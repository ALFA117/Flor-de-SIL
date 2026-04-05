import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'
import RamoCard from '../components/RamoCard'
import RamoModal from '../components/RamoModal'
import Spinner from '../components/Spinner'

const WA_NUMBER = '5215652539705'
const WA_DIRECT = `https://wa.me/${WA_NUMBER}`

export default function Catalogo() {
  const [ramos, setRamos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ramoSeleccionado, setRamoSeleccionado] = useState(null)
  const catalogoRef = useRef(null)

  useEffect(() => {
    api.get('/api/ramos?soloDisponibles=true')
      .then(({ data }) => setRamos(data.ramos || []))
      .catch(() => setError('No pudimos cargar el catálogo. Intenta más tarde.'))
      .finally(() => setLoading(false))
  }, [])

  const scrollAlCatalogo = () => {
    catalogoRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* HERO */}
      <section
        className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6
                   bg-gradient-to-b from-verde-marino to-cafe-oscuro relative overflow-hidden"
      >
        {/* Decoración floral de fondo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-center">
          <span className="text-[40rem] leading-none">🌸</span>
        </div>

        <div className="relative z-10 max-w-2xl">
          <p className="font-lato text-sm tracking-[0.4em] text-verde-pistache uppercase mb-4">
            Bienvenido a
          </p>
          <h1 className="font-playfair font-bold text-5xl md:text-7xl text-crema tracking-[0.12em] mb-4 leading-tight">
            FLOR DE SIL
          </h1>

          {/* Separador */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-cafe-claro opacity-60" />
            <span className="text-cafe-claro text-xl">✿</span>
            <div className="h-px w-16 bg-cafe-claro opacity-60" />
          </div>

          <p className="font-playfair italic text-xl text-verde-pistache mb-10">
            Donde florecen las emociones
          </p>

          <button
            onClick={scrollAlCatalogo}
            className="bg-cafe-claro hover:bg-cafe-medio text-cafe-oscuro font-lato font-bold
                       px-8 py-3 rounded-lg transition-all duration-300
                       shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Ver Catálogo ↓
          </button>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section ref={catalogoRef} className="bg-crema py-16 px-4 min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          {/* Encabezado sección */}
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-cafe-oscuro mb-3">
              Nuestros Arreglos
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-cafe-claro opacity-50" />
              <span className="text-cafe-claro">✿</span>
              <div className="h-px w-20 bg-cafe-claro opacity-50" />
            </div>
          </div>

          {loading && <Spinner size="lg" />}

          {error && (
            <div className="text-center py-16">
              <p className="font-lato text-cafe-medio">{error}</p>
            </div>
          )}

          {!loading && !error && ramos.length === 0 && (
            <div className="text-center py-20 max-w-md mx-auto">
              <span className="text-7xl mb-6 block">🌸</span>
              <p className="font-playfair text-xl text-cafe-oscuro mb-2">
                Por el momento no contamos con disponibilidad.
              </p>
              <p className="font-lato font-light text-cafe-medio mb-8">
                Escríbenos directamente y con gusto te ayudamos →
              </p>
              <a
                href={WA_DIRECT}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-verde-bosque hover:bg-verde-marino text-white
                           font-lato font-bold px-8 py-3 rounded-lg transition-colors duration-200"
              >
                Contactar por WhatsApp
              </a>
            </div>
          )}

          {!loading && !error && ramos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ramos.map((ramo) => (
                <RamoCard
                  key={ramo.id}
                  ramo={ramo}
                  onClick={() => setRamoSeleccionado(ramo)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-cafe-oscuro text-crema py-10 px-4 text-center">
        <p className="font-playfair text-lg mb-1">FLOR DE SIL</p>
        <p className="font-playfair italic text-verde-pistache text-sm mb-4">
          Donde florecen las emociones
        </p>
        <a
          href={WA_DIRECT}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-crema hover:text-cafe-claro
                     transition-colors font-lato text-sm font-light"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          56 5253 9705
        </a>
        <p className="font-lato font-light text-xs text-cafe-claro mt-4 opacity-70">
          © 2024 FLOR DE SIL. Todos los derechos reservados.
        </p>
      </footer>

      {/* Modal */}
      {ramoSeleccionado && (
        <RamoModal
          ramo={ramoSeleccionado}
          onClose={() => setRamoSeleccionado(null)}
        />
      )}
    </>
  )
}
