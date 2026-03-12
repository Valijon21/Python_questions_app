import json
import random
import os
from django.db import models
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

from api.models import Question

@api_view(['GET'])
def get_questions(request):
    category = request.GET.get('category')
    try:
        count = int(request.GET.get('count', 25))
    except ValueError:
        count = 25
    
    # Filter by category if provided
    query = Question.objects.all()
    if category:
        query = query.filter(category=category)
    
    # Get random 'count' questions
    random_questions = query.order_by('?')[:count]
    
    # Convert queryset to list of dicts expecting the same format as before
    response_data = [q.to_dict() for q in random_questions]
    return Response(response_data)

@api_view(['GET'])
def get_categories(request):
    # Get unique categories and their question counts
    categories = Question.objects.values('category').annotate(count=models.Count('id')).order_by('category')
    return Response(list(categories))

@csrf_exempt
@api_view(['POST'])
def evaluate_answers(request):
    language = request.data.get('language', 'en')
    answers = request.data.get('answers', {})
    questions = request.data.get('questions', [])
    
    # Force reload of environment variables if not found (sometimes needed in dev)
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        from dotenv import load_dotenv
        load_dotenv()
        api_key = os.getenv('GEMINI_API_KEY')

    if not HAS_GENAI or not api_key:
        # Fallback if genai is not installed or no API key is provided
        return Response({
            "level": "Middle (Mocked)",
            "summary": "Gemini AI API key not found or library missing. Returning mock evaluation.",
            "feedback": [
                {
                    "questionId": q.get('id'), 
                    "isCorrect": False, 
                    "aiFeedback": "Mock feedback: " + answers.get(str(q.get('id')), "No answer."),
                    "correctAnswer": "This is a mock correct answer. Please configure your GEMINI_API_KEY to see real AI-generated model answers."
                } 
                for q in questions
            ]
        })

    genai.configure(api_key=api_key)
    # Using gemini-flash-latest as it is the most stable and available in this environment
    model = genai.GenerativeModel("gemini-flash-latest")
    
    prompt = f"You are an expert strict technical interviewer evaluating {len(questions)} Python Backend interview answers in {language}. Provide the assessment strictly in JSON format.\n"
    prompt += "Be extremely strict and critical. If the user provides random letters (e.g., 'asdfasdf'), completely incorrect answers, or avoids the question, immediately classify their level as 'Trainee' or 'Fail', and provide harsh but professional feedback.\n"
    prompt += "{\n"
    prompt += '  "level": "Trainee | Junior | Middle | Senior",\n'
    prompt += '  "summary": "Overall synthesis and strict feedback string in the requested language. Explicitly mention if they guessed or wrote random characters.",\n'
    prompt += '  "feedback": [\n'
    prompt += '    { "questionId": 123, "isCorrect": true, "aiFeedback": "Specific feedback for this answer in the requested language. Be brutally honest if it is wrong.", "correctAnswer": "A clear, concise model answer to this question in the requested language (2-4 sentences)." }\n'
    prompt += "  ]\n}\n\n"
    prompt += "For isCorrect: set it to true only if the answer is substantially correct and demonstrates real understanding. Set it to false for wrong, random, empty, or vague answers.\n"
    prompt += "For correctAnswer: always provide the ideal answer regardless of whether the user was correct or not. This helps them learn.\n"
    prompt += "Here are the questions and user's answers:\n"
    
    for q in questions:
        q_id = q.get('id')
        q_text = q.get('text')
        ans_text = answers.get(str(q_id), "No answer provided")
        prompt += f"Question {q_id}: {q_text}\nAnswer: {ans_text}\n\n"

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Ensure clean JSON parsing
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
            
        result = json.loads(text.strip())
        
        # Normalize isCorrect field to proper boolean for all feedback items
        for item in result.get('feedback', []):
            raw = item.get('isCorrect')
            if isinstance(raw, bool):
                pass  # Already correct
            elif isinstance(raw, str):
                item['isCorrect'] = raw.strip().lower() == 'true'
            else:
                # If missing, default to False (assume wrong unless explicitly correct)
                item['isCorrect'] = False
        
        return Response(result)
    except Exception as e:
        print("Error evaluating:", e)
        return Response({
            "level": "Error",
            "summary": f"Evaluation failed: {str(e)}",
            "feedback": []
        }, status=500)
