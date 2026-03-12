from django.db import models
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Question
from .serializers import QuestionSerializer, CategorySerializer
from .services import GeminiService

@api_view(['GET'])
def get_questions(request):
    """
    API endpoint to fetch random questions, optionally filtered by category.
    Now uses QuestionSerializer for professional data formatting.
    """
    category = request.GET.get('category')
    try:
        count = int(request.GET.get('count', 25))
    except (ValueError, TypeError):
        count = 25
    
    query = Question.objects.all()
    if category:
        query = query.filter(category=category)
    
    questions = query.order_by('?')[:count]
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_categories(request):
    """
    API endpoint to fetch category summaries.
    Uses CategorySerializer and a clean order mapping.
    """
    categories_query = Question.objects.values('category').annotate(count=models.Count('id'))
    
    order_map = {
        'python_core': 0, 'python_advanced': 1, 'async': 2,
        'database': 3, 'django': 4, 'others': 5
    }
    
    categories_list = list(categories_query)
    categories_list.sort(key=lambda x: order_map.get(x['category'], 999))
    
    serializer = CategorySerializer(categories_list, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
def evaluate_answers(request):
    """
    API endpoint to evaluate interview answers using Gemini AI service.
    Now delegates heavy lifting to GeminiService.
    """
    language = request.data.get('language', 'en')
    answers = request.data.get('answers', {})
    questions = request.data.get('questions', [])
    
    service = GeminiService()
    try:
        result = service.evaluate_interview(language, questions, answers)
        return Response(result)
    except Exception as e:
        return Response({
            "level": "Error",
            "summary": str(e),
            "feedback": []
        }, status=500)
