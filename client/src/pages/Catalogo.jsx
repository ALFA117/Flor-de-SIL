import { useState, useEffect, useRef } from 'react'
import supabase from '../lib/supabase'
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
    supabase
      .from('ramos')
      .select('*')
      .eq('disponible', true)
      .order('creado_en', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error
        setRamos(data || [])
      })
      .catch(() => setError('No pudimos cargar el catálogo. Intenta más tarde.'))
      .finally(() => setLoading(false))
  }, [])

  const scrollAlCatalogo = () => {
    catalogoRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6
                          bg-gradient-to-b from-[#0f2418] via-verde-marino to-cafe-oscuro overflow-hidden pt-20">

        {/* Fondo decorativo radial */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[600px] h-[600px] rounded-full opacity-10
                          bg-radial-gradient"
               style={{ background: 'radial-gradient(circle, #C4956A 0%, transparent 70%)' }} />
        </div>

        {/* Partículas decorativas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <span key={i}
              className="absolute text-cafe-claro/20 text-4xl animate-pulse-soft select-none"
              style={{
                top: `${[15,70,30,80,50,20][i]}%`,
                left: `${[8,5,85,88,15,92][i]}%`,
                animationDelay: `${i * 0.7}s`,
                fontSize: `${[2,1.5,2.5,1.8,1.2,2.2][i]}rem`
              }}
            >✿</span>
          ))}
        </div>

        <div className="relative z-10 max-w-2xl flex flex-col items-center">

          {/* Logo oval flotante */}
          <div className="animate-scale-in mb-8">
            <div className="animate-float">
              <img
                src="/logo.png"
                alt="FLOR DE SIL"
                className="w-52 h-44 object-cover rounded-[50%] shadow-[0_0_60px_rgba(196,149,106,0.4)]
                           border-4 border-cafe-claro/70"
                style={{ objectPosition: 'center 25%' }}
              />
            </div>
          </div>

          <p className="animate-fade-in-up delay-200 font-lato text-xs tracking-[0.5em] text-verde-pistache/80 uppercase mb-3">
            Bienvenido a
          </p>

          <h1 className="animate-fade-in-up delay-300 font-playfair font-bold text-5xl md:text-7xl text-crema
                         tracking-[0.12em] mb-3 leading-tight">
            FLOR DE SIL
          </h1>

          {/* Separador shimmer */}
          <div className="animate-fade-in delay-400 flex items-center justify-center gap-4 mb-4 w-full max-w-xs">
            <div className="h-px flex-1 shimmer-gold rounded-full opacity-70" />
            <span className="text-cafe-claro text-xl">✿</span>
            <div className="h-px flex-1 shimmer-gold rounded-full opacity-70" />
          </div>

          <p className="animate-fade-in-up delay-500 font-playfair italic text-xl text-verde-pistache mb-10">
            Donde florecen las emociones
          </p>

          <button
            onClick={scrollAlCatalogo}
            className="animate-fade-in-up delay-600
                       group relative overflow-hidden bg-transparent border-2 border-cafe-claro/70
                       hover:border-cafe-claro text-crema font-lato font-bold
                       px-10 py-3.5 rounded-full transition-all duration-500
                       hover:shadow-[0_0_30px_rgba(196,149,106,0.4)]"
          >
            <span className="absolute inset-0 bg-cafe-claro/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-full" />
            <span className="relative">Ver Catálogo ↓</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <svg className="w-5 h-5 text-crema" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section ref={catalogoRef} className="bg-crema py-20 px-4 min-h-[60vh]">
        <div className="max-w-6xl mx-auto">

          {/* Encabezado sección */}
          <div className="text-center mb-14">
            <p className="font-lato text-xs tracking-[0.4em] text-cafe-claro uppercase mb-3">
              Colección
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-cafe-oscuro mb-4">
              Nuestros Arreglos
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-24 shimmer-gold rounded-full opacity-60" />
              <span className="text-cafe-claro text-lg">✿</span>
              <div className="h-px w-24 shimmer-gold rounded-full opacity-60" />
            </div>
          </div>

          {loading && <Spinner size="lg" />}

          {error && (
            <div className="text-center py-16">
              <p className="font-lato text-cafe-medio">{error}</p>
            </div>
          )}

          {!loading && !error && ramos.length === 0 && (
            <div className="text-center py-20 max-w-md mx-auto animate-fade-in-up">
              <img src="/logo.png" alt="FLOR DE SIL"
                className="w-32 h-28 object-cover rounded-[50%] mx-auto mb-6 opacity-40"
                style={{ objectPosition: 'center 25%' }} />
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
                className="inline-flex items-center gap-2 bg-verde-bosque hover:bg-verde-marino text-white
                           font-lato font-bold px-8 py-3 rounded-full transition-all duration-300
                           shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contactar por WhatsApp
              </a>
            </div>
          )}

          {!loading && !error && ramos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {ramos.map((ramo, i) => (
                <div
                  key={ramo.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <RamoCard
                    ramo={ramo}
                    onClick={() => setRamoSeleccionado(ramo)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-cafe-oscuro text-crema py-14 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <img src="/logo.png" alt="FLOR DE SIL"
            className="w-20 h-16 object-cover rounded-[50%] mb-5 border-2 border-cafe-claro/40 opacity-90"
            style={{ objectPosition: 'center 25%' }} />

          <p className="font-playfair text-xl font-semibold mb-1">FLOR DE SIL</p>
          <p className="font-playfair italic text-verde-pistache text-sm mb-6">
            Donde florecen las emociones
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-cafe-claro/30" />
            <span className="text-cafe-claro/50 text-sm">✿</span>
            <div className="h-px w-16 bg-cafe-claro/30" />
          </div>

          <a
            href={WA_DIRECT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-crema hover:text-cafe-claro
                       transition-colors font-lato text-sm group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            56 5253 9705
          </a>

          <p className="font-lato font-light text-xs text-cafe-claro/50 mt-6">
            © 2024 FLOR DE SIL. Todos los derechos reservados.
          </p>
        </div>
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
