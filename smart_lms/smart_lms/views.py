from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required()  # frontend login page
def serve_react(request):
    return render(request, 'index.html')
