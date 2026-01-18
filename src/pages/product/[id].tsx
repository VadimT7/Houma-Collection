import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import toast from 'react-hot-toast'
import { 
  HeartIcon, 
  ShareIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Product, useCart } from '@/lib/store'
import { useProducts } from '@/lib/stripe-products'
import { formatPrice, getImagePath, cn } from '@/lib/utils'
import ProductCard from '@/components/ProductCard'

const ProductDetailPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const { products, getProductById, getProductsByCategory, isLoading } = useProducts()
  const { addItem } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showZoom, setShowZoom] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'story' | 'care'>('details')

  // Get stock for a specific color+size combination
  const getStock = (color: string, size: string): number => {
    if (!product?.stock?.[color]?.[size]) return 0
    return product.stock[color][size]
  }

  // Check if selected combo is in stock
  const isSelectedComboInStock = React.useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return false
    // If no stock data exists, fall back to overall inStock status
    if (!product.stock || Object.keys(product.stock).length === 0) {
      return product.inStock
    }
    return getStock(selectedColor, selectedSize) > 0
  }, [product, selectedColor, selectedSize])

  // Check if any variant is available (for showing product as available overall)
  const hasAnyStock = React.useMemo(() => {
    if (!product?.stock) return product?.inStock ?? false
    return Object.values(product.stock).some(sizes => 
      Object.values(sizes).some(qty => qty > 0)
    )
  }, [product])

  // Load product when ID changes or products are fetched
  useEffect(() => {
    if (id && typeof id === 'string' && products.length > 0) {
      const foundProduct = getProductById(id)
      if (foundProduct) {
        setProduct(foundProduct)
        setSelectedSize(foundProduct.sizes[0] || '')
        setSelectedColor(foundProduct.colors[0] || '')
        
        // Get related products from the same category
        const related = getProductsByCategory(foundProduct.category)
          .filter(p => p.id !== foundProduct.id)
          .slice(0, 4)
        setRelatedProducts(related)
      } else if (!isLoading) {
        // Product not found and not loading
        router.push('/shop')
      }
    }
  }, [id, products, getProductById, getProductsByCategory, isLoading, router])

  // Get images to display based on selected color
  // If colorImages exist for the selected color, use those; otherwise use default images
  const displayImages = React.useMemo(() => {
    if (!product) return []
    
    // Check if there are color-specific images for the selected color
    if (product.colorImages && selectedColor && product.colorImages[selectedColor]) {
      return product.colorImages[selectedColor]
    }
    
    // Fallback to default product images
    return product.images.length > 0 ? product.images : ['/placeholder-product.jpg']
  }, [product, selectedColor])

  // Reset selected image when color changes (to show first image of new color)
  useEffect(() => {
    setSelectedImage(0)
  }, [selectedColor])

  const handleAddToCart = () => {
    if (!product) return
    
    if (!isSelectedComboInStock) {
      toast.error('This color/size combination is out of stock')
      return
    }
    
    addItem(product, selectedSize, selectedColor)
    toast.success('Added to your bag')
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const nextImage = () => {
    if (displayImages.length > 0) {
      setSelectedImage((prev) => (prev + 1) % displayImages.length)
    }
  }

  const prevImage = () => {
    if (displayImages.length > 0) {
      setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)
    }
  }

  // Loading state
  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-houma-gold"></div>
          <p className="text-houma-white/50 mt-4">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{product.name} - HOUMA | Luxury Streetwear</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} - HOUMA`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images && product.images.length > 0 ? getImagePath(product.images[0]) : '/images/placeholder.svg'} />
      </Head>

      <section className="pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8">
        <div className="houma-container px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-4 sm:mb-6 md:mb-8">
            <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm overflow-x-auto pb-2">
              <li>
                <Link href="/" className="text-houma-white/50 hover:text-houma-gold transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-houma-white/30">/</li>
              <li>
                <Link href="/shop" className="text-houma-white/50 hover:text-houma-gold transition-colors">
                  Shop
                </Link>
              </li>
              <li className="text-houma-white/30">/</li>
              <li>
                <Link 
                  href={`/shop?category=${product.category.toLowerCase()}`} 
                  className="text-houma-white/50 hover:text-houma-gold transition-colors"
                >
                  {product.category}
                </Link>
              </li>
              <li className="text-houma-white/30">/</li>
              <li className="text-houma-gold">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Image Gallery */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-houma-black/50 rounded-lg overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    className="relative w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={getImagePath(displayImages?.[selectedImage])}
                      alt={`${product.name} - View ${selectedImage + 1}`}
                      fill
                      className="object-cover cursor-zoom-in"
                      onClick={() => setShowZoom(true)}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-houma-black/50 
                               backdrop-blur-sm rounded-full flex items-center justify-center
                               text-houma-white hover:bg-houma-black/70 transition-all
                               opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-houma-black/50 
                               backdrop-blur-sm rounded-full flex items-center justify-center
                               text-houma-white hover:bg-houma-black/70 transition-all
                               opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Zoom Icon */}
                <button
                  onClick={() => setShowZoom(true)}
                  className="absolute top-4 right-4 w-10 h-10 bg-houma-black/50 
                           backdrop-blur-sm rounded-full flex items-center justify-center
                           text-houma-white hover:bg-houma-black/70 transition-all
                           opacity-0 group-hover:opacity-100"
                >
                  <MagnifyingGlassPlusIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              {displayImages && displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'relative aspect-square rounded-lg overflow-hidden transition-all',
                        selectedImage === index 
                          ? 'ring-2 ring-houma-gold' 
                          : 'ring-1 ring-houma-white/10 hover:ring-houma-white/30'
                      )}
                    >
                      <Image
                        src={getImagePath(image)}
                        alt={`${product.name} - Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Header */}
              <div>
                <p className="text-houma-gold text-xs sm:text-sm tracking-wider mb-2">
                  {product.collection}
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-display tracking-wider text-houma-white mb-3 sm:mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl sm:text-3xl text-houma-gold">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-houma-white/80 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              <div>
                <label className="block text-xs sm:text-sm tracking-wider text-houma-white mb-2 sm:mb-3">
                  SIZE
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => {
                    // Check if this size is available in the selected color
                    const sizeStock = selectedColor ? getStock(selectedColor, size) : 0
                    const hasStockData = product.stock && Object.keys(product.stock).length > 0
                    const isOutOfStock = hasStockData && sizeStock === 0
                    const isLowStock = hasStockData && sizeStock > 0 && sizeStock <= 3
                    
                    return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                          'py-2 sm:py-3 border text-xs sm:text-sm tracking-wider transition-all relative',
                        selectedSize === size
                            ? isOutOfStock
                              ? 'border-red-500/50 bg-red-500/10 text-red-400'
                              : 'border-houma-gold bg-houma-gold text-houma-black'
                            : isOutOfStock
                              ? 'border-houma-white/10 text-houma-white/30 line-through'
                          : 'border-houma-white/20 text-houma-white hover:border-houma-gold'
                      )}
                    >
                      {size}
                        {isLowStock && !isOutOfStock && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" title={`Only ${sizeStock} left`} />
                        )}
                    </button>
                    )
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs sm:text-sm tracking-wider text-houma-white mb-2 sm:mb-3">
                  COLOR
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    // Check if any size is available in this color
                    const hasStockData = product.stock && Object.keys(product.stock).length > 0
                    const colorTotalStock = hasStockData && product.stock?.[color]
                      ? Object.values(product.stock[color]).reduce((sum, qty) => sum + qty, 0)
                      : 0
                    const isColorOutOfStock = hasStockData && colorTotalStock === 0
                    
                    return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                          'px-3 sm:px-4 py-1.5 sm:py-2 border text-xs sm:text-sm tracking-wider transition-all relative',
                        selectedColor === color
                            ? isColorOutOfStock
                              ? 'border-red-500/50 bg-red-500/10 text-red-400'
                              : 'border-houma-gold bg-houma-gold/10 text-houma-gold'
                            : isColorOutOfStock
                              ? 'border-houma-white/10 text-houma-white/30'
                          : 'border-houma-white/20 text-houma-white hover:border-houma-gold'
                      )}
                    >
                      {color}
                        {isColorOutOfStock && (
                          <span className="ml-1 text-[10px] text-red-400">(Out)</span>
                        )}
                    </button>
                    )
                  })}
                </div>
              </div>

              {/* Stock Status Indicator */}
              {product.stock && Object.keys(product.stock).length > 0 && (
                <div className={cn(
                  'px-3 py-2 rounded text-xs sm:text-sm',
                  isSelectedComboInStock
                    ? getStock(selectedColor, selectedSize) <= 3
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      : 'bg-green-500/10 text-green-400 border border-green-500/30'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                )}>
                  {isSelectedComboInStock
                    ? getStock(selectedColor, selectedSize) <= 3
                      ? `Only ${getStock(selectedColor, selectedSize)} left in stock!`
                      : `${getStock(selectedColor, selectedSize)} in stock`
                    : 'This combination is out of stock'
                  }
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isSelectedComboInStock}
                  className={cn(
                    'flex-1 py-3 sm:py-4 text-xs sm:text-sm md:text-base text-center tracking-wider transition-all',
                    isSelectedComboInStock
                      ? 'bg-houma-gold text-houma-black hover:bg-houma-gold/90'
                      : 'bg-houma-white/10 text-houma-white/50 cursor-not-allowed'
                  )}
                >
                  {isSelectedComboInStock ? 'ADD TO BAG' : 'OUT OF STOCK'}
                </button>
                <button
                  onClick={handleWishlist}
                  className="w-12 h-12 sm:w-14 sm:h-14 border border-houma-white/20 flex items-center justify-center
                           hover:border-houma-gold transition-colors flex-shrink-0"
                >
                  {isWishlisted ? (
                    <HeartIconSolid className="w-5 h-5 sm:w-6 sm:h-6 text-houma-gold" />
                  ) : (
                    <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-houma-white" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="w-12 h-12 sm:w-14 sm:h-14 border border-houma-white/20 flex items-center justify-center
                           hover:border-houma-gold transition-colors flex-shrink-0"
                >
                  <ShareIcon className="w-5 h-5 sm:w-6 sm:h-6 text-houma-white" />
                </button>
              </div>

              {/* Product Details Tabs */}
              <div className="border-t border-houma-white/10 pt-4 sm:pt-6">
                <div className="flex gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 overflow-x-auto pb-2">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={cn(
                      'text-xs sm:text-sm tracking-wider pb-2 border-b-2 transition-all whitespace-nowrap flex-shrink-0',
                      activeTab === 'details'
                        ? 'text-houma-gold border-houma-gold'
                        : 'text-houma-white/50 border-transparent hover:text-houma-white'
                    )}
                  >
                    DETAILS
                  </button>
                  <button
                    onClick={() => setActiveTab('story')}
                    className={cn(
                      'text-xs sm:text-sm tracking-wider pb-2 border-b-2 transition-all whitespace-nowrap flex-shrink-0',
                      activeTab === 'story'
                        ? 'text-houma-gold border-houma-gold'
                        : 'text-houma-white/50 border-transparent hover:text-houma-white'
                    )}
                  >
                    CULTURAL STORY
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={cn(
                      'text-xs sm:text-sm tracking-wider pb-2 border-b-2 transition-all whitespace-nowrap flex-shrink-0',
                      activeTab === 'care'
                        ? 'text-houma-gold border-houma-gold'
                        : 'text-houma-white/50 border-transparent hover:text-houma-white'
                    )}
                  >
                    CARE GUIDE
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'details' && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3 text-houma-white/70 text-sm"
                    >
                      <p>• Premium quality materials sourced ethically</p>
                      <p>• Handcrafted details with traditional techniques</p>
                      <p>• Modern fit designed for comfort and style</p>
                      <p>• Limited edition piece from {product.collection}</p>
                      <p>• Category: {product.category}</p>
                    </motion.div>
                  )}

                  {activeTab === 'story' && (
                    <motion.div
                      key="story"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-houma-white/70 text-sm leading-relaxed"
                    >
                      {product.culturalStory || 
                        'Each HOUMA piece carries the spirit of North African heritage, reimagined for the modern world. This design celebrates the rich cultural tapestry of the Maghreb, where ancient traditions meet contemporary expression.'}
                    </motion.div>
                  )}

                  {activeTab === 'care' && (
                    <motion.div
                      key="care"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3 text-houma-white/70 text-sm"
                    >
                      <p>• Machine wash cold with like colors</p>
                      <p>• Do not bleach or use fabric softener</p>
                      <p>• Tumble dry low or hang to dry</p>
                      <p>• Iron on low heat if needed</p>
                      <p>• Store in a cool, dry place</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 pt-4 sm:pt-6 border-t border-houma-white/10">
                <div className="flex flex-col items-center text-center">
                  <ShieldCheckIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-houma-gold mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-houma-white/70">Authentic Design</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <TruckIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-houma-gold mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-houma-white/70">Worldwide Shipping</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <ArrowPathIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-houma-gold mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-houma-white/70">Easy Returns</p>
                </div>
              </div>
              
              {/* Delivery Time Info */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-houma-white/10">
                <p className="text-xs sm:text-sm text-houma-gold tracking-wider mb-2 sm:mb-3">DELIVERY TIME</p>
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-xs sm:text-sm text-houma-white/80">
                    <span className="text-houma-white">Canada:</span> 2-6 business days
                  </p>
                  <p className="text-xs sm:text-sm text-houma-white/80">
                    <span className="text-houma-white">International:</span> 5-10 business days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-12 sm:mt-16 md:mt-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display tracking-wider text-houma-white mb-4 sm:mb-6 md:mb-8">
                YOU MAY ALSO LIKE
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      {/* Zoom Modal */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            className="fixed inset-0 bg-houma-black/95 z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowZoom(false)}
          >
            <button
              className="absolute top-4 right-4 text-houma-white hover:text-houma-gold transition-colors"
              onClick={() => setShowZoom(false)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <TransformWrapper>
              <TransformComponent>
                <Image
                  src={getImagePath(displayImages?.[selectedImage])}
                  alt={product.name}
                  width={1200}
                  height={1200}
                  className="max-w-full max-h-full object-contain"
                />
              </TransformComponent>
            </TransformWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductDetailPage