# Notas rápidas de depuración (Registro)

- Backend debe estar activo en `http://localhost:8000` (ejecuta `python manage.py runserver` desde `backend/`).
- Frontend debe estar en `http://localhost:5173` con `npm run dev` desde `frontend/estructura_base_react/`.
- La variable `VITE_API_BASE_URL` (en `.env` del frontend) tiene que apuntar al backend exacto (misma IP/puerto/protocolo). Ejemplo:
  ```
  VITE_API_BASE_URL=http://localhost:8000
  ```
- Si aparece error de red en registro, revisa la consola del navegador: ahora se muestra la URL fallida y si no hubo conexión con el backend.
