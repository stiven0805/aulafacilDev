from datetime import timedelta

from django.contrib.auth.hashers import make_password
from django.db import connection
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from .auth import generar_token_usuario
from .models import Aula, Reserva, Usuario


@override_settings(
    DATABASES={
        "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"},
    }
)
class ReservaBusinessTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Habilitar creación de tablas para modelos unmanaged en el entorno de prueba.
        for model in [Usuario, Aula, Reserva]:
            model._meta.managed = True
            with connection.schema_editor() as schema_editor:
                schema_editor.create_model(model)

        cls.estudiante = Usuario.objects.create(
            nombre="Ana",
            apellido="Estudiante",
            correo="ana@test.com",
            contraseña=make_password("123456"),
            rol="estudiante",
        )
        cls.admin = Usuario.objects.create(
            nombre="Admin",
            apellido="Sistema",
            correo="admin@test.com",
            contraseña=make_password("admin123"),
            rol="administrador",
        )
        cls.aula = Aula.objects.create(nombre_aula="A101", capacidad=10, descripcion="Sala 1")

    @classmethod
    def tearDownClass(cls):
        # Limpia tablas creadas manualmente.
        with connection.schema_editor() as schema_editor:
            for model in [Reserva, Aula, Usuario]:
                schema_editor.delete_model(model)
        for model in [Usuario, Aula, Reserva]:
            model._meta.managed = False
        super().tearDownClass()

    def _auth(self, usuario):
        client = APIClient()
        token = generar_token_usuario(usuario)
        client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        return client

    def test_prevenir_solapamiento_reservas(self):
        inicio = timezone.now() + timedelta(hours=1)
        fin = inicio + timedelta(hours=2)
        Reserva.objects.create(inicio=inicio, fin=fin, estado="pendiente", id_usuario=self.estudiante, id_aula=self.aula)
        client = self._auth(self.estudiante)
        resp = client.post(
            "/api/reservas/",
            {"inicio": inicio.isoformat(), "fin": fin.isoformat(), "id_aula": self.aula.id_aula},
            format="json",
        )
        self.assertEqual(resp.status_code, 400)
        self.assertIn("ya está reservada", resp.json()["non_field_errors"][0])

    def test_no_modificar_reserva_iniciada(self):
        inicio_pasado = timezone.now() - timedelta(hours=1)
        fin_futuro = timezone.now() + timedelta(hours=1)
        reserva = Reserva.objects.create(
            inicio=inicio_pasado,
            fin=fin_futuro,
            estado="pendiente",
            id_usuario=self.estudiante,
            id_aula=self.aula,
        )
        client = self._auth(self.estudiante)
        resp = client.patch(
            f"/api/reservas/{reserva.id_reserva}/",
            {"inicio": (timezone.now() + timedelta(hours=2)).isoformat(), "fin": (timezone.now() + timedelta(hours=3)).isoformat()},
            format="json",
        )
        self.assertEqual(resp.status_code, 400)
        self.assertIn("No se puede modificar", resp.json()["detail"])

    def test_estudiante_no_ve_reservas_ajenas(self):
        otro = Usuario.objects.create(
            nombre="Luis",
            apellido="Otro",
            correo="luis@test.com",
            contraseña=make_password("abc12345"),
            rol="estudiante",
        )
        Reserva.objects.create(
            inicio=timezone.now() + timedelta(hours=1),
            fin=timezone.now() + timedelta(hours=2),
            estado="pendiente",
            id_usuario=otro,
            id_aula=self.aula,
        )
        client = self._auth(self.estudiante)
        resp = client.get("/api/reservas/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.json()), 0)

    def test_admin_puede_ver_todas_las_reservas(self):
        Reserva.objects.create(
            inicio=timezone.now() + timedelta(hours=1),
            fin=timezone.now() + timedelta(hours=2),
            estado="pendiente",
            id_usuario=self.estudiante,
            id_aula=self.aula,
        )
        client = self._auth(self.admin)
        resp = client.get("/api/reservas/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.json()), 1)
