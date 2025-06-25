from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse ,Http404,HttpResponseForbidden
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from .models import Course, AssignedQuiz, CourseProgress, CourseEnrollment, ClassSchedule,Submission,Lesson,LessonProgress
from quizzes.models import   AssignedQuiz,Quiz ,QuizQuestion ,QuizResult,Notification
from django.db.models import Count,Avg,Q
import json
from users.models import UserProfile



@csrf_protect
@login_required
def student_dashboard_data(request):
    if request.user.userprofile.role != 'student':
        return JsonResponse({'error': 'Access denied'}, status=403)
    
    
    enrollments = CourseEnrollment.objects.filter(student=request.user).select_related('course')
    quizzes = AssignedQuiz.objects.filter(student=request.user).select_related('quiz')
    all_courses = Course.objects.all()
    progress = CourseProgress.objects.filter(student=request.user).select_related('course')
    upcoming_classes = ClassSchedule.objects.filter(
        course__in=[e.course for e in enrollments]
    ).order_by('scheduled_at')[:5]
    
    for course in all_courses:
        # Get first lesson's video URL if course has no main video
        first_lesson = course.lessons.order_by('id').first()  # or use a defined order
        fallback_video = first_lesson.video_url if first_lesson else None
    #last submissions details
    student=request.user
    last_submission = (
        Submission.objects.filter(student=student)
        .select_related("assigned_quiz__quiz")
        .order_by("-submitted_at")
        .first()
    )
   
    last_submission_data=None
    if last_submission:
        quiz=last_submission.assigned_quiz.quiz
        last_submission_data={
            "title":quiz.title,
            "submitted_at":last_submission.submitted_at,
        }

    data = {
        'enrolled_courses': [
            {
                'title': e.course.title,
                'description': e.course.description,
                'video_url':e.course.video_url or (
                    e.course.lessons.order_by('id').first().video_url 
                    if e.course.lessons.exists() else None
            ),
                'enrolled_at': e.enrolled_at
            } for e in enrollments
        ],
        'recommended_courses': [
            {
                'title': 'AI Fundamentals',
                'description': 'A recommended course based on your progress.'
            }
        ],  # Placeholder: you can build a real recommendation engine later
        'assigned_quizzes': [
            {
                'quiz_id':q.quiz.id,
                'title': q.quiz.title,
                'is_completed': q.is_completed,
                'assigned_at': q.assigned_at
            } for q in quizzes
        ],
        'upcoming_classes': [
            {
                'course': c.course.title,
                'topic': c.topic,
                'scheduled_at': c.scheduled_at
            } for c in upcoming_classes
        ],
        'progress':[
            {
                'course':p.course.title,
                'progress': float(p.progress)
            } for p in progress
        ],
        'user_details':[
            {
                'student':request.user.username,
            }
        ],
        'all_courses': [
        {
            'id': c.id,
            'title': c.title,
            'description': c.description,
            'video_url':c.video_url or (
              c.lessons.order_by('id').first().video_url 
            if c.lessons.exists() else None
            ),
            'instructor': c.instructor.username  # or instructor.get_full_name()
        }
        for c in all_courses
    ],
        'last_activity': {
            'activity': last_submission_data
             # Stub value
        }
    }

    return JsonResponse(data)



@csrf_protect
@login_required
def instructor_dashboard_data(request):
    if request.user.userprofile.role != 'instructor':
        return JsonResponse({'error': 'Access denied'}, status=403)

    # Fetch instructor's courses and quizzes
    instructor=request.user
    courses = Course.objects.filter(instructor=request.user)
    quizzes = Quiz.objects.filter(instructor=request.user)
    total_courses=courses.count()
    # Count unique students enrolled in instructor's courses
    student_ids = CourseEnrollment.objects.filter(course__in=courses).values_list('student', flat=True).distinct()
    total_students = len(student_ids)
    
    # for course in courses:
    #     # Get first lesson's video URL if course has no main video
    #     first_lesson = course.lessons.order_by('id').first()  # or use a defined order
    #     fallback_video = first_lesson.video_url if first_lesson else None

    # Build course list
    course_data = [
        {    'id':course.id,
            'title': course.title,
            'description': course.description,
            'video_url':course.video_url or (
              course.lessons.order_by('id').first().video_url 
            if course.lessons.exists() else None
            ),
            'created_at': course.created_at,
        } for course in courses
    ]

    # Notifications stub - for demo, assume enrollment events (could be tracked separately in a Notification model)
    notifications = [
        f"New student enrolled in {enrollment.course.title}"
        for enrollment in CourseEnrollment.objects.filter(course__in=courses).order_by('-enrolled_at')[:5]
    ]

    # Recent quiz submissions
    # Inside your instructor dashboard view
    recent_submissions_data= []
    recent_submissions = Submission.objects.select_related(
        "assigned_quiz__quiz", "student"
    ).filter(
        assigned_quiz__quiz__instructor=instructor
    ).order_by("-submitted_at")[:10]
    
    for sub in recent_submissions:
        quiz = sub.assigned_quiz.quiz
        courses = Course.objects.filter(quiz=quiz)
    
        for course in courses:
            recent_submissions_data.append({
                "quiz": quiz.title,
                "course_title": course.title,
                "student_name": sub.student.username,
            })

    
    # Student Analytics
    quiz_ids = quizzes.values_list("id", flat=True)
    total_quizzes = quizzes.count()

    total_submissions = Submission.objects.filter(
        assigned_quiz__quiz__in=quiz_ids
    ).count()

    average_score = Submission.objects.filter(
        assigned_quiz__quiz__in=quiz_ids
    ).aggregate(avg=Avg('score'))['avg'] or 0

    # Score distribution
    score_dist = Submission.objects.filter(
        assigned_quiz__quiz__in=quiz_ids
    ).values('score').annotate(count=Count('score'))

    # Completion distribution
    completed_count = AssignedQuiz.objects.filter(
        quiz__in=quiz_ids, is_completed=True
    ).count()

    incomplete_count = AssignedQuiz.objects.filter(
        quiz__in=quiz_ids, is_completed=False
    ).count()

    print(courses.count())
    data = {
        'total_courses': total_courses,
        'total_quizzes': quizzes.count(),
        'total_students': total_students,
        'courses': course_data,
        'notifications': notifications,
        'recent_submissions': recent_submissions_data,

        'student_analytics':
        [{
            "total_students": total_students,
        "total_quizzes": total_quizzes,
        "total_submissions": total_submissions,
        "average_score": round(average_score, 2),
        "score_distribution": list(score_dist),
        "completion_distribution": {
            "Completed": completed_count,
            "Incomplete": incomplete_count}
            }
        ]
    }

    return JsonResponse(data)




@csrf_protect 
@login_required
def add_course(request):
    if request.method == 'POST':
        if request.user.userprofile.role != 'instructor':
            return JsonResponse({'error': 'Only instructors can add courses.'}, status=403)

        try:
            data = json.loads(request.body)
            title = data.get('title')
            description = data.get('description')
            video_url=data.get('video_url')
            lessons = data.get('lessons', [])

            if not title:
                return JsonResponse({'error': 'Course title is required.'}, status=400)

            course=Course.objects.create(
                instructor=request.user,
                title=title,
                description=description,
                video_url=video_url
            )

              # Create lessons
            for lesson in lessons:
                Lesson.objects.create(
                    course=course,
                    title=lesson.get('title'),
                    video_url=lesson.get('video_url'),
                    order=lesson.get('order', 1)
                )

            return JsonResponse({'message': 'Course added successfully.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)


@csrf_protect 
@login_required
def course_detail_view(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
        user=request.user
        learners_count = CourseEnrollment.objects.filter(course=course).count()
        
        # Get lessons for this course
        lessons = Lesson.objects.filter(course=course).order_by('id')  # or use 'order' field if available

        completed_lessons = set(
            LessonProgress.objects.filter(student=user, completed=True)
            .values_list('lesson_id', flat=True)
        )

        lesson_data = []
        for index, lesson in enumerate(lessons):
            is_completed = lesson.id in completed_lessons
            is_unlocked = index == 0 or lessons[index - 1].id in completed_lessons
            lesson_data.append({
                "id": lesson.id,
                "title": lesson.title,
                "video_url": lesson.video_url,
                "is_completed": is_completed,
                "is_unlocked": is_unlocked,
            })
       
        data = {
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "instructor":course.instructor.username,
            "video_url": course.video_url,
            "learners_count": learners_count,
            "lessons": lesson_data,
        }
        return JsonResponse(data)
    except Course.DoesNotExist:
        raise Http404("Course not found")



@csrf_protect
@login_required
def delete_course(request, course_id):
    if request.method == "DELETE":
        try:
            course = Course.objects.get(id=course_id, instructor=request.user)
            course.delete()
            return JsonResponse({"message": "Course deleted successfully."})
        except Course.DoesNotExist:
            return JsonResponse({"error": "Course not found or unauthorized."}, status=404)
    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_protect
@login_required
def all_courses_view(request):
    user = request.user
    user_profile = UserProfile.objects.get(user=user)

    # Get courses the user has enrolled in
    enrolled_course_ids = CourseEnrollment.objects.filter(student=user_profile.user).values_list('course_id', flat=True)

    # Get all courses
    all_courses = Course.objects.all()
    

    course_data = []
    for course in all_courses:
        course_data.append({
            'id': course.id,
            'title': course.title,
            'description': course.description,
            'video_url':course.video_url or (
              course.lessons.order_by('id').first().video_url 
            if course.lessons.exists() else None
            ),
            'instructor_name': course.instructor.username if course.instructor else "Unknown",
            'is_enrolled': course.id in enrolled_course_ids
        })

    return JsonResponse({'courses': course_data,'enrolled_course_ids': list(enrolled_course_ids)})

@csrf_protect
@login_required
def my_courses_view(request):
    user = request.user

    enrolled_courses = CourseEnrollment.objects.select_related('course', 'course__instructor').filter(student=user)

    

    course_data = []
    for enrollment in enrolled_courses:
        course = enrollment.course
        first_lesson = course.lessons.order_by('id').first()  
        fallback_video = first_lesson.video_url if first_lesson else None
        course_data.append({
            'id': course.id,
            'title': course.title,
            'description': course.description,
            'video_url': course.video_url or fallback_video,
            'instructor_name': course.instructor.username if course.instructor else "Unknown",
        })
    
    return JsonResponse({'courses': course_data})



@login_required
def instructor_courses(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET method only."}, status=405)

    instructor = request.user
    courses = Course.objects.filter(instructor=instructor)

    course_data = [
        {
            "id": course.id,
            "title": course.title,
            "description": course.description,
            'video_url':course.video_url or (
              course.lessons.order_by('id').first().video_url 
            if course.lessons.exists() else None
            ),
            "created_at": course.created_at,
        }
        for course in courses
    ]

    return JsonResponse(course_data, safe=False)

@csrf_protect
@require_POST
@login_required
def enroll_course_view(request, course_id):
    user_profile = UserProfile.objects.get(user=request.user)
    course = get_object_or_404(Course, id=course_id)

    # Prevent duplicate enrollment
    if CourseEnrollment.objects.filter(student=user_profile.user, course=course).exists():
        return JsonResponse({"message": "Already enrolled"}, status=400)

    CourseEnrollment.objects.create(
        student=user_profile.user,
        course=course,
    )
    
    if course.quiz:
        AssignedQuiz.objects.get_or_create(
            student=user_profile.user,
            quiz=course.quiz
        )
    return JsonResponse({"message": "Enrolled successfully"})


@login_required
def get_course_progress(request, course_id):
    lessons = Lesson.objects.filter(course_id=course_id).order_by('id')
    progress_data = []

    for lesson in lessons:
        completed = LessonProgress.objects.filter(student=request.user, lesson=lesson, completed=True).exists()
        progress_data.append({
            "lesson_id": lesson.id,
            "title": lesson.title,
            "video_url": lesson.video_url,
            "completed": completed
        })
    

    return JsonResponse({"progress": progress_data})


@csrf_protect
@login_required
def mark_lesson_complete(request, lesson_id):
    if request.method == 'POST':
        lesson = Lesson.objects.get(id=lesson_id)
        progress, created = LessonProgress.objects.get_or_create(student=request.user, lesson=lesson)
        progress.completed = True
        progress.save()
        return JsonResponse({"success": True})
    



@login_required
def recent_submissions(request):
    instructor = request.user.userprofile
    submissions = Submission.objects.filter(
        assigned_quiz__quiz__course__instructor=instructor
    ).select_related("student", "assigned_quiz__quiz").order_by("-submitted_at")[:10]

    data = []
    for sub in submissions:
        data.append({
            "student": sub.student.username,
            "quiz": sub.assigned_quiz.quiz.title,
            "score": float(sub.score),
            "submitted_at": sub.submitted_at.strftime("%Y-%m-%d %H:%M"),
        })

    return JsonResponse({"results": data})



@login_required
def all_submissions_view(request):
    instructor = request.user
    submissions = Submission.objects.filter(
        assigned_quiz__quiz__instructor=instructor
    ).select_related("student", "assigned_quiz__quiz")

    data = []
    for sub in submissions:
        quiz = sub.assigned_quiz.quiz
        student = sub.student
        courses = Course.objects.filter(quiz=quiz)

        for course in courses:
            data.append({
                "id": sub.id,
                "quiz": quiz.title,
                "student_name": student.username,
                "course_title": course.title,
                "score": sub.score,
                "submitted_at": sub.submitted_at,
            })

    return JsonResponse({"submissions": data})




@login_required
def submission_detail_view(request, submission_id):
    submission = get_object_or_404(Submission, id=submission_id)
    print(submission)
    if submission.assigned_quiz.quiz.instructor != request.user:
        return HttpResponseForbidden("You do not have access to this submission.")

    quiz = submission.assigned_quiz.quiz
    course = Course.objects.filter(quiz=quiz).first()  # if multiple, pick one
    student = submission.student

  

    return JsonResponse({
        "quiz_title": quiz.title,
        "student_name": student.username,
        "course_title": course.title if course else "N/A",
        "score": submission.score,
        "submitted_at": submission.submitted_at,
        # "answers": list(answers)
    })
