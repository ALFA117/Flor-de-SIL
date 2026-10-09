// Datos de contacto y formato compartidos por el catálogo
export const WA_NUMBER = '5215652539705'
export const WA_DISPLAY = '56 5253 9705'
export const WA_DIRECT = `https://wa.me/${WA_NUMBER}`

export const waLinkRamo = (ramo) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa el ramo *${ramo.nombre}*, ¿está disponible?`
  )}`

export const formatoMXN = (n) =>
  `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// Devuelve los datos de la promoción solo si es válida (precio de oferta menor al original)
export function promoDe(ramo) {
  const precio = Number(ramo.precio)
  const oferta = Number(ramo.precio_promocion)
  const valida = Boolean(ramo.en_promocion && ramo.precio && ramo.precio_promocion && oferta < precio)
  if (!valida) return null
  const ahorro = precio - oferta
  return { precio, oferta, ahorro, pct: Math.round((ahorro / precio) * 100) }
}
