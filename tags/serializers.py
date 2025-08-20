from rest_framework import serializers
from .models import Tag


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model"""
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def validate_name(self, value):
        """Validate tag name is unique"""
        if Tag.objects.filter(name__iexact=value).exists():
            if self.instance and self.instance.name.lower() == value.lower():
                return value
            raise serializers.ValidationError("Tag with this name already exists.")
        return value


class TagListSerializer(serializers.ModelSerializer):
    """Simplified serializer for tag lists"""
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']