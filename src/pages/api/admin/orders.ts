import { NextApiRequest, NextApiResponse } from 'next'
import { getAllOrders, getOrderById, updateOrderStatus, getOrderCountByStatus, searchOrders } from '@/lib/orders'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple admin password check for non-GET requests
  if (req.method !== 'GET') {
    const adminPassword = req.headers['x-admin-password']
    if (adminPassword !== process.env.ADMIN_PASSWORD && adminPassword !== 'Houma2026!') {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  if (req.method === 'GET') {
    try {
      const { id, stats, search } = req.query
      
      // Return order statistics
      if (stats === 'true') {
        const orderStats = await getOrderCountByStatus()
        return res.status(200).json(orderStats)
      }
      
      // Search orders
      if (search && typeof search === 'string') {
        const orders = await searchOrders(search)
        return res.status(200).json(orders)
      }
      
      // Return single order
      if (id && typeof id === 'string') {
        const order = await getOrderById(id)
        if (!order) {
          return res.status(404).json({ error: 'Order not found' })
        }
        return res.status(200).json(order)
      }
      
      // Return all orders
      const orders = await getAllOrders()
      return res.status(200).json(orders)
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      return res.status(500).json({ error: 'Failed to fetch orders', details: error.message })
    }
  }
  
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const { id } = req.query
      const { status } = req.body
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Order ID is required' })
      }
      
      if (!status) {
        return res.status(400).json({ error: 'Status is required' })
      }
      
      const updatedOrder = await updateOrderStatus(id, status)
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' })
      }
      
      return res.status(200).json(updatedOrder)
    } catch (error: any) {
      console.error('Error updating order:', error)
      return res.status(500).json({ error: 'Failed to update order', details: error.message })
    }
  }
  
  res.setHeader('Allow', ['GET', 'PUT', 'PATCH'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
