from django.db import models

class Question(models.Model):
    category = models.CharField(max_length=100, verbose_name="Category", blank=True, null=True, db_index=True)
    text_uz = models.TextField(verbose_name="Question in Uzbek", blank=True, null=True)
    text_en = models.TextField(verbose_name="Question in English", blank=True, null=True)
    text_ru = models.TextField(verbose_name="Question in Russian", blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Question"
        verbose_name_plural = "Questions"

    def __str__(self):
        return self.text_uz[:50] + "..." if self.text_uz else f"Question {self.id}"

    def to_dict(self):
        return {
            "id": self.id,
            "text": {
                "uz": self.text_uz,
                "en": self.text_en,
                "ru": self.text_ru
            }
        }
