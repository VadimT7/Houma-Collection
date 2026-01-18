import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'product-images.json')

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
  inStock?: boolean
  // Timestamps
  updatedAt: string
}

// Keep old interface name for backwards compatibility
export type ProductImageData = ProductLocalData

interface ProductImagesStore {
  products: { [productId: string]: ProductLocalData }
}

// Ensure data directory and file exist
function ensureDataFile() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ products: {} }, null, 2))
  }
}

// Read the product images store
export function readProductImages(): ProductImagesStore {
  ensureDataFile()
  const data = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(data)
}

// Write to the product images store
export function writeProductImages(store: ProductImagesStore): void {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2))
}

// Get images for a specific product
export function getProductImages(productId: string): ProductImageData | null {
  const store = readProductImages()
  return store.products[productId] || null
}

// Save data for a specific product
export function saveProductImages(productId: string, data: Omit<ProductLocalData, 'productId' | 'updatedAt'>): ProductLocalData {
  const store = readProductImages()
  const existingData = store.products[productId] || {}
  
  const productData: ProductLocalData = {
    ...existingData,
    productId,
    defaultImages: data.defaultImages ?? existingData.defaultImages ?? [],
    colorImages: data.colorImages ?? existingData.colorImages ?? {},
    category: data.category ?? existingData.category,
    collection: data.collection ?? existingData.collection,
    colors: data.colors ?? existingData.colors,
    sizes: data.sizes ?? existingData.sizes,
    culturalStory: data.culturalStory ?? existingData.culturalStory,
    featured: data.featured ?? existingData.featured,
    inStock: data.inStock ?? existingData.inStock,
    updatedAt: new Date().toISOString()
  }
  store.products[productId] = productData
  writeProductImages(store)
  return productData
}

// Delete images for a specific product
export function deleteProductImages(productId: string): boolean {
  const store = readProductImages()
  if (store.products[productId]) {
    delete store.products[productId]
    writeProductImages(store)
    return true
  }
  return false
}

// Get all products with images
export function getAllProductImages(): ProductImageData[] {
  const store = readProductImages()
  return Object.values(store.products)
}

