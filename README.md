# 🌸 FLOR DE SIL — Catálogo Online

> *Donde florecen las emociones*

Catálogo web para florería. Los clientes ven los arreglos disponibles y contactan por WhatsApp. El admin gestiona el catálogo con foto, precio y disponibilidad.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Base de datos | Supabase (PostgreSQL) |
| Imágenes | Supabase Storage (bucket: `ramos`) |
| Deploy frontend | Vercel |
| Deploy backend | Railway |

---

## Inicio rápido (local)

### 1. Clonar y entrar al repo

```bash
git clone <tu-repo>
cd flordesil
```

### 2. Configurar variables de entorno

**server/.env** — Agrega tu `SUPABASE_SERVICE_ROLE_KEY`:
```
PORT=4000
JWT_SECRET=flordesil_secret_2024
ADMIN_USER=claudio123
ADMIN_PASSWORD=floreria321
CLIENT_URL=http://localhost:5173
SUPABASE_URL=https://hbsioiejbkvkdwasyrck.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<tu_service_role_key>
```

**client/.env** — Ya tiene el URL y anon key configurados.

### 3. Instalar dependencias

```bash
cd server && npm install
cd ../client && npm install
```

### 4. Correr Supabase

1. Ir a [app.supabase.com](https://app.supabase.com) → tu proyecto
2. SQL Editor → pegar y ejecutar `supabase/schema.sql`
3. Storage → crear bucket `ramos` como **Public**

### 5. Levantar

Terminal 1 (backend):
```bash
cd server
npm run dev
# Corriendo en http://localhost:4000
```

Terminal 2 (frontend):
```bash
cd client
npm run dev
# Abriendo http://localhost:5173
```

---

## Credenciales Admin

```
Usuario:    claudio123
Contraseña: floreria321
```

Ruta: `http://localhost:5173/admin/login`

---

## Deploy

### Railway (backend)
1. New Project → Deploy from GitHub → root: `/server`
2. Agregar todas las variables de `server/.env`
3. Cambiar `CLIENT_URL` a la URL de Vercel

### Vercel (frontend)
1. Import repo → root directory: `client`
2. Variables de entorno:
   - `VITE_API_URL` → URL de Railway
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Login admin |
| GET | `/api/ramos` | — | Listar ramos |
| POST | `/api/ramos` | JWT | Crear ramo |
| PUT | `/api/ramos/:id` | JWT | Editar ramo |
| DELETE | `/api/ramos/:id` | JWT | Eliminar ramo |
