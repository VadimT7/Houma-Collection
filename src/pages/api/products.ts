import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { getProductImages } from '@/lib/product-images'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export interface StripeProduct {
  id: string
  name: string
  price: number
  description: string
  culturalStory?: string
  images: string[]
  colorImages?: { [color: string]: string[] }  // Color-specific images
  sizes: string[]
  colors: string[]
  category: string
  collection: string
  inStock: boolean
  featured?: boolean
}

// Convert Stripe product to our format
function convertStripeProduct(
  product: Stripe.Product,
  price: Stripe.Price
): StripeProduct | null {
  // Skip archived or inactive products
  if (!product.active) return null

  // Extract metadata
  const metadata = product.metadata || {}
  
  // Parse arrays from metadata (stored as JSON strings in Stripe)
  const sizes = metadata.sizes ? JSON.parse(metadata.sizes) : ['One Size']
  const colors = metadata.colors ? JSON.parse(metadata.colors) : ['Default']
  
  // Normalize collection name - remove " Collection" suffix if present
  // This handles cases where Stripe metadata is "EL BIDAYA Collection" but code expects "EL BIDAYA"
  let collection = metadata.collection || 'General'
  if (collection.endsWith(' Collection')) {
    collection = collection.replace(' Collection', '')
  }
  
  // Build images array: main Stripe images + additional images from metadata
  // Stripe Dashboard only allows 1 image upload, so use metadata for additional images
  // Format in metadata: additionalImages: '["url1","url2","url3"]'
  let images = product.images || []
  if (metadata.additionalImages) {
    try {
      const additionalImages = JSON.parse(metadata.additionalImages)
      images = [...images, ...additionalImages]
    } catch (e) {
      console.error('Error parsing additionalImages metadata:', e)
    }
  }
  
  // Parse color-specific images from metadata
  // Format in metadata: colorImages: '{"Midnight Black":["url1","url2"],"Desert Sand":["url3","url4"]}'
  // This allows showing different product images when user selects different colors
  let colorImages: { [color: string]: string[] } | undefined
  if (metadata.colorImages) {
    try {
      colorImages = JSON.parse(metadata.colorImages)
    } catch (e) {
      console.error('Error parsing colorImages metadata:', e)
    }
  }
  
  // Check for locally stored data (from admin dashboard)
  // Local data takes priority over Stripe metadata
  let localCategory = metadata.category || 'Uncategorized'
  let localCollection = collection
  let localColors = colors
  let localSizes = sizes
  let localCulturalStory = metadata.culturalStory || ''
  let localFeatured = metadata.featured === 'true'
  let localInStock = metadata.inStock !== 'false'
  
  try {
    const localData = getProductImages(product.id)
    if (localData) {
      // If we have local default images, use those
      if (localData.defaultImages && localData.defaultImages.length > 0) {
        images = localData.defaultImages
      }
      // If we have local color images, merge/override with those
      if (localData.colorImages && Object.keys(localData.colorImages).length > 0) {
        colorImages = { ...colorImages, ...localData.colorImages }
      }
      // Override other properties if set locally
      if (localData.category) localCategory = localData.category
      if (localData.collection) localCollection = localData.collection
      if (localData.colors && localData.colors.length > 0) localColors = localData.colors
      if (localData.sizes && localData.sizes.length > 0) localSizes = localData.sizes
      if (localData.culturalStory) localCulturalStory = localData.culturalStory
      if (localData.featured !== undefined) localFeatured = localData.featured
      if (localData.inStock !== undefined) localInStock = localData.inStock
    }
  } catch (e) {
    // Ignore errors reading local data - just use Stripe data
    console.error('Error reading local product data:', e)
  }
  
  return {
    id: product.id,
    name: product.name,
    price: price.unit_amount ? price.unit_amount / 100 : 0, // Convert from cents
    description: product.description || '',
    culturalStory: localCulturalStory,
    images,
    colorImages,
    sizes: localSizes,
    colors: localColors,
    category: localCategory,
    collection: localCollection,
    inStock: localInStock,
    featured: localFeatured,
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Fetch all active products from Stripe
    const products = await stripe.products.list({
      active: true,
      limit: 100, // Adjust as needed
      expand: ['data.default_price'],
    })

    // Convert products to our format
    const formattedProducts: StripeProduct[] = []
    
    for (const product of products.data) {
      // Get the default price
      const defaultPrice = product.default_price as Stripe.Price
      
      if (!defaultPrice) {
        // If no default price, try to fetch the first active price
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
          limit: 1,
        })
        
        if (prices.data.length > 0) {
          const converted = convertStripeProduct(product, prices.data[0])
          if (converted) formattedProducts.push(converted)
        }
      } else {
        const converted = convertStripeProduct(product, defaultPrice)
        if (converted) formattedProducts.push(converted)
      }
    }

    // Sort products: featured first, then by name
    formattedProducts.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return a.name.localeCompare(b.name)
    })

    res.status(200).json(formattedProducts)
  } catch (error: any) {
    console.error('Error fetching products from Stripe:', error)
    
    // Extract detailed Stripe error information
    const errorMessage = error?.message || 'Unknown error'
    const stripeErrorCode = error?.code || error?.raw?.code || null
    const stripeErrorType = error?.type || null
    const stripeStatusCode = error?.statusCode || error?.raw?.statusCode || null
    const stripeDeclineCode = error?.decline_code || null
    
    const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'unknown'
    const keyLength = process.env.STRIPE_SECRET_KEY?.length || 0
    const isLiveKey = keyPrefix.startsWith('sk_live')
    const isTestKey = keyPrefix.startsWith('sk_test')
    
    // Generate helpful hints based on error type
    let hint = ''
    if (stripeErrorCode === 'api_key_expired') {
      hint = 'Your Stripe API key has expired. Please generate a new one in the Stripe Dashboard.'
    } else if (stripeErrorType === 'authentication_error' || stripeErrorCode === 'invalid_api_key') {
      hint = 'Invalid API key. Please check that your STRIPE_SECRET_KEY is correct and has no extra spaces or characters.'
    } else if (stripeStatusCode === 401) {
      hint = 'Authentication failed. Your API key may be invalid, expired, or have incorrect permissions.'
    } else if (stripeStatusCode === 403) {
      hint = 'Access denied. Your API key may not have permission to access products.'
    } else if (!process.env.STRIPE_SECRET_KEY) {
      hint = 'STRIPE_SECRET_KEY environment variable is not set.'
    } else if (keyLength < 30) {
      hint = 'STRIPE_SECRET_KEY appears to be truncated or incomplete.'
    } else {
      hint = isLiveKey 
        ? 'Using LIVE mode. Ensure products are created in live mode dashboard.'
        : isTestKey 
          ? 'Using TEST mode. Ensure products exist in test dashboard.'
          : 'Could not determine key type. Key should start with sk_live_ or sk_test_'
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch products',
      details: errorMessage,
      stripeErrorCode,
      stripeErrorType,
      stripeStatusCode,
      hint,
      keyMode: isLiveKey ? 'live' : isTestKey ? 'test' : 'unknown',
      keyConfigured: !!process.env.STRIPE_SECRET_KEY,
      keyPrefixValid: isLiveKey || isTestKey
    })
  }
}
