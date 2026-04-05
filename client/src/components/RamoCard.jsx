const WA_NUMBER = '5215652539705'

export default function RamoCard({ ramo, onClick }) {
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa el ramo *${ramo.nombre}*, ¿está disponible?`
  )}`

  return (
    <article
      className="bg-white rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(59,31,14,0.12)]
                 hover:shadow-[0_8px_32px_rgba(59,31,14,0.22)] hover:-translate-y-1
                 transition-all duration-300 ease-in-out flex flex-col cursor-pointer"
      onClick={onClick}
    >
      {/* Foto */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {ramo.foto_url ? (
          <img
            src={ramo.foto_url}
            alt={ramo.nombre}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-crema-oscura flex items-center justify-center">
            <span className="text-6xl opacity-30">🌸</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-verde-pistache text-cafe-oscuro text-xs font-lato font-bold px-2 py-1 rounded-full">
          Disponible
        </span>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-playfair text-lg font-semibold text-cafe-oscuro mb-2 leading-tight">
          {ramo.nombre}
        </h3>

        {ramo.descripcion && (
          <p className="font-lato font-light text-sm text-cafe-medio mb-3 line-clamp-2">
            {ramo.descripcion}
          </p>
        )}

        {/* Flores */}
        {ramo.flores && ramo.flores.length > 0 && (
          <ul className="mb-3 space-y-0.5">
            {ramo.flores.map((flor, i) => (
              <li key={i} className="font-lato font-light text-sm text-cafe-medio">
                🌸 {flor}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-3">
          {ramo.precio && (
            <p className="font-lato font-bold text-cafe-claro text-lg mb-3">
              ${Number(ramo.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </p>
          )}

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="block w-full text-center bg-verde-bosque hover:bg-verde-marino text-white
                       font-lato font-bold text-sm py-2.5 rounded-lg
                       transition-colors duration-200"
          >
            Pedir por WhatsApp →
          </a>
        </div>
      </div>
    </article>
  )
}
