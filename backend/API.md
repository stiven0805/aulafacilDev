# AulaFácil API

Base URL: `/api/`

## Autenticación
- `POST /api/auth/registro/`
  - Body: `{nombre, apellido, correo, password, rol}` (`rol`: `estudiante` | `administrador`)
  - Respuesta 201: `{ token, usuario: { id_usuario, nombre, apellido, correo, rol } }`
- `POST /api/auth/login/`
  - Body: `{correo, password}`
  - Respuesta 200 igual a registro. Credenciales inválidas ⇒ 401 con `{"detail": "Credenciales inválidas."}`
- `GET /api/auth/usuario/`
  - Cabecera `Authorization: Token <token>`
  - Respuesta 200: usuario logueado.

## Aulas y Recursos
- `GET /api/aulas/`
  - Opcional `?inicio=<iso>&fin=<iso>` para filtrar aulas libres.
- `POST /api/aulas/` (admin) crea aula. Ej:
  ```json
  { "nombre_aula": "A101", "capacidad": 12, "descripcion": "Sala principal" }
  ```
- `GET /api/aulas/{id}/`, `PATCH`, `DELETE` (admin) CRUD.
- `GET /api/recursos/` lista recursos.
- `POST /api/recursos/` (admin) crea recurso:
  ```json
  { "nombre_recurso": "Proyector", "tipo": "video", "estado": "activo", "id_aula": 1 }
  ```

## Reservas
- `GET /api/reservas/`
  - Estudiante: sólo propias. Admin: todas; filtros `inicio`, `fin` (ISO).
- `POST /api/reservas/`
  - Body: `{inicio, fin, id_aula}` (ISO). Valida fin>inicio, fecha futura y solapamiento.
  - Respuesta 201: datos de la reserva (estado `pendiente`).
  - Solapamiento/validación ⇒ 400 con `{"non_field_errors": ["El aula ya está reservada en ese horario."]}`
- `PATCH /api/reservas/{id}/` modifica horario antes de iniciar.
- `POST /api/reservas/{id}/cancelar/` dueño o admin, sólo si no inició.
- `POST /api/reservas/{id}/confirmar/` (admin) pasa a `confirmada`.
- `POST /api/reservas/{id}/finalizar/` (admin) pasa a `finalizada` si ya inició.

## Reportes y Notificaciones
- `GET /api/reportes/estadisticas/` (admin) devuelve:
  ```json
  {
    "total_reservas": 10,
    "por_estado": [{"estado": "pendiente", "total": 4}, ...],
    "top_aulas": [{"id_aula__nombre_aula": "A101", "total": 3}, ...]
  }
  ```
- `GET /api/notificaciones/` recordatorios próximas 24h del usuario:
  ```json
  [
    {"tipo": "recordatorio", "mensaje": "Tienes una reserva de aula A101 a las 2025-01-01T10:00:00", "reserva": 5}
  ]
  ```

## Autorización y estados
- Cabecera: `Authorization: Token <token>`.
- Roles: `administrador` o `estudiante`.
- Estados de reserva: `pendiente`, `confirmada`, `cancelada`, `finalizada`.
