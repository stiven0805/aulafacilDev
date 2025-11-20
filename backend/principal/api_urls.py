from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .api_views import (
    AulaViewSet,
    EstadisticasView,
    LoginView,
    NotificacionesView,
    RecursoViewSet,
    RegistroView,
    ReservaViewSet,
    UsuarioActualView,
)

router = DefaultRouter()
router.register(r"aulas", AulaViewSet, basename="aula")
router.register(r"recursos", RecursoViewSet, basename="recurso")
router.register(r"reservas", ReservaViewSet, basename="reserva")

urlpatterns = [
    path("auth/registro/", RegistroView.as_view(), name="registro"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/usuario/", UsuarioActualView.as_view(), name="usuario-actual"),
    path("reportes/estadisticas/", EstadisticasView.as_view(), name="estadisticas"),
    path("notificaciones/", NotificacionesView.as_view(), name="notificaciones"),
    path("", include(router.urls)),
]
