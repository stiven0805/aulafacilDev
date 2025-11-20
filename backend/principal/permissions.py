from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    """Permite acceso solo a usuarios con rol administrador."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and getattr(user, "rol", "") == "administrador")


class IsOwnerOrAdminReservation(permissions.BasePermission):
    """El dueño de la reserva o el administrador puede modificarla."""

    def has_object_permission(self, request, view, obj):
        user = request.user
        if getattr(user, "rol", "") == "administrador":
            return True
        return getattr(obj, "id_usuario_id", None) == getattr(user, "id_usuario", None)
