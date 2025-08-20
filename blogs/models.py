from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.conf import settings
from categories.models import Category
from tags.models import Tag
import bleach


class Blog(models.Model):
    """Blog model with SEO features and content management."""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    content = models.TextField(help_text='HTML content will be sanitized')
    featured_image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='blogs')
    tags = models.ManyToManyField(Tag, blank=True, related_name='blogs')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blogs')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    
    # SEO fields
    meta_title = models.CharField(max_length=60, blank=True, help_text='SEO title (max 60 chars)')
    meta_description = models.CharField(max_length=160, blank=True, help_text='SEO description (max 160 chars)')
    image_alt_text = models.CharField(max_length=125, blank=True, help_text='Alt text for featured image')
    
    # Timestamps
    published_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'blogs'
        verbose_name = 'Blog'
        verbose_name_plural = 'Blogs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'published_at']),
            models.Index(fields=['author']),
            models.Index(fields=['category']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Auto-generate slug from title if not provided
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Blog.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        
        # Sanitize HTML content
        allowed_tags = [
            'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'blockquote', 'a', 'img', 'code', 'pre', 'span', 'div'
        ]
        allowed_attributes = {
            'a': ['href', 'title'],
            'img': ['src', 'alt', 'width', 'height'],
            'span': ['class'],
            'div': ['class']
        }
        self.content = bleach.clean(self.content, tags=allowed_tags, attributes=allowed_attributes)
        
        # Set published_at when status changes to published
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        elif self.status == 'draft':
            self.published_at = None
        
        # Auto-generate meta_title if not provided
        if not self.meta_title:
            self.meta_title = self.title[:60]
        
        super().save(*args, **kwargs)
    
    @property
    def is_published(self):
        return self.status == 'published'
    
    @property
    def reading_time(self):
        """Estimate reading time based on word count (average 200 words per minute)."""
        word_count = len(self.content.split())
        return max(1, round(word_count / 200))
    
    def get_absolute_url(self):
        return f'/blogs/{self.slug}/'
