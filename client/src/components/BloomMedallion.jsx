import { motion, useReducedMotion } from 'motion/react'

/* Elemento visual del hero: el logo de Flor de Sil dentro de una flor de
   pétalos que se abren al cargar y giran muy despacio. */

const PETAL = 'M0 0 C 34 -44, 30 -118, 0 -158 C -30 -118, -34 -44, 0 0 Z'
const OUTER = Array.from({ length: 12 }, (_, i) => i * 30)
const INNER = Array.from({ length: 12 }, (_, i) => i * 30 + 15)

export default function BloomMedallion() {
  const reduce = useReducedMotion()

  const petal = (angle, i, ring) => (
    <g key={`${ring}-${angle}`} transform={`rotate(${angle})`}>
      {/* El círculo invisible centra la caja del grupo en el origen: el pétalo crece desde el centro */}
      <motion.g
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: ring === 'outer' ? 1 : 0.72, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.35 + i * 0.04 + (ring === 'inner' ? 0.2 : 0) }}
      >
        <circle r="158" fill="none" stroke="none" />
        <path
          d={PETAL}
          fill={ring === 'outer' ? 'rgb(var(--rose) / 0.22)' : 'rgb(var(--accent) / 0.28)'}
          stroke={ring === 'outer' ? 'rgb(var(--rose) / 0.55)' : 'rgb(var(--accent) / 0.6)'}
          strokeWidth="1.2"
        />
      </motion.g>
    </g>
  )

  return (
    <div className="relative mx-auto aspect-square w-[min(64vw,440px)]">
      <motion.svg
        viewBox="-200 -200 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <circle r="186" fill="none" stroke="rgb(var(--accent) / 0.25)" strokeDasharray="2 8" />
        {OUTER.map((a, i) => petal(a, i, 'outer'))}
        {INNER.map((a, i) => petal(a, i, 'inner'))}
      </motion.svg>

      <motion.div
        className="absolute inset-[24%]"
        initial={reduce ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.15 }}
      >
        <motion.img
          src="/logo-320.webp"
          srcSet="/logo-320.webp 320w, /logo-640.webp 640w"
          sizes="(min-width: 768px) 220px, 40vw"
          alt="Logotipo de Flor de Sil: ramo de flores blancas con el lema Donde las emociones florecen"
          width="320"
          height="320"
          className="h-full w-full rounded-full shadow-lift ring-4 ring-accent/50"
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  )
}
