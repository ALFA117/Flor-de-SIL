# FLOR DE SIL — Pendientes para dejar el proyecto completo

---

## PASO 1 — Supabase (hacer PRIMERO, todo lo demás depende de esto)

- [ ] Ir a https://supabase.com → tu proyecto → **SQL Editor → New Query**
- [ ] Pegar y ejecutar el contenido de `supabase/schema.sql`
      Esto crea las tablas `ramos` y `config`, y habilita RLS
- [ ] Ir a **Storage → New Bucket**
      - Nombre: `ramos`
      - Marcar **Public: ON**
      - Guardar

---

## PASO 2 — Deploy Frontend en Vercel

- [ ] Ir a https://vercel.com → **Add New Project**
- [ ] Importar repositorio: `ALFA117/Flor-de-SIL`
- [ ] Configurar:
  - **Root Directory:** `client`
  - **Framework Preset:** Vite
- [ ] Agregar las siguientes **Environment Variables**:

  | Variable              | Valor                                          |
  |-----------------------|------------------------------------------------|
  | `VITE_SUPABASE_URL`   | `https://hbsioiejbkvkdwasyrck.supabase.co`     |
  | `VITE_SUPABASE_ANON_KEY` | `sb_publishable_XRxlhx6clAOO_f2R5rurJg_8EC_Zd9c` |
  | `VITE_API_URL`        | *(dejar vacío por ahora, se llena en Paso 4)*  |

- [ ] Hacer **Deploy**
- [ ] Copiar la URL que genera Vercel → ejemplo: `https://flor-de-sil.vercel.app`

> Con esto el catálogo público ya funciona. El admin panel todavía no hasta terminar el Paso 4.

---

## PASO 3 — Deploy Backend en Railway

- [ ] Ir a https://railway.app → **New Project → Deploy from GitHub repo**
- [ ] Seleccionar `ALFA117/Flor-de-SIL`
- [ ] En **Root Directory** poner: `server`
- [ ] Agregar las siguientes **Environment Variables** en Railway:

  | Variable                   | Valor                                              |
  |----------------------------|----------------------------------------------------|
  | `PORT`                     | `4000`                                             |
  | `JWT_SECRET`               | `flordesil_secret_2024`                            |
  | `ADMIN_USER`               | `claudio123`                                       |
  | `ADMIN_PASSWORD`           | `floreria321`                                      |
  | `SUPABASE_URL`             | `https://hbsioiejbkvkdwasyrck.supabase.co`         |
  | `SUPABASE_SERVICE_ROLE_KEY`| *(tu secret key de Supabase — Settings → API → Secret key)* |
  | `CLIENT_URL`               | *(URL de Vercel del Paso 2, ej: https://flor-de-sil.vercel.app)* |

- [ ] Hacer **Deploy**
- [ ] Copiar la URL que genera Railway → ejemplo: `https://flor-de-sil-api.railway.app`

---

## PASO 4 — Conectar Frontend ↔ Backend

Una vez que tienes ambas URLs (Vercel y Railway):

**En Vercel:**
- [ ] Ir al proyecto → **Settings → Environment Variables**
- [ ] Editar `VITE_API_URL` y poner la URL de Railway:
      `https://flor-de-sil-api.railway.app`
- [ ] Hacer **Redeploy** (Settings → Deployments → Redeploy)

**En Railway:**
- [ ] Verificar que `CLIENT_URL` tiene la URL correcta de Vercel
      (ya lo pusiste en el Paso 3, solo confirmar)

---

## PASO 5 — Verificar que todo funciona

- [ ] Abrir la URL de Vercel → ver que carga el catálogo
- [ ] Si no hay ramos: es normal, la tabla está vacía todavía
- [ ] Ir a `/admin/login` → entrar con `claudio123` / `floreria321`
- [ ] Agregar un ramo de prueba con foto
- [ ] Verificar que aparece en el catálogo público
- [ ] Verificar que el botón "Pedir por WhatsApp" abre WhatsApp con el mensaje correcto
- [ ] Probar toggle de disponible/no disponible
- [ ] Probar editar y eliminar un ramo

---

## Resumen de URLs finales (llenar cuando estén listas)

| Servicio   | URL |
|------------|-----|
| Catálogo   | `https://______.vercel.app` |
| Admin      | `https://______.vercel.app/admin` |
| API        | `https://______.railway.app` |
| Supabase   | `https://hbsioiejbkvkdwasyrck.supabase.co` |
