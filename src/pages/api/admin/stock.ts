import { NextApiRequest, NextApiResponse } from 'next'
import { getProductImages, saveProductImages, getProductStock, updateProductStock, getProductStockData, StockData } from '@/lib/product-images'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { productId } = req.query

  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'Product ID is required' })
  }

  if (req.method === 'GET') {
    try {
      const { color, size } = req.query
      
      // Get specific stock for color+size
      if (color && size && typeof color === 'string' && typeof size === 'string') {
        const stock = await getProductStock(productId, color, size)
        return res.status(200).json({ productId, color, size, stock })
      }
      
      // Get all stock for product
      const allStock = await getProductStockData(productId)
      return res.status(200).json({ productId, stock: allStock || {} })
    } catch (error: any) {
      console.error('Error fetching stock:', error)
      return res.status(500).json({ error: 'Failed to fetch stock', details: error.message })
    }
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const { color, size, quantity, stockData } = req.body
      
      // Bulk update all stock data
      if (stockData && typeof stockData === 'object') {
        const productData = await getProductImages(productId)
        if (!productData) {
          return res.status(404).json({ error: 'Product not found' })
        }
        
        // Save the entire stock data object
        await saveProductImages(productId, {
          stock: stockData as StockData
        })
        
        return res.status(200).json({ 
          message: 'Stock updated successfully',
          productId,
          stock: stockData
        })
      }
      
      // Update single stock entry
      if (color && size && typeof quantity === 'number') {
        const result = await updateProductStock(productId, color, size, quantity)
        if (!result) {
          return res.status(404).json({ error: 'Product not found' })
        }
        
        return res.status(200).json({ 
          message: 'Stock updated successfully',
          productId,
          color,
          size,
          quantity
        })
      }
      
      return res.status(400).json({ error: 'Missing required fields: color, size, quantity OR stockData' })
    } catch (error: any) {
      console.error('Error updating stock:', error)
      return res.status(500).json({ error: 'Failed to update stock', details: error.message })
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
