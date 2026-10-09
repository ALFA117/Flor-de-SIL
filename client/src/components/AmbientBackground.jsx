import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform,
} from 'motion/react'

/* Fondo 3D: "campo de flores en ondas" (receta 2 del dado, terreno de ondas).
   Tres capas con parallax distinto:
   - lejana: dos resplandores cálidos que derivan lento
   - media: un canvas con un prado en perspectiva (líneas que ondulan como
     pasto al viento) y flores de cinco pétalos posadas sobre las ondas
   - cercana: pétalos en CSS 3D que caen girando
   Completa en la landing, tranquila en las pantallas de trabajo.
   Solo transform/opacity; el canvas se pausa con la pestaña oculta. */

const rgbVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).join(',')

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return mobile
}

function useCanvasLoop(el, reduce, draw) {
  useEffect(() => {
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0, raf = 0
    const resize = () => {
      w = el.clientWidth; h = el.clientHeight
      el.width = w * dpr; el.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduce) draw(ctx, w, h, 0)
    }
    resize()
    window.addEventListener('resize', resize)
    if (reduce) return () => window.removeEventListener('resize', resize)
    const loop = (t) => { draw(ctx, w, h, t / 1000); raf = requestAnimationFrame(loop) }
    const onVisibility = () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [el, reduce, draw])
}

function Meadow({ reduce, full, mobile, px, py }) {
  const [el, setEl] = useState(null)
  const colors = useRef({ line: '74,107,58', bloom: '168,68,76', glow: '196,149,106', strength: 1, frame: 0 })

  const draw = useCallback((ctx, w, h, t) => {
    const c = colors.current
    // Relee los tokens de vez en cuando para seguir el cambio de tema
    if (c.frame++ % 45 === 0) {
      c.line = rgbVar('--amb-line'); c.bloom = rgbVar('--amb-bloom'); c.glow = rgbVar('--amb-glow-a')
      c.strength = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--amb-strength')) || 1
    }
    const ROWS = mobile ? 11 : full ? 22 : 14
    const COLS = mobile ? 22 : full ? 46 : 30
    const FOV = 520
    const tilt = px.get() * 0.14
    const lift = py.get() * 18
    const horizon = h * (mobile ? 0.7 : 0.66)
    ctx.clearRect(0, 0, w, h)
    ctx.lineWidth = 1

    // De lejos a cerca, para que las flores cercanas tapen a las lejanas
    for (let r = ROWS - 1; r >= 0; r--) {
      const z = r * 58 + 50
      const fade = 1 - r / ROWS
      const pts = []
      for (let col = 0; col <= COLS; col++) {
        const x = (col / COLS - 0.5) * w * 2.4
        const y = Math.sin(col * 0.38 + t * 0.7) * 20 + Math.cos(r * 0.5 + t * 0.55) * 16 + 150 + lift
        const xr = x * Math.cos(tilt) - z * Math.sin(tilt)
        const zr = x * Math.sin(tilt) + z * Math.cos(tilt)
        const k = FOV / (FOV + zr)
        pts.push([w / 2 + xr * k, horizon + y * k, k, col])
      }
      ctx.beginPath()
      pts.forEach(([sx, sy], i) => (i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy)))
      ctx.strokeStyle = `rgba(${c.line},${0.42 * fade * c.strength + 0.08})`
      ctx.stroke()

      // Flores sobre algunas crestas
      for (const [sx, sy, k, col] of pts) {
        if ((col * 5 + r * 3) % 9 !== 0) continue
        if (sx < -20 || sx > w + 20) continue
        const size = 7 * k * (mobile ? 0.9 : 1.15)
        const spin = t * 0.25 + col + r
        ctx.save()
        ctx.translate(sx, sy - size * 0.6)
        ctx.rotate(spin)
        ctx.fillStyle = `rgba(${c.bloom},${(0.55 * fade + 0.15) * c.strength})`
        for (let p = 0; p < 5; p++) {
          ctx.rotate((Math.PI * 2) / 5)
          ctx.beginPath()
          ctx.ellipse(0, -size * 0.55, size * 0.36, size * 0.6, 0, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(${c.glow},${(0.8 * fade + 0.2) * c.strength})`
        ctx.beginPath()
        ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }
  }, [full, mobile, px, py])

  useCanvasLoop(el, reduce, draw)
  return <canvas ref={setEl} className="absolute inset-0 h-full w-full" />
}

// Pétalos de la capa cercana: x/y en %, size px, depth 0–1, dur s
const PETALS = [
  { x: 8,  size: 26, depth: 0.9, dur: 19, delay: -2,  mobile: true,  calm: true },
  { x: 22, size: 16, depth: 0.5, dur: 24, delay: -14, mobile: false, calm: false },
  { x: 41, size: 20, depth: 0.7, dur: 21, delay: -7,  mobile: true,  calm: false },
  { x: 63, size: 14, depth: 0.4, dur: 27, delay: -19, mobile: false, calm: false },
  { x: 78, size: 30, depth: 1,   dur: 17, delay: -10, mobile: true,  calm: true },
  { x: 91, size: 18, depth: 0.6, dur: 23, delay: -4,  mobile: false, calm: false },
  { x: 52, size: 22, depth: 0.8, dur: 20, delay: -16, mobile: true,  calm: false },
]

function Petal({ p, reduce, px, py }) {
  const x = useTransform(px, (v) => v * 40 * p.depth)
  const y = useTransform(py, (v) => v * 24 * p.depth)
  const startY = 12 + ((p.x * 7) % 70) // posición fija si no hay movimiento
  return (
    <motion.div className="amb-petal" style={{ left: `${p.x}%`, top: reduce ? `${startY}%` : '-6%', width: p.size, height: p.size * 1.25, x: reduce ? 0 : x, y: reduce ? 0 : y }}>
      {reduce ? (
        <i style={{ transform: `rotateX(50deg) rotateZ(${p.x * 4}deg)` }} />
      ) : (
        <motion.i
          animate={{ y: ['0vh', '112vh'], rotateX: [0, 360], rotateY: [0, 180], rotateZ: [0, 160] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}

export default function AmbientBackground() {
  const { pathname } = useLocation()
  const full = pathname === '/'
  const reduce = useReducedMotion() ?? false
  const mobile = useIsMobile()

  // Parallax por puntero (solo puntero fino) suavizado con spring
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const px = useSpring(rx, { stiffness: 40, damping: 18 })
  const py = useSpring(ry, { stiffness: 40, damping: 18 })
  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e) => {
      rx.set((e.clientX / window.innerWidth - 0.5) * 2)
      ry.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, rx, ry])

  // Parallax por scroll: cada capa se desplaza distinto según su profundidad
  const { scrollYProgress } = useScroll()
  const scroll = useSpring(scrollYProgress, { stiffness: 60, damping: 20 })
  const farY = useTransform(scroll, [0, 1], [0, reduce ? 0 : -40])
  const midY = useTransform(scroll, [0, 1], [0, reduce ? 0 : -120])
  const nearY = useTransform(scroll, [0, 1], [0, reduce ? 0 : -260])
  const farX = useTransform(px, (v) => v * -12)
  const midX = useTransform(px, (v) => v * -24)

  const petals = PETALS.filter((p) => (full ? true : p.calm) && (mobile ? p.mobile : true))

  return (
    <div aria-hidden="true" className={`amb-root ${full ? 'amb-full' : 'amb-calm'}`}>
      {/* Capa lejana */}
      <motion.div className="amb-layer" style={{ y: farY, x: reduce ? 0 : farX }}>
        <motion.div
          className="amb-glow"
          style={{ width: '60vmax', height: '60vmax', left: '45%', top: '-20%', background: 'rgb(var(--amb-glow-a))' }}
          animate={reduce ? undefined : { x: ['0%', '-8%', '0%'], y: ['0%', '6%', '0%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="amb-glow"
          style={{ width: '50vmax', height: '50vmax', left: '-20%', top: '40%', background: 'rgb(var(--amb-glow-b))' }}
          animate={reduce ? undefined : { x: ['0%', '10%', '0%'], y: ['0%', '-6%', '0%'] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Capa media: prado en ondas */}
      <motion.div className="amb-layer" style={{ y: midY, x: reduce ? 0 : midX }}>
        <Meadow reduce={reduce} full={full} mobile={mobile} px={px} py={py} />
      </motion.div>

      {/* Viñeta para legibilidad */}
      <div className="amb-vignette" />

      {/* Capa cercana: pétalos en 3D */}
      <motion.div className="amb-layer" style={{ y: nearY, perspective: 600 }}>
        {petals.map((p) => <Petal key={p.x} p={p} reduce={reduce} px={px} py={py} />)}
      </motion.div>
    </div>
  )
}
