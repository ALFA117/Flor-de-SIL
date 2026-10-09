import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'

const KEY = 'flordesil_tema'

function temaActual() {
  const forced = document.documentElement.dataset.theme
  if (forced === 'light' || forced === 'dark') return forced
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [tema, setTema] = useState(() => (typeof document === 'undefined' ? 'dark' : temaActual()))

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setTema(temaActual())
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const alternar = () => {
    const nuevo = tema === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nuevo
    try { localStorage.setItem(KEY, nuevo) } catch { /* sin almacenamiento: solo esta visita */ }
    setTema(nuevo)
  }

  return (
    <motion.button
      type="button"
      onClick={alternar}
      className="btn-icon"
      aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={tema}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex"
        >
          {tema === 'dark' ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
