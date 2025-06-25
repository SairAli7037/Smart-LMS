from django.urls import path
from .views import *

urlpatterns = [
    path('instructor/dashboard/',instructor_dashboard_data, name='instructor_dashboard_data'),
    path('student/dashboard/',student_dashboard_data, name='student_dashboard_data'),
    path('add/',add_course, name='add_course'),
    path('<int:course_id>/detail/',course_detail_view, name='course_detail'),
    path('<int:course_id>/delete/',delete_course, name='delete_course'),
    path("all/",all_courses_view, name="all_courses"),
    path('my/',my_courses_view, name='my-courses'),
    path("instructor/my-courses/", instructor_courses, name="instructor_courses"),
    path("<int:course_id>/enroll/",enroll_course_view, name="enroll_course"),
    path('course/<int:course_id>/progress/', get_course_progress,name="get_course_progress"),
    path('lesson/<int:lesson_id>/complete/',mark_lesson_complete,name="mark_lesson_complete"),
    path("instructor/recent-submissions/", recent_submissions, name="recent_submissions"),
    path("instructor/submissions/", all_submissions_view),
    path("instructor/submissions/<int:submission_id>/",submission_detail_view),

]


