import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useProducts } from '@/lib/stripe-products'

const TestStripeSyncPage = () => {
  const { 
    products, 
    isLoading, 
    error, 
    fetchProducts, 
    getCategories, 
    getCollections,
    getFeaturedProducts 
  } = useProducts()
  
  const [webhookTest, setWebhookTest] = useState<string>('')
  const [testingWebhook, setTestingWebhook] = useState(false)

  // Manual refresh
  const handleRefresh = async () => {
    await fetchProducts()
  }

  // Test webhook endpoint
  const testWebhook = async () => {
    setTestingWebhook(true)
    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'test-signature'
        },
        body: JSON.stringify({
          type: 'product.updated',
          data: {
            object: {
              id: 'test-product',
              name: 'Test Product'
            }
          }
        })
      })
      
      if (response.ok) {
        setWebhookTest('✅ Webhook endpoint is accessible')
      } else {
        setWebhookTest(`❌ Webhook returned status: ${response.status}`)
      }
    } catch (error: any) {
      setWebhookTest(`❌ Webhook test failed: ${error.message}`)
    } finally {
      setTestingWebhook(false)
    }
  }

  const categories = getCategories()
  const collections = getCollections()
  const featuredProducts = getFeaturedProducts()

  return (
    <>
      <Head>
        <title>Stripe Sync Test - HOUMA</title>
      </Head>

      <div className="min-h-screen bg-houma-black text-houma-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-display mb-8 text-houma-gold">
            Stripe Product Sync Test
          </h1>

          {/* Status Section */}
          <div className="bg-houma-black/50 border border-houma-gold/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl mb-4">System Status</h2>
            
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-semibold">API Status:</span>
                {isLoading ? (
                  <span className="text-yellow-500">⏳ Loading...</span>
                ) : error ? (
                  <span className="text-red-500">❌ {error}</span>
                ) : (
                  <span className="text-green-500">✅ Connected</span>
                )}
              </p>
              
              <p className="flex items-center gap-2">
                <span className="font-semibold">Products Loaded:</span>
                <span className={products.length > 0 ? 'text-green-500' : 'text-yellow-500'}>
                  {products.length} products
                </span>
              </p>
              
              <p className="flex items-center gap-2">
                <span className="font-semibold">Categories Found:</span>
                <span>{categories.length} categories</span>
              </p>
              
              <p className="flex items-center gap-2">
                <span className="font-semibold">Collections Found:</span>
                <span>{collections.length} collections</span>
              </p>
              
              <p className="flex items-center gap-2">
                <span className="font-semibold">Featured Products:</span>
                <span>{featuredProducts.length} products</span>
              </p>
            </div>

            <div className="mt-4 flex gap-4">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-houma-gold text-houma-black hover:bg-houma-gold/90 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh Products'}
              </button>
              
              <button
                onClick={testWebhook}
                className="px-4 py-2 border border-houma-gold text-houma-gold hover:bg-houma-gold/10 transition-colors"
                disabled={testingWebhook}
              >
                {testingWebhook ? 'Testing...' : 'Test Webhook'}
              </button>
            </div>
            
            {webhookTest && (
              <p className="mt-4 text-sm">{webhookTest}</p>
            )}
          </div>

          {/* Environment Check */}
          <div className="bg-houma-black/50 border border-houma-gold/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl mb-4">Environment Configuration</h2>
            
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Publishable Key:</span>{' '}
                {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                  <span className="text-green-500">✅ Set (starts with pk_)</span>
                ) : (
                  <span className="text-red-500">❌ Not set</span>
                )}
              </p>
              
              <p className="text-houma-white/50">
                Note: Secret key and webhook secret are server-side only and cannot be checked from the browser.
              </p>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-houma-black/50 border border-houma-gold/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl mb-4">Products from Stripe</h2>
            
            {products.length === 0 ? (
              <div className="text-houma-white/50">
                <p>No products found. Please ensure:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your Stripe secret key is configured correctly</li>
                  <li>You have active products in your Stripe account</li>
                  <li>Products have default prices set</li>
                </ul>
                
                <div className="mt-4 p-4 bg-houma-black/50 border border-houma-gold/10 rounded">
                  <p className="font-semibold mb-2">Quick Setup:</p>
                  <code className="text-xs block bg-black p-2 rounded">
                    node scripts/setup-stripe-products.js
                  </code>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="border border-houma-white/10 p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-houma-gold">{product.name}</h3>
                        <p className="text-sm text-houma-white/70 mt-1">{product.description}</p>
                      </div>
                      <span className="text-houma-gold">${product.price}</span>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-houma-gold/10 text-houma-gold rounded">
                        {product.category}
                      </span>
                      <span className="px-2 py-1 bg-houma-gold/10 text-houma-gold rounded">
                        {product.collection}
                      </span>
                      {product.featured && (
                        <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded ${
                        product.inStock 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-xs text-houma-white/50">
                      <p>Sizes: {product.sizes.join(', ')}</p>
                      <p>Colors: {product.colors.join(', ')}</p>
                      <p>Images: {product.images.length} image(s)</p>
                      {product.images.length > 0 && (
                        <p className="truncate">First image: {product.images[0].substring(0, 50)}...</p>
                      )}
                      <p>ID: {product.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-houma-black/50 border border-houma-gold/20 rounded-lg p-6">
            <h2 className="text-2xl mb-4">How to Add Products</h2>
            
            <ol className="space-y-3 text-sm">
              <li>
                <span className="font-semibold">1. Via Stripe Dashboard:</span>
                <ul className="list-disc list-inside ml-4 mt-1 text-houma-white/70">
                  <li>Go to Stripe Dashboard → Products</li>
                  <li>Click "Add Product"</li>
                  <li>Set name, description, price, and images</li>
                  <li>Add metadata fields (see below)</li>
                </ul>
              </li>
              
              <li>
                <span className="font-semibold">2. Required Metadata:</span>
                <div className="ml-4 mt-1 p-3 bg-black rounded text-xs font-mono">
                  <p>category: "Hoodies"</p>
                  <p>collection: "Heritage Collection"</p>
                  <p>sizes: ["S", "M", "L", "XL"]</p>
                  <p>colors: ["Black", "White"]</p>
                  <p>featured: "true"</p>
                  <p>inStock: "true"</p>
                </div>
              </li>
              
              <li>
                <span className="font-semibold">3. Via Script:</span>
                <div className="ml-4 mt-1 p-3 bg-black rounded text-xs">
                  <p>Run the setup script to create sample products:</p>
                  <code>node scripts/setup-stripe-products.js</code>
                </div>
              </li>
              
              <li>
                <span className="font-semibold">4. Adding Images:</span>
                <div className="ml-4 mt-1 p-3 bg-black rounded text-xs">
                  <p>To display images on the website:</p>
                  <p>1. Go to Stripe Dashboard → Products</p>
                  <p>2. Click on each product</p>
                  <p>3. Upload images in the "Images" section</p>
                  <p>4. Images will automatically appear on the site</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  )
}

export default TestStripeSyncPage
