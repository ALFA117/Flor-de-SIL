import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import supabase from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import FloresInput from '../components/FloresInput'
import Spinner from '../components/Spinner'

const FORM_INICIAL = {
  nombre: '',
  descripcion: '',
  flores: [],
  precio: '',
  disponible: true,
  en_promocion: false,
  foto: null,
}

export default function Admin() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('catalogo') // 'catalogo' | 'form' | 'promociones'
  const [ramos, setRamos] = useState([])
  const [loadingRamos, setLoadingRamos] = useState(true)
  const [error, setError] = useState(null)
  const [visitas, setVisitas] = useState(null)

  const [form, setForm] = useState(FORM_INICIAL)
  const [editandoId, setEditandoId] = useState(null)
  const [preview, setPreview] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [formError, setFormError] = useState(null)
  const [formExito, setFormExito] = useState(null)

  const [eliminandoId, setEliminandoId] = useState(null)
  const [confirmEliminar, setConfirmEliminar] = useState(null)

  const fileRef = useRef(null)

  const cargarRamos = () => {
    setLoadingRamos(true)
    api.get('/api/ramos')
      .then(({ data }) => setRamos(data.ramos || []))
      .catch(() => setError('Error al cargar ramos.'))
      .finally(() => setLoadingRamos(false))
  }

  const cargarVisitas = async () => {
    const { data } = await supabase
      .from('config')
      .select('valor')
      .eq('clave', 'visitas_pagina')
      .single()
    if (data) setVisitas(Number(data.valor))
  }

  useEffect(() => {
    cargarRamos()
    cargarVisitas()
  }, [])

  // Auto-activar promoción si precio >= 1500
  useEffect(() => {
    const precio = parseFloat(form.precio)
    if (!isNaN(precio) && precio >= 1500 && !form.en_promocion) {
      setForm((f) => ({ ...f, en_promocion: true }))
    }
  }, [form.precio])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // ── Toggle disponible ──
  const toggleDisponible = async (ramo) => {
    setRamos((prev) =>
      prev.map((r) => r.id === ramo.id ? { ...r, disponible: !r.disponible } : r)
    )
    try {
      await api.put(`/api/ramos/${ramo.id}`, { disponible: String(!ramo.disponible) })
    } catch {
      setRamos((prev) =>
        prev.map((r) => r.id === ramo.id ? { ...r, disponible: ramo.disponible } : r)
      )
    }
  }

  // ── Toggle en_promocion ──
  const togglePromocion = async (ramo) => {
    setRamos((prev) =>
      prev.map((r) => r.id === ramo.id ? { ...r, en_promocion: !r.en_promocion } : r)
    )
    try {
      await api.put(`/api/ramos/${ramo.id}`, { en_promocion: String(!ramo.en_promocion) })
    } catch {
      setRamos((prev) =>
        prev.map((r) => r.id === ramo.id ? { ...r, en_promocion: ramo.en_promocion } : r)
      )
    }
  }

  // ── Editar ──
  const iniciarEdicion = (ramo) => {
    setEditandoId(ramo.id)
    setForm({
      nombre: ramo.nombre || '',
      descripcion: ramo.descripcion || '',
      flores: ramo.flores || [],
      precio: ramo.precio || '',
      disponible: ramo.disponible,
      en_promocion: ramo.en_promocion || false,
      foto: null,
    })
    setPreview(ramo.foto_url || null)
    setFormError(null)
    setFormExito(null)
    setTab('form')
  }

  const cancelarEdicion = () => {
    setEditandoId(null)
    setForm(FORM_INICIAL)
    setPreview(null)
    setFormError(null)
    setFormExito(null)
    setTab('catalogo')
    if (fileRef.current) fileRef.current.value = ''
  }

  // ── Foto preview ──
  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setFormError('La imagen no debe superar 5MB.')
      return
    }
    setForm((f) => ({ ...f, foto: file }))
    setPreview(URL.createObjectURL(file))
  }

  // ── Guardar ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setFormExito(null)

    if (!form.nombre.trim()) return setFormError('El nombre es requerido.')
    if (form.flores.length === 0) return setFormError('Agrega al menos una flor.')
    if (!editandoId && !form.foto) return setFormError('La foto es requerida.')

    setGuardando(true)
    try {
      const fd = new FormData()
      fd.append('nombre', form.nombre)
      fd.append('descripcion', form.descripcion)
      fd.append('flores', JSON.stringify(form.flores))
      fd.append('precio', form.precio)
      fd.append('disponible', String(form.disponible))
      fd.append('en_promocion', String(form.en_promocion))
      if (form.foto) fd.append('foto', form.foto)

      if (editandoId) {
        await api.put(`/api/ramos/${editandoId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setFormExito('Ramo actualizado correctamente.')
      } else {
        await api.post('/api/ramos', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setFormExito('Ramo agregado correctamente.')
      }

      cargarRamos()
      setTimeout(() => cancelarEdicion(), 1200)
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al guardar.')
    } finally {
      setGuardando(false)
    }
  }

  // ── Eliminar ──
  const confirmarEliminar = async () => {
    if (!confirmEliminar) return
    setEliminandoId(confirmEliminar.id)
    try {
      await api.delete(`/api/ramos/${confirmEliminar.id}`)
      setRamos((prev) => prev.filter((r) => r.id !== confirmEliminar.id))
    } catch {
      setError('No se pudo eliminar el ramo.')
    } finally {
      setEliminandoId(null)
      setConfirmEliminar(null)
    }
  }

  const ramosEnPromocion = ramos.filter((r) => r.en_promocion)

  return (
    <div className="min-h-screen bg-crema">
      {/* Header Admin */}
      <header className="bg-gradient-to-r from-cafe-oscuro to-verde-marino text-crema px-6 py-4
                         flex items-center justify-between shadow-lg sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FLOR DE SIL"
            className="w-10 h-10 object-cover rounded-full border-2 border-cafe-claro/50" />
          <div>
            <h1 className="font-playfair text-base font-bold tracking-wide">Panel de Administración</h1>
            <p className="font-lato text-xs text-verde-pistache">FLOR DE SIL</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="font-lato text-sm border border-crema/30 hover:border-crema/70
                     hover:bg-white/10 text-crema px-4 py-2 rounded-xl
                     transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Widget de visitas ── */}
        {visitas !== null && (
          <div className="mb-6 bg-gradient-to-r from-verde-marino to-cafe-oscuro
                          rounded-2xl p-5 flex items-center gap-5 shadow-lg animate-fade-in-down">
            <div className="w-12 h-12 rounded-full bg-cafe-claro/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-cafe-claro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <p className="font-lato text-xs text-verde-pistache uppercase tracking-widest mb-0.5">
                Visitas totales a la página
              </p>
              <p className="font-playfair font-bold text-3xl text-crema animate-count-up">
                {visitas.toLocaleString('es-MX')}
              </p>
            </div>
            <button
              onClick={cargarVisitas}
              title="Actualizar"
              className="ml-auto p-2 rounded-lg hover:bg-white/10 text-verde-pistache
                         transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => { setTab('catalogo'); setEditandoId(null); setForm(FORM_INICIAL); setPreview(null) }}
            className={`font-lato font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-300
              ${tab === 'catalogo'
                ? 'bg-cafe-oscuro text-crema shadow-lg'
                : 'text-cafe-oscuro bg-white border border-crema-oscura hover:bg-crema-oscura'}`}
          >
            Catálogo
          </button>
          <button
            onClick={() => { setTab('form'); setEditandoId(null); setForm(FORM_INICIAL); setPreview(null); setFormError(null); setFormExito(null) }}
            className={`font-lato font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-300
              flex items-center gap-2
              ${tab === 'form'
                ? 'bg-cafe-oscuro text-crema shadow-lg'
                : 'text-cafe-oscuro bg-white border border-crema-oscura hover:bg-crema-oscura'}`}
          >
            <span className="text-lg leading-none">+</span> Agregar Ramo
          </button>
          <button
            onClick={() => setTab('promociones')}
            className={`font-lato font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-300
              flex items-center gap-2
              ${tab === 'promociones'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-lg'
                : 'text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100'}`}
          >
            🏷️ Promociones
            {ramosEnPromocion.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                ${tab === 'promociones' ? 'bg-white/30 text-white' : 'bg-amber-500 text-white'}`}>
                {ramosEnPromocion.length}
              </span>
            )}
          </button>
        </div>

        {/* ── TAB CATÁLOGO ── */}
        {tab === 'catalogo' && (
          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 font-lato text-sm">
                {error}
              </div>
            )}

            {loadingRamos ? (
              <Spinner size="lg" />
            ) : ramos.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-6xl block mb-4">🌸</span>
                <p className="font-playfair text-cafe-oscuro text-lg">No hay ramos aún.</p>
                <button
                  onClick={() => setTab('form')}
                  className="mt-4 bg-verde-bosque text-white font-lato font-bold px-6 py-2 rounded-lg hover:bg-verde-marino transition-colors"
                >
                  Agregar primer ramo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {ramos.map((ramo) => (
                  <div
                    key={ramo.id}
                    className="bg-white rounded-xl shadow-[0_2px_12px_rgba(59,31,14,0.08)]
                               flex items-center gap-4 p-4 transition-all duration-300
                               hover:shadow-[0_4px_20px_rgba(59,31,14,0.14)]"
                  >
                    {/* Foto miniatura */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-crema-oscura">
                      {ramo.foto_url ? (
                        <img src={ramo.foto_url} alt={ramo.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl opacity-40">🌸</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-playfair font-semibold text-cafe-oscuro truncate">{ramo.nombre}</p>
                        {ramo.en_promocion && (
                          <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200
                                           font-lato font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                            🏷️ Oferta
                          </span>
                        )}
                      </div>
                      <p className="font-lato font-light text-xs text-cafe-medio truncate">
                        {ramo.flores?.join(', ')}
                      </p>
                      {ramo.precio && (
                        <p className={`font-lato font-bold text-sm
                          ${ramo.en_promocion ? 'text-amber-600' : 'text-cafe-claro'}`}>
                          ${Number(ramo.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                        </p>
                      )}
                    </div>

                    {/* Toggle disponible */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleDisponible(ramo)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                          ${ramo.disponible ? 'bg-verde-pistache' : 'bg-gray-300'}`}
                        title={ramo.disponible ? 'Deshabilitar' : 'Habilitar'}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200
                          ${ramo.disponible ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className="text-xs font-lato text-cafe-medio">
                        {ramo.disponible ? 'Visible' : 'Oculto'}
                      </span>
                    </div>

                    {/* Toggle promoción */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => togglePromocion(ramo)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                          ${ramo.en_promocion ? 'bg-amber-400' : 'bg-gray-300'}`}
                        title={ramo.en_promocion ? 'Quitar oferta' : 'Activar oferta'}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200
                          ${ramo.en_promocion ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className="text-xs font-lato text-cafe-medio">
                        {ramo.en_promocion ? 'Oferta' : 'Normal'}
                      </span>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => iniciarEdicion(ramo)}
                        title="Editar"
                        className="p-2 rounded-lg hover:bg-crema-oscura text-cafe-medio transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setConfirmEliminar(ramo)}
                        title="Eliminar"
                        className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB PROMOCIONES ── */}
        {tab === 'promociones' && (
          <div>
            <div className="mb-6">
              <h2 className="font-playfair text-2xl font-bold text-cafe-oscuro mb-1">Gestión de Promociones</h2>
              <p className="font-lato font-light text-sm text-cafe-medio">
                Los ramos con precio ≥ $1,500 MXN se marcan como oferta automáticamente al crearlos.
                Puedes activar o desactivar manualmente desde aquí.
              </p>
            </div>

            {loadingRamos ? (
              <Spinner size="lg" />
            ) : ramos.length === 0 ? (
              <p className="text-cafe-medio font-lato text-center py-16">No hay ramos registrados.</p>
            ) : (
              <div className="space-y-4">
                {ramos.map((ramo) => (
                  <div
                    key={ramo.id}
                    className={`rounded-xl p-4 flex items-center gap-4 transition-all duration-300
                      border-2 ${ramo.en_promocion
                        ? 'bg-amber-50 border-amber-300 shadow-[0_2px_16px_rgba(251,191,36,0.2)]'
                        : 'bg-white border-transparent shadow-[0_2px_12px_rgba(59,31,14,0.08)]'}`}
                  >
                    {/* Foto */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-crema-oscura">
                      {ramo.foto_url ? (
                        <img src={ramo.foto_url} alt={ramo.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl opacity-40">🌸</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-playfair font-semibold text-cafe-oscuro truncate">{ramo.nombre}</p>
                      {ramo.precio && (
                        <p className={`font-lato font-bold text-sm ${ramo.en_promocion ? 'text-amber-600' : 'text-cafe-claro'}`}>
                          ${Number(ramo.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                          {Number(ramo.precio) >= 1500 && (
                            <span className="ml-2 text-xs text-amber-500 font-normal">≥ $1,500</span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Estado y toggle */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`font-lato font-bold text-xs px-3 py-1 rounded-full
                        ${ramo.en_promocion
                          ? 'bg-amber-400 text-white'
                          : 'bg-gray-100 text-cafe-medio'}`}>
                        {ramo.en_promocion ? '🏷️ En oferta' : 'Sin oferta'}
                      </span>
                      <button
                        onClick={() => togglePromocion(ramo)}
                        className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-200
                          ${ramo.en_promocion ? 'bg-amber-400' : 'bg-gray-300'}`}
                        style={{ width: '52px' }}
                        title={ramo.en_promocion ? 'Desactivar oferta' : 'Activar oferta'}
                      >
                        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200
                          ${ramo.en_promocion ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loadingRamos && ramosEnPromocion.length === 0 && ramos.length > 0 && (
              <div className="mt-8 text-center py-8 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-4xl block mb-3">🏷️</span>
                <p className="font-playfair text-cafe-oscuro font-semibold mb-1">Sin ofertas activas</p>
                <p className="font-lato font-light text-sm text-cafe-medio">
                  Activa el toggle en cualquier ramo para marcarlo como oferta especial.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB FORMULARIO ── */}
        {tab === 'form' && (
          <form onSubmit={handleSubmit} className="max-w-xl">
            <h2 className="font-playfair text-2xl font-bold text-cafe-oscuro mb-6">
              {editandoId ? 'Editar Ramo' : 'Agregar Ramo'}
            </h2>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 font-lato text-sm">
                {formError}
              </div>
            )}
            {formExito && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 font-lato text-sm">
                {formExito}
              </div>
            )}

            <div className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block font-lato font-bold text-sm text-cafe-oscuro mb-1">
                  Nombre del ramo *
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Ramo Primaveral"
                  className="w-full border border-crema-oscura rounded-lg px-3 py-2.5
                             font-playfair text-cafe-oscuro bg-crema
                             focus:outline-none focus:ring-2 focus:ring-cafe-claro"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block font-lato font-bold text-sm text-cafe-oscuro mb-1">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) setForm({ ...form, descripcion: e.target.value })
                  }}
                  rows={3}
                  placeholder="Describe el ramo brevemente..."
                  className="w-full border border-crema-oscura rounded-lg px-3 py-2.5
                             font-lato font-light text-sm text-cafe-oscuro bg-crema resize-none
                             focus:outline-none focus:ring-2 focus:ring-cafe-claro"
                />
                <p className="text-xs font-lato text-cafe-claro text-right mt-1">
                  {form.descripcion.length}/200
                </p>
              </div>

              {/* Flores */}
              <div>
                <label className="block font-lato font-bold text-sm text-cafe-oscuro mb-2">
                  Flores que contiene *
                </label>
                <FloresInput
                  flores={form.flores}
                  onChange={(flores) => setForm({ ...form, flores })}
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block font-lato font-bold text-sm text-cafe-oscuro mb-1">
                  Precio (MXN) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-lato text-cafe-claro font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    placeholder="350.00"
                    className="w-full pl-8 pr-4 py-2.5 border border-crema-oscura rounded-lg
                               font-lato text-cafe-oscuro bg-crema
                               focus:outline-none focus:ring-2 focus:ring-cafe-claro"
                  />
                </div>
                {parseFloat(form.precio) >= 1500 && (
                  <p className="mt-1.5 text-xs font-lato text-amber-600 flex items-center gap-1">
                    🏷️ Precio ≥ $1,500 — se activa oferta automáticamente
                  </p>
                )}
              </div>

              {/* Foto */}
              <div>
                <label className="block font-lato font-bold text-sm text-cafe-oscuro mb-2">
                  Foto del ramo {!editandoId && '*'}
                </label>
                {preview && (
                  <div className="mb-3 rounded-xl overflow-hidden aspect-[4/3] max-w-xs">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFoto}
                  className="block w-full font-lato text-sm text-cafe-oscuro
                             file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                             file:font-bold file:text-sm file:bg-cafe-oscuro file:text-crema
                             hover:file:bg-cafe-medio file:transition-colors file:cursor-pointer"
                />
                <p className="text-xs font-lato text-cafe-claro mt-1">JPG, PNG, WEBP — máx 5MB</p>
              </div>

              {/* Disponible toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, disponible: !form.disponible })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                    ${form.disponible ? 'bg-verde-pistache' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200
                    ${form.disponible ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="font-lato text-sm text-cafe-oscuro">
                  {form.disponible ? 'Disponible al guardar' : 'No disponible al guardar'}
                </span>
              </div>

              {/* Promoción toggle */}
              <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300
                ${form.en_promocion ? 'bg-amber-50 border-amber-200' : 'bg-white border-crema-oscura'}`}>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, en_promocion: !form.en_promocion })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                    ${form.en_promocion ? 'bg-amber-400' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200
                    ${form.en_promocion ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="font-lato text-sm text-cafe-oscuro">
                  {form.en_promocion ? '🏷️ Marcar como oferta especial' : 'Sin oferta'}
                </span>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 bg-verde-bosque hover:bg-verde-marino text-white font-lato font-bold
                             py-3 rounded-lg transition-colors duration-200 disabled:opacity-60"
                >
                  {guardando ? 'Guardando...' : 'Guardar Ramo'}
                </button>
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="px-6 py-3 border border-cafe-medio text-cafe-medio rounded-lg
                             hover:bg-crema-oscura transition-colors duration-200 font-lato text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Modal confirmar eliminar */}
      {confirmEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cafe-oscuro/70 backdrop-blur-sm">
          <div className="bg-crema rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-scale-in">
            <span className="text-4xl block mb-3">🗑️</span>
            <h3 className="font-playfair text-xl font-bold text-cafe-oscuro mb-2">
              ¿Eliminar ramo?
            </h3>
            <p className="font-lato font-light text-cafe-medio text-sm mb-6">
              ¿Eliminar el ramo <strong>"{confirmEliminar.nombre}"</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmarEliminar}
                disabled={eliminandoId === confirmEliminar.id}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-lato font-bold
                           py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-60"
              >
                {eliminandoId === confirmEliminar.id ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button
                onClick={() => setConfirmEliminar(null)}
                className="flex-1 border border-cafe-medio text-cafe-medio rounded-lg py-2.5
                           hover:bg-crema-oscura transition-colors font-lato text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
