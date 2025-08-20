from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import Comment
from .serializers import (
    CommentListSerializer,
    CommentDetailSerializer,
    CommentCreateSerializer,
    CommentUpdateSerializer,
    CommentModerationSerializer
)
from users.permissions import CommentPermission, IsAdminUser


class CommentListView(generics.ListAPIView):
    """List comments for a specific blog"""
    serializer_class = CommentListSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['content', 'user__name']
    filterset_fields = ['status']
    ordering_fields = ['created_at']
    ordering = ['created_at']
    
    def get_queryset(self):
        blog_slug = self.kwargs.get('blog_slug')
        queryset = Comment.objects.filter(blog__slug=blog_slug).select_related('user', 'blog')
        
        # Filter based on user permissions
        if self.request.user.is_authenticated:
            if self.request.user.role == 'admin':
                # Admin can see all comments
                pass
            else:
                # Other users can see approved comments and their own comments
                queryset = queryset.filter(
                    Q(status='approved') | Q(user=self.request.user)
                )
        else:
            # Anonymous users can only see approved comments
            queryset = queryset.filter(status='approved')
        
        return queryset


class CommentCreateView(generics.CreateAPIView):
    """Create a new comment"""
    serializer_class = CommentCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @method_decorator(ratelimit(key='user', rate='5/m', method='POST'))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class CommentDetailView(generics.RetrieveAPIView):
    """Retrieve a comment"""
    serializer_class = CommentDetailSerializer
    
    def get_queryset(self):
        queryset = Comment.objects.select_related('user', 'blog')
        
        # Filter based on user permissions
        if self.request.user.is_authenticated:
            if self.request.user.role == 'admin':
                # Admin can see all comments
                pass
            else:
                # Other users can see approved comments and their own comments
                queryset = queryset.filter(
                    Q(status='approved') | Q(user=self.request.user)
                )
        else:
            # Anonymous users can only see approved comments
            queryset = queryset.filter(status='approved')
        
        return queryset


class CommentUpdateView(generics.UpdateAPIView):
    """Update a comment (only by comment author)"""
    serializer_class = CommentUpdateSerializer
    permission_classes = [CommentPermission]
    
    def get_queryset(self):
        # Users can only update their own comments
        return Comment.objects.filter(user=self.request.user)


class CommentDeleteView(generics.DestroyAPIView):
    """Delete a comment"""
    permission_classes = [CommentPermission]
    
    def get_queryset(self):
        # Users can only delete their own comments (unless admin)
        if self.request.user.role == 'admin':
            return Comment.objects.all()
        return Comment.objects.filter(user=self.request.user)


class CommentModerationView(generics.UpdateAPIView):
    """Moderate comments (Admin only)"""
    serializer_class = CommentModerationSerializer
    permission_classes = [IsAdminUser]
    queryset = Comment.objects.all()


class MyCommentsView(generics.ListAPIView):
    """List current user's comments"""
    serializer_class = CommentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['content']
    filterset_fields = ['status', 'blog__slug']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Comment.objects.filter(user=self.request.user).select_related('blog')


class PendingCommentsView(generics.ListAPIView):
    """List pending comments for moderation (Admin only)"""
    serializer_class = CommentDetailSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['content', 'user__name', 'blog__title']
    ordering_fields = ['created_at']
    ordering = ['created_at']
    
    def get_queryset(self):
        return Comment.objects.filter(status='pending').select_related('user', 'blog')


@api_view(['GET'])
@permission_classes([IsAdminUser])
def comment_stats(request):
    """Get comment statistics (Admin only)"""
    total_comments = Comment.objects.count()
    approved_comments = Comment.objects.filter(status='approved').count()
    pending_comments = Comment.objects.filter(status='pending').count()
    spam_comments = Comment.objects.filter(status='spam').count()
    
    return Response({
        'total_comments': total_comments,
        'approved_comments': approved_comments,
        'pending_comments': pending_comments,
        'spam_comments': spam_comments
    })
