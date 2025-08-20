from django.db import models
from django.utils import timezone
from django.conf import settings
from blogs.models import Blog
import bleach


class Comment(models.Model):
    """Comment model for blog posts with spam detection."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('spam', 'Spam'),
    ]
    
    id = models.AutoField(primary_key=True)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField(max_length=1000)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Spam detection fields
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    
    class Meta:
        db_table = 'comments'
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['blog', 'status']),
            models.Index(fields=['user']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f'Comment by {self.user.name} on {self.blog.title}'
    
    def save(self, *args, **kwargs):
        # Sanitize comment content
        allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'a']
        allowed_attributes = {'a': ['href']}
        self.content = bleach.clean(self.content, tags=allowed_tags, attributes=allowed_attributes)
        
        # Basic spam detection
        if self.is_spam():
            self.status = 'spam'
        
        super().save(*args, **kwargs)
    
    def is_spam(self):
        """Basic spam detection using keyword matching."""
        spam_keywords = [
            'viagra', 'casino', 'lottery', 'winner', 'congratulations',
            'click here', 'free money', 'make money fast', 'work from home',
            'buy now', 'limited time', 'act now', 'urgent', 'guaranteed'
        ]
        
        content_lower = self.content.lower()
        spam_count = sum(1 for keyword in spam_keywords if keyword in content_lower)
        
        # Consider spam if contains 2 or more spam keywords
        return spam_count >= 2
    
    def approve(self):
        """Approve the comment."""
        self.status = 'approved'
        self.save()
    
    def mark_as_spam(self):
        """Mark the comment as spam."""
        self.status = 'spam'
        self.save()
    
    @property
    def is_approved(self):
        return self.status == 'approved'
    
    @property
    def is_pending(self):
        return self.status == 'pending'
    
    @property
    def is_spam_status(self):
        return self.status == 'spam'
