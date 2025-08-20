from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Comment
from blogs.models import Blog
from users.serializers import UserSerializer

User = get_user_model()


class CommentListSerializer(serializers.ModelSerializer):
    """Serializer for comment list view"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = [
            'id', 'user', 'content', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class CommentDetailSerializer(serializers.ModelSerializer):
    """Serializer for comment detail view"""
    user = UserSerializer(read_only=True)
    blog_title = serializers.CharField(source='blog.title', read_only=True)
    
    class Meta:
        model = Comment
        fields = [
            'id', 'blog', 'blog_title', 'user', 'content',
            'status', 'ip_address', 'user_agent',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['blog', 'ip_address', 'user_agent', 'created_at', 'updated_at']


class CommentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating comments"""
    blog_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Comment
        fields = ['blog_id', 'content']
    
    def validate_blog_id(self, value):
        """Validate blog exists and is published"""
        try:
            blog = Blog.objects.get(id=value)
            if blog.status != 'published':
                raise serializers.ValidationError("Cannot comment on unpublished blog.")
        except Blog.DoesNotExist:
            raise serializers.ValidationError("Blog does not exist.")
        return value
    
    def validate_content(self, value):
        """Validate comment content"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Comment must be at least 10 characters long.")
        if len(value.strip()) > 1000:
            raise serializers.ValidationError("Comment cannot exceed 1000 characters.")
        return value
    
    def create(self, validated_data):
        """Create comment with blog and user"""
        blog_id = validated_data.pop('blog_id')
        validated_data['blog'] = Blog.objects.get(id=blog_id)
        validated_data['user'] = self.context['request'].user
        
        # Get IP address and user agent from request
        request = self.context['request']
        validated_data['ip_address'] = self.get_client_ip(request)
        validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')[:500]
        
        return Comment.objects.create(**validated_data)
    
    def get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class CommentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating comments"""
    
    class Meta:
        model = Comment
        fields = ['content']
    
    def validate_content(self, value):
        """Validate comment content"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Comment must be at least 10 characters long.")
        if len(value.strip()) > 1000:
            raise serializers.ValidationError("Comment cannot exceed 1000 characters.")
        return value


class CommentModerationSerializer(serializers.Serializer):
    """Serializer for comment moderation (approve/spam)"""
    action = serializers.ChoiceField(choices=['approve', 'spam', 'pending'])
    
    def update(self, instance, validated_data):
        """Update comment status based on action"""
        action = validated_data['action']
        
        if action == 'approve':
            instance.approve()
        elif action == 'spam':
            instance.mark_as_spam()
        elif action == 'pending':
            instance.status = 'pending'
            instance.save()
        
        return instance