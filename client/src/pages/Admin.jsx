import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import FloresInput from '../components/FloresInput'
import Spinner from '../components/Spinner'

const FORM_INICIAL = {
  nombre: '',
  descripcion: '',
  flores: [],
  precio: '',
  disponible: true,
  foto: null,
}

export default function Admin() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('catalogo') // 'catalogo' | 'form'
  const [ramos, setRamos] = useState([])
  const [loadingRamos, setLoadingRamos] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState(FORM_INICIAL)
  const [editandoId, setEditandoId] = useState(null)
  const [preview, setPreview] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [formError, setFormError] = useState(null)
  const [formExito, setFormExito] = useState(null)

  const [eliminandoId, setEliminandoId] = useState(null)
  const [confirmEliminar, setConfirmEliminar] = useState(null) // ramo

  const fileRef = useRef(null)

  const cargarRamos = () => {
    setLoadingRamos(true)
    api.get('/api/ramos')
      .then(({ data }) => setRamos(data.ramos || []))
      .catch(() => setError('Error al cargar ramos.'))
      .finally(() => setLoadingRamos(false))
  }

  useEffect(() => { cargarRamos() }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // ── Toggle disponible ──
  const toggleDisponible = async (ramo) => {
    // Optimistic UI
    setRamos((prev) =>
      prev.map((r) => r.id === ramo.id ? { ...r, disponible: !r.disponible } : r)
    )
    try {
      await api.put(`/api/ramos/${ramo.id}`, { disponible: String(!ramo.disponible) })
    } catch {
      // Revertir
      setRamos((prev) =>
        prev.map((r) => r.id === ramo.id ? { ...r, disponible: ramo.disponible } : r)
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

  return (
    <div className="min-h-screen bg-crema">
      {/* Header Admin */}
      <header className="bg-gradient-to-r from-cafe-oscuro to-verde-marino text-crema px-6 py-4
                         flex items-center justify-between shadow-lg sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FLOR DE SIL"
            className="w-10 h-9 object-cover rounded-[50%] border-2 border-cafe-claro/50"
            style={{ objectPosition: 'center 25%' }} />
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
        {/* Tabs */}
        <div className="flex gap-3 mb-8">
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
                               flex items-center gap-4 p-4"
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
                      <p className="font-playfair font-semibold text-cafe-oscuro truncate">{ramo.nombre}</p>
                      <p className="font-lato font-light text-xs text-cafe-medio truncate">
                        {ramo.flores?.join(', ')}
                      </p>
                      {ramo.precio && (
                        <p className="font-lato font-bold text-cafe-claro text-sm">
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
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200
                            ${ramo.disponible ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                      <span className="text-xs font-lato text-cafe-medio">
                        {ramo.disponible ? 'Disponible' : 'Oculto'}
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
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200
                      ${form.disponible ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
                <span className="font-lato text-sm text-cafe-oscuro">
                  {form.disponible ? 'Disponible al guardar' : 'No disponible al guardar'}
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
          <div className="bg-crema rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
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
