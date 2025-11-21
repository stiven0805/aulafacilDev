from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .auth import generar_token_usuario
from .models import Aula, Recurso, Reserva
from .permissions import IsAdminRole, IsOwnerOrAdminReservation
from .serializers import (
    AulaSerializer,
    LoginSerializer,
    RecursoSerializer,
    RegistroUsuarioSerializer,
    ReservaCreateSerializer,
    ReservaSerializer,
    UsuarioSerializer,
)


class RegistroView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegistroUsuarioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()
        token = generar_token_usuario(usuario)
        return Response(
            {"token": token, "usuario": UsuarioSerializer(usuario).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class UsuarioActualView(APIView):
    def get(self, request):
        return Response(UsuarioSerializer(request.user).data)


class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminRole()]
        return [permissions.AllowAny()]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        inicio_raw = request.query_params.get("inicio")
        fin_raw = request.query_params.get("fin")

        if inicio_raw and fin_raw:
            inicio = parse_datetime(inicio_raw)
            fin = parse_datetime(fin_raw)
            if inicio and fin:
                ocupadas = Reserva.objects.filter(
                    id_aula__in=queryset,
                    estado__in=["pendiente", "confirmada"],
                    inicio__lt=fin,
                    fin__gt=inicio,
                ).values_list("id_aula_id", flat=True)
                queryset = queryset.exclude(id_aula__in=ocupadas)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class RecursoViewSet(viewsets.ModelViewSet):
    queryset = Recurso.objects.select_related("id_aula").all()
    serializer_class = RecursoSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminRole()]
        return [permissions.AllowAny()]


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.select_related("id_aula", "id_usuario").all()
    permission_classes = [IsOwnerOrAdminReservation]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return ReservaCreateSerializer
        return ReservaSerializer

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "rol", "") == "administrador":
            fecha_inicio = self.request.query_params.get("inicio")
            fecha_fin = self.request.query_params.get("fin")
            qs = self.queryset
            if fecha_inicio:
                parsed = parse_datetime(fecha_inicio)
                if parsed:
                    qs = qs.filter(fin__gte=parsed)
            if fecha_fin:
                parsed = parse_datetime(fecha_fin)
                if parsed:
                    qs = qs.filter(inicio__lte=parsed)
            return qs
            return self.queryset
        return self.queryset.filter(id_usuario=user)

    def perform_create(self, serializer):
        serializer.save()

    def _validate_future_change(self, reserva):
        if reserva.inicio <= timezone.now():
            return Response(
                {"detail": "No se puede modificar una reserva ya iniciada."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return None

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        check = self._validate_future_change(instance)
        if check:
            return check
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(ReservaSerializer(instance).data)

    @action(detail=True, methods=["post"])
    def cancelar(self, request, pk=None):
        reserva = self.get_object()
        check = self._validate_future_change(reserva)
        if check:
            return check
        reserva.estado = "cancelada"
        reserva.save(update_fields=["estado"])
        return Response(ReservaSerializer(reserva).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminRole])
    def confirmar(self, request, pk=None):
        reserva = self.get_object()
        if reserva.estado.lower() == "cancelada":
            return Response(
                {"detail": "No se puede confirmar una reserva cancelada."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        reserva.estado = "confirmada"
        reserva.save(update_fields=["estado"])
        return Response(ReservaSerializer(reserva).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminRole])
    def finalizar(self, request, pk=None):
        reserva = self.get_object()
        if reserva.inicio > timezone.now():
            return Response(
                {"detail": "Solo se pueden finalizar reservas ya iniciadas."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        reserva.estado = "finalizada"
        reserva.save(update_fields=["estado"])
        return Response(ReservaSerializer(reserva).data)


class EstadisticasView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        fecha_inicio = request.query_params.get("inicio")
        fecha_fin = request.query_params.get("fin")
        qs = Reserva.objects.all()
        if fecha_inicio:
            parsed = parse_datetime(fecha_inicio)
            if parsed:
                qs = qs.filter(inicio__gte=parsed)
        if fecha_fin:
            parsed = parse_datetime(fecha_fin)
            if parsed:
                qs = qs.filter(fin__lte=parsed)

        total = qs.count()
        por_estado = qs.values("estado").order_by("estado").annotate(total=models.Count("id_reserva"))
        por_aula = qs.values("id_aula__nombre_aula").annotate(total=models.Count("id_reserva")).order_by("-total")[:5]
        return Response(
            {
                "total_reservas": total,
                "por_estado": list(por_estado),
                "top_aulas": list(por_aula),
            }
        )


class NotificacionesView(APIView):
    def get(self, request):
        ahora = timezone.now()
        proximas = Reserva.objects.filter(
            id_usuario=request.user,
            estado__in=["pendiente", "confirmada"],
            inicio__gte=ahora,
            inicio__lte=ahora + timedelta(hours=24),
        ).select_related("id_aula")

        data = [
            {
                "tipo": "recordatorio",
                "mensaje": f"Tienes una reserva de aula {r.id_aula.nombre_aula} a las {r.inicio.isoformat()}",
                "reserva": r.id_reserva,
            }
            for r in proximas
        ]
        return Response(data)
