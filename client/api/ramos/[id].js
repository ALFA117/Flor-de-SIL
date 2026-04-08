import { IncomingForm } from 'formidable'
import { readFileSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import supabase from '../_lib/supabase.js'
import { verifyToken } from '../_lib/auth.js'

export const config = { api: { bodyParser: false } }

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 4.5 * 1024 * 1024,
    })
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    verifyToken(req)
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message })
  }

  const { id } = req.query

  // PUT
  if (req.method === 'PUT') {
    try {
      const { fields, files } = await parseForm(req)

      const { data: ramoActual, error: fetchError } = await supabase
        .from('ramos')
        .select('foto_path')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      const updates = {}

      const nombre     = Array.isArray(fields.nombre)     ? fields.nombre[0]     : fields.nombre
      const descripcion= Array.isArray(fields.descripcion)? fields.descripcion[0]: fields.descripcion
      const precio     = Array.isArray(fields.precio)     ? fields.precio[0]     : fields.precio
      const disponible = Array.isArray(fields.disponible) ? fields.disponible[0] : fields.disponible
      const floresRaw  = Array.isArray(fields.flores)     ? fields.flores[0]     : fields.flores

      if (nombre      !== undefined) updates.nombre      = nombre
      if (descripcion !== undefined) updates.descripcion = descripcion
      if (floresRaw   !== undefined) updates.flores      = JSON.parse(floresRaw)
      if (precio      !== undefined) updates.precio      = precio ? parseFloat(precio) : null
      if (disponible  !== undefined) updates.disponible  = disponible === 'true'

      const fotoFile = files.foto?.[0] || files.foto
      if (fotoFile) {
        if (ramoActual?.foto_path) {
          await supabase.storage.from('ramos').remove([ramoActual.foto_path])
        }
        const buffer = readFileSync(fotoFile.filepath)
        const ext = fotoFile.mimetype?.split('/')[1] || 'jpg'
        const foto_path = `fotos/${uuidv4()}-${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('ramos')
          .upload(foto_path, buffer, { contentType: fotoFile.mimetype, upsert: false })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from('ramos').getPublicUrl(foto_path)
        updates.foto_url  = urlData.publicUrl
        updates.foto_path = foto_path
      }

      const { data, error } = await supabase
        .from('ramos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return res.json({ ramo: data })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al actualizar ramo.' })
    }
  }

  // DELETE
  if (req.method === 'DELETE') {
    try {
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

      return res.json({ mensaje: 'Ramo eliminado' })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al eliminar ramo.' })
    }
  }

  res.status(405).json({ error: 'Método no permitido' })
}
