import React, { useState, useMemo, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import ProductCard from '@/components/ProductCard'
import { useProducts } from '@/lib/stripe-products'
import { ChevronDownIcon, AdjustmentsHorizontalIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

const ShopPage = () => {
  const router = useRouter()
  const { products, isLoading, error, getCategories, getCollections } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCollection, setSelectedCollection] = useState<string>('all')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  
  // Get dynamic categories and collections from Stripe products
  const categories = getCategories()
  const collections = getCollections()

  // Map URL collection parameters to actual collection names
  const collectionMap: { [key: string]: string } = {
    'el-bidaya': 'EL BIDAYA',
    // 'heritage': 'Heritage Collection',
    // 'signature': 'Signature Line',
    // 'essentials': 'Street Essentials',
    // 'core': 'Core Collection',
    // 'summer': 'Summer Drop',
  }

  // Collection-specific hero data
  const collectionHeroData: { [key: string]: { title: string, subtitle: string, description: string, image: string } } = {
    'EL BIDAYA': {
      title: 'EL BIDAYA',
      subtitle: '',
      description: 'Our most exclusive pieces, crafted with unparalleled attention to detail and luxury materials.',
      image: '/Resources/Logos-and-Images/Logo_page-0002.jpg'
    },
    // 'Heritage Collection': {
    //   title: 'HERITAGE',
    //   subtitle: 'COLLECTION',
    //   description: 'Where ancient traditions meet contemporary design. Each piece honors the rich cultural tapestry of North Africa.',
    //   image: '/Resources/Logos-and-Images/Logo_page-0003.jpg'
    // },
    // 'Signature Line': {
    //   title: 'SIGNATURE',
    //   subtitle: 'LINE',
    //   description: 'Our most exclusive pieces, crafted with unparalleled attention to detail and luxury materials.',
    //   image: '/Resources/Logos-and-Images/Logo_page-0002.jpg'
    // },
    // 'Street Essentials': {
    //   title: 'STREET',
    //   subtitle: 'ESSENTIALS',
    //   description: 'Everyday luxury redefined. Essential pieces that blend comfort, style, and cultural authenticity.',
    //   image: '/Resources/Logos-and-Images/Logo_page-0001.jpg'
    // },
    // 'Core Collection': {
    //   title: 'CORE',
    //   subtitle: 'COLLECTION',
    //   description: 'The foundation of HOUMA. Timeless pieces that define our brand identity and quality standards.',
    //   image: '/Resources/Logos-and-Images/Logo_page-0005.jpg'
    // },
    // 'Summer Drop': {
    //   title: 'SUMMER',
    //   subtitle: 'DROP',
    //   description: 'Lightweight luxury for warmer days. Fresh designs that capture the essence of summer sophistication.',
    //   image: '/Resources/Logos-and-Images/Logo_page-0006.jpg'
    // }
  }

  // Map URL category parameters to actual category names
  const categoryMap: { [key: string]: string } = {
    'hoodies': 'Hoodies',
    'jackets': 'Jackets',
    'pants': 'Pants',
    't-shirts': 'T-Shirts',
    'tracksuits': 'Tracksuits',
    'shirts': 'Shirts',
    'shorts': 'Shorts',
    'accessories': 'Accessories',
  }

  // Handle URL query parameters
  useEffect(() => {
    if (router.isReady) {
      const { collection, category, filter } = router.query
      
      if (collection && typeof collection === 'string') {
        // Map URL parameter to actual collection name
        const mappedCollection = collectionMap[collection] || collection
        setSelectedCollection(mappedCollection)
        
        // Auto-scroll to products section when collection filter is applied
        setTimeout(() => {
          const productsSection = document.getElementById('products-section')
          if (productsSection) {
            productsSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            })
          }
        }, 300)
      }
      
      if (category && typeof category === 'string') {
        // Map URL parameter to actual category name
        const mappedCategory = categoryMap[category] || category
        setSelectedCategory(mappedCategory)
        
        // Auto-scroll to products section when category filter is applied
        setTimeout(() => {
          const productsSection = document.getElementById('products-section')
          if (productsSection) {
            productsSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            })
          }
        }, 300)
      }
      
      if (filter && typeof filter === 'string') {
        setSelectedFilter(filter)
        
        // Auto-scroll to products section when filter is applied
        setTimeout(() => {
          const productsSection = document.getElementById('products-section')
          if (productsSection) {
            productsSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            })
          }
        }, 300)
      }
    }
  }, [router.isReady, router.query])

  // Get current hero data based on selected collection or filter
  const currentHeroData = useMemo(() => {
    if (selectedFilter === 'new') {
      return {
        title: 'NEW',
        subtitle: 'ARRIVALS',
        description: 'Discover our latest pieces that blend contemporary design with timeless cultural heritage.',
        image: '/Resources/Logos-and-Images/Logo_page-0001.jpg'
      }
    }
    
    if (selectedCollection === 'all') {
      return {
        title: 'EXPLORE',
        subtitle: 'THE COLLECTION',
        description: 'Each piece tells a story of heritage reimagined. Discover luxury streetwear that honors tradition while defining the future.',
        image: '/Resources/Logos-and-Images/Logo_page-0004.jpg'
      }
    }
    return collectionHeroData[selectedCollection] || {
      title: 'EXPLORE',
      subtitle: 'THE COLLECTION',
      description: 'Each piece tells a story of heritage reimagined. Discover luxury streetwear that honors tradition while defining the future.',
      image: '/Resources/Logos-and-Images/Logo_page-0004.jpg'
    }
  }, [selectedCollection, selectedFilter])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // When "NEW ARRIVALS" is selected, show all products (ignore category/collection filters)
    if (selectedFilter === 'new') {
      // Show all products - no filtering needed
    } else {
      // Category filter (only apply when not in "new arrivals" mode)
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === selectedCategory)
      }

      // Collection filter (only apply when not in "new arrivals" mode)
      if (selectedCollection !== 'all') {
        filtered = filtered.filter(p => p.collection === selectedCollection)
      }
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return filtered
  }, [selectedCategory, selectedCollection, selectedFilter, sortBy, priceRange])

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
  ]

  return (
    <>
      <Head>
        <title>Shop - HOUMA | Luxury Streetwear Collection</title>
        <meta name="description" content="Explore HOUMA's complete collection of luxury streetwear. Premium pieces inspired by North African heritage." />
      </Head>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={currentHeroData.image}
            alt={`HOUMA ${currentHeroData.title} ${currentHeroData.subtitle}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-houma-black/80 via-houma-black/70 to-houma-black/90" />
        </motion.div>

        <div className="relative h-full flex items-center justify-center text-center">
          <motion.div
            className="houma-container"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            key={`${selectedCollection}-${selectedFilter}`} // Re-animate when collection or filter changes
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-display tracking-wider text-houma-gold mb-4 sm:mb-5 md:mb-6 px-4">
              {currentHeroData.title}
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-display tracking-wider text-houma-white mb-4 sm:mb-5 md:mb-6 px-4">
              {currentHeroData.subtitle}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-houma-white/80 max-w-2xl mx-auto px-4">
              {currentHeroData.description}
            </p>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-houma-gold to-transparent" />
        </motion.div>
      </section>

      {/* Filters Bar */}
      <section id="products-section" className="sticky top-20 lg:top-24 bg-houma-black/95 backdrop-blur-xl border-b border-houma-gold/20 z-40">
        <div className="houma-container">
          {/* Mobile Layout - Stacked */}
          <div className="md:hidden py-4 space-y-3">
            {/* Top Row: Filters and Product Count */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-houma-white hover:text-houma-gold transition-colors"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                <span className="text-sm tracking-wider">FILTERS</span>
              </button>
              <p className="text-sm text-houma-white/50">
                {filteredProducts.length} PRODUCTS
              </p>
            </div>
            
            {/* Bottom Row: Sort and View Options */}
            <div className="flex items-center justify-between">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent text-houma-white text-sm tracking-wider 
                           pr-8 focus:outline-none cursor-pointer hover:text-houma-gold transition-colors"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-houma-white/50 pointer-events-none" />
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid' ? 'text-houma-gold' : 'text-houma-white/50 hover:text-houma-white'
                  )}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list' ? 'text-houma-gold' : 'text-houma-white/50 hover:text-houma-white'
                  )}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Horizontal */}
          <div className="hidden md:flex items-center justify-between py-4">
            {/* Left: Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-houma-white hover:text-houma-gold transition-colors"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span className="text-sm tracking-wider">FILTERS</span>
            </button>

            {/* Center: Result Count */}
            <p className="text-sm text-houma-white/50">
              {filteredProducts.length} PRODUCTS
            </p>

            {/* Right: Sort and View Options */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent text-houma-white text-sm tracking-wider 
                           pr-8 focus:outline-none cursor-pointer hover:text-houma-gold transition-colors"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-houma-white/50 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid' ? 'text-houma-gold' : 'text-houma-white/50 hover:text-houma-white'
                  )}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list' ? 'text-houma-gold' : 'text-houma-white/50 hover:text-houma-white'
                  )}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="houma-container">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <AnimatePresence>
              {showFilters && (
                <motion.aside
                  className="w-64 flex-shrink-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-8">
                    {/* Filters */}
                    <div>
                      <h3 className="text-xs font-light tracking-[0.3em] text-houma-gold mb-4">
                        FILTERS
                      </h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => setSelectedFilter('all')}
                          className={cn(
                            'block w-full text-left text-sm transition-colors',
                            selectedFilter === 'all' 
                              ? 'text-houma-gold' 
                              : 'text-houma-white/70 hover:text-houma-white'
                          )}
                        >
                          All Products
                        </button>
                        <button
                          onClick={() => setSelectedFilter('new')}
                          className={cn(
                            'block w-full text-left text-sm transition-colors',
                            selectedFilter === 'new' 
                              ? 'text-houma-gold' 
                              : 'text-houma-white/70 hover:text-houma-white'
                          )}
                        >
                          New Arrivals
                        </button>
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h3 className="text-xs font-light tracking-[0.3em] text-houma-gold mb-4">
                        CATEGORIES
                      </h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className={cn(
                            'block w-full text-left text-sm transition-colors',
                            selectedCategory === 'all' 
                              ? 'text-houma-gold' 
                              : 'text-houma-white/70 hover:text-houma-white'
                          )}
                        >
                          All Categories
                        </button>
                        {categories.length > 0 ? categories.map(category => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                              'block w-full text-left text-sm transition-colors',
                              selectedCategory === category 
                                ? 'text-houma-gold' 
                                : 'text-houma-white/70 hover:text-houma-white'
                            )}
                          >
                            {category}
                          </button>
                        )) : (
                          <span className="text-houma-white/30 text-sm">Loading categories...</span>
                        )}
                      </div>
                    </div>

                    {/* Collections */}
                    <div>
                      <h3 className="text-xs font-light tracking-[0.3em] text-houma-gold mb-4">
                        COLLECTIONS
                      </h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => setSelectedCollection('all')}
                          className={cn(
                            'block w-full text-left text-sm transition-colors',
                            selectedCollection === 'all' 
                              ? 'text-houma-gold' 
                              : 'text-houma-white/70 hover:text-houma-white'
                          )}
                        >
                          All Collections
                        </button>
                        {collections.length > 0 ? collections.map(collection => (
                          <button
                            key={collection}
                            onClick={() => setSelectedCollection(collection)}
                            className={cn(
                              'block w-full text-left text-sm transition-colors',
                              selectedCollection === collection 
                                ? 'text-houma-gold' 
                                : 'text-houma-white/70 hover:text-houma-white'
                            )}
                          >
                            {collection}
                          </button>
                        )) : (
                          <span className="text-houma-white/30 text-sm">Loading collections...</span>
                        )}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="text-xs font-light tracking-[0.3em] text-houma-gold mb-4">
                        PRICE RANGE
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className="block text-xs text-houma-white/50 mb-2">Min Price</label>
                            <input
                              type="number"
                              min="0"
                              max="1000"
                              value={priceRange[0]}
                              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                              className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                       px-3 py-2 focus:outline-none focus:border-houma-gold transition-colors"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-houma-white/50 mb-2">Max Price</label>
                            <input
                              type="number"
                              min="0"
                              max="1000"
                              value={priceRange[1]}
                              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                              className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                       px-3 py-2 focus:outline-none focus:border-houma-gold transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <button
                      onClick={() => {
                        setSelectedCategory('all')
                        setSelectedCollection('all')
                        setSelectedFilter('all')
                        setPriceRange([0, 1000])
                      }}
                      className="text-sm text-houma-white/50 hover:text-houma-gold transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Products Grid/List */}
            <div className="flex-1">
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-houma-gold"></div>
                  <p className="text-houma-white/50 mt-4">Loading products from Stripe...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-500 mb-4">{error}</p>
                  <p className="text-houma-white/50">Please check your Stripe configuration.</p>
                </div>
              ) : (
              <AnimatePresence mode="wait">
                {filteredProducts.length === 0 && products.length > 0 ? (
                  <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-houma-white/50 text-lg mb-4">No products found</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all')
                        setSelectedCollection('all')
                        setSelectedFilter('all')
                        setPriceRange([0, 1000])
                      }}
                      className="houma-button"
                    >
                      <span>CLEAR FILTERS</span>
                    </button>
                  </motion.div>
                ) : filteredProducts.length > 0 ? (
                  <motion.div
                    className={cn(
                      'grid gap-6',
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-houma-gold"></div>
                    <p className="text-houma-white/50 mt-4">Loading products...</p>
                  </div>
                )}
              </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ShopPage
