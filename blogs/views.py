from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import Blog
from .serializers import (
    BlogListSerializer,
    BlogDetailSerializer,
    BlogCreateUpdateSerializer,
    BlogPublishSerializer
)
from users.permissions import BlogPermission
from newsletter.models import NewsletterSubscriber


class BlogListView(generics.ListAPIView):
    """List all published blogs for public, all blogs for authenticated users"""
    serializer_class = BlogListSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['title', 'content', 'author__name']
    filterset_fields = ['category__slug', 'tags__slug', 'status']
    ordering_fields = ['created_at', 'published_at', 'title']
    ordering = ['-published_at']
    
    def get_queryset(self):
        queryset = Blog.objects.select_related('author', 'category').prefetch_related('tags')
        
        # Filter based on user permissions
        if self.request.user.is_authenticated:
            if self.request.user.role == 'admin':
                # Admin can see all blogs
                pass
            elif self.request.user.role == 'editor':
                # Editor can see their own blogs and published blogs
                queryset = queryset.filter(
                    Q(author=self.request.user) | Q(status='published')
                )
            else:
                # Viewer can only see published blogs
                queryset = queryset.filter(status='published')
        else:
            # Anonymous users can only see published blogs
            queryset = queryset.filter(status='published')
        
        return queryset


class BlogCreateView(generics.CreateAPIView):
    """Create a new blog"""
    serializer_class = BlogCreateUpdateSerializer
    permission_classes = [BlogPermission]
    
    @method_decorator(ratelimit(key='user', rate='10/h', method='POST'))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BlogDetailView(generics.RetrieveAPIView):
    """Retrieve a blog by slug"""
    serializer_class = BlogDetailSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = Blog.objects.select_related('author', 'category').prefetch_related('tags')
        
        # Filter based on user permissions
        if self.request.user.is_authenticated:
            if self.request.user.role == 'admin':
                # Admin can see all blogs
                pass
            elif self.request.user.role == 'editor':
                # Editor can see their own blogs and published blogs
                queryset = queryset.filter(
                    Q(author=self.request.user) | Q(status='published')
                )
            else:
                # Viewer can only see published blogs
                queryset = queryset.filter(status='published')
        else:
            # Anonymous users can only see published blogs
            queryset = queryset.filter(status='published')
        
        return queryset


class BlogUpdateView(generics.UpdateAPIView):
    """Update a blog"""
    serializer_class = BlogCreateUpdateSerializer
    permission_classes = [BlogPermission]
    lookup_field = 'slug'
    
    def get_queryset(self):
        # Users can only update their own blogs (unless admin)
        if self.request.user.role == 'admin':
            return Blog.objects.all()
        return Blog.objects.filter(author=self.request.user)


class BlogDeleteView(generics.DestroyAPIView):
    """Delete a blog"""
    permission_classes = [BlogPermission]
    lookup_field = 'slug'
    
    def get_queryset(self):
        # Users can only delete their own blogs (unless admin)
        if self.request.user.role == 'admin':
            return Blog.objects.all()
        return Blog.objects.filter(author=self.request.user)


class BlogPublishView(generics.UpdateAPIView):
    """Publish or unpublish a blog"""
    serializer_class = BlogPublishSerializer
    permission_classes = [BlogPermission]
    lookup_field = 'slug'
    
    def get_queryset(self):
        # Users can only publish their own blogs (unless admin)
        if self.request.user.role == 'admin':
            return Blog.objects.all()
        return Blog.objects.filter(author=self.request.user)
    
    def perform_update(self, serializer):
        blog = serializer.save()
        
        # Send newsletter if blog is being published
        if blog.status == 'published' and 'status' in serializer.validated_data:
            try:
                NewsletterSubscriber.send_newsletter(blog)
            except Exception as e:
                # Log error but don't fail the request
                pass


class MyBlogsView(generics.ListAPIView):
    """List current user's blogs"""
    serializer_class = BlogListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['title', 'content']
    filterset_fields = ['category__slug', 'tags__slug', 'status']
    ordering_fields = ['created_at', 'published_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Blog.objects.filter(author=self.request.user).select_related('category').prefetch_related('tags')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def blog_stats(request):
    """Get blog statistics"""
    total_blogs = Blog.objects.filter(status='published').count()
    total_categories = Blog.objects.filter(status='published').values('category').distinct().count()
    total_authors = Blog.objects.filter(status='published').values('author').distinct().count()
    
    return Response({
        'total_published_blogs': total_blogs,
        'total_categories': total_categories,
        'total_authors': total_authors
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_blogs(request):
    """Get featured blogs (latest 5 published blogs)"""
    blogs = Blog.objects.filter(status='published').select_related('author', 'category').prefetch_related('tags')[:5]
    serializer = BlogListSerializer(blogs, many=True)
    return Response(serializer.data)
