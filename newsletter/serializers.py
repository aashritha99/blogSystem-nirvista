from rest_framework import serializers
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import NewsletterSubscriber


class NewsletterSubscribeSerializer(serializers.ModelSerializer):
    """Serializer for newsletter subscription"""
    
    class Meta:
        model = NewsletterSubscriber
        fields = ['email']
    
    def validate_email(self, value):
        """Validate email format and uniqueness"""
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        
        # Check if email already exists and is active
        existing_subscriber = NewsletterSubscriber.objects.filter(email=value).first()
        if existing_subscriber and existing_subscriber.is_active:
            raise serializers.ValidationError("This email is already subscribed to our newsletter.")
        
        return value.lower()
    
    def create(self, validated_data):
        """Create or reactivate newsletter subscription"""
        email = validated_data['email']
        
        # Check if subscriber exists but is inactive
        existing_subscriber = NewsletterSubscriber.objects.filter(email=email).first()
        if existing_subscriber:
            if not existing_subscriber.is_active:
                existing_subscriber.resubscribe()
                return existing_subscriber
            else:
                # This shouldn't happen due to validation, but just in case
                raise serializers.ValidationError("This email is already subscribed.")
        
        # Create new subscriber
        return NewsletterSubscriber.objects.create(**validated_data)


class NewsletterUnsubscribeSerializer(serializers.Serializer):
    """Serializer for newsletter unsubscription"""
    email = serializers.EmailField()
    
    def validate_email(self, value):
        """Validate email exists and is active"""
        try:
            subscriber = NewsletterSubscriber.objects.get(email=value.lower())
            if not subscriber.is_active:
                raise serializers.ValidationError("This email is not currently subscribed.")
        except NewsletterSubscriber.DoesNotExist:
            raise serializers.ValidationError("This email is not subscribed to our newsletter.")
        
        return value.lower()
    
    def save(self):
        """Unsubscribe the email"""
        email = self.validated_data['email']
        subscriber = NewsletterSubscriber.objects.get(email=email)
        subscriber.unsubscribe()
        return subscriber


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    """Serializer for newsletter subscriber (admin view)"""
    
    class Meta:
        model = NewsletterSubscriber
        fields = [
            'id', 'email', 'is_active', 'subscription_date', 'unsubscribed_at'
        ]
        read_only_fields = ['id', 'subscription_date', 'unsubscribed_at']


class NewsletterBulkActionSerializer(serializers.Serializer):
    """Serializer for bulk actions on newsletter subscribers"""
    action = serializers.ChoiceField(choices=['activate', 'deactivate', 'delete'])
    subscriber_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1
    )
    
    def validate_subscriber_ids(self, value):
        """Validate all subscriber IDs exist"""
        existing_subscribers = NewsletterSubscriber.objects.filter(id__in=value)
        if len(existing_subscribers) != len(value):
            raise serializers.ValidationError("One or more subscriber IDs do not exist.")
        return value
    
    def save(self):
        """Perform bulk action on subscribers"""
        action = self.validated_data['action']
        subscriber_ids = self.validated_data['subscriber_ids']
        
        subscribers = NewsletterSubscriber.objects.filter(id__in=subscriber_ids)
        
        if action == 'activate':
            for subscriber in subscribers:
                if not subscriber.is_active:
                    subscriber.resubscribe()
        elif action == 'deactivate':
            for subscriber in subscribers:
                if subscriber.is_active:
                    subscriber.unsubscribe()
        elif action == 'delete':
            subscribers.delete()
        
        return subscribers