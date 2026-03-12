import json
import os
from django.core.management.base import BaseCommand
from api.models import Question
from django.conf import settings

class Command(BaseCommand):
    help = 'Imports questions from questions_db.json into the database'

    def handle(self, *args, **options):
        # Path to the JSON file
        # It's one level up from the django_project directory
        json_path = os.path.join(settings.BASE_DIR, '..', 'questions_db.json')
        
        if not os.path.exists(json_path):
            self.stdout.write(self.style.ERROR(f'File not found: {json_path}'))
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        self.stdout.write(f'Found {len(data)} questions. Starting import...')
        
        created_count = 0
        updated_count = 0
        
        for item in data:
            q_id = item.get('id')
            text = item.get('text', {})
            
            # Using update_or_create to handle potential repeats or updates
            # However, since id is auto-increment in Django by default, 
            # we should decide if we want to respect the JSON id or let Django handle it.
            # To keep it simple and consistent with the front-end logic (which uses these IDs),
            # we will try to use the provided ID.
            
            obj, created = Question.objects.update_or_create(
                id=q_id,
                defaults={
                    'text_uz': text.get('uz', ''),
                    'text_en': text.get('en', ''),
                    'text_ru': text.get('ru', ''),
                }
            )
            
            if created:
                created_count += 1
            else:
                updated_count += 1
                
        self.stdout.write(self.style.SUCCESS(f'Successfully imported questions!'))
        self.stdout.write(f'Created: {created_count}')
        self.stdout.write(f'Updated: {updated_count}')
