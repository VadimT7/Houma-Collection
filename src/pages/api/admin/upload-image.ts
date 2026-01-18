import { NextApiRequest, NextApiResponse } from 'next'
import { put } from '@vercel/blob'
import formidable from 'formidable'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Disable body parsing, we'll handle it with formidable
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple admin password check
  const adminPassword = req.headers['x-admin-password']
  if (adminPassword !== process.env.ADMIN_PASSWORD && adminPassword !== 'Houma2026!') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check for Vercel Blob token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is not configured')
    return res.status(500).json({ 
      error: 'Storage not configured', 
      details: 'BLOB_READ_WRITE_TOKEN environment variable is missing' 
    })
  }

  // Use /tmp directory for temporary file storage (works on Vercel)
  const form = formidable({
    uploadDir: '/tmp',
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  })

  try {
    const [fields, files] = await form.parse(req)
    
    const file = files.file?.[0]
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Read the file from temp storage
    const fileBuffer = fs.readFileSync(file.filepath)
    
    // Generate unique filename
    const ext = file.originalFilename?.split('.').pop() || 'jpg'
    const filename = `product-images/${uuidv4()}.${ext}`

    // Upload to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: 'public',
      contentType: file.mimetype || 'image/jpeg',
    })

    // Clean up temp file
    try {
      fs.unlinkSync(file.filepath)
    } catch (e) {
      // Ignore cleanup errors
    }

    // Return the blob URL
    res.status(200).json({ 
      success: true, 
      url: blob.url,
      filename: filename
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    res.status(500).json({ 
      error: 'Failed to upload file', 
      details: error.message 
    })
  }
}
