import json
import os
import re
from django.core.management.base import BaseCommand
from api.models import Question
from django.conf import settings

class Command(BaseCommand):
    help = 'Imports and auto-categorizes questions into deep technical sub-topics'

    def handle(self, *args, **options):
        json_path = os.path.join(settings.BASE_DIR, '..', 'questions_db.json')
        
        if not os.path.exists(json_path):
            self.stdout.write(self.style.ERROR(f'File not found: {json_path}'))
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        self.stdout.write(f'Found {len(data)} questions. Starting Categorization & Import...')
        
        counts = {}
        
        def detect_category(text_dict):
            full_text = " ".join([str(v) for v in text_dict.values()]).lower()
            
            # Category Rules (Priority based)
            rules = [
                (r'django|orm|queryset|migration|view|model', 'django'),
                (r'async|await|coroutine|thread|multiprocessing|task|celery', 'async'),
                (r'postgresql|mysql|sqlite|redis|mongodb|database|sql|index', 'database'),
                (r'class|inheritance|polymorphism|encapsulation|self|init|oop', 'python_advanced'),
                (r'list|dict|set|tuple|string|int|float|type|bool|data type', 'python_core'),
                (r'def|function|lambda|args|kwargs|return|decorator', 'python_functions'),
                (r'for|while|loop|if|else|elif|break|continue', 'python_control_flow'),
                (r'variable|name|global|local|scope', 'python_core'),
            ]
            
            for pattern, cat in rules:
                if re.search(pattern, full_text):
                    return cat
            return 'others'

        created_count = 0
        updated_count = 0
        
        for item in data:
            text = item.get('text', {})
            q_id = item.get('id')
            category = detect_category(text)
            
            counts[category] = counts.get(category, 0) + 1
            
            obj, created = Question.objects.update_or_create(
                id=q_id,
                defaults={
                    'text_uz': text.get('uz', ''),
                    'text_en': text.get('en', ''),
                    'text_ru': text.get('ru', ''),
                    'category': category
                }
            )
            
            if created: created_count += 1
            else: updated_count += 1
                
        self.stdout.write(self.style.SUCCESS('Categorization Complete:'))
        for cat, count in counts.items():
            self.stdout.write(f" - {cat}: {count}")
            
        self.stdout.write(f'Total Created: {created_count}, Updated: {updated_count}')
