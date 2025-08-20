from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Tag
from .serializers import TagSerializer, TagListSerializer
from users.permissions import IsAdminUser, CategoryTagPermission


class TagListCreateView(generics.ListCreateAPIView):
    """List all tags or create a new tag"""
    queryset = Tag.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TagSerializer
        return TagListSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [CategoryTagPermission()]
        return [permissions.AllowAny()]


class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a tag"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [CategoryTagPermission]
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [CategoryTagPermission()]
    
    def destroy(self, request, *args, **kwargs):
        """Custom delete to check if tag has associated blogs"""
        tag = self.get_object()
        
        # Check if tag has associated blogs
        if tag.blog_set.exists():
            return Response({
                'error': 'Cannot delete tag that has associated blogs. Please remove the tag from blogs first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().destroy(request, *args, **kwargs)
