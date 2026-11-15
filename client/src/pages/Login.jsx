import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon'

const inputCls =
  'w-full min-h-[48px] rounded border border-linea-fuerte bg-papel-claro pl-11 pr-4 text-[16px] text-tinta ' +
  'placeholder:text-tinta-tenue transition-colors focus:border-bosque focus:outline-none focus:ring-2 focus:ring-bosque/20'

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
      setError(
        err.response?.data?.error ||
          (err.response ? 'Error al iniciar sesión.' : 'No se pudo conectar con el servidor. Intenta de nuevo en unos minutos.')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main id="contenido" className="contenedor py-10 md:py-16">
      <div className="mx-auto grid max-w-[960px] overflow-hidden rounded border border-linea bg-papel-claro md:grid-cols-2">
        <div className="relative hidden md:flex flex-col justify-between bg-bosque-noche p-10 text-papel">
          <div className="absolute inset-4 rounded-sm border border-papel/15 pointer-events-none" />
          <p className="relative text-[13px] uppercase tracking-[0.18em] text-papel/60">Administración</p>
          <div className="relative">
            <img src="/logo-320.webp" alt="" width="120" height="120" className="h-[120px] w-[120px] rounded-full object-cover ring-1 ring-papel/25" />
            <p className="mt-6 font-display text-[32px] font-semibold leading-tight">Flor de Sil</p>
            <p className="mt-1 font-display text-[19px] italic text-papel/75">Donde florecen las emociones</p>
          </div>
          <p className="relative text-[14px] text-papel/60">Catálogo, fotos, precios y ofertas.</p>
        </div>

        <div className="p-6 sm:p-10">
          <p className="eyebrow">Panel de administración</p>
          <h1 className="mt-3 font-display text-[36px] font-semibold leading-tight">Inicia sesión</h1>
          <p className="mt-2 text-[15px] text-tinta-suave">Acceso solo para el equipo de Flor de Sil.</p>

          {expirado && (
            <div className="mt-6 flex gap-3 rounded border border-barro/30 bg-barro-claro px-4 py-3 text-[15px] text-barro-hondo" role="status">
              <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
              Tu sesión expiró. Ingresa de nuevo.
            </div>
          )}
          {error && (
            <div className="mt-6 flex gap-3 rounded border border-red-200 bg-red-50 px-4 py-3 text-[15px] text-red-800" role="alert">
              <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="usuario" className="block text-[14px] font-semibold text-tinta mb-2">Usuario</label>
              <div className="relative">
                <Icon name="user" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tinta-tenue" />
                <input
                  id="usuario"
                  type="text"
                  autoComplete="username"
                  value={form.usuario}
                  onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                  required
                  className={inputCls}
                  placeholder="Tu usuario"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[14px] font-semibold text-tinta mb-2">Contraseña</label>
              <div className="relative">
                <Icon name="lock" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-tinta-tenue" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className={`${inputCls} !pr-12`}
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded text-tinta-tenue hover:text-tinta"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primario w-full">
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-papel/40 border-t-papel animate-spin" />
                  Ingresando…
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <Link to="/" className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-[15px] text-tinta-suave hover:text-tinta">
            <Icon name="arrowRight" size={16} className="rotate-180" />
            Volver al catálogo
          </Link>
        </div>
      </div>
    </main>
  )
}
