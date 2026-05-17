const WA_NUMBER = '5215652539705'

function PrecioDisplay({ ramo }) {
  const tienePromo = ramo.en_promocion && ramo.precio_promocion

  if (!ramo.precio) return null

  if (tienePromo) {
    const ahorro = Number(ramo.precio) - Number(ramo.precio_promocion)
    return (
      <div className="mb-3 animate-price-drop">
        {/* Precio original tachado */}
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-lato text-sm text-cafe-medio/60 line-through">
            ${Number(ramo.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs font-lato font-bold text-red-500 bg-red-50
                           border border-red-200 px-1.5 py-0.5 rounded-full">
            -{Math.round((ahorro / Number(ramo.precio)) * 100)}%
          </span>
        </div>
        {/* Precio de promoción */}
        <p className="font-playfair font-bold text-xl text-amber-600">
          ${Number(ramo.precio_promocion).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          <span className="font-lato font-light text-sm text-cafe-medio ml-1">MXN</span>
        </p>
        <p className="text-xs font-lato text-green-600 font-semibold">
          Ahorras ${ahorro.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
        </p>
      </div>
    )
  }

  return (
    <p className="font-playfair font-bold text-cafe-claro text-xl mb-3">
      ${Number(ramo.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      <span className="font-lato font-light text-sm text-cafe-medio ml-1">MXN</span>
    </p>
  )
}

export default function RamoCard({ ramo, onClick }) {
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa el ramo *${ramo.nombre}*, ¿está disponible?`
  )}`

  return (
    <article
      className="card-shine group bg-white rounded-2xl overflow-hidden
                 shadow-[0_4px_24px_rgba(59,31,14,0.10)]
                 hover:shadow-[0_16px_48px_rgba(59,31,14,0.25)]
                 hover:-translate-y-3 transition-all duration-500 ease-out
                 flex flex-col cursor-pointer border border-crema-oscura/40
                 relative"
      onClick={onClick}
    >
      {/* Foto */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {ramo.foto_url ? (
          <img
            src={ramo.foto_url}
            alt={ramo.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-crema to-crema-oscura flex items-center justify-center">
            <img src="/logo.png" alt="FLOR DE SIL"
              className="w-24 h-24 object-cover rounded-full opacity-30" />
          </div>
        )}

        {/* Overlay degradado */}
        <div className="absolute inset-0 bg-gradient-to-t from-cafe-oscuro/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge promo o disponible */}
        {ramo.en_promocion ? (
          <span className="absolute top-3 left-3 flex items-center gap-1
                           bg-gradient-to-r from-amber-500 to-yellow-400
                           text-white text-xs font-lato font-bold
                           px-3 py-1 rounded-full shadow-md promo-glow">
            🏷️ OFERTA
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-verde-pistache/90 backdrop-blur-sm text-cafe-oscuro
                           text-xs font-lato font-bold px-3 py-1 rounded-full shadow-sm">
            ✓ Disponible
          </span>
        )}

        {/* Ahorro badge (solo si tiene precio promo) */}
        {ramo.en_promocion && ramo.precio_promocion && ramo.precio && (
          <span className="absolute top-3 right-3 bg-red-500 text-white
                           text-xs font-lato font-bold px-2 py-1 rounded-full shadow-md
                           animate-bounce-in">
            -{Math.round(((Number(ramo.precio) - Number(ramo.precio_promocion)) / Number(ramo.precio)) * 100)}%
          </span>
        )}

        {/* Ícono zoom al hover */}
        <div className="absolute inset-0 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3
                          transform scale-75 group-hover:scale-100 transition-transform duration-400">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-playfair text-lg font-bold text-cafe-oscuro mb-2 leading-tight
                       group-hover:text-cafe-medio transition-colors duration-300">
          {ramo.nombre}
        </h3>

        {ramo.descripcion && (
          <p className="font-lato font-light text-sm text-cafe-medio/80 mb-3 line-clamp-2 leading-relaxed">
            {ramo.descripcion}
          </p>
        )}

        {/* Flores */}
        {ramo.flores && ramo.flores.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {ramo.flores.map((flor, i) => (
              <span key={i}
                className="inline-flex items-center gap-1 bg-crema text-cafe-medio
                           text-xs font-lato px-2.5 py-1 rounded-full border border-crema-oscura
                           transition-colors duration-200 group-hover:border-cafe-claro/40">
                🌸 {flor}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-crema-oscura/50">
          <PrecioDisplay ramo={ramo} />

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 w-full text-center
                       bg-verde-bosque hover:bg-verde-marino text-white
                       font-lato font-bold text-sm py-2.5 rounded-xl
                       transition-all duration-300 shadow-md hover:shadow-lg
                       hover:-translate-y-0.5 group/btn"
          >
            <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
