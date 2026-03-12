from rest_framework import serializers
from .models import Question

class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializer for Question model to handle data representation consistently.
    """
    text = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'text', 'category']

    def get_text(self, obj):
        # Already handled by model's to_dict, but here we standardize it
        return obj.text

class CategorySerializer(serializers.Serializer):
    """
    Simple serializer for category summary data.
    """
    category = serializers.CharField()
    count = serializers.IntegerField()
