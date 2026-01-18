import { query, queryOne } from './db'

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
  size: string
  color: string
  image: string
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  address: string
  apartment?: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

export interface Order {
  id: string // Unique ID for the order
  orderNumber: string
  paymentIntentId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: ShippingAddress
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

interface DbOrderRow {
  id: string
  order_number: string
  payment_intent_id: string
  items: OrderItem[]
  subtotal: string
  shipping: string
  tax: string
  total: string
  shipping_address: ShippingAddress
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}

// Convert database row to Order
function rowToOrder(row: DbOrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    paymentIntentId: row.payment_intent_id,
    items: row.items,
    subtotal: parseFloat(row.subtotal),
    shipping: parseFloat(row.shipping),
    tax: parseFloat(row.tax),
    total: parseFloat(row.total),
    shippingAddress: row.shipping_address,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// Create a new order
export async function createOrder(
  newOrder: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<Order> {
  const id = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  
  const rows = await query<DbOrderRow>(
    `INSERT INTO orders (
      id, order_number, payment_intent_id, items,
      subtotal, shipping, tax, total,
      shipping_address, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'confirmed')
    RETURNING *`,
    [
      id,
      newOrder.orderNumber,
      newOrder.paymentIntentId,
      JSON.stringify(newOrder.items),
      newOrder.subtotal,
      newOrder.shipping,
      newOrder.tax,
      newOrder.total,
      JSON.stringify(newOrder.shippingAddress)
    ]
  )
  
  return rowToOrder(rows[0])
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const row = await queryOne<DbOrderRow>(
    'SELECT * FROM orders WHERE id = $1',
    [orderId]
  )
  return row ? rowToOrder(row) : undefined
}

// Get order by order number
export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined> {
  const row = await queryOne<DbOrderRow>(
    'SELECT * FROM orders WHERE order_number = $1',
    [orderNumber]
  )
  return row ? rowToOrder(row) : undefined
}

// Get all orders
export async function getAllOrders(): Promise<Order[]> {
  const rows = await query<DbOrderRow>(
    'SELECT * FROM orders ORDER BY created_at DESC'
  )
  return rows.map(rowToOrder)
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<Order | null> {
  const rows = await query<DbOrderRow>(
    `UPDATE orders SET status = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 RETURNING *`,
    [orderId, status]
  )
  return rows.length > 0 ? rowToOrder(rows[0]) : null
}

// Search orders by email or order number
export async function searchOrders(searchTerm: string): Promise<Order[]> {
  const rows = await query<DbOrderRow>(
    `SELECT * FROM orders 
     WHERE order_number ILIKE $1 
     OR shipping_address->>'email' ILIKE $1
     OR shipping_address->>'firstName' ILIKE $1
     OR shipping_address->>'lastName' ILIKE $1
     ORDER BY created_at DESC`,
    [`%${searchTerm}%`]
  )
  return rows.map(rowToOrder)
}

// Get orders by status
export async function getOrdersByStatus(status: Order['status']): Promise<Order[]> {
  const rows = await query<DbOrderRow>(
    'SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC',
    [status]
  )
  return rows.map(rowToOrder)
}

// Get order count by status
export async function getOrderCountByStatus(): Promise<{ [key: string]: number }> {
  const rows = await query<{ status: string; count: string }>(
    'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
  )
  const counts: { [key: string]: number } = {}
  rows.forEach(row => {
    counts[row.status] = parseInt(row.count)
  })
  return counts
}
