import { useState, useEffect, useCallback } from 'react'
import supabase from '../lib/supabase'
import RamoCard, { RamoCardSkeleton } from '../components/RamoCard'
import RamoModal from '../components/RamoModal'
import Icon from '../components/Icon'
import { WA_DIRECT, WA_DISPLAY } from '../lib/tienda'

const pasos = [
  { n: '01', t: 'Elige un arreglo', d: 'Revisa el catálogo y abre cualquier ramo para ver sus flores y su precio.' },
  { n: '02', t: 'Escríbenos por WhatsApp', d: 'El botón de cada arreglo abre el chat con el nombre del ramo ya escrito.' },
  { n: '03', t: 'Confirmamos tu pedido', d: 'Te respondemos con la disponibilidad y acordamos los detalles contigo.' },
]

function Ramita({ className = '' }) {
  // Trazo botánico fino, decorativo
  return (
    <svg viewBox="0 0 120 220" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className={className}>
      <path d="M60 218C58 170 62 120 60 70 59 45 61 22 60 2" />
      <path d="M60 170c-14-6-26-18-30-34 14 2 26 14 30 34zM60 140c14-6 26-18 30-34-14 2-26 14-30 34zM60 108c-12-5-22-15-25-29 12 2 22 12 25 29zM60 80c12-5 22-15 25-29-12 2-22 12-25 29zM60 52c-9-4-16-11-18-21 9 2 16 9 18 21z" />
      <circle cx="60" cy="10" r="6" />
    </svg>
  )
}

function EstadoCatalogo({ loading, error, total }) {
  let color = 'bg-linea-fuerte'
  let texto = 'Cargando catálogo…'
  if (!loading && error) { color = 'bg-barro'; texto = 'Catálogo en línea fuera de servicio' }
  else if (!loading && total === 0) { color = 'bg-linea-fuerte'; texto = 'Sin arreglos publicados por ahora' }
  else if (!loading) { color = 'bg-bosque'; texto = `${total} ${total === 1 ? 'arreglo disponible' : 'arreglos disponibles'}` }
  return (
    <p className="inline-flex items-center gap-2 text-[14px] text-tinta-suave" role="status" aria-live="polite">
      <span className={`h-2 w-2 rounded-full ${color} ${loading ? 'animate-pulse' : ''}`} />
      {texto}
    </p>
  )
}

export default function Catalogo() {
  const [ramos, setRamos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ramoSeleccionado, setRamoSeleccionado] = useState(null)

  // Si el servidor no contesta en 8 s se muestra el aviso con WhatsApp
  const cargarRamos = useCallback(() => {
    setLoading(true)
    setError(null)
    supabase
      .from('ramos')
      .select('*')
      .eq('disponible', true)
      .order('creado_en', { ascending: false })
      .abortSignal(AbortSignal.timeout(8000))
      .then(({ data, error }) => {
        if (error) throw error
        setRamos(data || [])
      })
      .catch(() => setError('No pudimos cargar el catálogo en este momento.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    supabase.rpc('incrementar_visitas_pagina').then(() => null, () => null)
    cargarRamos()
  }, [cargarRamos])

  const cerrarModal = useCallback(() => setRamoSeleccionado(null), [])
  const anio = new Date().getFullYear()

  return (
    <main id="contenido">
      {/* ── HERO ── */}
      <section className="contenedor pt-8 pb-16 md:pt-14 md:pb-24">
        <div className="grid items-stretch gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="flex flex-col justify-center animate-rise">
            <p className="eyebrow">Florería · Pedidos por WhatsApp</p>
            <h1 className="mt-5 font-display text-[44px] leading-[1.02] sm:text-[60px] lg:text-[76px] font-semibold tracking-[-0.01em] text-tinta">
              Donde florecen <span className="italic font-medium text-bosque">las emociones.</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-[17px] sm:text-[18px] leading-relaxed text-tinta-suave">
              Ramos y arreglos florales con precio en pesos. Elige el tuyo en el catálogo y apártalo
              con un mensaje: te confirmamos disponibilidad y detalles por WhatsApp.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#catalogo" className="btn-primario">
                Ver catálogo
                <Icon name="arrowDown" size={17} />
              </a>
              <a href={WA_DIRECT} target="_blank" rel="noopener noreferrer" className="btn-secundario">
                <Icon name="whatsapp" size={17} />
                Escribir por WhatsApp
              </a>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-2 border-t border-linea pt-5 text-[14px]">
              <div>
                <dt className="text-tinta-tenue">Pedidos</dt>
                <dd className="mt-1 font-medium text-tinta">Por WhatsApp</dd>
              </div>
              <div>
                <dt className="text-tinta-tenue">Teléfono</dt>
                <dd className="mt-1 precio text-tinta">{WA_DISPLAY}</dd>
              </div>
            </dl>
          </div>

          <div className="relative min-h-[360px] sm:min-h-[440px] overflow-hidden rounded bg-bosque-noche text-papel animate-fade-in">
            <div className="absolute inset-3 sm:inset-4 rounded-sm border border-papel/15" />
            <Ramita className="absolute -left-4 bottom-0 h-[70%] text-papel/15" />
            <Ramita className="absolute -right-6 top-0 h-[55%] rotate-180 text-papel/10" />
            <div className="relative flex h-full flex-col items-center justify-center px-8 py-12 text-center">
              <picture>
                <source srcSet="/logo-320.webp 1x, /logo-640.webp 2x" type="image/webp" />
                <img
                  src="/logo.png"
                  alt="Logotipo de Flor de Sil"
                  width="240"
                  height="240"
                  className="h-[200px] w-[200px] sm:h-[240px] sm:w-[240px] rounded-full object-cover ring-1 ring-papel/25"
                />
              </picture>
              <p className="mt-8 font-display text-[22px] italic text-papel/90">Ramos y arreglos florales</p>
              <p className="mt-2 text-[13px] uppercase tracking-[0.18em] text-papel/60">Flor de Sil</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓMO PEDIR ── */}
      <section id="como-pedir" className="scroll-mt-20 border-y border-linea bg-papel-hondo/60">
        <div className="contenedor py-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-[0.8fr_2fr] md:gap-16">
            <div>
              <p className="eyebrow">Cómo pedir</p>
              <h2 className="mt-3 font-display text-[34px] md:text-[40px] font-semibold leading-[1.05]">
                Tres pasos, un mensaje.
              </h2>
            </div>
            <ol className="grid gap-8 sm:grid-cols-3 sm:gap-0">
              {pasos.map((p, i) => (
                <li
                  key={p.n}
                  className={`sm:px-6 ${i > 0 ? 'sm:border-l sm:border-linea-fuerte' : 'sm:pl-0'} ${i === 0 ? '' : 'border-t border-linea pt-8 sm:border-t-0 sm:pt-0'}`}
                >
                  <span className="font-mono text-[13px] text-barro">{p.n}</span>
                  <h3 className="mt-3 text-[18px] font-semibold text-tinta">{p.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-tinta-suave">{p.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── CATÁLOGO ── */}
      <section id="catalogo" className="scroll-mt-20 contenedor py-16 md:py-24">
        <div className="flex flex-col gap-4 border-b border-linea pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Colección</p>
            <h2 className="mt-3 font-display text-[40px] md:text-[52px] font-semibold leading-none">Nuestros arreglos</h2>
          </div>
          <EstadoCatalogo loading={loading} error={error} total={ramos.length} />
        </div>

        {loading && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Cargando catálogo">
            {[0, 1, 2].map((i) => <RamoCardSkeleton key={i} />)}
          </div>
        )}

        {!loading && (error || ramos.length === 0) && (
          <div
            className="mt-10 grid gap-8 rounded border border-linea bg-papel-claro p-6 sm:p-10 md:grid-cols-[auto_1fr_auto] md:items-center animate-rise"
            role={error ? 'alert' : undefined}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-linea-fuerte text-barro">
              <Icon name={error ? 'cloudOff' : 'flower'} size={26} strokeWidth={1.5} />
            </div>
            <div className="max-w-[56ch]">
              <h3 className="font-display text-[28px] font-semibold leading-tight text-tinta">
                {error ? 'El catálogo en línea no está disponible por ahora.' : 'Por el momento no hay arreglos publicados.'}
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed text-tinta-suave">
                {error
                  ? 'Seguimos atendiendo: escríbenos por WhatsApp y te compartimos los arreglos disponibles.'
                  : 'Escríbenos directamente y con gusto te ayudamos a elegir.'}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <a href={WA_DIRECT} target="_blank" rel="noopener noreferrer" className="btn-primario">
                <Icon name="whatsapp" size={18} />
                Contactar por WhatsApp
              </a>
              {error && (
                <button type="button" onClick={cargarRamos} className="btn-secundario">
                  <Icon name="refresh" size={17} />
                  Reintentar
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && ramos.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ramos.map((ramo, i) => (
              <RamoCard key={ramo.id} ramo={ramo} index={i} onOpen={() => setRamoSeleccionado(ramo)} />
            ))}
          </div>
        )}
      </section>

      {/* ── CONTACTO ── */}
      <section id="contacto" className="scroll-mt-20 contenedor pb-16 md:pb-24">
        <div className="grid gap-8 rounded bg-bosque px-6 py-10 text-papel sm:px-10 md:grid-cols-[1.4fr_1fr] md:items-center md:py-14">
          <div>
            <h2 className="font-display text-[32px] md:text-[40px] font-semibold leading-[1.08]">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-papel/80">
              Escríbenos por WhatsApp y con gusto te ayudamos a elegir el arreglo indicado.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <a href={WA_DIRECT} target="_blank" rel="noopener noreferrer" className="btn-claro w-full md:w-auto">
              <Icon name="whatsapp" size={18} />
              Escribir por WhatsApp
            </a>
            <span className="precio text-[15px] text-papel/80">{WA_DISPLAY}</span>
          </div>
        </div>
      </section>

      {/* ── PIE ── */}
      <footer className="border-t border-linea">
        <div className="contenedor grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo-160.webp" alt="" width="44" height="44" className="h-11 w-11 rounded-full object-cover ring-1 ring-linea-fuerte" />
              <span className="font-display text-[24px] font-semibold">Flor de Sil</span>
            </div>
            <p className="mt-3 font-display text-[18px] italic text-tinta-suave">Donde florecen las emociones</p>
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-tinta-tenue">Contacto</p>
            <a
              href={WA_DIRECT}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-[15px] text-tinta hover:text-bosque"
            >
              <Icon name="whatsapp" size={16} />
              <span className="precio">{WA_DISPLAY}</span>
            </a>
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-tinta-tenue">Sitio</p>
            <ul className="mt-3 space-y-1 text-[15px]">
              <li><a href="#catalogo" className="inline-flex min-h-[40px] items-center text-tinta hover:text-bosque">Catálogo</a></li>
              <li><a href="#como-pedir" className="inline-flex min-h-[40px] items-center text-tinta hover:text-bosque">Cómo pedir</a></li>
              <li><a href="/admin" className="inline-flex min-h-[40px] items-center gap-1.5 text-tinta-suave hover:text-tinta"><Icon name="lock" size={14} />Acceso administración</a></li>
            </ul>
          </div>
        </div>
        <div className="contenedor border-t border-linea py-6 text-[13px] text-tinta-tenue">
          © {anio} Flor de Sil. Todos los derechos reservados.
        </div>
      </footer>

      {ramoSeleccionado && <RamoModal ramo={ramoSeleccionado} onClose={cerrarModal} />}
    </main>
  )
}
