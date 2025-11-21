# Backend AulaFácil (Django + DRF)

Proyecto Django que expone la API REST usada por el frontend de AulaFácil.

## Requisitos
- Python 3.10+ (SQLite incluido)

## Instalación y arranque
```bash
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate    # crea db.sqlite3
python manage.py runserver
```

## Autenticación y API
- Token firmado en la cabecera `Authorization: Token <token>`.
- Roles: `administrador` y `estudiante`.
- Rutas documentadas en `API.md` (base `/api/`).

## Pruebas
- Ejecutar suites de la app principal:
```bash
python manage.py test principal
```

## Pasos para probar de extremo a extremo
1) Levanta el backend como arriba (migraciones incluidas).
2) En otra terminal, sigue las instrucciones del frontend (`frontend/estructura_base_react/README.md`) y configura `VITE_API_BASE_URL` si aplica.
3) Usa el guion `tests_manual_e2e.md` en la raíz del repo para validar flujos de autenticación, reservas, aulas, reportes y notificaciones.
