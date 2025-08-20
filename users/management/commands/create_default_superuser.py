from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a default superuser for development'
    
    def handle(self, *args, **options):
        email = 'admin@example.com'
        name = 'Admin User'
        password = 'admin123'
        
        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(f'User with email {email} already exists')
            )
            return
        
        user = User.objects.create_user(
            email=email,
            name=name,
            password=password,
            role='admin'
        )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created superuser:\n'
                f'Email: {email}\n'
                f'Password: {password}\n'
                f'Role: {user.role}'
            )
        )