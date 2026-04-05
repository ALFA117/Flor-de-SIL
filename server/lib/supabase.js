import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey || supabaseKey === 'PENDIENTE_agregar_service_role_key') {
  console.warn('⚠️  Supabase no configurado. Agrega SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY al archivo .env antes de correr el servidor.')
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '')

export default supabase
