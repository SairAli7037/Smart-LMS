from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect


def serve_react(request):
    return render(request, 'index.html')
