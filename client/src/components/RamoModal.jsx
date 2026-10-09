import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { MessageCircle, Tag, X } from 'lucide-react'
import { formatoMXN, promoDe, waLinkRamo } from '../lib/tienda'
import { Precio } from './RamoCard'

const spring = { type: 'spring', stiffness: 320, damping: 28 }

export default function RamoModal({ ramo, onClose }) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const promo = promoDe(ramo)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      // Mantiene el foco dentro del diálogo
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll('a[href], button')
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ramo-titulo"
        className="pb-safe relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-y-auto rounded-t-[28px] border border-line/70 bg-surface shadow-lift sm:flex-row sm:overflow-hidden sm:rounded-[28px]"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98, transition: { duration: 0.15 } }}
        transition={spring}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] w-full shrink-0 bg-surface2 sm:aspect-auto sm:w-[46%]">
          {ramo.foto_url ? (
            <img src={ramo.foto_url} alt={`Ramo ${ramo.nombre}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-[240px] items-center justify-center">
              <img src="/logo-320.webp" alt="" className="h-28 w-28 rounded-full opacity-40" />
            </div>
          )}
          {promo && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-rose px-3 py-1.5 text-sm font-semibold text-bg shadow-soft">
              <Tag className="h-3.5 w-3.5" aria-hidden /> Oferta −{promo.pct}%
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-5 p-6 sm:overflow-y-auto sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="t-eyebrow mb-2">Arreglo floral</p>
              <h2 id="ramo-titulo" className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink">{ramo.nombre}</h2>
            </div>
            <motion.button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="btn-icon -mr-2 -mt-1 shrink-0 bg-surface2/70"
              aria-label="Cerrar detalles"
              whileTap={{ scale: 0.9 }}
              whileHover={{ rotate: 90 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <X className="h-5 w-5" aria-hidden />
            </motion.button>
          </div>

          {ramo.descripcion && <p className="t-body">{ramo.descripcion}</p>}

          {ramo.flores?.length > 0 && (
            <div>
              <p className="t-label mb-3">Lleva</p>
              <ul className="flex flex-wrap gap-2">
                {ramo.flores.map((flor) => (
                  <li key={flor} className="chip">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose" aria-hidden />
                    {flor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-line/70 bg-surface2/50 p-4">
            <Precio ramo={ramo} grande />
            {promo && (
              <p className="mt-2 text-sm font-semibold text-leaf">
                Ahorras {formatoMXN(promo.ahorro)} MXN frente al precio normal
              </p>
            )}
          </div>

          <motion.a
            href={waLinkRamo(ramo)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-auto w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            Pedir este ramo por WhatsApp
          </motion.a>
          <p className="-mt-2 text-center text-sm text-muted">El mensaje ya lleva el nombre del ramo; te confirmamos disponibilidad por ahí.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
