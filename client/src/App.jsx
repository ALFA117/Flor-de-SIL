import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import AmbientBackground from './components/AmbientBackground'
import Catalogo from './pages/Catalogo'
import Spinner from './components/Spinner'

// El panel y el login se cargan aparte: el catálogo público no los descarga
const Login = lazy(() => import('./pages/Login'))
const Admin = lazy(() => import('./pages/Admin'))

// Título y robots por ruta (el panel no se indexa)
function MetaPorRuta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const privada = pathname.startsWith('/admin')
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = privada ? 'noindex, nofollow' : 'index, follow'
    document.title = pathname === '/admin/login'
      ? 'Acceso administración — Flor de Sil'
      : pathname === '/admin'
        ? 'Panel — Flor de Sil'
        : 'Flor de Sil — Ramos y arreglos florales | Pide por WhatsApp'
  }, [pathname])
  return null
}

function Publica({ children }) {
  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Navbar />
      <main id="contenido" tabIndex={-1} className="outline-none">{children}</main>
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <BrowserRouter>
          <MetaPorRuta />
          <AmbientBackground />
          <Suspense fallback={<div className="pt-32"><Spinner size="lg" /></div>}>
          <Routes>
            <Route path="/" element={<Publica><Catalogo /></Publica>} />
            <Route path="/admin/login" element={<Publica><Login /></Publica>} />

            {/* Ruta protegida Admin (sin Navbar, tiene su propio header) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </MotionConfig>
  )
}
