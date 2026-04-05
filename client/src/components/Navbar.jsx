import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled
          ? 'bg-cafe-oscuro/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-cafe-oscuro'
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="FLOR DE SIL"
            className="w-11 h-11 object-cover rounded-full border-2 border-cafe-claro/60
                       group-hover:border-cafe-claro group-hover:scale-105
                       transition-all duration-300 shadow-lg"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-playfair font-bold text-lg tracking-widest text-crema">
              FLOR DE SIL
            </span>
            <span className="font-playfair italic text-[11px] text-verde-pistache">
              Donde florecen las emociones
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 font-lato text-sm tracking-wider">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative pb-0.5 transition-colors duration-300 after:absolute after:bottom-0 after:left-0
               after:h-px after:bg-cafe-claro after:transition-all after:duration-300
               ${isActive
                 ? 'text-cafe-claro after:w-full'
                 : 'text-crema hover:text-cafe-claro after:w-0 hover:after:w-full'
               }`
            }
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `relative pb-0.5 transition-colors duration-300 after:absolute after:bottom-0 after:left-0
               after:h-px after:bg-cafe-claro after:transition-all after:duration-300
               ${isActive
                 ? 'text-cafe-claro after:w-full'
                 : 'text-crema hover:text-cafe-claro after:w-0 hover:after:w-full'
               }`
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
          <div className="flex flex-col gap-1.5 w-6">
            <span className={`block h-0.5 bg-crema rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-crema rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-crema rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-40' : 'max-h-0'}`}>
        <div className="bg-cafe-medio/95 backdrop-blur-md px-4 pb-4 pt-2 flex flex-col gap-1">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-crema hover:text-cafe-claro font-lato py-2.5 border-b border-cafe-oscuro/40 transition-colors"
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className="text-crema hover:text-cafe-claro font-lato py-2.5 transition-colors"
          >
            Acceso Admin
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
