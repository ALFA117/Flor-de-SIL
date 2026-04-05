import { useEffect } from 'react'

const WA_NUMBER = '5215652539705'

export default function RamoModal({ ramo, onClose }) {
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa el ramo *${ramo.nombre}*, ¿está disponible?`
  )}`

  // Cerrar con Escape
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cafe-oscuro/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-crema rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Foto */}
        {ramo.foto_url && (
          <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
            <img src={ramo.foto_url} alt={ramo.nombre} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6">
          {/* Badge */}
          <span className="inline-block bg-verde-pistache text-cafe-oscuro text-xs font-bold px-3 py-1 rounded-full mb-3">
            Disponible
          </span>

          <h2 className="font-playfair text-2xl font-bold text-cafe-oscuro mb-2">{ramo.nombre}</h2>

          {ramo.descripcion && (
            <p className="font-lato font-light text-cafe-medio mb-4">{ramo.descripcion}</p>
          )}

          {ramo.flores && ramo.flores.length > 0 && (
            <div className="mb-4">
              <p className="font-lato font-bold text-sm text-cafe-oscuro mb-2">Flores:</p>
              <ul className="space-y-1">
                {ramo.flores.map((flor, i) => (
                  <li key={i} className="font-lato font-light text-cafe-medio">🌸 {flor}</li>
                ))}
              </ul>
            </div>
          )}

          {ramo.precio && (
            <p className="font-lato font-bold text-cafe-claro text-2xl mb-6">
              ${Number(ramo.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </p>
          )}

          <div className="flex gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-verde-bosque hover:bg-verde-marino text-white
                         font-lato font-bold py-3 rounded-lg transition-colors duration-200"
            >
              Pedir por WhatsApp →
            </a>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-cafe-medio text-cafe-medio rounded-lg
                         hover:bg-crema-oscura transition-colors duration-200 font-lato text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
