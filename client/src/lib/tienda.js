// Datos de contacto y utilidades compartidas del catálogo
export const WA_NUMBER = '5215652539705'
export const WA_DISPLAY = '56 5253 9705'
export const WA_DIRECT = `https://wa.me/${WA_NUMBER}`

export const waLinkRamo = (nombre) =>
  `${WA_DIRECT}?text=${encodeURIComponent(`Hola, me interesa el ramo *${nombre}*, ¿está disponible?`)}`

export const mxn = (n) =>
  `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// Precio ya resuelto (la promoción solo cuenta si es menor al precio original)
export function precioDe(ramo) {
  const precio = ramo.precio ? Number(ramo.precio) : null
  const promo = ramo.precio_promocion ? Number(ramo.precio_promocion) : null
  const tienePromo = Boolean(ramo.en_promocion && precio && promo && promo < precio)
  const ahorro = tienePromo ? precio - promo : 0
  const pct = tienePromo ? Math.round((ahorro / precio) * 100) : 0
  return { precio, promo, tienePromo, ahorro, pct, final: tienePromo ? promo : precio }
}
