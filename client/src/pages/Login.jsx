import { useState, useEffect } from 'react'
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
    <div className="min-h-screen flex items-center justify-center px-4
                    bg-gradient-to-br from-[#0f2418] via-verde-marino to-cafe-oscuro relative overflow-hidden">

      {/* Partículas de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <span key={i}
            className="absolute text-cafe-claro/10 animate-pulse-soft select-none"
            style={{
              top: `${[10,75,35,85,55][i]}%`,
              left: `${[5,8,88,85,50][i]}%`,
              fontSize: `${[3,2,3.5,2,4][i]}rem`,
              animationDelay: `${i * 0.8}s`
            }}
          >✿</span>
        ))}
      </div>

      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10
                        shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden">

          {/* Header con logo */}
          <div className="relative bg-gradient-to-b from-cafe-oscuro to-verde-marino/80 pt-10 pb-8 px-8 text-center">
            {/* Logo oval */}
            <div className="flex justify-center mb-5">
              <div className="animate-float">
                <img
                  src="/logo.png"
                  alt="FLOR DE SIL"
                  className="w-28 h-28 object-cover rounded-full
                             border-4 border-cafe-claro/60
                             shadow-[0_0_40px_rgba(196,149,106,0.4)]"
                />
              </div>
            </div>
            <h1 className="font-playfair font-bold text-2xl tracking-widest text-crema mb-1">
              FLOR DE SIL
            </h1>
            <p className="font-playfair italic text-verde-pistache text-sm">
              Donde florecen las emociones
            </p>
          </div>

          {/* Formulario */}
          <div className="p-8 bg-crema">
            <h2 className="font-playfair text-lg font-semibold text-cafe-oscuro mb-6 text-center">
              Panel de Administración
            </h2>

            {expirado && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 mb-4 text-sm font-lato animate-fade-in-down">
                ⚠️ Tu sesión ha expirado. Ingresa de nuevo.
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm font-lato animate-fade-in-down">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Usuario */}
              <div>
                <label className="block font-lato font-bold text-xs tracking-widest text-cafe-oscuro uppercase mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-claro">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={form.usuario}
                    onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-crema-oscura rounded-xl
                               font-lato text-sm bg-crema focus:outline-none
                               focus:ring-2 focus:ring-cafe-claro focus:border-transparent
                               transition-all duration-300"
                    placeholder="Tu usuario"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block font-lato font-bold text-xs tracking-widest text-cafe-oscuro uppercase mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-claro">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full pl-11 pr-12 py-3 border border-crema-oscura rounded-xl
                               font-lato text-sm bg-crema focus:outline-none
                               focus:ring-2 focus:ring-cafe-claro focus:border-transparent
                               transition-all duration-300"
                    placeholder="Tu contraseña"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cafe-claro
                               hover:text-cafe-medio transition-colors">
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-verde-bosque hover:bg-verde-marino text-white font-lato font-bold
                           py-3.5 rounded-xl transition-all duration-300 mt-2
                           shadow-lg hover:shadow-xl hover:-translate-y-0.5
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Ingresando...
                  </span>
                ) : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
