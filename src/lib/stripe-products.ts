import { create } from 'zustand'
import { Product } from './store'

interface ProductStore {
  products: Product[]
  isLoading: boolean
  error: string | null
  lastFetch: number | null
  fetchProducts: () => Promise<void>
  getProductById: (id: string) => Product | undefined
  getFeaturedProducts: () => Product[]
  getProductsByCategory: (category: string) => Product[]
  getProductsByCollection: (collection: string) => Product[]
  getCategories: () => string[]
  getCollections: () => string[]
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  lastFetch: null,

  fetchProducts: async () => {
    const state = get()
    
    // Check if we have cached data that's still fresh
    if (state.lastFetch && Date.now() - state.lastFetch < CACHE_DURATION && state.products.length > 0) {
      return // Use cached data
    }

    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const products = await response.json()
      
      set({ 
        products, 
        isLoading: false,
        lastFetch: Date.now()
      })
    } catch (error: any) {
      console.error('Error fetching products:', error)
      set({ 
        error: error.message || 'Failed to fetch products',
        isLoading: false 
      })
      
      // Fall back to empty array if fetch fails
      set({ products: [] })
    }
  },

  getProductById: (id: string) => {
    return get().products.find(product => product.id === id)
  },

  getFeaturedProducts: () => {
    return get().products.filter(product => product.featured)
  },

  getProductsByCategory: (category: string) => {
    return get().products.filter(product => product.category === category)
  },

  getProductsByCollection: (collection: string) => {
    return get().products.filter(product => product.collection === collection)
  },

  getCategories: () => {
    const products = get().products
    const categories = [...new Set(products.map(p => p.category))]
    return categories.sort()
  },

  getCollections: () => {
    const products = get().products
    const collections = [...new Set(products.map(p => p.collection))]
    return collections.sort()
  },
}))

// Helper hook to ensure products are loaded
export function useProducts() {
  const store = useProductStore()
  
  // Fetch products on mount if not already loaded
  if (!store.lastFetch && !store.isLoading) {
    store.fetchProducts()
  }
  
  return store
}
