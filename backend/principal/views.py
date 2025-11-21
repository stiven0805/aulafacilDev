from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

def inicio(request):
    return HttpResponse("<h1>¡Hola! ¡Tu proyecto Django con SQLite está funcionando!</h1>")
