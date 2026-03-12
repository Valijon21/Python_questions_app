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
        prompt += "Technical Context and Ground Truth:\n"
        for q in questions:
            q_id = q.get('id')
            q_text = q.get('text')
            ans_text = answers.get(str(q_id), "No answer provided")
            
            # Incorporate reference answer if available
            ref_ans_data = q.get('answers', {})
            ref_ans = ref_ans_data.get(language) or ref_ans_data.get('uz') or ref_ans_data.get('en')
            
            prompt += f"Question {q_id}: {q_text}\n"
            if ref_ans:
                prompt += f"REFERENCE ANSWER (Ground Truth): {ref_ans}\n"
            prompt += f"USER ANSWER: {ans_text}\n\n"
        
        prompt += "Note: If a REFERENCE ANSWER is provided, use it as the definitive source of truth to evaluate the USER ANSWER. If not provided, evaluate based on your general Python knowledge.\n"
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
        """
        Professional offline fallback: Uses keyword importance + fuzzy matching.
        In real-world systems, we look for 'Keywords' first, then 'Style'.
        """
        from difflib import SequenceMatcher
        import re
        
        feedback = []
        correct_count = 0
        
        for q in questions:
            q_id = str(q.get('id'))
            user_ans = answers.get(q_id, "").lower().strip()
            
            ref_ans_data = q.get('answers', {})
            ref_ans = (ref_ans_data.get('uz') or ref_ans_data.get('en') or "").lower().strip()
            
            is_correct = False
            score = 0
            
            if ref_ans and user_ans:
                # 1. Fuzzy Similarity (Difflib)
                similarity = SequenceMatcher(None, user_ans, ref_ans).ratio()
                
                # 2. Key Term Matching (Professional approach)
                # We extract words longer than 4 chars as potential 'technical terms'
                ref_words = set(re.findall(r'\w{5,}', ref_ans))
                user_words = set(re.findall(r'\w{5,}', user_ans))
                
                if ref_words:
                    keyword_match = len(ref_words.intersection(user_words)) / len(ref_words)
                    # Combined Weighted Score: 40% fuzzy + 60% keywords
                    score = (similarity * 0.4) + (keyword_match * 0.6)
                else:
                    score = similarity

                if score > 0.45: # Balanced threshold
                    is_correct = True
                    status_text = "Highly Accurate" if score > 0.75 else "Partially Correct"
                    ai_feedback = f"AI Offline. Manual check: {status_text} (Match: {int(score*100)}%)."
                else:
                    ai_feedback = "AI Offline. The answer does not sufficiently match the technical requirements."
            else:
                ai_feedback = "No reference answer to compare offline."

            if is_correct: correct_count += 1
            
            feedback.append({
                "questionId": q.get('id'),
                "isCorrect": is_correct,
                "aiFeedback": ai_feedback,
                "correctAnswer": ref_ans_data.get('uz') or ref_ans_data.get('en') or "N/A"
            })

        # Calculate level based on correct count
        total = len(questions)
        ratio = correct_count / total if total > 0 else 0
        level = "Trainee"
        if ratio > 0.8: level = "Senior"
        elif ratio > 0.5: level = "Middle"
        elif ratio > 0.2: level = "Junior"

        return {
            "level": f"{level} (Offline)",
            "summary": "AI is offline. Evaluation performed using local fuzzy matching against database answers.",
            "feedback": feedback
        }
