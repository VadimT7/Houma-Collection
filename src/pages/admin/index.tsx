import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlusIcon, 
  TrashIcon, 
  PhotoIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XMarkIcon,
  LockClosedIcon,
  Cog6ToothIcon,
  SwatchIcon,
  DocumentTextIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'

interface Product {
  id: string
  name: string
  images: string[]
  colors: string[]
  sizes: string[]
  category: string
  collection: string
  culturalStory?: string
  featured?: boolean
  inStock?: boolean
  stock?: StockData
}

interface StockData {
  [color: string]: {
    [size: string]: number
  }
}

interface ProductLocalData {
  defaultImages: string[]
  colorImages: { [color: string]: string[] }
  category?: string
  collection?: string
  colors?: string[]
  sizes?: string[]
  culturalStory?: string
  featured?: boolean
  inStock?: boolean
  stock?: StockData
}

interface Order {
  id: string
  paymentIntentId: string
  items: {
    productId: string
    productName: string
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
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    address: string
    apartment?: string
    city: string
    postalCode: string
    country: string
  }
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
  notes?: string
  trackingNumber?: string
}

const ADMIN_PASSWORD = 'houma-admin-2024'

// Predefined options
const CATEGORIES = ['Shirts', 'T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shorts', 'Tracksuits', 'Accessories']
const COLLECTIONS = ['EL BIDAYA', 'DESERT ROSE', 'MEDINA NIGHTS', 'ATLAS PEAK', 'SAHARA', 'General']
const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', 'One Size']
const COMMON_COLORS = ['Midnight Black', 'Desert Sand', 'Atlas White', 'Charcoal', 'Navy Blue', 'Olive Green', 'Burgundy', 'Cream', 'Stone Gray']

const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  processing: 'bg-purple-500/20 text-purple-400',
  shipped: 'bg-green-500/20 text-green-400',
  delivered: 'bg-emerald-500/20 text-emerald-400',
  cancelled: 'bg-red-500/20 text-red-400'
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [localData, setLocalData] = useState<ProductLocalData>({
    defaultImages: [],
    colorImages: {},
    category: '',
    collection: '',
    colors: [],
    sizes: [],
    culturalStory: '',
    featured: false,
    inStock: true,
    stock: {}
  })
  const [mainTab, setMainTab] = useState<'products' | 'orders'>('products')
  const [activeTab, setActiveTab] = useState<'metadata' | 'images' | 'stock'>('metadata')
  const [selectedColor, setSelectedColor] = useState<string>('default')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newColor, setNewColor] = useState('')
  const [newSize, setNewSize] = useState('')
  const [orderSearchTerm, setOrderSearchTerm] = useState('')

  // Fetch products from Stripe
  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        if (data.length > 0 && !selectedProduct) {
          setSelectedProduct(data[0])
        }
      }
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }, [selectedProduct])

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true)
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setIsLoadingOrders(false)
    }
  }, [])

  // Fetch local data for selected product
  const fetchLocalData = useCallback(async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/product-images?productId=${productId}`, {
        headers: { 'x-admin-password': ADMIN_PASSWORD }
      })
      if (response.ok) {
        const data = await response.json()
        setLocalData({
          defaultImages: data.defaultImages || [],
          colorImages: data.colorImages || {},
          category: data.category || '',
          collection: data.collection || '',
          colors: data.colors || [],
          sizes: data.sizes || [],
          culturalStory: data.culturalStory || '',
          featured: data.featured ?? false,
          inStock: data.inStock ?? true,
          stock: data.stock || {}
        })
      }
    } catch (error) {
      console.error('Failed to fetch local data:', error)
    }
  }, [])

  // Load products on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
      fetchOrders()
    }
  }, [isAuthenticated, fetchProducts, fetchOrders])

  // Load data when product changes
  useEffect(() => {
    if (selectedProduct && isAuthenticated) {
      fetchLocalData(selectedProduct.id)
      setSelectedColor('default')
    }
  }, [selectedProduct, isAuthenticated, fetchLocalData])

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      toast.success('Welcome to Admin Dashboard')
    } else {
      toast.error('Incorrect password')
    }
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !selectedProduct) return

    setIsUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: { 'x-admin-password': ADMIN_PASSWORD },
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          uploadedUrls.push(data.url)
        } else {
          throw new Error('Upload failed')
        }
      }

      // Add uploaded images to the appropriate array
      if (selectedColor === 'default') {
        setLocalData(prev => ({
          ...prev,
          defaultImages: [...prev.defaultImages, ...uploadedUrls]
        }))
      } else {
        setLocalData(prev => ({
          ...prev,
          colorImages: {
            ...prev.colorImages,
            [selectedColor]: [...(prev.colorImages[selectedColor] || []), ...uploadedUrls]
          }
        }))
      }

      toast.success(`Uploaded ${uploadedUrls.length} image(s)`)
    } catch (error) {
      toast.error('Failed to upload images')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  // Handle image deletion
  const handleDeleteImage = async (imageUrl: string) => {
    const filename = imageUrl.split('/').pop()
    
    if (imageUrl.startsWith('/product-images/') && filename) {
      try {
        await fetch(`/api/admin/delete-image?filename=${filename}`, {
          method: 'DELETE',
          headers: { 'x-admin-password': ADMIN_PASSWORD }
        })
      } catch (error) {
        console.error('Failed to delete file from server:', error)
      }
    }

    if (selectedColor === 'default') {
      setLocalData(prev => ({
        ...prev,
        defaultImages: prev.defaultImages.filter(url => url !== imageUrl)
      }))
    } else {
      setLocalData(prev => ({
        ...prev,
        colorImages: {
          ...prev.colorImages,
          [selectedColor]: (prev.colorImages[selectedColor] || []).filter(url => url !== imageUrl)
        }
      }))
    }

    toast.success('Image removed')
  }

  // Handle adding URL
  const handleAddUrl = () => {
    const url = prompt('Enter image URL:')
    if (url && url.trim()) {
      if (selectedColor === 'default') {
        setLocalData(prev => ({
          ...prev,
          defaultImages: [...prev.defaultImages, url.trim()]
        }))
      } else {
        setLocalData(prev => ({
          ...prev,
          colorImages: {
            ...prev.colorImages,
            [selectedColor]: [...(prev.colorImages[selectedColor] || []), url.trim()]
          }
        }))
      }
      toast.success('URL added')
    }
  }

  // Add color
  const handleAddColor = (color: string) => {
    if (color && !localData.colors?.includes(color)) {
      setLocalData(prev => ({
        ...prev,
        colors: [...(prev.colors || []), color]
      }))
      setNewColor('')
    }
  }

  // Remove color
  const handleRemoveColor = (color: string) => {
    setLocalData(prev => ({
      ...prev,
      colors: (prev.colors || []).filter(c => c !== color),
      colorImages: Object.fromEntries(
        Object.entries(prev.colorImages).filter(([key]) => key !== color)
      ),
      stock: Object.fromEntries(
        Object.entries(prev.stock || {}).filter(([key]) => key !== color)
      )
    }))
  }

  // Add size
  const handleAddSize = (size: string) => {
    if (size && !localData.sizes?.includes(size)) {
      setLocalData(prev => ({
        ...prev,
        sizes: [...(prev.sizes || []), size]
      }))
      setNewSize('')
    }
  }

  // Remove size
  const handleRemoveSize = (size: string) => {
    setLocalData(prev => {
      // Also remove stock for this size
      const newStock = { ...prev.stock }
      Object.keys(newStock).forEach(color => {
        if (newStock[color]) {
          delete newStock[color][size]
        }
      })
      return {
        ...prev,
        sizes: (prev.sizes || []).filter(s => s !== size),
        stock: newStock
      }
    })
  }

  // Update stock for a specific color+size combination
  const handleStockChange = (color: string, size: string, quantity: number) => {
    setLocalData(prev => ({
      ...prev,
      stock: {
        ...prev.stock,
        [color]: {
          ...(prev.stock?.[color] || {}),
          [size]: Math.max(0, quantity)
        }
      }
    }))
  }

  // Get stock for a specific color+size
  const getStock = (color: string, size: string): number => {
    return localData.stock?.[color]?.[size] ?? 0
  }

  // Calculate total stock
  const getTotalStock = (): number => {
    let total = 0
    Object.values(localData.stock || {}).forEach(sizeStock => {
      Object.values(sizeStock).forEach(qty => {
        total += qty
      })
    })
    return total
  }

  // Save all data
  const handleSave = async () => {
    if (!selectedProduct) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/product-images?productId=${selectedProduct.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': ADMIN_PASSWORD
        },
        body: JSON.stringify(localData)
      })

      if (response.ok) {
        toast.success('All changes saved successfully!')
        // Refresh products to see updated data
        fetchProducts()
      } else {
        throw new Error('Save failed')
      }
    } catch (error) {
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': ADMIN_PASSWORD
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        toast.success('Order status updated')
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status } : null)
        }
      } else {
        throw new Error('Update failed')
      }
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  // Get current images based on selected color
  const getCurrentImages = () => {
    if (selectedColor === 'default') {
      return localData.defaultImages
    }
    return localData.colorImages[selectedColor] || []
  }

  // Filter orders by search term
  const filteredOrders = orders.filter(order => {
    if (!orderSearchTerm) return true
    const term = orderSearchTerm.toLowerCase()
    return (
      order.id.toLowerCase().includes(term) ||
      order.shippingAddress.firstName.toLowerCase().includes(term) ||
      order.shippingAddress.lastName.toLowerCase().includes(term) ||
      order.shippingAddress.email.toLowerCase().includes(term) ||
      order.items.some(item => item.productName.toLowerCase().includes(term))
    )
  })

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2
    }).format(price)
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - HOUMA</title>
        </Head>
        <div className="min-h-screen bg-houma-black flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-houma-smoke p-8 rounded-lg max-w-md w-full"
          >
            <div className="text-center mb-8">
              <LockClosedIcon className="w-12 h-12 text-houma-gold mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-houma-white">Admin Access</h1>
              <p className="text-houma-white/60 mt-2">Enter password to continue</p>
            </div>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-houma-black border border-houma-white/20 rounded-lg 
                         text-houma-white placeholder-houma-white/40 focus:border-houma-gold 
                         focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full mt-4 px-6 py-3 bg-houma-gold text-houma-black font-semibold 
                         rounded-lg hover:bg-houma-gold/90 transition-colors"
              >
                Login
              </button>
            </form>
            <p className="text-houma-white/40 text-sm mt-4 text-center">
              Default password: houma-admin-2024
            </p>
          </motion.div>
        </div>
        <Toaster position="top-right" />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - HOUMA</title>
      </Head>
      <div className="min-h-screen bg-houma-black">
        {/* Header */}
        <header className="bg-houma-smoke border-b border-houma-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-houma-gold">HOUMA Admin</h1>
              <p className="text-houma-white/60 text-sm">Product & Order Management</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Main Tab Switcher */}
              <div className="flex gap-2 bg-houma-black/50 p-1 rounded-lg">
                <button
                  onClick={() => setMainTab('products')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    mainTab === 'products'
                      ? 'bg-houma-gold text-houma-black'
                      : 'text-houma-white/60 hover:text-houma-white'
                  }`}
                >
                  <CubeIcon className="w-4 h-4" />
                  Products
                </button>
                <button
                  onClick={() => setMainTab('orders')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    mainTab === 'orders'
                      ? 'bg-houma-gold text-houma-black'
                      : 'text-houma-white/60 hover:text-houma-white'
                  }`}
                >
                  <ClipboardDocumentListIcon className="w-4 h-4" />
                  Orders
                  {orders.filter(o => o.status === 'confirmed' || o.status === 'pending').length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {orders.filter(o => o.status === 'confirmed' || o.status === 'pending').length}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-houma-white/60 hover:text-houma-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {mainTab === 'products' ? (
          <div className="flex h-[calc(100vh-73px)]">
            {/* Product Sidebar */}
            <aside className="w-80 bg-houma-smoke/50 border-r border-houma-white/10 overflow-y-auto">
              <div className="p-4 border-b border-houma-white/10">
                <h2 className="text-houma-white font-semibold flex items-center gap-2">
                  <PhotoIcon className="w-5 h-5" />
                  Products
                </h2>
                <button
                  onClick={fetchProducts}
                  className="mt-2 text-sm text-houma-gold hover:text-houma-gold/80 flex items-center gap-1"
                >
                  <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              <div className="p-2">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`w-full p-3 rounded-lg text-left transition-colors mb-2 ${
                      selectedProduct?.id === product.id
                        ? 'bg-houma-gold/20 border border-houma-gold/50'
                        : 'hover:bg-houma-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-houma-black rounded overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PhotoIcon className="w-6 h-6 text-houma-white/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-houma-white font-medium truncate">{product.name}</p>
                        <p className="text-houma-white/50 text-xs">{product.category || 'No category'}</p>
                      </div>
                    </div>
                  </button>
                ))}
                {products.length === 0 && !isLoading && (
                  <p className="text-houma-white/40 text-center py-8">No products found</p>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
              {selectedProduct ? (
                <div>
                  {/* Product Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-houma-white">{selectedProduct.name}</h2>
                    <p className="text-houma-white/60">Product ID: {selectedProduct.id}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-houma-white/60">
                        Total Stock: <span className={getTotalStock() > 0 ? 'text-green-400' : 'text-red-400'}>{getTotalStock()} units</span>
                      </span>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex gap-4 mb-6 border-b border-houma-white/10">
                    <button
                      onClick={() => setActiveTab('metadata')}
                      className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'metadata'
                          ? 'text-houma-gold border-b-2 border-houma-gold'
                          : 'text-houma-white/60 hover:text-houma-white'
                      }`}
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                      Product Details
                    </button>
                    <button
                      onClick={() => setActiveTab('images')}
                      className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'images'
                          ? 'text-houma-gold border-b-2 border-houma-gold'
                          : 'text-houma-white/60 hover:text-houma-white'
                      }`}
                    >
                      <PhotoIcon className="w-5 h-5" />
                      Images
                    </button>
                    <button
                      onClick={() => setActiveTab('stock')}
                      className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'stock'
                          ? 'text-houma-gold border-b-2 border-houma-gold'
                          : 'text-houma-white/60 hover:text-houma-white'
                      }`}
                    >
                      <CubeIcon className="w-5 h-5" />
                      Stock Management
                    </button>
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'metadata' && (
                      <motion.div
                        key="metadata"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        {/* Category & Collection Row */}
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-houma-white/70 text-sm mb-2">Category</label>
                            <select
                              value={localData.category || ''}
                              onChange={(e) => setLocalData(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full px-4 py-3 bg-houma-smoke border border-houma-white/20 rounded-lg 
                                       text-houma-white focus:border-houma-gold focus:outline-none"
                            >
                              <option value="">Select category...</option>
                              {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-houma-white/70 text-sm mb-2">Collection</label>
                            <select
                              value={localData.collection || ''}
                              onChange={(e) => setLocalData(prev => ({ ...prev, collection: e.target.value }))}
                              className="w-full px-4 py-3 bg-houma-smoke border border-houma-white/20 rounded-lg 
                                       text-houma-white focus:border-houma-gold focus:outline-none"
                            >
                              <option value="">Select collection...</option>
                              {COLLECTIONS.map(col => (
                                <option key={col} value={col}>{col}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Featured & In Stock Row */}
                        <div className="flex gap-6">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={localData.featured || false}
                              onChange={(e) => setLocalData(prev => ({ ...prev, featured: e.target.checked }))}
                              className="w-5 h-5 rounded border-houma-white/20 bg-houma-smoke text-houma-gold 
                                       focus:ring-houma-gold focus:ring-offset-0"
                            />
                            <span className="text-houma-white">Featured Product</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={localData.inStock ?? true}
                              onChange={(e) => setLocalData(prev => ({ ...prev, inStock: e.target.checked }))}
                              className="w-5 h-5 rounded border-houma-white/20 bg-houma-smoke text-houma-gold 
                                       focus:ring-houma-gold focus:ring-offset-0"
                            />
                            <span className="text-houma-white">In Stock (Overall)</span>
                          </label>
                        </div>

                        {/* Sizes */}
                        <div>
                          <label className="block text-houma-white/70 text-sm mb-2">Sizes</label>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(localData.sizes || []).map(size => (
                              <span
                                key={size}
                                className="px-3 py-1 bg-houma-gold/20 text-houma-gold rounded-lg flex items-center gap-2"
                              >
                                {size}
                                <button
                                  onClick={() => handleRemoveSize(size)}
                                  className="hover:text-red-400 transition-colors"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={newSize}
                              onChange={(e) => {
                                if (e.target.value) handleAddSize(e.target.value)
                              }}
                              className="flex-1 px-4 py-2 bg-houma-smoke border border-houma-white/20 rounded-lg 
                                       text-houma-white focus:border-houma-gold focus:outline-none"
                            >
                              <option value="">Add size...</option>
                              {COMMON_SIZES.filter(s => !localData.sizes?.includes(s)).map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={newSize}
                              onChange={(e) => setNewSize(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddSize(newSize)}
                              placeholder="Custom size"
                              className="w-32 px-4 py-2 bg-houma-smoke border border-houma-white/20 rounded-lg 
                                       text-houma-white placeholder-houma-white/40 focus:border-houma-gold focus:outline-none"
                            />
                            <button
                              onClick={() => handleAddSize(newSize)}
                              className="px-4 py-2 bg-houma-gold/20 text-houma-gold rounded-lg hover:bg-houma-gold/30"
                            >
                              <PlusIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Colors */}
                        <div>
                          <label className="block text-houma-white/70 text-sm mb-2">Colors</label>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(localData.colors || []).map(color => (
                              <span
                                key={color}
                                className="px-3 py-1 bg-houma-gold/20 text-houma-gold rounded-lg flex items-center gap-2"
                              >
                                <SwatchIcon className="w-4 h-4" />
                                {color}
                                <button
                                  onClick={() => handleRemoveColor(color)}
                                  className="hover:text-red-400 transition-colors"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={newColor}
                              onChange={(e) => {
                                if (e.target.value) handleAddColor(e.target.value)
                              }}
                              className="flex-1 px-4 py-2 bg-houma-smoke border border-houma-white/20 rounded-lg 
                                       text-houma-white focus:border-houma-gold focus:outline-none"
                            >
                              <option value="">Add color...</option>
                              {COMMON_COLORS.filter(c => !localData.colors?.includes(c)).map(color => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={newColor}
                              onChange={(e) => setNewColor(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddColor(newColor)}
                              placeholder="Custom color"
                              className="w-32 px-4 py-2 bg-houma-smoke border border-houma-white/20 rounded-lg 
                                       text-houma-white placeholder-houma-white/40 focus:border-houma-gold focus:outline-none"
                            />
                            <button
                              onClick={() => handleAddColor(newColor)}
                              className="px-4 py-2 bg-houma-gold/20 text-houma-gold rounded-lg hover:bg-houma-gold/30"
                            >
                              <PlusIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Cultural Story */}
                        <div>
                          <label className="block text-houma-white/70 text-sm mb-2 flex items-center gap-2">
                            <DocumentTextIcon className="w-4 h-4" />
                            Cultural Story
                          </label>
                          <textarea
                            value={localData.culturalStory || ''}
                            onChange={(e) => setLocalData(prev => ({ ...prev, culturalStory: e.target.value }))}
                            rows={4}
                            placeholder="Tell the cultural story behind this product..."
                            className="w-full px-4 py-3 bg-houma-smoke border border-houma-white/20 rounded-lg 
                                     text-houma-white placeholder-houma-white/40 focus:border-houma-gold 
                                     focus:outline-none resize-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'images' && (
                      <motion.div
                        key="images"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {/* Color Selector */}
                        <div className="mb-6">
                          <label className="text-houma-white/70 text-sm mb-2 block">Select Color Variant</label>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setSelectedColor('default')}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedColor === 'default'
                                  ? 'bg-houma-gold text-houma-black'
                                  : 'bg-houma-smoke text-houma-white hover:bg-houma-white/10'
                              }`}
                            >
                              Default Images
                            </button>
                            {(localData.colors || []).map((color) => (
                              <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  selectedColor === color
                                    ? 'bg-houma-gold text-houma-black'
                                    : 'bg-houma-smoke text-houma-white hover:bg-houma-white/10'
                                }`}
                              >
                                {color}
                                {localData.colorImages[color]?.length > 0 && (
                                  <span className="ml-1 text-xs">({localData.colorImages[color].length})</span>
                                )}
                              </button>
                            ))}
                          </div>
                          {(localData.colors?.length === 0) && (
                            <p className="text-houma-white/40 text-sm mt-2">
                              Add colors in the "Product Details" tab to manage color-specific images
                            </p>
                          )}
                        </div>

                        {/* Image Grid */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-houma-white font-semibold">
                              {selectedColor === 'default' ? 'Default Images' : `${selectedColor} Images`}
                            </h3>
                            <span className="text-houma-white/50 text-sm">
                              {getCurrentImages().length} image(s)
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {getCurrentImages().map((imageUrl, index) => (
                              <motion.div
                                key={imageUrl}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-square bg-houma-smoke rounded-lg overflow-hidden group"
                              >
                                <img
                                  src={imageUrl}
                                  alt={`Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    onClick={() => handleDeleteImage(imageUrl)}
                                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                                  #{index + 1}
                                </div>
                              </motion.div>
                            ))}

                            {/* Upload Button */}
                            <label className="aspect-square bg-houma-smoke/50 border-2 border-dashed border-houma-white/20 
                                            rounded-lg flex flex-col items-center justify-center cursor-pointer
                                            hover:border-houma-gold/50 hover:bg-houma-smoke transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={isUploading}
                              />
                              {isUploading ? (
                                <ArrowPathIcon className="w-8 h-8 text-houma-gold animate-spin" />
                              ) : (
                                <>
                                  <PlusIcon className="w-8 h-8 text-houma-white/40" />
                                  <span className="text-houma-white/40 text-sm mt-2">Upload</span>
                                </>
                              )}
                            </label>

                            {/* Add URL Button */}
                            <button
                              onClick={handleAddUrl}
                              className="aspect-square bg-houma-smoke/50 border-2 border-dashed border-houma-white/20 
                                       rounded-lg flex flex-col items-center justify-center cursor-pointer
                                       hover:border-houma-gold/50 hover:bg-houma-smoke transition-colors"
                            >
                              <span className="text-houma-white/40 text-2xl">🔗</span>
                              <span className="text-houma-white/40 text-sm mt-2">Add URL</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'stock' && (
                      <motion.div
                        key="stock"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-houma-white font-semibold">Stock per Color & Size</h3>
                              <p className="text-houma-white/50 text-sm">
                                Set the quantity available for each color and size combination
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-houma-white/70 text-sm">Total Stock: </span>
                              <span className={`text-lg font-bold ${getTotalStock() > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {getTotalStock()} units
                              </span>
                            </div>
                          </div>

                          {(!localData.colors?.length || !localData.sizes?.length) ? (
                            <div className="bg-houma-smoke/50 rounded-lg p-8 text-center">
                              <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                              <p className="text-houma-white/70">
                                Please add colors and sizes in the "Product Details" tab first
                              </p>
                            </div>
                          ) : (
                            <div className="bg-houma-smoke/50 rounded-lg overflow-hidden">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-houma-black/50">
                                    <th className="px-4 py-3 text-left text-houma-white/70 font-medium">
                                      Color / Size
                                    </th>
                                    {localData.sizes?.map(size => (
                                      <th key={size} className="px-4 py-3 text-center text-houma-white/70 font-medium min-w-[80px]">
                                        {size}
                                      </th>
                                    ))}
                                    <th className="px-4 py-3 text-right text-houma-white/70 font-medium">
                                      Total
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {localData.colors?.map((color, colorIndex) => {
                                    const colorTotal = localData.sizes?.reduce((sum, size) => 
                                      sum + getStock(color, size), 0) || 0
                                    return (
                                      <tr 
                                        key={color} 
                                        className={colorIndex % 2 === 0 ? 'bg-houma-smoke/30' : ''}
                                      >
                                        <td className="px-4 py-3 text-houma-white font-medium flex items-center gap-2">
                                          <SwatchIcon className="w-4 h-4 text-houma-gold" />
                                          {color}
                                        </td>
                                        {localData.sizes?.map(size => (
                                          <td key={size} className="px-4 py-3 text-center">
                                            <input
                                              type="number"
                                              min="0"
                                              value={getStock(color, size)}
                                              onChange={(e) => handleStockChange(color, size, parseInt(e.target.value) || 0)}
                                              className={`w-16 px-2 py-1 text-center rounded border transition-colors
                                                ${getStock(color, size) === 0 
                                                  ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                                                  : 'bg-houma-black border-houma-white/20 text-houma-white'
                                                } focus:border-houma-gold focus:outline-none`}
                                            />
                                          </td>
                                        ))}
                                        <td className={`px-4 py-3 text-right font-bold ${
                                          colorTotal > 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                          {colorTotal}
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                                <tfoot>
                                  <tr className="bg-houma-black/50 border-t border-houma-white/10">
                                    <td className="px-4 py-3 text-houma-white/70 font-medium">
                                      Size Total
                                    </td>
                                    {localData.sizes?.map(size => {
                                      const sizeTotal = localData.colors?.reduce((sum, color) => 
                                        sum + getStock(color, size), 0) || 0
                                      return (
                                        <td key={size} className={`px-4 py-3 text-center font-bold ${
                                          sizeTotal > 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                          {sizeTotal}
                                        </td>
                                      )
                                    })}
                                    <td className={`px-4 py-3 text-right font-bold text-lg ${
                                      getTotalStock() > 0 ? 'text-houma-gold' : 'text-red-400'
                                    }`}>
                                      {getTotalStock()}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          )}

                          <div className="mt-4 p-4 bg-houma-smoke/30 rounded-lg">
                            <h4 className="text-houma-white font-medium mb-2">Stock Management Tips:</h4>
                            <ul className="text-houma-white/60 text-sm space-y-1">
                              <li>• Items with 0 stock will show as "Out of Stock" on the product page</li>
                              <li>• Customers can still view out-of-stock items but cannot add them to cart</li>
                              <li>• Stock is automatically deducted when a customer completes a purchase</li>
                              <li>• Low stock items (≤3) will show a warning indicator</li>
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Save Button */}
                  <div className="mt-8 pt-6 border-t border-houma-white/10 flex items-center gap-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-8 py-3 bg-houma-gold text-houma-black font-semibold rounded-lg 
                               hover:bg-houma-gold/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircleIcon className="w-5 h-5" />
                      )}
                      Save All Changes
                    </button>
                    <p className="text-houma-white/50 text-sm">
                      Changes will be reflected on the product page immediately
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <PhotoIcon className="w-16 h-16 text-houma-white/20 mx-auto mb-4" />
                    <p className="text-houma-white/40">Select a product to manage</p>
                  </div>
                </div>
              )}
            </main>
          </div>
        ) : (
          /* Orders Tab */
          <div className="flex h-[calc(100vh-73px)]">
            {/* Orders List Sidebar */}
            <aside className="w-96 bg-houma-smoke/50 border-r border-houma-white/10 overflow-y-auto">
              <div className="p-4 border-b border-houma-white/10">
                <h2 className="text-houma-white font-semibold flex items-center gap-2 mb-3">
                  <ClipboardDocumentListIcon className="w-5 h-5" />
                  Orders ({orders.length})
                </h2>
                <div className="relative">
                  <MagnifyingGlassIcon className="w-4 h-4 text-houma-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-houma-black border border-houma-white/20 rounded-lg 
                             text-houma-white placeholder-houma-white/40 focus:border-houma-gold focus:outline-none text-sm"
                  />
                </div>
                <button
                  onClick={fetchOrders}
                  className="mt-2 text-sm text-houma-gold hover:text-houma-gold/80 flex items-center gap-1"
                >
                  <ArrowPathIcon className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              <div className="p-2">
                {filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full p-3 rounded-lg text-left transition-colors mb-2 ${
                      selectedOrder?.id === order.id
                        ? 'bg-houma-gold/20 border border-houma-gold/50'
                        : 'hover:bg-houma-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-houma-white font-medium">{order.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-houma-white/60 text-sm">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p className="text-houma-white/40 text-xs mt-1">
                      {formatDate(order.createdAt)} • {order.items.length} item(s)
                    </p>
                    <p className="text-houma-gold font-medium mt-1">
                      {formatPrice(order.total)}
                    </p>
                  </button>
                ))}
                {orders.length === 0 && !isLoadingOrders && (
                  <p className="text-houma-white/40 text-center py-8">No orders yet</p>
                )}
                {filteredOrders.length === 0 && orders.length > 0 && (
                  <p className="text-houma-white/40 text-center py-8">No matching orders</p>
                )}
              </div>
            </aside>

            {/* Order Details */}
            <main className="flex-1 overflow-y-auto p-6">
              {selectedOrder ? (
                <div>
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-houma-white">{selectedOrder.id}</h2>
                      <p className="text-houma-white/60">Payment ID: {selectedOrder.paymentIntentId}</p>
                      <p className="text-houma-white/60">Placed: {formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                        className="px-4 py-2 bg-houma-smoke border border-houma-white/20 rounded-lg 
                                 text-houma-white focus:border-houma-gold focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div className="bg-houma-smoke/50 rounded-lg p-6">
                      <h3 className="text-houma-gold text-sm tracking-wider mb-4 flex items-center gap-2">
                        <TruckIcon className="w-4 h-4" />
                        SHIPPING INFORMATION
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-houma-white font-medium text-lg">
                            {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-houma-white/70">{selectedOrder.shippingAddress.address}</p>
                          {selectedOrder.shippingAddress.apartment && (
                            <p className="text-houma-white/70">{selectedOrder.shippingAddress.apartment}</p>
                          )}
                          <p className="text-houma-white/70">
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                          </p>
                          <p className="text-houma-white/70">{selectedOrder.shippingAddress.country}</p>
                        </div>
                        <div className="pt-3 border-t border-houma-white/10">
                          <p className="text-houma-white/70">
                            <span className="text-houma-white/50">Email:</span> {selectedOrder.shippingAddress.email}
                          </p>
                          {selectedOrder.shippingAddress.phone && (
                            <p className="text-houma-white/70">
                              <span className="text-houma-white/50">Phone:</span> {selectedOrder.shippingAddress.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-houma-smoke/50 rounded-lg p-6">
                      <h3 className="text-houma-gold text-sm tracking-wider mb-4">ORDER SUMMARY</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-houma-white/70">
                          <span>Subtotal</span>
                          <span>{formatPrice(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-houma-white/70">
                          <span>Shipping</span>
                          <span>{formatPrice(selectedOrder.shipping)}</span>
                        </div>
                        <div className="flex justify-between text-houma-white/70">
                          <span>Tax (14.975%)</span>
                          <span>{formatPrice(selectedOrder.tax)}</span>
                        </div>
                        <div className="flex justify-between text-houma-white font-bold text-lg pt-3 border-t border-houma-white/10">
                          <span>Total</span>
                          <span className="text-houma-gold">{formatPrice(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-6 bg-houma-smoke/50 rounded-lg p-6">
                    <h3 className="text-houma-gold text-sm tracking-wider mb-4">
                      ORDER ITEMS ({selectedOrder.items.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-houma-black/30 rounded-lg">
                          <div className="w-16 h-16 bg-houma-smoke rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <PhotoIcon className="w-8 h-8 text-houma-white/30" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-houma-white font-medium">{item.productName}</p>
                            <p className="text-houma-white/60 text-sm">
                              Color: {item.color} • Size: {item.size}
                            </p>
                            <p className="text-houma-white/40 text-xs">
                              Product ID: {item.productId}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-houma-white font-medium">×{item.quantity}</p>
                            <p className="text-houma-gold font-bold">{formatPrice(item.price * item.quantity)}</p>
                            <p className="text-houma-white/40 text-xs">{formatPrice(item.price)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 flex gap-3">
                    {selectedOrder.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'processing')}
                        className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-2"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                        Start Processing
                      </button>
                    )}
                    {selectedOrder.status === 'processing' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'shipped')}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2"
                      >
                        <TruckIcon className="w-4 h-4" />
                        Mark as Shipped
                      </button>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-2"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Mark as Delivered
                      </button>
                    )}
                    {(selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered') && (
                      <button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <ClipboardDocumentListIcon className="w-16 h-16 text-houma-white/20 mx-auto mb-4" />
                    <p className="text-houma-white/40">Select an order to view details</p>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </>
  )
}
