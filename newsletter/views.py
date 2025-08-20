from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import NewsletterSubscriber
from .serializers import (
    NewsletterSubscribeSerializer,
    NewsletterUnsubscribeSerializer,
    NewsletterSubscriberSerializer,
    NewsletterBulkActionSerializer
)
from users.permissions import IsAdminUser


class NewsletterSubscribeView(generics.CreateAPIView):
    """Subscribe to newsletter"""
    serializer_class = NewsletterSubscribeSerializer
    permission_classes = [permissions.AllowAny]
    
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST'))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            subscriber = serializer.save()
            return Response({
                'message': 'Successfully subscribed to newsletter!',
                'email': subscriber.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsletterUnsubscribeView(generics.GenericAPIView):
    """Unsubscribe from newsletter"""
    serializer_class = NewsletterUnsubscribeSerializer
    permission_classes = [permissions.AllowAny]
    
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST'))
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            subscriber = serializer.save()
            return Response({
                'message': 'Successfully unsubscribed from newsletter.',
                'email': subscriber.email
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsletterSubscriberListView(generics.ListAPIView):
    """List all newsletter subscribers (Admin only)"""
    queryset = NewsletterSubscriber.objects.all().order_by('-subscription_date')
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['email']
    filterset_fields = ['is_active']
    ordering_fields = ['subscription_date', 'email']
    ordering = ['-subscription_date']


class NewsletterSubscriberDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a newsletter subscriber (Admin only)"""
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAdminUser]


class NewsletterBulkActionView(generics.GenericAPIView):
    """Perform bulk actions on newsletter subscribers (Admin only)"""
    serializer_class = NewsletterBulkActionSerializer
    permission_classes = [IsAdminUser]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            action = serializer.validated_data['action']
            subscriber_ids = serializer.validated_data['subscriber_ids']
            
            try:
                subscribers = serializer.save()
                
                if action == 'delete':
                    message = f'Successfully deleted {len(subscriber_ids)} subscribers.'
                else:
                    message = f'Successfully {action}d {len(subscriber_ids)} subscribers.'
                
                return Response({
                    'message': message,
                    'affected_count': len(subscriber_ids)
                }, status=status.HTTP_200_OK)
            
            except Exception as e:
                return Response({
                    'error': 'An error occurred while performing the bulk action.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def newsletter_stats(request):
    """Get newsletter statistics (Admin only)"""
    total_subscribers = NewsletterSubscriber.objects.count()
    active_subscribers = NewsletterSubscriber.objects.filter(is_active=True).count()
    inactive_subscribers = NewsletterSubscriber.objects.filter(is_active=False).count()
    
    return Response({
        'total_subscribers': total_subscribers,
        'active_subscribers': active_subscribers,
        'inactive_subscribers': inactive_subscribers
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def newsletter_check_subscription(request):
    """Check if an email is subscribed to newsletter"""
    email = request.query_params.get('email')
    
    if not email:
        return Response({
            'error': 'Email parameter is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        subscriber = NewsletterSubscriber.objects.get(email=email.lower())
        return Response({
            'subscribed': subscriber.is_active,
            'subscription_date': subscriber.subscription_date if subscriber.is_active else None
        })
    except NewsletterSubscriber.DoesNotExist:
        return Response({
            'subscribed': False,
            'subscription_date': None
        })
