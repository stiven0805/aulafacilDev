# AulaFácil

Sistema web de reservas de salas de estudio (Django + DRF + React).

## Backend (Django)
1. Requerimientos: Python 3, PostgreSQL. Instala dependencias:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Configura variables de la BD en `aulafacil/settings.py` (por defecto: `aulafacilDB` en localhost).
3. Ejecuta el servidor:
   ```bash
   python manage.py runserver
   ```
4. API base: `http://localhost:8000/api/` (ver `backend/API.md`).

## Frontend (React con Vite)
1. Requerimientos: Node 18+. Instala dependencias:
   ```bash
   cd frontend/estructura_base_react
   npm install
   ```
2. Levanta el entorno de desarrollo:
   ```bash
   npm run dev
   ```
3. Configura la URL base de la API en el cliente HTTP cuando se integre.
