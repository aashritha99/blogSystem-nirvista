from django.urls import path
from . import views

app_name = 'categories'

urlpatterns = [
    path('', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('<slug:slug>/', views.CategoryDetailView.as_view(), name='category-detail'),
]