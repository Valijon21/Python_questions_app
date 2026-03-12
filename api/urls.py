from django.urls import path
from . import views

urlpatterns = [
    path('questions', views.get_questions, name='get_questions'),
    path('categories', views.get_categories, name='get_categories'),
    path('evaluate', views.evaluate_answers, name='evaluate_answers'),
]
