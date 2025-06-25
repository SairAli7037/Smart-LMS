from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('get-csrf-token/',views.get_csrf_token, name='get_csrf_token'),
    path('user/', views.user_info_view, name='user_info'),
    path('add/', views.add_question, name='add_question'),
    path('list/', views.get_questions, name='get_questions'),
    path('delete/<int:question_id>/', views.delete_question, name='delete_question'),
    path("my-questions/",views.my_questions, name='my_questions'),
    path("students/",views.student_list, name="student_list"),
]
