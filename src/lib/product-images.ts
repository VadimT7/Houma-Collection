import { query, queryOne } from './db'

export type StockData = { [color: string]: { [size: string]: number } }

export interface ProductLocalData {
  productId: string
  // Images
  defaultImages: string[]  // Default product images
  colorImages: { [color: string]: string[] }  // Color-specific images
  // Product metadata (can override Stripe)
  category?: string
  collection?: string
  colors?: string[]
  sizes?: string[]
  culturalStory?: string
  featured?: boolean
  inStock?: boolean  // Overall in stock status (computed from stock data)
  stock?: StockData
  // Timestamps
  updatedAt: string
}

// Keep old interface name for backwards compatibility
export type ProductImageData = ProductLocalData

interface DbProductRow {
  product_id: string
  default_images: string[]
  color_images: { [color: string]: string[] }
  category: string | null
  collection: string | null
  colors: string[]
  sizes: string[]
  cultural_story: string | null
  featured: boolean
  in_stock: boolean
  stock: StockData
  created_at: string
  updated_at: string
}

// Convert database row to ProductLocalData
function rowToProductData(row: DbProductRow): ProductLocalData {
  return {
    productId: row.product_id,
    defaultImages: row.default_images || [],
    colorImages: row.color_images || {},
    category: row.category || undefined,
    collection: row.collection || undefined,
    colors: row.colors || [],
    sizes: row.sizes || [],
    culturalStory: row.cultural_story || undefined,
    featured: row.featured,
    inStock: row.in_stock,
    stock: row.stock || {},
    updatedAt: row.updated_at
  }
}

// Get data for a specific product
export async function getProductImages(productId: string): Promise<ProductLocalData | null> {
  const row = await queryOne<DbProductRow>(
    'SELECT * FROM products_local WHERE product_id = $1',
    [productId]
  )
  return row ? rowToProductData(row) : null
}

// Save data for a specific product
export async function saveProductImages(
  productId: string,
  data: Partial<Omit<ProductLocalData, 'productId' | 'updatedAt'>>
): Promise<ProductLocalData> {
  const existing = await getProductImages(productId)
  
  const defaultImages = data.defaultImages ?? existing?.defaultImages ?? []
  const colorImages = data.colorImages ?? existing?.colorImages ?? {}
  const category = data.category ?? existing?.category ?? null
  const collection = data.collection ?? existing?.collection ?? null
  const colors = data.colors ?? existing?.colors ?? []
  const sizes = data.sizes ?? existing?.sizes ?? []
  const culturalStory = data.culturalStory ?? existing?.culturalStory ?? null
  const featured = data.featured ?? existing?.featured ?? false
  const inStock = data.inStock ?? existing?.inStock ?? true
  const stock = data.stock ?? existing?.stock ?? {}

  if (existing) {
    // Update existing record
    await query(
      `UPDATE products_local SET
        default_images = $2,
        color_images = $3,
        category = $4,
        collection = $5,
        colors = $6,
        sizes = $7,
        cultural_story = $8,
        featured = $9,
        in_stock = $10,
        stock = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $1`,
      [
        productId,
        JSON.stringify(defaultImages),
        JSON.stringify(colorImages),
        category,
        collection,
        JSON.stringify(colors),
        JSON.stringify(sizes),
        culturalStory,
        featured,
        inStock,
        JSON.stringify(stock)
      ]
    )
  } else {
    // Insert new record
    await query(
      `INSERT INTO products_local (
        product_id, default_images, color_images, category, collection,
        colors, sizes, cultural_story, featured, in_stock, stock
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        productId,
        JSON.stringify(defaultImages),
        JSON.stringify(colorImages),
        category,
        collection,
        JSON.stringify(colors),
        JSON.stringify(sizes),
        culturalStory,
        featured,
        inStock,
        JSON.stringify(stock)
      ]
    )
  }

  // Return the updated data
  const updated = await getProductImages(productId)
  return updated!
}

// Delete data for a specific product
export async function deleteProductImages(productId: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM products_local WHERE product_id = $1 RETURNING product_id',
    [productId]
  )
  return result.length > 0
}

// Get all products with data
export async function getAllProductImages(): Promise<ProductLocalData[]> {
  const rows = await query<DbProductRow>(
    'SELECT * FROM products_local ORDER BY updated_at DESC'
  )
  return rows.map(rowToProductData)
}

// Get stock for a specific size+color combination
export async function getProductStock(productId: string, color: string, size: string): Promise<number> {
  const data = await getProductImages(productId)
  if (!data?.stock?.[color]?.[size]) {
    return 0
  }
  return data.stock[color][size]
}

// Update stock for a specific size+color combination
export async function updateProductStock(
  productId: string,
  color: string,
  size: string,
  quantity: number
): Promise<ProductLocalData | null> {
  const data = await getProductImages(productId)
  if (!data) {
    return null
  }
  
  // Initialize stock structure if needed
  const stock = data.stock || {}
  if (!stock[color]) {
    stock[color] = {}
  }
  
  stock[color][size] = Math.max(0, quantity) // Never go below 0
  
  return saveProductImages(productId, { stock })
}

// Deduct stock after purchase
export async function deductProductStock(
  productId: string,
  color: string,
  size: string,
  quantity: number
): Promise<boolean> {
  const data = await getProductImages(productId)
  if (!data || !data.stock?.[color]?.[size] || data.stock[color][size] < quantity) {
    return false // Not enough stock
  }
  
  const stock = data.stock
  stock[color][size] -= quantity
  
  await saveProductImages(productId, { stock })
  return true
}

// Check if a size+color combo is in stock
export async function isProductVariantInStock(
  productId: string,
  color: string,
  size: string
): Promise<boolean> {
  const stockCount = await getProductStock(productId, color, size)
  return stockCount > 0
}

// Get all stock data for a product
export async function getProductStockData(productId: string): Promise<StockData | null> {
  const data = await getProductImages(productId)
  return data?.stock || null
}
