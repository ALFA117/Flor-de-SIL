import { Router } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import supabase from '../lib/supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// GET /api/ramos — público
router.get('/', async (req, res) => {
  try {
    let query = supabase
      .from('ramos')
      .select('*')
      .order('creado_en', { ascending: false })

    if (req.query.soloDisponibles === 'true') {
      query = query.eq('disponible', true)
    }

    const { data, error } = await query

    if (error) throw error

    res.json({ ramos: data })
  } catch (err) {
    console.error('Error al obtener ramos:', err)
    res.status(500).json({ error: 'Error al obtener ramos.' })
  }
})

// POST /api/ramos — protegido
router.post('/', authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const { nombre, descripcion, flores, precio, disponible } = req.body

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido.' })
    }

    let foto_url = null
    let foto_path = null

    if (req.file) {
      const ext = req.file.mimetype.split('/')[1]
      foto_path = `fotos/${uuidv4()}-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('ramos')
        .upload(foto_path, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('ramos')
        .getPublicUrl(foto_path)

      foto_url = urlData.publicUrl
    }

    const floresArray = flores ? JSON.parse(flores) : []

    const { data, error } = await supabase
      .from('ramos')
      .insert({
        nombre,
        descripcion: descripcion || null,
        flores: floresArray,
        precio: precio ? parseFloat(precio) : null,
        foto_url,
        foto_path,
        disponible: disponible === 'true' || disponible === true,
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ ramo: data })
  } catch (err) {
    console.error('Error al crear ramo:', err)
    res.status(500).json({ error: 'Error al crear ramo.' })
  }
})

// PUT /api/ramos/:id — protegido
router.put('/:id', authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, flores, precio, disponible } = req.body

    // Obtener ramo actual para foto_path
    const { data: ramoActual, error: fetchError } = await supabase
      .from('ramos')
      .select('foto_path')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const updates = {}

    if (nombre !== undefined) updates.nombre = nombre
    if (descripcion !== undefined) updates.descripcion = descripcion
    if (flores !== undefined) updates.flores = JSON.parse(flores)
    if (precio !== undefined) updates.precio = precio ? parseFloat(precio) : null
    if (disponible !== undefined) updates.disponible = disponible === 'true' || disponible === true

    if (req.file) {
      // Borrar foto anterior si existe
      if (ramoActual?.foto_path) {
        await supabase.storage.from('ramos').remove([ramoActual.foto_path])
      }

      const ext = req.file.mimetype.split('/')[1]
      const foto_path = `fotos/${uuidv4()}-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('ramos')
        .upload(foto_path, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('ramos')
        .getPublicUrl(foto_path)

      updates.foto_url = urlData.publicUrl
      updates.foto_path = foto_path
    }

    const { data, error } = await supabase
      .from('ramos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ ramo: data })
  } catch (err) {
    console.error('Error al actualizar ramo:', err)
    res.status(500).json({ error: 'Error al actualizar ramo.' })
  }
})

// DELETE /api/ramos/:id — protegido
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    // Obtener foto_path antes de borrar
    const { data: ramo, error: fetchError } = await supabase
      .from('ramos')
      .select('foto_path')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    if (ramo?.foto_path) {
      await supabase.storage.from('ramos').remove([ramo.foto_path])
    }

    const { error } = await supabase.from('ramos').delete().eq('id', id)

    if (error) throw error

    res.json({ mensaje: 'Ramo eliminado' })
  } catch (err) {
    console.error('Error al eliminar ramo:', err)
    res.status(500).json({ error: 'Error al eliminar ramo.' })
  }
})

export default router
