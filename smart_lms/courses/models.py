from django.db import models
from django.contrib.auth.models import User
from quizzes.models import AssignedQuiz,Quiz

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    video_url = models.URLField(blank=True, null=True)
    quiz = models.ForeignKey(Quiz, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.title


class CourseEnrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')  # No duplicate enrollments

    def __str__(self):
        return f"{self.student.username} enrolled in {self.course.title}"

class CourseProgress(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)  # 0.00 to 100.00
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.username} - {self.course.title}: {self.progress}%"

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=255)
    video_url = models.URLField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class LessonProgress(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed=models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'lesson')


class ClassSchedule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    topic = models.CharField(max_length=255)
    scheduled_at = models.DateTimeField()

    def __str__(self):
        return f"{self.course.title} - {self.topic} on {self.scheduled_at.strftime('%Y-%m-%d %H:%M')}"

class Submission(models.Model):
    assigned_quiz = models.ForeignKey(AssignedQuiz, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    submitted_at = models.DateTimeField(auto_now_add=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    is_archived = models.BooleanField(default=False)  

    def __str__(self):
        return f"{self.student.username} - {self.assigned_quiz.quiz.title} - {self.score}"
