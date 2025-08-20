from django.urls import path
from . import views

app_name = 'blogs'

urlpatterns = [
    # Blog CRUD endpoints
    path('', views.BlogListView.as_view(), name='blog-list'),
    path('create/', views.BlogCreateView.as_view(), name='blog-create'),
    path('<slug:slug>/', views.BlogDetailView.as_view(), name='blog-detail'),
    path('<slug:slug>/update/', views.BlogUpdateView.as_view(), name='blog-update'),
    path('<slug:slug>/delete/', views.BlogDeleteView.as_view(), name='blog-delete'),
    path('<slug:slug>/publish/', views.BlogPublishView.as_view(), name='blog-publish'),
    
    # User-specific endpoints
    path('my-blogs/', views.MyBlogsView.as_view(), name='my-blogs'),
    
    # Statistics and featured endpoints
    path('stats/', views.blog_stats, name='blog-stats'),
    path('featured/', views.featured_blogs, name='featured-blogs'),
]