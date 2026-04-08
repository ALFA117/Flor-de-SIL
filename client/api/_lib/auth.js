import jwt from 'jsonwebtoken'

export function verifyToken(req) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    throw Object.assign(new Error('No autorizado. Token no proporcionado.'), { status: 401 })
  }
  try {
    return jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET)
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Tu sesión ha expirado. Ingresa de nuevo.'
      : 'No autorizado. Token inválido.'
    throw Object.assign(new Error(msg), { status: 401 })
  }
}
