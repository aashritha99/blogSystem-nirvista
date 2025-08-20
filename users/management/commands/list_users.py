from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = 'List all users in the database'

    def handle(self, *args, **options):
        users = User.objects.all()
        if not users:
            self.stdout.write(self.style.WARNING('No users found in database'))
            return
        
        self.stdout.write(self.style.SUCCESS('Users in database:'))
        for user in users:
            self.stdout.write(
                f'Email: {user.email}, Name: {user.name}, Role: {user.role}, '
                f'is_staff: {user.is_staff}, is_superuser: {user.is_superuser}'
            )