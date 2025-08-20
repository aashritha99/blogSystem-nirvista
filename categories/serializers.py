from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def validate_name(self, value):
        """Validate category name is unique"""
        if Category.objects.filter(name__iexact=value).exists():
            if self.instance and self.instance.name.lower() == value.lower():
                return value
            raise serializers.ValidationError("Category with this name already exists.")
        return value


class CategoryListSerializer(serializers.ModelSerializer):
    """Simplified serializer for category lists"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']