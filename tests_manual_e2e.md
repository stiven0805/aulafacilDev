# Pruebas manuales end-to-end AulaFácil

Precondición: backend en `http://localhost:8000` y frontend corriendo con `VITE_API_BASE_URL` apuntando al backend. BD limpia o con datos conocidos.

## Autenticación
1. Registro estudiante: en `/registro`, crear usuario rol `estudiante`; debe llevar al panel estudiante.
2. Registro admin: crear usuario con rol `administrador`; debe llevar al panel admin.
3. Login inválido: usar credenciales incorrectas → mensaje “Credenciales inválidas” (401) y no debe guardar token.
4. Usuario actual: recargar la app con token guardado → debe mantener sesión y mostrar nombre/rol.

## Estudiante
1. Ver aulas disponibles: ir a “Reservas”, filtrar rango futuro → lista de aulas sin reservas solapadas.
2. Crear reserva válida: seleccionar aula y rango válido → aparecer en “Mis reservas” con estado pendiente.
3. Intento solapado: crear otra reserva en misma aula y horario superpuesto → backend responde 400 con mensaje de solapamiento.
4. Editar reserva futura: cambiar inicio/fin a otro rango válido antes de iniciar → se actualiza la fila.
5. Cancelar reserva futura: cancelar antes de iniciar → estado cancelada y ya no debe permitir confirmación posterior.

## Administrador
1. Ver todas las reservas: en “Admin Reservas” deben mostrarse las de todos los usuarios; filtros de fecha deben limitar resultados.
2. Confirmar/finalizar: confirmar una reserva pendiente y luego finalizarla cuando esté en curso → estados deben reflejarse.
3. Cancelar como admin: cancelar reserva de otro usuario → permitida, estado cancelada.
4. CRUD de aulas: crear aula nueva, editar campos, eliminarla → cambios reflejados en listado.
5. CRUD de recursos: crear recurso asociado a aula, editar y eliminar → reflejado en listado.

## Reportes y notificaciones
1. Reportes: en “Reportes”, ver totales, por estado y top aulas; variar rango de fechas para confirmar cambios.
2. Notificaciones: con reservas próximas (dentro de 24h), `/api/notificaciones/` debe listarlas en panel estudiante y admin reportes “Notificaciones”.

## Errores y validaciones
1. Crear reserva con fin <= inicio → frontend bloquea; si se fuerza, backend responde 400.
2. Modificar/cancelar reserva ya iniciada → backend responde 400 y frontend muestra error.
3. Acceso sin token: visitar ruta protegida sin sesión → redirige a login.
4. Acceso estudiante a rutas admin → redirige a home; acceso admin a rutas estudiante permitido pero debe ver vistas correspondientes.
