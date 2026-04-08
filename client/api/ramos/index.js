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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  // GET — público
  if (req.method === 'GET') {
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
      return res.json({ ramos: data })
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener ramos.' })
    }
  }

  // POST — protegido
  if (req.method === 'POST') {
    try {
      verifyToken(req)
    } catch (err) {
      return res.status(err.status || 401).json({ error: err.message })
    }

    try {
      const { fields, files } = await parseForm(req)

      const nombre = Array.isArray(fields.nombre) ? fields.nombre[0] : fields.nombre
      if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' })

      const descripcion = Array.isArray(fields.descripcion) ? fields.descripcion[0] : fields.descripcion
      const precio      = Array.isArray(fields.precio)      ? fields.precio[0]      : fields.precio
      const disponible  = Array.isArray(fields.disponible)  ? fields.disponible[0]  : fields.disponible
      const floresRaw   = Array.isArray(fields.flores)      ? fields.flores[0]      : fields.flores
      const floresArray = floresRaw ? JSON.parse(floresRaw) : []

      let foto_url = null
      let foto_path = null

      const fotoFile = files.foto?.[0] || files.foto
      if (fotoFile) {
        const buffer = readFileSync(fotoFile.filepath)
        const ext = fotoFile.mimetype?.split('/')[1] || 'jpg'
        foto_path = `fotos/${uuidv4()}-${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('ramos')
          .upload(foto_path, buffer, { contentType: fotoFile.mimetype, upsert: false })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from('ramos').getPublicUrl(foto_path)
        foto_url = urlData.publicUrl
      }

      const { data, error } = await supabase
        .from('ramos')
        .insert({
          nombre,
          descripcion: descripcion || null,
          flores: floresArray,
          precio: precio ? parseFloat(precio) : null,
          foto_url,
          foto_path,
          disponible: disponible === 'true',
        })
        .select()
        .single()

      if (error) throw error
      return res.status(201).json({ ramo: data })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al crear ramo.' })
    }
  }

  res.status(405).json({ error: 'Método no permitido' })
}
