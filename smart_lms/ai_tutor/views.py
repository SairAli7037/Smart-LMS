# views.py
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.conf import settings
import json

@csrf_protect
def chat_with_ai(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data.get("message")

        together_api_key = settings.TOGETHER_API_KEY

        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {together_api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                "messages": [{"role": "user", "content": user_message}],
                "temperature": 0.7,
                "max_tokens": 300
            }
        )

        if response.status_code == 200:
            reply = response.json()["choices"][0]["message"]["content"]
            return JsonResponse({"reply": reply})
        else:
            return JsonResponse({"error": response.text}, status=500)
