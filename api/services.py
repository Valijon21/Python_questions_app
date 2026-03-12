import json
import os
import google.generativeai as genai
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    """
    Service layer to handle all interactions with Gemini AI.
    Separates prompt engineering and AI configuration from Django views.
    """
    
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.model_name = "gemini-flash-latest"
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
        else:
            self.model = None

    def evaluate_interview(self, language, questions, answers):
        if not self.model:
            return self._get_fallback_evaluation(questions, answers)

        prompt = self._build_prompt(language, questions, answers)
        
        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            raise Exception(f"AI Evaluation failed: {str(e)}")

    def _build_prompt(self, language, questions, answers):
        prompt = f"You are an expert strict technical interviewer evaluating {len(questions)} Python Backend interview answers in {language}. Provide the assessment strictly in JSON format.\n"
        prompt += "Be extremely strict and critical. If the user provides random letters, incorrect answers, or avoids the question, classify their level as 'Trainee' or 'Fail'.\n"
        prompt += "{\n"
        prompt += '  "level": "Trainee | Junior | Middle | Senior",\n'
        prompt += '  "summary": "Overall synthesis and strict feedback string in the requested language.",\n'
        prompt += '  "feedback": [\n'
        prompt += '    { "questionId": 123, "isCorrect": true, "aiFeedback": "Specific honest feedback.", "correctAnswer": "Ideal model answer (2-4 sentences)." }\n'
        prompt += '  ]\n}\n\n'
        prompt += "Technical Context:\n"
        for q in questions:
            q_id = q.get('id')
            q_text = q.get('text')
            ans_text = answers.get(str(q_id), "No answer provided")
            prompt += f"Question {q_id}: {q_text}\nAnswer: {ans_text}\n\n"
        return prompt

    def _parse_json_response(self, text):
        text = text.strip()
        if text.startswith('```json'): text = text[7:]
        if text.startswith('```'): text = text[3:]
        if text.endswith('```'): text = text[:-3]
        
        result = json.loads(text.strip())
        
        # Normalize booleans
        for item in result.get('feedback', []):
            raw = item.get('isCorrect')
            if isinstance(raw, str):
                item['isCorrect'] = raw.strip().lower() == 'true'
            elif not isinstance(raw, bool):
                item['isCorrect'] = False
        return result

    def _get_fallback_evaluation(self, questions, answers):
        return {
            "level": "Middle (Offline)",
            "summary": "API Key missing. Local evaluation mode.",
            "feedback": [{"questionId": q.get('id'), "isCorrect": False, "aiFeedback": "Configure GEMINI_API_KEY for real AI feedback.", "correctAnswer": "Model answer pending API setup."} for q in questions]
        }
