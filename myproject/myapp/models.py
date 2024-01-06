from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    
    pass

class Video(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    video = models.FileField(upload_to='videos/')  # Changed from ImageField to FileField
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    @property
    def likes(self):
        return VideoReaction.objects.filter(video=self, liked=True).count()

    @property
    def dislikes(self):
        return VideoReaction.objects.filter(video=self, liked=False).count()

class VideoReaction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)  # Reference to Video model
    liked = models.BooleanField()

    class Meta:
        unique_together = ('user', 'video')

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    bio = models.TextField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.user.username