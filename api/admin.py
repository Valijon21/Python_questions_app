from django.contrib import admin
from .models import Question

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'short_text_uz', 'created_at')
    search_fields = ('text_uz', 'text_en', 'text_ru')
    
    def short_text_uz(self, obj):
        return obj.text_uz[:100] + "..." if obj.text_uz and len(obj.text_uz) > 100 else obj.text_uz
    short_text_uz.short_description = "Uzbek Text"
