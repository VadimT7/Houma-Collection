import { NextApiRequest, NextApiResponse } from 'next'
import { createOrder, OrderItem, ShippingAddress } from '@/lib/orders'
import { deductProductStock } from '@/lib/product-images'

interface CreateOrderRequest {
  orderNumber: string
  paymentIntentId: string
  items: {
    productId: string
    name: string
    color: string
    size: string
    quantity: number
    price: number
    image?: string
  }[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: ShippingAddress
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const orderData: CreateOrderRequest = req.body

    // Validate required fields
    if (!orderData.orderNumber || !orderData.paymentIntentId || !orderData.items?.length) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['orderNumber', 'paymentIntentId', 'items']
      })
    }

    // Deduct stock for each item
    const stockDeductionResults: { productId: string; color: string; size: string; success: boolean }[] = []
    
    for (const item of orderData.items) {
      const success = await deductProductStock(item.productId, item.color, item.size, item.quantity)
      stockDeductionResults.push({
        productId: item.productId,
        color: item.color,
        size: item.size,
        success
      })
      
      if (!success) {
        console.warn(`Failed to deduct stock for ${item.name} (${item.color}/${item.size})`)
      }
    }

    // Create order items matching the OrderItem interface
    const orderItems: OrderItem[] = orderData.items.map(item => ({
      productId: item.productId,
      name: item.name,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      image: item.image || ''
    }))

    // Create the order
    const order = await createOrder({
      orderNumber: orderData.orderNumber,
      paymentIntentId: orderData.paymentIntentId,
      items: orderItems,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress
    })

    console.log(`Order ${order.id} created successfully`)

    return res.status(200).json({
      success: true,
      order,
      stockDeduction: stockDeductionResults
    })

  } catch (error: any) {
    console.error('Error creating order:', error)
    return res.status(500).json({
      error: 'Failed to create order',
      details: error.message
    })
  }
}
