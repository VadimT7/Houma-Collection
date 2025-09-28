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

  const handleAddToCart = () => {
    if (!product) return
    
    if (!product.inStock) {
      toast.error('This product is currently out of stock')
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
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
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

      <section className="pt-24 pb-8">
        <div className="houma-container">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
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
                      src={getImagePath(product.images?.[selectedImage])}
                      alt={`${product.name} - View ${selectedImage + 1}`}
                      fill
                      className="object-cover cursor-zoom-in"
                      onClick={() => setShowZoom(true)}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
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
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
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
            <div className="space-y-6">
              {/* Header */}
              <div>
                <p className="text-houma-gold text-sm tracking-wider mb-2">
                  {product.collection}
                </p>
                <h1 className="text-4xl font-display tracking-wider text-houma-white mb-4">
                  {product.name}
                </h1>
                <p className="text-3xl text-houma-gold">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Description */}
              <p className="text-houma-white/80 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              <div>
                <label className="block text-sm tracking-wider text-houma-white mb-3">
                  SIZE
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'py-3 border text-sm tracking-wider transition-all',
                        selectedSize === size
                          ? 'border-houma-gold bg-houma-gold text-houma-black'
                          : 'border-houma-white/20 text-houma-white hover:border-houma-gold'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm tracking-wider text-houma-white mb-3">
                  COLOR
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'px-4 py-2 border text-sm tracking-wider transition-all',
                        selectedColor === color
                          ? 'border-houma-gold bg-houma-gold/10 text-houma-gold'
                          : 'border-houma-white/20 text-houma-white hover:border-houma-gold'
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={cn(
                    'flex-1 py-4 text-center tracking-wider transition-all',
                    product.inStock
                      ? 'bg-houma-gold text-houma-black hover:bg-houma-gold/90'
                      : 'bg-houma-white/10 text-houma-white/50 cursor-not-allowed'
                  )}
                >
                  {product.inStock ? 'ADD TO BAG' : 'OUT OF STOCK'}
                </button>
                <button
                  onClick={handleWishlist}
                  className="w-14 h-14 border border-houma-white/20 flex items-center justify-center
                           hover:border-houma-gold transition-colors"
                >
                  {isWishlisted ? (
                    <HeartIconSolid className="w-6 h-6 text-houma-gold" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-houma-white" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="w-14 h-14 border border-houma-white/20 flex items-center justify-center
                           hover:border-houma-gold transition-colors"
                >
                  <ShareIcon className="w-6 h-6 text-houma-white" />
                </button>
              </div>

              {/* Product Details Tabs */}
              <div className="border-t border-houma-white/10 pt-6">
                <div className="flex gap-8 mb-6">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={cn(
                      'text-sm tracking-wider pb-2 border-b-2 transition-all',
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
                      'text-sm tracking-wider pb-2 border-b-2 transition-all',
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
                      'text-sm tracking-wider pb-2 border-b-2 transition-all',
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
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-houma-white/10">
                <div className="flex flex-col items-center text-center">
                  <ShieldCheckIcon className="w-8 h-8 text-houma-gold mb-2" />
                  <p className="text-xs text-houma-white/70">Authentic Design</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <TruckIcon className="w-8 h-8 text-houma-gold mb-2" />
                  <p className="text-xs text-houma-white/70">Worldwide Shipping</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <ArrowPathIcon className="w-8 h-8 text-houma-gold mb-2" />
                  <p className="text-xs text-houma-white/70">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20">
              <h2 className="text-3xl font-display tracking-wider text-houma-white mb-8">
                YOU MAY ALSO LIKE
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  src={getImagePath(product.images?.[selectedImage])}
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