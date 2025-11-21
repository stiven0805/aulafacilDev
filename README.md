# AulaFácil

Sistema web de reservas de salas de estudio (Django + DRF + React).

## Backend (Django)
1. Requerimientos: Python 3 (SQLite viene incluido). Instala dependencias:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. La BD usa SQLite por defecto (`db.sqlite3` en la raíz de `backend`). Ajusta `aulafacil/settings.py` si necesitas otra ruta.
3. Aplica migraciones (crea el esquema en SQLite):
   ```bash
   python manage.py migrate
   ```
4. Ejecuta el servidor:
   ```bash
   python manage.py runserver
   ```
5. API base: `http://localhost:8000/api/` (ver `backend/API.md`).

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
