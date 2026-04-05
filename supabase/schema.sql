-- ============================================================
--  FLOR DE SIL — Schema SQL
--  Correr en: Supabase → SQL Editor → New Query
-- ============================================================

-- Tabla ramos
CREATE TABLE IF NOT EXISTS ramos (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre       text NOT NULL,
  descripcion  text,
  flores       text[],
  precio       numeric(10,2),
  foto_url     text,
  foto_path    text,
  disponible   boolean DEFAULT true,
  creado_en    timestamptz DEFAULT now()
);

-- Tabla config
CREATE TABLE IF NOT EXISTS config (
  clave  text PRIMARY KEY,
  valor  text NOT NULL
);

INSERT INTO config (clave, valor) VALUES
  ('whatsapp',        '5215652539705'),
  ('nombre_floreria', 'FLOR DE SIL'),
  ('slogan',          'Donde florecen las emociones')
ON CONFLICT (clave) DO NOTHING;

-- ============================================================
--  Row Level Security (RLS)
-- ============================================================

-- Habilitar RLS en ramos
ALTER TABLE ramos ENABLE ROW LEVEL SECURITY;

-- Lectura pública: cualquiera puede leer
CREATE POLICY "Lectura pública de ramos"
  ON ramos FOR SELECT
  USING (true);

-- Escritura solo con service_role (backend)
-- No se crean políticas INSERT/UPDATE/DELETE aquí;
-- el backend usa service_role_key que bypasea RLS.

-- Habilitar RLS en config
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Lectura pública de config
CREATE POLICY "Lectura pública de config"
  ON config FOR SELECT
  USING (true);

-- ============================================================
--  Storage Bucket "ramos"
-- ============================================================
-- NOTA: El bucket se crea desde el Dashboard de Supabase:
--   Storage → New Bucket → nombre: "ramos" → Public: ON
--   Allowed MIME types: image/jpeg, image/png, image/webp
--   Max file size: 5242880 (5MB)
--
-- O con la siguiente instrucción si tienes acceso SQL a storage:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ramos',
  'ramos',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Política de lectura pública para el bucket ramos
CREATE POLICY "Acceso público lectura ramos storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ramos');

-- Política de inserción para service_role (el backend)
CREATE POLICY "Service role puede subir a ramos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ramos');

CREATE POLICY "Service role puede borrar de ramos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ramos');
