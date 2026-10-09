import { motion } from 'motion/react'
import { MessageCircle, Tag, Expand } from 'lucide-react'
import { formatoMXN, promoDe, waLinkRamo } from '../lib/tienda'

const spring = { type: 'spring', stiffness: 400, damping: 22 }

export function Precio({ ramo, grande = false }) {
  if (!ramo.precio) return <p className="text-sm text-muted">Precio por WhatsApp</p>
  const promo = promoDe(ramo)
  if (promo) {
    return (
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className={`t-price text-rose ${grande ? 'text-3xl' : 'text-xl'}`}>
          {formatoMXN(promo.oferta)} <span className="text-sm font-medium text-muted">MXN</span>
        </p>
        <p className="t-price text-sm font-medium text-muted line-through decoration-rose/60">
          <span className="sr-only">Antes </span>{formatoMXN(promo.precio)}
        </p>
      </div>
    )
  }
  return (
    <p className={`t-price text-ink ${grande ? 'text-3xl' : 'text-xl'}`}>
      {formatoMXN(ramo.precio)} <span className="text-sm font-medium text-muted">MXN</span>
    </p>
  )
}

export function Lleva({ flores, max = 3 }) {
  if (!flores?.length) return null
  const visibles = flores.slice(0, max)
  const resto = flores.length - visibles.length
  return (
    <p className="text-sm text-muted">
      <span className="font-semibold text-accent">Lleva </span>
      {visibles.join(' · ')}
      {resto > 0 && <span className="text-muted/80"> · +{resto}</span>}
    </p>
  )
}

export default function RamoCard({ ramo, onOpen }) {
  const promo = promoDe(ramo)

  return (
    <motion.article
      className="card group flex h-full flex-col overflow-hidden"
      whileHover={{ y: -6 }}
      transition={spring}
    >
      <motion.button
        type="button"
        onClick={(e) => onOpen(ramo, e.currentTarget)}
        className="flex flex-1 cursor-pointer flex-col text-left focus-visible:outline-offset-[-3px]"
        aria-haspopup="dialog"
        aria-label={`Ver detalles de ${ramo.nombre}`}
        whileTap={{ scale: 0.98 }}
        transition={spring}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface2">
          {ramo.foto_url ? (
            <img
              src={ramo.foto_url}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <img src="/logo-160.webp" alt="" className="h-20 w-20 rounded-full opacity-40" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          {promo && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-rose px-3 py-1.5 text-sm font-semibold text-bg shadow-soft">
              <Tag className="h-3.5 w-3.5" aria-hidden />
              Oferta −{promo.pct}%
            </span>
          )}

          <span className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100" aria-hidden>
            <Expand className="h-4 w-4" />
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5 pb-3">
          <h3 className="t-heading text-ink">{ramo.nombre}</h3>
          {ramo.descripcion && <p className="line-clamp-2 text-[15px] leading-relaxed text-muted">{ramo.descripcion}</p>}
          <Lleva flores={ramo.flores} />
        </div>
      </motion.button>

      <div className="flex flex-col gap-3 border-t border-line/60 px-5 pb-5 pt-4">
        <Precio ramo={ramo} />
        <motion.a
          href={waLinkRamo(ramo)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Pedir por WhatsApp
          <span className="sr-only"> el ramo {ramo.nombre} (abre WhatsApp)</span>
        </motion.a>
      </div>
    </motion.article>
  )
}

export function RamoCardSkeleton() {
  return (
    <div className="card flex flex-col overflow-hidden" aria-hidden>
      <div className="skeleton aspect-[4/5] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-6 w-2/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton mt-3 h-7 w-1/3" />
        <div className="skeleton h-12 w-full rounded-full" />
      </div>
    </div>
  )
}
