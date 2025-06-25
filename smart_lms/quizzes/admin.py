from django.contrib import admin
from .models import Quiz, QuizQuestion, AssignedQuiz,QuizResult,Notification

admin.site.register(Quiz)
admin.site.register(QuizQuestion)
admin.site.register(AssignedQuiz)
admin.site.register(QuizResult)
admin.site.register(Notification)

# Register your models here.
