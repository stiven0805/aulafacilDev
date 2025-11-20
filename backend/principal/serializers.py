from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from .auth import generar_token_usuario
from .models import Aula, Recurso, Reserva, Usuario

ESTADOS_RESERVA = ("pendiente", "confirmada", "cancelada", "finalizada")


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id_usuario", "nombre", "apellido", "correo", "rol"]


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, source="contraseña")

    class Meta:
        model = Usuario
        fields = ["nombre", "apellido", "correo", "password", "rol"]

    def validate_correo(self, value):
        if Usuario.objects.filter(correo=value).exists():
            raise serializers.ValidationError("El correo ya está registrado.")
        return value

    def create(self, validated_data):
        validated_data["contraseña"] = make_password(validated_data["contraseña"])
        return Usuario.objects.create(**validated_data)


class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        correo = attrs.get("correo")
        password = attrs.get("password")
        try:
            usuario = Usuario.objects.get(correo=correo)
        except Usuario.DoesNotExist:
            raise AuthenticationFailed("Credenciales inválidas.", code="authentication")

        if not check_password(password, getattr(usuario, "contraseña")):
            raise AuthenticationFailed("Credenciales inválidas.", code="authentication")

        token = generar_token_usuario(usuario)
        return {"token": token, "usuario": UsuarioSerializer(usuario).data}


class AulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = ["id_aula", "nombre_aula", "capacidad", "descripcion"]


class RecursoSerializer(serializers.ModelSerializer):
    aula = AulaSerializer(source="id_aula", read_only=True)

    class Meta:
        model = Recurso
        fields = ["id_recurso", "nombre_recurso", "tipo", "estado", "id_aula", "aula"]
        extra_kwargs = {"id_aula": {"write_only": True}}


class ReservaSerializer(serializers.ModelSerializer):
    aula = AulaSerializer(source="id_aula", read_only=True)
    usuario = UsuarioSerializer(source="id_usuario", read_only=True)

    class Meta:
        model = Reserva
        fields = [
            "id_reserva",
            "inicio",
            "fin",
            "estado",
            "id_aula",
            "id_usuario",
            "aula",
            "usuario",
        ]
        read_only_fields = ["estado", "id_usuario"]
        extra_kwargs = {"id_aula": {"write_only": True}}

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data.get("estado") and data["estado"] not in ESTADOS_RESERVA:
            data["estado"] = data["estado"].lower()
        return data


class ReservaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = ["inicio", "fin", "id_aula"]

    def validate(self, attrs):
        inicio = attrs.get("inicio")
        fin = attrs.get("fin")
        aula = attrs.get("id_aula")

        if inicio >= fin:
            raise serializers.ValidationError("La hora de fin debe ser posterior a la de inicio.")

        if inicio < timezone.now():
            raise serializers.ValidationError("No puedes crear reservas en el pasado.")

        if not aula:
            raise serializers.ValidationError("El aula es obligatoria.")

        qs = Reserva.objects.filter(id_aula=aula).exclude(estado__iexact="cancelada")
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.filter(inicio__lt=fin, fin__gt=inicio).exists():
            raise serializers.ValidationError("El aula ya está reservada en ese horario.")

        return attrs

    def create(self, validated_data):
        reserva = Reserva.objects.create(
            id_usuario=self.context["request"].user,
            estado="pendiente",
            **validated_data,
        )
        return reserva

    def update(self, instance, validated_data):
        instance.inicio = validated_data.get("inicio", instance.inicio)
        instance.fin = validated_data.get("fin", instance.fin)
        instance.id_aula = validated_data.get("id_aula", instance.id_aula)
        instance.save(update_fields=["inicio", "fin", "id_aula"])
        return instance
