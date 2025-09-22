import React, { useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
import { getProductById, products, getProductsByCategory } from '@/lib/products'
import { formatPrice, getImagePath, cn } from '@/lib/utils'
import ProductCard from '@/components/ProductCard'

interface ProductPageProps {
  product: Product
  relatedProducts: Product[]
}

const ProductDetailPage: React.FC<ProductPageProps> = ({ product, relatedProducts }) => {
  const router = useRouter()
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showZoom, setShowZoom] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'story' | 'care'>('details')

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('This product is currently out of stock')
      return
    }
    
    addItem(product, selectedSize, selectedColor)
    toast.success('Added to your bag')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <>
      <Head>
        <title>{product.name} - HOUMA</title>
        <meta name="description" content={product.description} />
      </Head>

      {/* Breadcrumbs */}
      <div className="pt-28 pb-4 houma-container">
        <nav className="flex items-center gap-2 text-xs text-houma-white/50">
          <Link href="/" className="hover:text-houma-gold transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-houma-gold transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-houma-gold transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-houma-white">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="py-12">
        <div className="houma-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images Section */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-houma-smoke mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    className="relative w-full h-full cursor-zoom-in"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setShowZoom(true)}
                  >
                    <Image
                      src={getImagePath(product.images[selectedImage])}
                      alt={`${product.name} - Image ${selectedImage + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />
                    
                    {/* Zoom Icon */}
                    <div className="absolute top-4 right-4 p-2 bg-houma-black/50 backdrop-blur-sm rounded-full">
                      <MagnifyingGlassPlusIcon className="w-5 h-5 text-houma-white" />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-houma-black/50 
                               backdrop-blur-sm rounded-full hover:bg-houma-black/70 transition-colors"
                    >
                      <ChevronLeftIcon className="w-5 h-5 text-houma-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-houma-black/50 
                               backdrop-blur-sm rounded-full hover:bg-houma-black/70 transition-colors"
                    >
                      <ChevronRightIcon className="w-5 h-5 text-houma-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'relative aspect-[3/4] overflow-hidden bg-houma-smoke transition-all duration-300',
                        selectedImage === index 
                          ? 'ring-2 ring-houma-gold' 
                          : 'opacity-60 hover:opacity-100'
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
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-8">
                <p className="text-xs text-houma-gold tracking-[0.3em] mb-2">
                  {product.collection.toUpperCase()}
                </p>
                <h1 className="text-4xl font-display tracking-wider text-houma-white mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl font-light text-houma-gold">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Description */}
              <p className="text-houma-white/70 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-xs tracking-[0.2em] text-houma-white/50 mb-3">
                  COLOR: <span className="text-houma-white">{selectedColor}</span>
                </h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'w-10 h-10 rounded-full border-2 transition-all duration-300',
                        selectedColor === color 
                          ? 'border-houma-gold scale-110' 
                          : 'border-houma-white/20 hover:border-houma-white/40'
                      )}
                      style={{
                        backgroundColor: 
                          color === 'Midnight Black' ? '#000000' :
                          color === 'Desert Sand' ? '#D2B48C' :
                          color === 'Atlas White' ? '#FFFFFF' :
                          color === 'Obsidian' ? '#1C1C1C' :
                          color === 'Sahara Gold' ? '#D4AF37' :
                          '#2C2C2C'
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs tracking-[0.2em] text-houma-white/50">
                    SIZE: <span className="text-houma-white">{selectedSize}</span>
                  </h3>
                  <button className="text-xs text-houma-gold hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'py-3 border transition-all duration-300',
                        selectedSize === size
                          ? 'bg-houma-gold text-houma-black border-houma-gold'
                          : 'border-houma-white/20 text-houma-white hover:border-houma-gold'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={cn(
                    'flex-1 py-4 uppercase tracking-widest transition-all duration-300',
                    product.inStock
                      ? 'bg-houma-gold text-houma-black hover:bg-houma-gold-light'
                      : 'bg-houma-smoke text-houma-white/50 cursor-not-allowed'
                  )}
                >
                  {product.inStock ? 'Add to Bag' : 'Out of Stock'}
                </button>
                
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-4 border border-houma-white/20 hover:border-houma-gold transition-colors"
                >
                  {isWishlisted ? (
                    <HeartIconSolid className="w-5 h-5 text-houma-gold" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-houma-white" />
                  )}
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-4 border border-houma-white/20 hover:border-houma-gold transition-colors"
                >
                  <ShareIcon className="w-5 h-5 text-houma-white" />
                </button>
              </div>

              {/* Product Benefits */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-houma-white/10">
                <div className="text-center">
                  <TruckIcon className="w-6 h-6 text-houma-gold mx-auto mb-2" />
                  <p className="text-xs text-houma-white/70">Free Shipping</p>
                </div>
                <div className="text-center">
                  <ShieldCheckIcon className="w-6 h-6 text-houma-gold mx-auto mb-2" />
                  <p className="text-xs text-houma-white/70">Authenticity</p>
                </div>
                <div className="text-center">
                  <ArrowPathIcon className="w-6 h-6 text-houma-gold mx-auto mb-2" />
                  <p className="text-xs text-houma-white/70">Easy Returns</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-8">
                <div className="flex gap-8 border-b border-houma-white/10">
                  {(['details', 'story', 'care'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'pb-3 text-sm uppercase tracking-wider transition-all duration-300',
                        activeTab === tab
                          ? 'text-houma-gold border-b-2 border-houma-gold'
                          : 'text-houma-white/50 hover:text-houma-white'
                      )}
                    >
                      {tab === 'story' ? 'Cultural Story' : tab}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="py-6"
                  >
                    {activeTab === 'details' && (
                      <ul className="space-y-2 text-sm text-houma-white/70">
                        <li>• Premium quality materials</li>
                        <li>• Handcrafted with attention to detail</li>
                        <li>• Limited edition piece</li>
                        <li>• Ethically sourced fabrics</li>
                        <li>• Made with cultural authenticity</li>
                      </ul>
                    )}
                    
                    {activeTab === 'story' && (
                      <div className="space-y-4">
                        {product.culturalStory && (
                          <p className="text-houma-white/70 leading-relaxed">
                            {product.culturalStory}
                          </p>
                        )}
                        <div className="pt-4 border-t border-houma-white/10">
                          <p className="houma-arabic text-2xl text-houma-gold mb-2">
                            القوة في التراث
                          </p>
                          <p className="text-xs text-houma-white/50">
                            "Strength in Heritage" - Every piece carries the soul of our culture
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'care' && (
                      <ul className="space-y-2 text-sm text-houma-white/70">
                        <li>• Machine wash cold with like colors</li>
                        <li>• Do not bleach</li>
                        <li>• Tumble dry low</li>
                        <li>• Iron on low heat if needed</li>
                        <li>• Do not dry clean</li>
                      </ul>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-20 bg-gradient-luxury">
        <div className="houma-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-xs text-houma-gold tracking-[0.3em] mb-4">COMPLETE THE LOOK</p>
            <h2 className="text-3xl font-display tracking-wider text-houma-white">
              YOU MIGHT ALSO LIKE
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Zoom Modal */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            className="fixed inset-0 bg-houma-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowZoom(false)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-houma-white hover:text-houma-gold transition-colors"
              onClick={() => setShowZoom(false)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <TransformWrapper>
              <TransformComponent>
                <Image
                  src={getImagePath(product.images[selectedImage])}
                  alt={product.name}
                  width={1200}
                  height={1600}
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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = products.map((product) => ({
    params: { id: product.id },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<ProductPageProps> = async ({ params }) => {
  const product = getProductById(params?.id as string)

  if (!product) {
    return {
      notFound: true,
    }
  }

  // Get related products from same category
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)

  return {
    props: {
      product,
      relatedProducts,
    },
  }
}

export default ProductDetailPage
