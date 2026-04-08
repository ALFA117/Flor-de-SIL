import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const { usuario, password } = req.body

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' })
  }

  if (usuario !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' })
  }

  const token = jwt.sign(
    { usuario, rol: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  res.json({ token })
}
