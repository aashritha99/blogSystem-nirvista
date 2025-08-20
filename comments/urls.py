from django.urls import path
from . import views

app_name = 'comments'

urlpatterns = [
    # Comment CRUD endpoints
    path('blog/<slug:blog_slug>/', views.CommentListView.as_view(), name='comment-list'),
    path('blog/<slug:blog_slug>/create/', views.CommentCreateView.as_view(), name='comment-create'),
    path('<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('<int:pk>/update/', views.CommentUpdateView.as_view(), name='comment-update'),
    path('<int:pk>/delete/', views.CommentDeleteView.as_view(), name='comment-delete'),
    
    # Moderation endpoints
    path('<int:pk>/moderate/', views.CommentModerationView.as_view(), name='comment-moderate'),
    path('pending/', views.PendingCommentsView.as_view(), name='pending-comments'),
    
    # User-specific endpoints
    path('my-comments/', views.MyCommentsView.as_view(), name='my-comments'),
    
    # Statistics endpoints
    path('stats/', views.comment_stats, name='comment-stats'),
]