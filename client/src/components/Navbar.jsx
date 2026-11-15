import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { WA_DIRECT } from '../lib/tienda'

const enlaces = [
  { href: '/#catalogo', label: 'Catálogo' },
  { href: '/#como-pedir', label: 'Cómo pedir' },
  { href: '/#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header
      className={`sticky top-0 z-40 bg-papel/95 supports-[backdrop-filter]:bg-papel/90 border-b transition-colors duration-200
        ${scrolled ? 'border-linea' : 'border-transparent'}`}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-tinta focus:text-papel focus:px-4 focus:py-2 focus:rounded"
      >
        Saltar al contenido
      </a>
      <nav className="contenedor flex h-16 md:h-[72px] items-center justify-between gap-4" aria-label="Principal">
        <Link to="/" className="flex items-center gap-3 min-h-[44px]" aria-label="Flor de Sil, inicio">
          <img
            src="/logo-160.webp"
            alt=""
            width="40"
            height="40"
            className="w-10 h-10 rounded-full object-cover ring-1 ring-linea-fuerte"
          />
          <span className="font-display text-[22px] font-semibold leading-none tracking-[0.01em] text-tinta">
            Flor de Sil
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-7">
            {enlaces.map((e) => (
              <li key={e.href}>
                <a
                  href={e.href}
                  className="text-[15px] font-medium text-tinta-suave hover:text-tinta transition-colors py-2"
                >
                  {e.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={WA_DIRECT} target="_blank" rel="noopener noreferrer" className="btn-primario !min-h-[42px] !px-4 !text-[14px]">
            <Icon name="whatsapp" size={16} />
            Escríbenos
          </a>
        </div>

        <button
          type="button"
          className="md:hidden -mr-2 inline-flex h-11 w-11 items-center justify-center rounded text-tinta hover:bg-papel-hondo"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>
      </nav>

      <div
        id="menu-movil"
        className={`md:hidden border-t border-linea bg-papel ${menuOpen ? 'block animate-fade-in' : 'hidden'}`}
      >
        <ul className="contenedor py-2">
          {enlaces.map((e) => (
            <li key={e.href}>
              <a
                href={e.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[48px] items-center justify-between border-b border-linea text-[16px] font-medium text-tinta"
              >
                {e.label}
                <Icon name="arrowRight" size={16} className="text-tinta-tenue" />
              </a>
            </li>
          ))}
          <li className="py-4">
            <a href={WA_DIRECT} target="_blank" rel="noopener noreferrer" className="btn-primario w-full">
              <Icon name="whatsapp" size={18} />
              Escríbenos por WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
