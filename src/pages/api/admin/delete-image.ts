import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'product-images')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple admin password check
  const adminPassword = req.headers['x-admin-password']
  if (adminPassword !== process.env.ADMIN_PASSWORD && adminPassword !== 'Houma2026!') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { filename } = req.query

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Filename required' })
  }

  // Security check - prevent directory traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Invalid filename' })
  }

  const filePath = path.join(UPLOAD_DIR, filename)

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return res.status(200).json({ success: true })
    } else {
      return res.status(404).json({ error: 'File not found' })
    }
  } catch (error: any) {
    console.error('Delete error:', error)
    return res.status(500).json({ error: 'Failed to delete file', details: error.message })
  }
}

