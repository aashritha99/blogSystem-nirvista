from django.db import models
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


class NewsletterSubscriber(models.Model):
    """Newsletter subscription model."""
    
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscription_date = models.DateTimeField(default=timezone.now)
    unsubscribed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'newsletter_subscribers'
        verbose_name = 'Newsletter Subscriber'
        verbose_name_plural = 'Newsletter Subscribers'
        ordering = ['-subscription_date']
    
    def __str__(self):
        return self.email
    
    def unsubscribe(self):
        """Unsubscribe the user from newsletter."""
        self.is_active = False
        self.unsubscribed_at = timezone.now()
        self.save()
    
    def resubscribe(self):
        """Resubscribe the user to newsletter."""
        self.is_active = True
        self.unsubscribed_at = None
        self.save()
    
    @classmethod
    def send_newsletter(cls, blog_post):
        """Send newsletter to all active subscribers when a new blog is published."""
        active_subscribers = cls.objects.filter(is_active=True)
        
        if not active_subscribers.exists():
            return
        
        subject = f"New Blog Post: {blog_post.title}"
        
        # Create email content
        context = {
            'blog_post': blog_post,
            'blog_url': f"{settings.FRONTEND_URL or 'http://localhost:3000'}/blogs/{blog_post.slug}",
        }
        
        # You can create an HTML template for better formatting
        html_message = f"""
        <h2>New Blog Post Published!</h2>
        <h3>{blog_post.title}</h3>
        <p>{blog_post.meta_description or 'Check out our latest blog post!'}</p>
        <p><a href="{context['blog_url']}">Read More</a></p>
        <hr>
        <p><small>You're receiving this because you subscribed to our newsletter.</small></p>
        """
        
        plain_message = strip_tags(html_message)
        
        # Send email to all subscribers
        recipient_list = [subscriber.email for subscriber in active_subscribers]
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=recipient_list,
                html_message=html_message,
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Failed to send newsletter: {e}")
            return False
