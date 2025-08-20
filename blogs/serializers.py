from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Blog
from categories.models import Category
from tags.models import Tag
from categories.serializers import CategoryListSerializer
from tags.serializers import TagListSerializer
from users.serializers import UserSerializer

User = get_user_model()


class BlogListSerializer(serializers.ModelSerializer):
    """Serializer for blog list view"""
    author = UserSerializer(read_only=True)
    category = CategoryListSerializer(read_only=True)
    tags = TagListSerializer(many=True, read_only=True)
    reading_time = serializers.ReadOnlyField()
    
    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'content', 'featured_image',
            'author', 'category', 'tags', 'status', 'reading_time',
            'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'published_at', 'created_at', 'updated_at']


class BlogDetailSerializer(serializers.ModelSerializer):
    """Serializer for blog detail view"""
    author = UserSerializer(read_only=True)
    category = CategoryListSerializer(read_only=True)
    tags = TagListSerializer(many=True, read_only=True)
    reading_time = serializers.ReadOnlyField()
    is_published = serializers.ReadOnlyField()
    
    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'content', 'featured_image',
            'author', 'category', 'tags', 'status', 'meta_title',
            'meta_description', 'image_alt_text', 'reading_time',
            'is_published', 'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'published_at', 'created_at', 'updated_at']


class BlogCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating blogs"""
    category_id = serializers.IntegerField(write_only=True)
    tag_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        allow_empty=True
    )
    
    class Meta:
        model = Blog
        fields = [
            'title', 'content', 'featured_image', 'category_id',
            'tag_ids', 'status', 'meta_title', 'meta_description',
            'image_alt_text'
        ]
    
    def validate_category_id(self, value):
        """Validate category exists"""
        try:
            Category.objects.get(id=value)
        except Category.DoesNotExist:
            raise serializers.ValidationError("Category does not exist.")
        return value
    
    def validate_tag_ids(self, value):
        """Validate all tags exist"""
        if value:
            existing_tags = Tag.objects.filter(id__in=value)
            if len(existing_tags) != len(value):
                raise serializers.ValidationError("One or more tags do not exist.")
        return value
    
    def validate_title(self, value):
        """Validate title length and uniqueness"""
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        
        # Check for duplicate titles (case-insensitive)
        if Blog.objects.filter(title__iexact=value).exists():
            if self.instance and self.instance.title.lower() == value.lower():
                return value
            raise serializers.ValidationError("Blog with this title already exists.")
        return value
    
    def validate_content(self, value):
        """Validate content length"""
        if len(value.strip()) < 50:
            raise serializers.ValidationError("Content must be at least 50 characters long.")
        return value
    
    def create(self, validated_data):
        """Create blog with category and tags"""
        category_id = validated_data.pop('category_id')
        tag_ids = validated_data.pop('tag_ids', [])
        
        # Set category
        validated_data['category'] = Category.objects.get(id=category_id)
        
        # Create blog
        blog = Blog.objects.create(**validated_data)
        
        # Set tags
        if tag_ids:
            tags = Tag.objects.filter(id__in=tag_ids)
            blog.tags.set(tags)
        
        return blog
    
    def update(self, instance, validated_data):
        """Update blog with category and tags"""
        category_id = validated_data.pop('category_id', None)
        tag_ids = validated_data.pop('tag_ids', None)
        
        # Update category if provided
        if category_id is not None:
            validated_data['category'] = Category.objects.get(id=category_id)
        
        # Update blog fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update tags if provided
        if tag_ids is not None:
            if tag_ids:
                tags = Tag.objects.filter(id__in=tag_ids)
                instance.tags.set(tags)
            else:
                instance.tags.clear()
        
        return instance


class BlogPublishSerializer(serializers.Serializer):
    """Serializer for publishing/unpublishing blogs"""
    status = serializers.ChoiceField(choices=Blog.STATUS_CHOICES)
    
    def update(self, instance, validated_data):
        """Update blog status"""
        instance.status = validated_data['status']
        instance.save()
        return instance