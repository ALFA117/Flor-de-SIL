import { Router } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/login', (req, res) => {
  const { usuario, password } = req.body

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' })
  }

  const adminUser = process.env.ADMIN_USER
  const adminPass = process.env.ADMIN_PASSWORD

  if (usuario !== adminUser || password !== adminPass) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' })
  }

  const token = jwt.sign(
    { usuario, rol: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  res.json({ token })
})

export default router
