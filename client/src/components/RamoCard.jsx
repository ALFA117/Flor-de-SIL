import Icon from './Icon'
import { mxn, precioDe, waLinkRamo } from '../lib/tienda'

export function Precio({ ramo, grande = false }) {
  const { precio, promo, tienePromo, pct } = precioDe(ramo)
  if (!precio) return null

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className={`precio text-tinta ${grande ? 'text-[26px]' : 'text-[19px]'}`}>
        {mxn(tienePromo ? promo : precio)}
        <span className="ml-1 font-sans text-[13px] font-medium text-tinta-tenue">MXN</span>
      </span>
      {tienePromo && (
        <>
          <span className="precio text-[14px] text-tinta-tenue line-through decoration-1">
            {mxn(precio)}
          </span>
          <span className="rounded-sm bg-barro-claro px-1.5 py-0.5 font-mono text-[12px] font-medium text-barro-hondo">
            −{pct}%
          </span>
        </>
      )}
    </div>
  )
}

export default function RamoCard({ ramo, onOpen, index = 0 }) {
  const { tienePromo } = precioDe(ramo)
  const flores = Array.isArray(ramo.flores) ? ramo.flores : []

  return (
    <article
      className="group flex h-full flex-col bg-papel-claro border border-linea rounded
                 transition-[border-color,box-shadow] duration-200 hover:border-linea-fuerte hover:shadow-hoja
                 animate-rise"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="relative block w-full overflow-hidden rounded-t text-left focus-visible:outline-offset-[-2px]"
        aria-label={`Ver detalles de ${ramo.nombre}`}
      >
        <div className="aspect-[4/5] bg-papel-hondo">
          {ramo.foto_url ? (
            <img
              src={ramo.foto_url}
              alt={ramo.nombre}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-linea-fuerte">
              <Icon name="flower" size={56} strokeWidth={1.25} />
            </div>
          )}
        </div>
        {tienePromo && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-sm bg-barro px-2 py-1 text-[12px] font-semibold tracking-[0.04em] text-papel-claro">
            <Icon name="tag" size={13} />
            Oferta
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[24px] font-semibold leading-[1.15] text-tinta">
          <button type="button" onClick={onOpen} className="text-left hover:text-bosque transition-colors">
            {ramo.nombre}
          </button>
        </h3>

        {flores.length > 0 && (
          <p className="mt-2 text-[14px] leading-relaxed text-tinta-suave line-clamp-2">
            {flores.join(' · ')}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="mb-4 border-t border-linea pt-4">
            <Precio ramo={ramo} />
          </div>
          <a
            href={waLinkRamo(ramo.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secundario w-full !text-[14px]"
          >
            <Icon name="whatsapp" size={16} />
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}

export function RamoCardSkeleton() {
  return (
    <div className="flex flex-col border border-linea rounded bg-papel-claro" aria-hidden="true">
      <div className="aspect-[4/5] skeleton rounded-t" />
      <div className="p-5 space-y-3">
        <div className="h-6 w-3/4 skeleton rounded-sm" />
        <div className="h-4 w-1/2 skeleton rounded-sm" />
        <div className="h-px bg-linea my-4" />
        <div className="h-5 w-1/3 skeleton rounded-sm" />
        <div className="h-12 w-full skeleton rounded" />
      </div>
    </div>
  )
}
