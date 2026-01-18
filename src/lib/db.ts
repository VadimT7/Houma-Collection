import { Pool } from 'pg'

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

export default pool

// Helper function to run queries
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows as T[]
  } finally {
    client.release()
  }
}

// Helper function to run a single query and get one result
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] || null
}

// Initialize database tables
export async function initializeDatabase(): Promise<void> {
  const client = await pool.connect()
  try {
    // Create products_local table for storing product metadata
    await client.query(`
      CREATE TABLE IF NOT EXISTS products_local (
        product_id VARCHAR(255) PRIMARY KEY,
        default_images JSONB DEFAULT '[]',
        color_images JSONB DEFAULT '{}',
        category VARCHAR(255),
        collection VARCHAR(255),
        colors JSONB DEFAULT '[]',
        sizes JSONB DEFAULT '[]',
        cultural_story TEXT,
        featured BOOLEAN DEFAULT false,
        in_stock BOOLEAN DEFAULT true,
        stock JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        order_number VARCHAR(255) UNIQUE NOT NULL,
        payment_intent_id VARCHAR(255),
        items JSONB NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        shipping DECIMAL(10, 2) NOT NULL,
        tax DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        shipping_address JSONB NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create index on order_number for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number)
    `)

    // Create index on status for filtering
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)
    `)

    // Create waitlist table
    await client.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create index on email for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email)
    `)

    console.log('Database tables initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  } finally {
    client.release()
  }
}
