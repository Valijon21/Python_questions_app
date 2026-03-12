from rest_framework import serializers
from .models import Question

class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializer for Question model to handle data representation consistently.
    """
    text = serializers.SerializerMethodField()
    answers = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'text', 'category', 'answers']

    def get_text(self, obj):
        return {
            "uz": obj.text_uz,
            "en": obj.text_en,
            "ru": obj.text_ru
        }

    def get_answers(self, obj):
        return {
            "uz": obj.answer_uz,
            "en": obj.answer_en,
            "ru": obj.answer_ru
        }

class CategorySerializer(serializers.Serializer):
    """
    Simple serializer for category summary data.
    """
    category = serializers.CharField()
    count = serializers.IntegerField()
