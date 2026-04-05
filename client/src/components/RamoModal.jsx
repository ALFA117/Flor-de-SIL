import { useEffect } from 'react'

const WA_NUMBER = '5215652539705'

export default function RamoModal({ ramo, onClose }) {
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa el ramo *${ramo.nombre}*, ¿está disponible?`
  )}`

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-cafe-oscuro/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-crema rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.4)]
                   max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Foto */}
        {ramo.foto_url ? (
          <div className="aspect-[4/3] overflow-hidden rounded-t-3xl">
            <img src={ramo.foto_url} alt={ramo.nombre} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[4/3] rounded-t-3xl bg-gradient-to-br from-crema to-crema-oscura
                          flex items-center justify-center">
            <img src="/logo.png" alt="FLOR DE SIL"
              className="w-32 h-32 object-cover rounded-full opacity-40" />
          </div>
        )}

        <div className="p-7">
          <div className="flex items-start justify-between mb-4">
            <span className="inline-block bg-verde-pistache text-cafe-oscuro text-xs font-bold px-3 py-1 rounded-full">
              ✓ Disponible
            </span>
            <button
              onClick={onClose}
              className="text-cafe-medio hover:text-cafe-oscuro transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-cafe-oscuro mb-3 leading-tight">
            {ramo.nombre}
          </h2>

          {ramo.descripcion && (
            <p className="font-lato font-light text-cafe-medio leading-relaxed mb-5">
              {ramo.descripcion}
            </p>
          )}

          {ramo.flores && ramo.flores.length > 0 && (
            <div className="mb-5">
              <p className="font-lato font-bold text-xs tracking-widest text-cafe-claro uppercase mb-3">
                Flores incluidas
              </p>
              <div className="flex flex-wrap gap-2">
                {ramo.flores.map((flor, i) => (
                  <span key={i}
                    className="inline-flex items-center gap-1 bg-white border border-crema-oscura
                               text-cafe-medio text-sm font-lato px-3 py-1.5 rounded-full shadow-sm">
                    🌸 {flor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ramo.precio && (
            <div className="bg-white rounded-2xl p-4 mb-6 border border-crema-oscura">
              <p className="font-lato text-xs text-cafe-medio uppercase tracking-widest mb-1">Precio</p>
              <p className="font-playfair font-bold text-cafe-claro text-3xl">
                ${Number(ramo.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                <span className="font-lato font-light text-sm text-cafe-medio ml-1">MXN</span>
              </p>
            </div>
          )}

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full text-center
                       bg-verde-bosque hover:bg-verde-marino text-white
                       font-lato font-bold py-3.5 rounded-xl
                       transition-all duration-300 shadow-lg hover:shadow-xl
                       hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Pedir por WhatsApp →
          </a>
        </div>
      </div>
    </div>
  )
}
