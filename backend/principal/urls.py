# principal/urls.py

from django.urls import include, path
from . import views
from . import api_urls

# Aquí definiremos las rutas específicas de la aplicación 'principal'
urlpatterns = [
    path('', views.inicio, name='inicio'), # Ejemplo de la vista 'inicio'
    path('api/', include(api_urls)),
]
