import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { WA_DIRECT } from '../lib/tienda'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="pt-safe fixed inset-x-0 top-0 z-50">
      {/* La barra de fondo es una capa aparte: el header nunca lleva transform */}
      <div
        className={`absolute inset-0 border-b transition-colors duration-300 ${
          scrolled ? 'border-line/60 bg-bg/80 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
        aria-hidden="true"
      />
      <nav aria-label="Principal" className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link to="/" className="group flex min-h-[44px] min-w-0 items-center gap-3 rounded-full pr-2" aria-label="Flor de Sil, inicio">
          <img
            src="/logo-160.webp"
            alt=""
            width="44"
            height="44"
            className="h-11 w-11 shrink-0 rounded-full ring-2 ring-accent/40 transition-transform duration-300 group-hover:rotate-[-8deg]"
          />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-xl font-semibold tracking-tight text-ink">Flor de Sil</span>
            <span className="hidden truncate pt-1 font-display text-xs italic text-muted min-[400px]:block">Donde florecen las emociones</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          {pathname === '/' && (
            <a href="#catalogo" className="btn-ghost hidden px-4 text-sm sm:inline-flex">Catálogo</a>
          )}
          <ThemeToggle />
          <motion.a
            href={WA_DIRECT}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary min-h-[44px] px-4 text-sm"
            aria-label="Escribir por WhatsApp"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            <span className="hidden min-[400px]:inline">WhatsApp</span>
          </motion.a>
        </div>
      </nav>
    </header>
  )
}
