import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import ramosRoutes from './routes/ramos.js'

const app = express()
const PORT = process.env.PORT || 4000

// CORS
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:4173',
  ],
  credentials: true,
}))

app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/ramos', ramosRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'FLOR DE SIL API' })
})

app.listen(PORT, () => {
  console.log(`🌸 FLOR DE SIL API corriendo en puerto ${PORT}`)

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey || supabaseKey === 'PENDIENTE_agregar_service_role_key') {
    console.warn('⚠️  Supabase no configurado. Agrega las variables de entorno.')
  } else {
    console.log('✅ Supabase conectado')
  }
})
