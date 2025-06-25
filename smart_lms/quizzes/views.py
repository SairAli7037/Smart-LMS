from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
import json
from .models import Quiz, AssignedQuiz, QuizQuestion ,User,QuizResult,Notification
from users.models import Question,UserProfile
from courses.models import Course,CourseEnrollment,Submission
from django.utils import timezone
@csrf_protect
@login_required
def create_quiz(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            title = data.get("title")
            description = data.get("description", "")
            question_ids = data.get("question_ids", [])  # list of question IDs

            if not title or not question_ids:
                return JsonResponse({"error": "Title and question_ids are required"}, status=400)

            # Create quiz
            quiz = Quiz.objects.create(
                instructor=request.user,
                title=title,
                description=description
            )

            # Attach questions
            for qid in question_ids:
                try:
                    question = Question.objects.get(id=qid, instructor=request.user)
                    QuizQuestion.objects.create(quiz=quiz, question=question)
                except Question.DoesNotExist:
                    continue  # Skip invalid questions

            return JsonResponse({"message": "Quiz created successfully"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)




@csrf_protect
@login_required
def assign_quiz(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            quiz_id = data.get("quiz_id")
            student_ids = data.get("student_ids", [])
            
            if not quiz_id or not student_ids:
                return JsonResponse({"error": "Missing quiz_id or student_ids"}, status=400)
            
            quiz = Quiz.objects.get(id=quiz_id, instructor=request.user)

            for sid in student_ids:
                try:
                    student=User.objects.get(id=sid)
                    UserProfile.objects.get_or_create(user=student)
                    
                    AssignedQuiz.objects.get_or_create(quiz=quiz, student=student)
                except User.DoesNotExist:
                    return JsonResponse({"error": f"User with ID {sid} does not exist"}, status=400)

            return JsonResponse({"message": "Quiz assigned successfully."}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


@login_required
def my_quizzes(request):
    quizzes = Quiz.objects.filter(instructor=request.user)
    quiz_list = []
    for quiz in quizzes:
        print(quiz)
        assigned_count = AssignedQuiz.objects.filter(quiz=quiz).count()
        quiz_list.append({
            'id': quiz.id,
            'title': quiz.title,
            'description': quiz.description,
            'question_count': quiz.questions.count(),
            'assigned_count': assigned_count,
        })
    
    return JsonResponse(quiz_list, safe=False)



@login_required
def student_assigned_quizzes(request):
    student = request.user
    assigned = AssignedQuiz.objects.filter(student=student).select_related("quiz", "quiz__instructor")

    data = [
        {
            "quiz_id": aq.quiz.id,
            "title": aq.quiz.title,
            "instructor": aq.quiz.instructor.username,
           
        }
        for aq in assigned
    ]
    return JsonResponse(data, safe=False)

@login_required
def quiz_questions(request, quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)

        
        if request.user.userprofile.role == "student":
            if not quiz.assignedquiz_set.filter(student=request.user).exists():
                return JsonResponse({"error": "You are not assigned to this quiz."}, status=403)

        questions = Question.objects.filter(quiz=quiz)

        data = []
        for q in questions:
            data.append({
                "id": q.id,
                "question_text": q.question_text,
                "options": [q.option_a, q.option_b, q.option_c, q.option_d]
            })

        return JsonResponse(data, safe=False)

    except Quiz.DoesNotExist:
        return JsonResponse({"error": "Quiz not found."}, status=404)



@csrf_protect
@login_required
def submit_quiz(request, quiz_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = request.user

            answers = data.get("answers", {})
            # Fetch quiz and questions
            quiz = Quiz.objects.get(id=quiz_id)
            # questions = Question.objects.filter(quiz=quiz)
            
            AssignedQuiz.objects.filter(student=user, quiz=quiz).update( is_completed=True)
            
            assigned_quiz = AssignedQuiz.objects.get(student=user, quiz=quiz)

            Submission.objects.filter(assigned_quiz=assigned_quiz).delete()

            score = 0
            total = 0

            for q_id,selected_option in answers.items():
                try:
                    question=Question.objects.get(id=q_id,quiz=quiz)
                    total +=1
                    if question.correct_option == selected_option:
                        score += 1
                except Question.DoesNotExist:
                    continue
    
           

            # Save to Submission model
            submission = Submission.objects.create(
                assigned_quiz=assigned_quiz,
                student=user,
                score=score,
            )

            # Send notification to instructor
            instructor = quiz.instructor # get actual user behind instructor profile
            Notification.objects.create(
                user=instructor,
                message=f"{user.username} submitted '{quiz.title}' with score {score}/{total}",
            )

            return JsonResponse({
                "message": "Quiz submitted successfully",
                "score": score,
                "total": total,
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


@login_required
@require_http_methods(["DELETE"])
def delete_quiz(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id, instructor=request.user)
    quiz.delete()
    return JsonResponse({"success": True, "message": "Quiz deleted successfully."})


@login_required
@require_http_methods(["GET"])
def quiz_details(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id, instructor=request.user)
    questions = quiz.questions.all().values("id", "question_text")
    assigned_students = AssignedQuiz.objects.filter(quiz=quiz)
    student_data = [
        {
            "id": a.student.id,
            "name": a.student.userprofile.user.username,
            "email": a.student.userprofile.user.email,
        }
        for a in assigned_students
    ]

    return JsonResponse({
        "id": quiz.id,
        "title": quiz.title,
        "description": quiz.description,
        "questions": list(questions),
        "assigned_students": student_data
    })



@csrf_protect
@login_required
def assign_quiz_to_course(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed."}, status=405)

    try:
        data = json.loads(request.body)
        quiz_id = data.get("quiz_id")
        course_id = data.get("course_id")

        instructor = request.user
        # Validate quiz and course ownership
        quiz = Quiz.objects.get(id=quiz_id, instructor=instructor)
        course = Course.objects.get(id=course_id, instructor=instructor)
        
        # Get all enrolled students
        enrolled_students = [enrollment.student for enrollment in course.enrollments.all()]

        # Assign quiz to all enrolled students
        created_count = 0
        for student in enrolled_students:
            assigned, created = AssignedQuiz.objects.get_or_create(
                quiz=quiz,
                student=student
            )
            if created:
                created_count += 1

        # Link quiz to course (optional: for quick access)
        course.quiz = quiz
        course.save()

        return JsonResponse({
            "message": f"Quiz assigned to {created_count} student(s)."
        })

    except Quiz.DoesNotExist:
        return JsonResponse({"error": "Quiz not found or not owned by instructor."}, status=404)
    except Course.DoesNotExist:
        return JsonResponse({"error": "Course not found or not owned by instructor."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)





@login_required
def get_assigned_quiz(request, course_id):
    user = request.user
    try:
        course = Course.objects.get(id=course_id)
        print(course)
        # Check if the user is enrolled in this course
        if not CourseEnrollment.objects.filter(student=user, course=course).exists():
            return JsonResponse({"error": "You are not enrolled in this course."}, status=403)
        
        # Find assigned quiz for this course and this student
        assigned = AssignedQuiz.objects.filter(student=user, quiz=course.quiz).first()
        print(assigned)
        if assigned:
            return JsonResponse({
                "quiz_id": assigned.quiz.id,
                "quiz_title": assigned.quiz.title
            })
        else:
            return JsonResponse({"quiz_id": None})
    except Course.DoesNotExist:
        return JsonResponse({"error": "Course not found."}, status=404)


@login_required
@csrf_protect  
def retake_quiz(request, quiz_id):
    student = request.user

    assigned_quiz = get_object_or_404(AssignedQuiz, quiz_id=quiz_id, student=student)

    # Delete previous submission
    Submission.objects.filter(assigned_quiz=assigned_quiz, student=student).delete()

    return JsonResponse({
        "success": True,
        "assigned_quiz_id": assigned_quiz.id
    })
