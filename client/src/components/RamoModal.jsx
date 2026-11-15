import { useEffect, useRef } from 'react'
import Icon from './Icon'
import { Precio } from './RamoCard'
import { mxn, precioDe, waLinkRamo } from '../lib/tienda'

export default function RamoModal({ ramo, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const { tienePromo, ahorro } = precioDe(ramo)
  const flores = Array.isArray(ramo.flores) ? ramo.flores : []

  useEffect(() => {
    const previo = document.activeElement
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll('a[href],button:not([disabled])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previo?.focus?.()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-tinta/60 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ramo-titulo"
        className="relative w-full sm:max-w-[920px] max-h-[92vh] overflow-y-auto bg-papel-claro
                   rounded-t-lg sm:rounded border border-linea animate-sheet
                   grid sm:grid-cols-[1.05fr_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded
                     bg-papel-claro/95 border border-linea text-tinta hover:bg-papel"
          aria-label="Cerrar"
        >
          <Icon name="close" size={20} />
        </button>

        <div className="bg-papel-hondo aspect-[4/3] sm:aspect-auto sm:min-h-[520px]">
          {ramo.foto_url ? (
            <img src={ramo.foto_url} alt={ramo.nombre} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-linea-fuerte">
              <Icon name="flower" size={80} strokeWidth={1} />
            </div>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-9">
          <p className="eyebrow">{tienePromo ? 'Oferta vigente' : 'Disponible'}</p>
          <h2 id="ramo-titulo" className="mt-3 pr-10 font-display text-[34px] sm:text-[40px] font-semibold leading-[1.05] text-tinta">
            {ramo.nombre}
          </h2>

          {ramo.descripcion && (
            <p className="mt-4 text-[16px] leading-relaxed text-tinta-suave">{ramo.descripcion}</p>
          )}

          {flores.length > 0 && (
            <div className="mt-6">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-tinta-tenue">Flores incluidas</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {flores.map((flor, i) => (
                  <li key={i} className="rounded-sm border border-linea bg-papel px-2.5 py-1 text-[14px] text-tinta">
                    {flor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto pt-8">
            <div className="border-t border-linea pt-5">
              <Precio ramo={ramo} grande />
              {tienePromo && (
                <p className="mt-2 text-[14px] text-tinta-suave">
                  Ahorras <span className="precio text-tinta">{mxn(ahorro)} MXN</span> sobre el precio regular.
                </p>
              )}
            </div>
            <a
              href={waLinkRamo(ramo.nombre)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primario mt-6 w-full"
            >
              <Icon name="whatsapp" size={18} />
              Pedir este arreglo por WhatsApp
            </a>
            <p className="mt-3 text-center text-[13px] text-tinta-tenue">
              Te confirmamos disponibilidad y detalles por mensaje.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
