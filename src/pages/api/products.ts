import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

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
  
  return {
    id: product.id,
    name: product.name,
    price: price.unit_amount ? price.unit_amount / 100 : 0, // Convert from cents
    description: product.description || '',
    culturalStory: metadata.culturalStory || '',
    images: product.images || [],
    sizes,
    colors,
    category: metadata.category || 'Uncategorized',
    collection: metadata.collection || 'General',
    inStock: metadata.inStock !== 'false', // Default to true unless explicitly false
    featured: metadata.featured === 'true',
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
