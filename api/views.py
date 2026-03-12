import json
import random
import os
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
    try:
        count = int(request.GET.get('count', 25))
    except ValueError:
        count = 25
    
    # Get random 'count' questions from the database
    # For large databases order_by('?') can be slow, but for mock interviewer it works perfectly
    random_questions = Question.objects.order_by('?')[:count]
    
    # Convert queryset to list of dicts expecting the same format as before
    response_data = [q.to_dict() for q in random_questions]
    return Response(response_data)

@csrf_exempt
@api_view(['POST'])
def evaluate_answers(request):
    language = request.data.get('language', 'en')
    answers = request.data.get('answers', {})
    questions = request.data.get('questions', [])
    
    if not HAS_GENAI or not os.getenv('GEMINI_API_KEY'):
        # Fallback if genai is not installed or no API key is provided
        return Response({
            "level": "Middle (Mocked)",
            "summary": "Gemini AI API key not found or library missing. Returning mock evaluation.",
            "feedback": [
                {"questionId": q.get('id'), "isCorrect": False, "aiFeedback": "Mock feedback: " + answers.get(str(q.get('id')), "No answer.")} 
                for q in questions
            ]
        })

    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    prompt = f"You are an expert strict technical interviewer evaluating {len(questions)} Python Backend interview answers in {language}. Provide the assessment strictly in JSON format.\n"
    prompt += "Be extremely strict and critical. If the user provides random letters (e.g., 'asdfasdf'), completely incorrect answers, or avoids the question, immediately classify their level as 'Trainee' or 'Fail', and provide harsh but professional feedback.\n"
    prompt += "{\n"
    prompt += '  "level": "Trainee | Junior | Middle | Senior",\n'
    prompt += '  "summary": "Overall synthesis and strict feedback string in the requested language. Explicitly mention if they guessed or wrote random characters.",\n'
    prompt += '  "feedback": [\n'
    prompt += '    { "questionId": 123, "isCorrect": true, "aiFeedback": "Specific feedback for this answer in the requested language. Be brutally honest if it is wrong." }\n'
    prompt += "  ]\n}\n\n"
    prompt += "For isCorrect: set it to true only if the answer is substantially correct and demonstrates real understanding. Set it to false for wrong, random, empty, or vague answers.\n"
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
