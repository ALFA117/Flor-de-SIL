import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, Clock, Eye, EyeOff, Loader2, Lock, User } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [form, setForm] = useState({ usuario: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const expirado = searchParams.get('expirado') === '1'

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', {
        usuario: form.usuario,
        password: form.password,
      })
      login(data.token)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 pb-12 pt-24">
      <motion.div
        className="card w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        <div className="flex flex-col items-center gap-3 border-b border-line/60 bg-surface2/50 px-8 pb-7 pt-9 text-center">
          <img src="/logo-160.webp" alt="" width="80" height="80" className="h-20 w-20 rounded-full ring-2 ring-accent/50" />
          <p className="t-eyebrow">Solo personal de Flor de Sil</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Panel de administración</h1>
          <p className="text-sm text-muted">Aquí se suben ramos, precios y ofertas del catálogo.</p>
        </div>

        <div className="p-6 sm:p-8">
          <AnimatePresence initial={false}>
            {expirado && (
              <motion.p key="exp" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 flex items-start gap-2 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-ink">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                Tu sesión expiró. Ingresa de nuevo para seguir editando.
              </motion.p>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
            <div>
              <label htmlFor="usuario" className="field-label">Usuario</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  id="usuario"
                  type="text"
                  autoComplete="username"
                  value={form.usuario}
                  onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
                  className="field-input pl-11"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="field-label">Contraseña</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
                  className="field-input pl-11 pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="btn-icon absolute right-1 top-1/2 -translate-y-1/2 text-muted"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                </button>
              </div>
              <AnimatePresence initial={false}>
                {error && (
                  <motion.p id="login-error" role="alert" key="err"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="field-error flex items-start gap-1.5">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Ingresando…</>) : 'Ingresar'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
