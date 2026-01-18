import { NextApiRequest, NextApiResponse } from 'next'
import { initializeDatabase } from '@/lib/db'
import { saveProductImages } from '@/lib/product-images'
import fs from 'fs'
import path from 'path'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple admin password check
  const adminPassword = req.headers['x-admin-password']
  if (adminPassword !== process.env.ADMIN_PASSWORD && adminPassword !== 'houma-admin-2024') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Initialize database tables
    console.log('Initializing database tables...')
    await initializeDatabase()

    // Check if we should migrate existing data
    const { migrate } = req.body

    if (migrate) {
      console.log('Migrating existing data from JSON files...')
      
      // Try to read existing product-images.json
      const dataFile = path.join(process.cwd(), 'data', 'product-images.json')
      
      if (fs.existsSync(dataFile)) {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
        const products = data.products || {}
        
        let migratedCount = 0
        for (const [productId, productData] of Object.entries(products)) {
          const pd = productData as any
          await saveProductImages(productId, {
            defaultImages: pd.defaultImages || [],
            colorImages: pd.colorImages || {},
            category: pd.category,
            collection: pd.collection,
            colors: pd.colors || [],
            sizes: pd.sizes || [],
            culturalStory: pd.culturalStory,
            featured: pd.featured || false,
            inStock: pd.inStock ?? true,
            stock: pd.stock || {}
          })
          migratedCount++
          console.log(`Migrated product: ${productId}`)
        }
        
        return res.status(200).json({
          success: true,
          message: `Database initialized and ${migratedCount} products migrated successfully`
        })
      } else {
        return res.status(200).json({
          success: true,
          message: 'Database initialized. No existing data file found to migrate.'
        })
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Database initialized successfully'
    })
  } catch (error: any) {
    console.error('Database initialization error:', error)
    return res.status(500).json({
      error: 'Failed to initialize database',
      details: error.message
    })
  }
}

