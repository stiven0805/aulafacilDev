# Frontend AulaFácil (React + Vite)

SPA para AulaFácil que consume la API Django/DRF.

## Requisitos
- Node 18+

## Instalación
```bash
cd frontend/estructura_base_react
npm install
```

## Ejecutar
```bash
npm run dev
```

## Configuración
- Variable opcional: `VITE_API_BASE_URL` (por defecto `http://localhost:8000`). Ejemplo en `.env`:
  ```
  VITE_API_BASE_URL=http://localhost:8000
  ```
- La cabecera de autenticación `Authorization: Token <token>` se añade desde `src/api/client.js`.

## Flujo principal
- Levanta backend (`python manage.py runserver` en `backend/`) y frontend (`npm run dev`).
- Registro/Login → obtiene token y usuario actual (se guarda en localStorage).
- Panel estudiante → busca aulas disponibles, crea/edita/cancela sus reservas.
- Panel admin → gestiona reservas, aulas/recursos y consulta estadísticas/notificaciones.
