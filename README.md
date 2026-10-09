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

---

## FIX_NOTES (rediseño 2026-10-08)

- **Título del hero cortado en móvil**: "FLOR DE SIL" en mayúsculas con tracking amplio no cabía a 380 px. Ahora usa `clamp()` y tracking normal.
- **Logo de 2.2 MB** cargado en navbar, hero, tarjetas y footer: se generaron versiones WebP (`logo-160/320/640.webp`, 10–60 KB) y `logo.png` bajó a 512 px.
- **Tarjetas no accesibles con teclado**: el `<article onClick>` se cambió por un `<button>` real con `aria-label` y el modal ahora tiene `role="dialog"`, foco atrapado, Esc y devuelve el foco a la tarjeta.
- **Áreas táctiles chicas**: botón de menú 24×18, cerrar modal, ojo de contraseña y botones de WhatsApp de 40 px → todo ≥ 44 px.
- **Badge "OFERTA" engañoso**: se mostraba aunque el precio de oferta no fuera menor al original. Ahora solo aparece si la promoción es válida (`promoDe()` en `src/lib/tienda.js`).
- **Estado de error sin salida**: el catálogo decía "Intenta más tarde" sin botón. Ahora explica la causa probable y tiene **Reintentar** + WhatsApp.
- **Carga con spinner** → skeleton con la forma real de las tarjetas.
- **Login**: labels sin `htmlFor`, sin `autocomplete` y error lejos de los campos; corregido, el error va debajo del campo con `role="alert"`.
- **SEO**: faltaban canonical, Open Graph, imagen para WhatsApp/X, manifest, robots, sitemap y apple-icon. El favicon era un emoji. `/admin` ahora lleva `noindex` (meta + header `X-Robots-Tag` en `vercel.json`).
- **Bundle**: `/admin` y `/admin/login` se cargan con `lazy()`; el catálogo público ya no descarga axios ni el panel.

## DESIGN_NOTES

- **Concepto**: "jardín de noche" (oscuro) y "papel kraft" (claro), con la paleta original café/crema/verde y un rosa de pétalo como acento. Tokens en `src/index.css` (canales RGB) expuestos en Tailwind como `bg`, `surface`, `ink`, `muted`, `accent`, `leaf`, `rose`, `cta`. El tema sigue al sistema y se puede cambiar con el botón sol/luna (se recuerda en `localStorage`).
- **Tipografía**: Fraunces (display, serif suave con carácter floral), Figtree (cuerpo) y JetBrains Mono para precios y teléfono, con cifras tabulares.
- **Fondo 3D**: el dado dio la **receta 2, terreno de ondas**. Se adaptó a un **prado**: las líneas del terreno ondulan como pasto al viento y sobre las crestas hay flores de cinco pétalos que giran. Capa lejana: dos resplandores cálidos; capa cercana: pétalos en CSS 3D que caen girando. Parallax distinto por capa con el puntero (escritorio) y con el scroll. Completo en `/`, tranquilo en `/admin/login` (menos filas, 45 % de opacidad, 2 pétalos). En móvil, la mitad de filas/columnas y pétalos; DPR ≤ 2; pausa con la pestaña oculta; con `prefers-reduced-motion` se dibuja una escena fija. Archivo: `src/components/AmbientBackground.jsx`.
- **Hero**: el logo dentro de una flor SVG de 24 pétalos que se abren con spring al cargar y giran muy lento; los datos debajo ("Arreglos disponibles", "En oferta ahora") salen de Supabase, no son inventados.
- **Detalle propio**: cada tarjeta dice qué **lleva** el ramo ("Lleva Girasol · Rosa (Roja) · Follaje"), como lo diría una florista.
- **Animación** (Motion 14): entrada escalonada del hero, tarjetas con `whileInView`, springs en press/hover, modal con `AnimatePresence`, cambio de estados con crossfade. Solo `transform`/`opacity`; `MotionConfig reducedMotion="user"`.
- **Íconos**: Lucide. No se usa el logo oficial de WhatsApp (marca de terceros); se usa un globo de mensaje.
- El panel `/admin` conserva su diseño claro (clase `force-light`), solo hereda las tipografías nuevas.

## Checklist de 2 minutos en el celular

1. Abre https://flor-de-sil.vercel.app — el prado ondula al fondo y la flor del logo se abre.
2. Desliza hacia abajo: no debe haber scroll lateral; las tarjetas aparecen al llegar.
3. Toca una foto: se abre el detalle con "Lleva" y el precio; ciérralo con la X.
4. Toca "Pedir por WhatsApp": WhatsApp abre con el nombre del ramo escrito.
5. Toca el sol/luna: cambia a modo claro y se lee bien.
6. Con el modo "Reducir movimiento" del teléfono activado, el fondo se queda quieto.
7. Comparte el link por WhatsApp: debe salir la tarjeta con el logo.
