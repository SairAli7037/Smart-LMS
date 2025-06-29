from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    bio = models.TextField(blank=True, null=True)
    # profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

class Question(models.Model):
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    question_text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_option = models.CharField(
        max_length=1,
        choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question_text[:50]



# Create your models here.
