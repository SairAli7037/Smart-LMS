from django.urls import path
from .views import *

urlpatterns = [
    path("create-quiz/", create_quiz, name="create_quiz"),
    path("assign-quiz/", assign_quiz, name="assign_quiz"),
    path("my-quizzes/", my_quizzes,name="my_quizzes"),
    path("assigned/",student_assigned_quizzes,name="student_assigned_quizzes"),
    path("assign-to-course/", assign_quiz_to_course, name="assign_quiz_to_course"),
    path('assigned/<int:course_id>/',get_assigned_quiz, name='get_assigned_quiz'),
    path("<int:quiz_id>/questions/",quiz_questions,name="quiz_questions"),
    path("<int:quiz_id>/submit/",submit_quiz,name="submit_quiz"),
    path("<int:quiz_id>/delete/",delete_quiz,name="delete_quiz"),
    path("<int:quiz_id>/details/",quiz_details,name="quiz_details"),
    path("retake-quiz/<int:quiz_id>/",retake_quiz, name='retake_quiz'),



]
