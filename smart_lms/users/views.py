from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import UserProfile,User,Question
from django.http import JsonResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_protect ,ensure_csrf_cookie
from django.views.decorators.http import require_GET
from django.middleware.csrf import get_token
import json



@csrf_protect
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            role = data.get('role')

            # Basic validation
            if not all([username, password, email, role]):
                return JsonResponse({'error': 'All fields are required'}, status=400)

            if len(password) < 6:
                return JsonResponse({'error': 'Password too short'}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already taken'}, status=400)
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error':'Email already taken'})

            user = User.objects.create_user(username=username, email=email, password=password)
            if not UserProfile.objects.filter(user=user).exists():
                UserProfile.objects.create(
                    user=user,
                    role=role,
                )

            return JsonResponse({'message': 'User registered successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@ensure_csrf_cookie
@csrf_protect
def login_view(request):
    if request.method == 'GET':
        return JsonResponse({'message': 'CSRF cookie set'})
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return JsonResponse({'error': 'Username and password are required'}, status=400)

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                role = UserProfile.objects.get(user=user).role
                return JsonResponse({'message': 'Login successful' ,'role':role}, status=200)
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logged out'}, status=200)


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF cookie set'})
    # token=get_token(request)
    # response = JsonResponse({'message': 'CSRF cookie set', 'csrfToken': token})
    # return response
    # return JsonResponse({'csrfToken': get_token(request)})


@login_required
def user_info_view(request):

    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Not authenticated"}, status=401)

    # 2. Safely get the profile (handle missing profile)
    profile = getattr(request.user, "userprofile", None)

    if not profile:
        return JsonResponse({"detail": "User profile not found"}, status=404)

    # 3. Return the safe response
    return JsonResponse({
        "username": request.user.username,
        "role": profile.role,
        "email": request.user.email,
    })


@csrf_protect
@login_required
def add_question(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse JSON from body

            question_text = data.get('question_text')
            option_a = data.get('option_a')
            option_b = data.get('option_b')
            option_c = data.get('option_c')
            option_d = data.get('option_d')
            correct_option = data.get('correct_option')

            if not question_text or not correct_option:
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            new_question = Question.objects.create(
                instructor=request.user,
                question_text=question_text,
                option_a=option_a,
                option_b=option_b,
                option_c=option_c,
                option_d=option_d,
                correct_option=correct_option,
            )

            return JsonResponse({'message': 'Question added successfully!'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@login_required
def get_questions(request):
    questions = Question.objects.filter(instructor=request.user)
    question_data = [
        {
            'id': q.id,
            'question_text': q.question_text,
            'option_a': q.option_a,
            'option_b': q.option_b,
            'option_c': q.option_c,
            'option_d': q.option_d,
            'correct_option': q.correct_option,
        }
        for q in questions
    ]
    return JsonResponse({'questions': question_data}, safe=False)


@login_required
def delete_question(request, question_id):
    try:
        question = Question.objects.get(id=question_id)
    except Question.DoesNotExist:
        return JsonResponse({'error': 'Question not found'}, status=404)

    if question.instructor != request.user:
        return HttpResponseForbidden("You can't delete another instructor's question.")

    question.delete()
    return JsonResponse({'message': 'Question deleted successfully!'})


@login_required
def my_questions(request):
    questions = Question.objects.filter(instructor=request.user).values(
        "id", "question_text"
    )
    return JsonResponse(list(questions), safe=False)

@login_required
def student_list(request):
    students = UserProfile.objects.filter(role="student").select_related("user")
    data = [
        {
            "id":profile.user.id,
            "username":profile.user.username,
        }
        for profile in students
    ]
    return JsonResponse(data, safe=False)

