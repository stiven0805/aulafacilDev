from django.conf import settings
from django.core import signing
from rest_framework import authentication, exceptions

from .models import Usuario


TOKEN_TTL_SECONDS = getattr(settings, "API_TOKEN_TTL_SECONDS", 60 * 60 * 24)
_signer = signing.TimestampSigner()


def generar_token_usuario(usuario: Usuario) -> str:
    """
    Firma un token simple con la información mínima del usuario.
    """
    payload = f"{usuario.id_usuario}:{usuario.correo}:{usuario.rol}"
    return _signer.sign(payload)


class SignedTokenAuthentication(authentication.BaseAuthentication):
    """
    Autenticación ligera basada en un token firmado (cabecera Authorization: Token <token>).
    No requiere tabla adicional y expira según TOKEN_TTL_SECONDS.
    """

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).decode("utf-8")
        if not auth_header:
            return None

        try:
            prefix, token = auth_header.split(" ", 1)
        except ValueError:
            return None

        if prefix.lower() != "token":
            return None

        try:
            raw_value = _signer.unsign(token, max_age=TOKEN_TTL_SECONDS)
        except signing.SignatureExpired:
            raise exceptions.AuthenticationFailed("Token expirado")
        except signing.BadSignature:
            raise exceptions.AuthenticationFailed("Token inválido")

        try:
            user_id, _, _ = raw_value.split(":", 2)
        except ValueError:
            raise exceptions.AuthenticationFailed("Token mal formado")

        try:
            usuario = Usuario.objects.get(pk=user_id)
        except Usuario.DoesNotExist:
            raise exceptions.AuthenticationFailed("Usuario no encontrado")

        return (usuario, None)
