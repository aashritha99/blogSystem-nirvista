from django.urls import path
from . import views

app_name = 'newsletter'

urlpatterns = [
    # Subscription endpoints
    path('subscribe/', views.NewsletterSubscribeView.as_view(), name='subscribe'),
    path('unsubscribe/', views.NewsletterUnsubscribeView.as_view(), name='unsubscribe'),
    path('check-subscription/', views.newsletter_check_subscription, name='check-subscription'),
    
    # Admin endpoints
    path('subscribers/', views.NewsletterSubscriberListView.as_view(), name='subscriber-list'),
    path('subscribers/<int:pk>/', views.NewsletterSubscriberDetailView.as_view(), name='subscriber-detail'),
    path('bulk-action/', views.NewsletterBulkActionView.as_view(), name='bulk-action'),
    
    # Statistics endpoints
    path('stats/', views.newsletter_stats, name='newsletter-stats'),
]