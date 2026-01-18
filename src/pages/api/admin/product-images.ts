import { NextApiRequest, NextApiResponse } from 'next'
import { getProductImages, saveProductImages, getAllProductImages } from '@/lib/product-images'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple admin password check
  const adminPassword = req.headers['x-admin-password']
  if (adminPassword !== process.env.ADMIN_PASSWORD && adminPassword !== 'Houma2026!') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { productId } = req.query

  if (req.method === 'GET') {
    // Get data for a specific product or all products
    if (productId && typeof productId === 'string') {
      const data = await getProductImages(productId)
      return res.status(200).json(data || { 
        defaultImages: [], 
        colorImages: {},
        category: '',
        collection: '',
        colors: [],
        sizes: [],
        culturalStory: '',
        featured: false,
        inStock: true,
        stock: {}
      })
    } else {
      const allData = await getAllProductImages()
      return res.status(200).json(allData)
    }
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    // Save all product data
    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({ error: 'Product ID required' })
    }

    const { 
      defaultImages, 
      colorImages,
      category,
      collection,
      colors,
      sizes,
      culturalStory,
      featured,
      inStock,
      stock
    } = req.body

    const saved = await saveProductImages(productId, {
      defaultImages: defaultImages || [],
      colorImages: colorImages || {},
      category,
      collection,
      colors,
      sizes,
      culturalStory,
      featured,
      inStock,
      stock
    })

    return res.status(200).json(saved)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
