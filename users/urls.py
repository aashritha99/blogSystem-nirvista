from django.urls import path
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from . import views

app_name = 'users'

@require_http_methods(["GET"])
def users_api_root(request):
    """Users API root endpoint"""
    return JsonResponse({
        'message': 'Users API',
        'endpoints': {
            'register': '/api/users/register/',
            'login': '/api/users/login/',
            'logout': '/api/users/logout/',
            'profile': '/api/users/profile/',
            'change_password': '/api/users/change-password/',
            'password_reset': '/api/users/password-reset/',
            'password_reset_confirm': '/api/users/password-reset-confirm/',
            'user_list': '/api/users/list/',
            'user_detail': '/api/users/<id>/',
        }
    })

urlpatterns = [
    # Root endpoint
    path('', users_api_root, name='users-root'),
    
    # Authentication endpoints
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # Profile endpoints
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('change-password/', views.PasswordChangeView.as_view(), name='change-password'),
    
    # Password reset endpoints
    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Admin endpoints
    path('list/', views.UserListView.as_view(), name='user-list'),
    path('<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
]