from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = 'Fix admin user permissions for Django admin access'

    def handle(self, *args, **options):
        try:
            admin_user = User.objects.get(email='admin@example.com')
            
            # Update the user to have proper admin permissions
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.role = 'Admin'  # Ensure role is capitalized correctly
            admin_user.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully updated admin user: {admin_user.email}\n'
                    f'is_staff: {admin_user.is_staff}, is_superuser: {admin_user.is_superuser}, '
                    f'role: {admin_user.role}'
                )
            )
            
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Admin user with email admin@example.com not found')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error updating admin user: {str(e)}')
            )