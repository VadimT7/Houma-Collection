import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Disable body parsing, we'll handle it with formidable
export const config = {
  api: {
    bodyParser: false,
  },
}

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'product-images')

// Ensure upload directory exists
function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple admin password check (in production, use proper auth)
  const adminPassword = req.headers['x-admin-password']
  if (adminPassword !== process.env.ADMIN_PASSWORD && adminPassword !== 'houma-admin-2024') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  ensureUploadDir()

  const form = formidable({
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  })

  try {
    const [fields, files] = await form.parse(req)
    
    const file = files.file?.[0]
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Generate unique filename
    const ext = path.extname(file.originalFilename || '.jpg')
    const newFilename = `${uuidv4()}${ext}`
    const newPath = path.join(UPLOAD_DIR, newFilename)

    // Rename file to new unique name
    fs.renameSync(file.filepath, newPath)

    // Return the public URL
    const imageUrl = `/product-images/${newFilename}`

    res.status(200).json({ 
      success: true, 
      url: imageUrl,
      filename: newFilename
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload file', details: error.message })
  }
}

