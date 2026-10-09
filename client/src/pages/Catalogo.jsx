import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, stagger, useReducedMotion } from 'motion/react'
import { ArrowDown, Flower2, MessageCircle, RefreshCw, WifiOff, Hand, MessagesSquare, BadgeCheck } from 'lucide-react'
import supabase from '../lib/supabase'
import RamoCard, { RamoCardSkeleton } from '../components/RamoCard'
import RamoModal from '../components/RamoModal'
import BloomMedallion from '../components/BloomMedallion'
import { WA_DIRECT, WA_DISPLAY, promoDe } from '../lib/tienda'

const springTap = { type: 'spring', stiffness: 400, damping: 20 }
const heroList = { hidden: {}, show: { transition: { delayChildren: stagger(0.08, { startDelay: 0.1 }) } } }
const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

const PASOS = [
  { icon: Hand, titulo: 'Elige tu ramo', texto: 'Mira las flores que lleva cada arreglo y su precio en MXN.' },
  { icon: MessagesSquare, titulo: 'Escríbenos', texto: 'El botón abre WhatsApp con el nombre del ramo ya escrito.' },
  { icon: BadgeCheck, titulo: 'Te confirmamos', texto: 'Te respondemos con disponibilidad y los detalles de tu pedido.' },
]

export default function Catalogo() {
  const [ramos, setRamos] = useState([])
  const [estado, setEstado] = useState('cargando') // cargando | listo | error
  const [seleccion, setSeleccion] = useState(null)
  const [origen, setOrigen] = useState(null)
  const reduce = useReducedMotion()

  const cargar = useCallback(() => {
    setEstado('cargando')
    supabase
      .from('ramos')
      .select('*')
      .eq('disponible', true)
      .order('creado_en', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error
        setRamos(data || [])
        setEstado('listo')
      })
      .catch(() => setEstado('error'))
  }, [])

  useEffect(() => {
    supabase.rpc('incrementar_visitas_pagina').then(() => null, () => null)
    cargar()
  }, [cargar])

  const abrir = (ramo, boton) => { setOrigen(boton); setSeleccion(ramo) }
  const cerrar = useCallback(() => {
    setSeleccion(null)
    origen?.focus()
  }, [origen])

  const enOferta = ramos.filter((r) => promoDe(r)).length

  return (
    <>
      {/* HERO */}
      <section className="relative mx-auto grid min-h-[100dvh] overflow-x-clip max-w-6xl items-center gap-10 px-4 pb-16 pt-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pt-20">
        <motion.div
          className="order-2 flex flex-col items-start lg:order-1"
          variants={reduce ? undefined : heroList}
          initial={reduce ? false : 'hidden'}
          animate="show"
        >
          <motion.p variants={heroItem} className="t-eyebrow mb-5 inline-flex items-center gap-2">
            <Flower2 className="h-4 w-4" aria-hidden /> Florería · Pedidos por WhatsApp
          </motion.p>
          <motion.h1 variants={heroItem} className="t-display text-ink">
            Flor de Sil
          </motion.h1>
          <motion.p variants={heroItem} className="mt-3 font-display text-2xl italic text-accent sm:text-3xl">
            Donde florecen las emociones
          </motion.p>
          <motion.p variants={heroItem} className="t-body mt-6 max-w-[34rem] text-lg">
            Ramos de girasoles, rosas, lilis y más, cada uno con las flores que lleva y su precio a la vista.
            Elige el tuyo y apártalo por WhatsApp.
          </motion.p>

          <motion.div variants={heroItem} className="mt-8 flex w-full flex-col gap-3 min-[420px]:w-auto min-[420px]:flex-row">
            <motion.a href="#catalogo" className="btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={springTap}>
              Ver el catálogo <ArrowDown className="h-4 w-4" aria-hidden />
            </motion.a>
            <motion.a href={WA_DIRECT} target="_blank" rel="noopener noreferrer" className="btn-secondary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={springTap}>
              <MessageCircle className="h-4 w-4" aria-hidden /> Escríbenos
            </motion.a>
          </motion.div>

          {/* Datos reales del catálogo, no inventados */}
          <motion.div variants={heroItem} className="mt-10 min-h-[48px]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {estado === 'listo' && ramos.length > 0 ? (
                <motion.dl key="stats" className="flex flex-wrap gap-x-8 gap-y-3"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div>
                    <dt className="text-sm text-muted">Arreglos disponibles</dt>
                    <dd className="t-price text-2xl text-ink">{ramos.length}</dd>
                  </div>
                  {enOferta > 0 && (
                    <div>
                      <dt className="text-sm text-muted">En oferta ahora</dt>
                      <dd className="t-price text-2xl text-rose">{enOferta}</dd>
                    </div>
                  )}
                </motion.dl>
              ) : estado === 'cargando' ? (
                <motion.div key="sk" className="flex gap-8" exit={{ opacity: 0 }} aria-hidden>
                  <div className="skeleton h-12 w-32" /><div className="skeleton h-12 w-24" />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <BloomMedallion />
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" aria-labelledby="catalogo-titulo" className="scroll-mt-20 px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="t-eyebrow mb-3">Colección</p>
              <h2 id="catalogo-titulo" className="t-title text-ink">Nuestros arreglos</h2>
            </div>
            <p className="max-w-xs text-sm text-muted">Precios en pesos mexicanos. La disponibilidad se confirma por WhatsApp.</p>
          </div>

          <AnimatePresence mode="wait">
            {estado === 'cargando' && (
              <motion.div key="cargando" exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Cargando arreglos">
                {Array.from({ length: 6 }, (_, i) => <RamoCardSkeleton key={i} />)}
              </motion.div>
            )}

            {estado === 'error' && (
              <motion.div key="error" role="alert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="card mx-auto flex max-w-lg flex-col items-center gap-4 p-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose/15 text-rose"><WifiOff className="h-6 w-6" aria-hidden /></span>
                <h3 className="t-heading">No pudimos cargar el catálogo</h3>
                <p className="t-body">Puede ser tu conexión o una falla momentánea del servidor. Revisa tu internet y vuelve a intentar; si sigue igual, pídenos el catálogo por WhatsApp.</p>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <motion.button type="button" onClick={cargar} className="btn-primary" whileTap={{ scale: 0.96 }} transition={springTap}>
                    <RefreshCw className="h-4 w-4" aria-hidden /> Reintentar
                  </motion.button>
                  <a href={WA_DIRECT} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
                  </a>
                </div>
              </motion.div>
            )}

            {estado === 'listo' && ramos.length === 0 && (
              <motion.div key="vacio" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="card mx-auto flex max-w-lg flex-col items-center gap-4 p-8 text-center">
                <img src="/logo-160.webp" alt="" className="h-20 w-20 rounded-full opacity-60" />
                <h3 className="t-heading">Hoy no hay arreglos publicados</h3>
                <p className="t-body">Estamos preparando flores nuevas. Escríbenos y te contamos qué podemos armar para ti.</p>
                <a href={WA_DIRECT} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <MessageCircle className="h-4 w-4" aria-hidden /> Escribir por WhatsApp
                </a>
              </motion.div>
            )}

            {estado === 'listo' && ramos.length > 0 && (
              <motion.ul key="lista" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                {ramos.map((ramo, i) => (
                  <motion.li
                    key={ramo.id}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26, delay: (i % 3) * 0.05 }}
                  >
                    <RamoCard ramo={ramo} onOpen={abrir} />
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CÓMO PEDIR */}
      <section aria-labelledby="pedir-titulo" className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="t-eyebrow mb-3">Sin registro ni pagos en línea</p>
          <h2 id="pedir-titulo" className="t-title mb-10 text-ink">Así pides tu ramo</h2>
          <ol className="grid gap-4 sm:grid-cols-3">
            {PASOS.map(({ icon: Icon, titulo, texto }, i) => (
              <li key={titulo} className="relative rounded-[24px] border border-line/70 bg-surface/80 p-6 backdrop-blur-sm">
                <span className="t-price absolute right-6 top-5 text-4xl text-line" aria-hidden>0{i + 1}</span>
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-petal bg-leaf/15 text-leaf"><Icon className="h-5 w-5" aria-hidden /></span>
                <h3 className="t-heading mb-2">{titulo}</h3>
                <p className="t-body">{texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pb-safe border-t border-line/60 bg-surface/70 px-4 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-160.webp" alt="" width="56" height="56" className="h-14 w-14 rounded-full ring-2 ring-accent/40" />
            <div>
              <p className="font-display text-xl font-semibold">Flor de Sil</p>
              <p className="font-display text-sm italic text-muted">Donde florecen las emociones</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <a href={WA_DIRECT} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-ink hover:text-accent">
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp <span className="t-price">{WA_DISPLAY}</span>
            </a>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>© {new Date().getFullYear()} Flor de Sil</span>
              <Link to="/admin/login" className="inline-flex min-h-[44px] items-center underline-offset-4 hover:text-accent hover:underline">Acceso administración</Link>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {seleccion && <RamoModal key={seleccion.id} ramo={seleccion} onClose={cerrar} />}
      </AnimatePresence>
    </>
  )
}
