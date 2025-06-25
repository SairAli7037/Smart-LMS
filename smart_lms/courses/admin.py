from django.contrib import admin
from .models import Course,CourseEnrollment,CourseProgress,Lesson,LessonProgress,ClassSchedule,Submission


admin.site.register(CourseEnrollment)
admin.site.register(CourseProgress)
admin.site.register(Lesson)
admin.site.register(LessonProgress)
admin.site.register(ClassSchedule)
admin.site.register(Submission)
