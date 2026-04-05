import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-cafe-oscuro text-crema shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="font-playfair font-bold text-xl tracking-widest text-crema">
              FLOR DE SIL
            </span>
          </span>
          <span className="font-playfair italic text-xs text-verde-pistache ml-9">
            Donde florecen las emociones
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 font-lato text-sm font-light tracking-wide">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-cafe-claro border-b border-cafe-claro pb-0.5'
                : 'text-crema hover:text-cafe-claro transition-colors duration-200'
            }
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? 'text-cafe-claro border-b border-cafe-claro pb-0.5'
                : 'text-crema hover:text-cafe-claro transition-colors duration-200'
            }
          >
            Acceso Admin
          </NavLink>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-crema focus:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cafe-medio px-4 pb-4 flex flex-col gap-3 font-lato text-sm">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-crema hover:text-cafe-claro py-2 border-b border-cafe-oscuro"
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className="text-crema hover:text-cafe-claro py-2"
          >
            Acceso Admin
          </NavLink>
        </div>
      )}
    </nav>
  )
}
