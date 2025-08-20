from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category
from .serializers import CategorySerializer, CategoryListSerializer
from users.permissions import IsAdminUser, CategoryTagPermission


class CategoryListCreateView(generics.ListCreateAPIView):
    """List all categories or create a new category"""
    queryset = Category.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CategorySerializer
        return CategoryListSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [CategoryTagPermission()]
        return [permissions.AllowAny()]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a category"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [CategoryTagPermission]
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [CategoryTagPermission()]
    
    def destroy(self, request, *args, **kwargs):
        """Custom delete to check if category has associated blogs"""
        category = self.get_object()
        
        # Check if category has associated blogs
        if category.blog_set.exists():
            return Response({
                'error': 'Cannot delete category that has associated blogs. Please reassign or delete the blogs first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().destroy(request, *args, **kwargs)
