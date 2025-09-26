import React, { useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import ProductCard from '@/components/ProductCard'
import { getFeaturedProducts } from '@/lib/products'
import { cn } from '@/lib/utils'

const HomePage = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false,
  })

  const featuredProducts = getFeaturedProducts()

  const [heroInViewRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  const collections = [
    {
      name: 'HERITAGE COLLECTION',
      description: 'Where tradition meets rebellion',
      image: 'Illustration_sans_titre 2_pages-to-jpg-0001.jpg',
      link: '/collections/heritage',
    },
    {
      name: 'SIGNATURE LINE',
      description: 'Defining luxury streetwear',
      image: 'Illustration_sans_titre 2_pages-to-jpg-0003.jpg',
      link: '/collections/signature',
    },
    {
      name: 'STREET ESSENTIALS',
      description: 'Daily culture, elevated',
      image: 'Models1.jpeg',
      link: '/collections/essentials',
    },
  ]

  return (
    <>
      <Head>
        <title>HOUMA - Luxury Streetwear | North African Heritage</title>
        <meta name="description" content="HOUMA - Where North African heritage meets modern luxury streetwear. Discover our exclusive collections rooted in Maghrebi culture." />
      </Head>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY }}
        >
          {/* Hero Background Video/Image */}
          <div className="relative w-full h-full">
            <Image
              src="/Resources/Models/Models3.jpeg"
              alt="HOUMA Hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-houma-black/40 via-houma-black/20 to-houma-black" />
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          ref={heroInViewRef}
          className="relative h-full flex items-center justify-center"
          style={{ opacity: heroOpacity }}
        >
          <div className="houma-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Arabic Text */}
              <p className="houma-arabic text-5xl md:text-7xl text-houma-gold mb-4 opacity-80">
                حُومة
              </p>
              
              {/* Main Title */}
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-display tracking-wider text-houma-white mb-6">
                <span className="block text-gradient-gold">HOUMA</span>
              </h1>
              
              {/* Tagline */}
              <p className="text-lg md:text-xl text-houma-white/80 tracking-[0.3em] mb-12 font-light">
                STRENGTH IN HERITAGE
              </p>

              {/* CTA Button */}
              <div className="flex justify-center">
                <Link href="/shop">
                  <motion.button
                    className="houma-button min-w-[200px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>EXPLORE COLLECTION</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="w-px h-16 bg-gradient-to-b from-houma-gold to-transparent" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Introduction Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay" />
        
        <div className="houma-container relative">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display tracking-wider text-houma-white mb-8">
              THE CULTURAL <span className="text-gradient-gold">VOICE</span> OF MENA
            </h2>
            <p className="text-lg text-houma-white/70 leading-relaxed mb-6">
              Born from the streets of Tunisia, Algeria, and Morocco. HOUMA is more than clothing—it's a 
              movement. We blend thousand-year-old traditions with future-forward design, creating pieces 
              that honor our heritage while pushing boundaries.
            </p>
            <p className="text-sm text-houma-gold tracking-[0.3em]">
              LUXURY WITHOUT COMPROMISE. CULTURE WITHOUT APOLOGY.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collections Carousel */}
      <section className="py-32 bg-gradient-luxury relative">
        <div className="houma-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">EXPLORE</p>
            <h2 className="text-4xl md:text-5xl font-display tracking-wider text-houma-white">
              COLLECTIONS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.name}
                className="group relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Link href={collection.link}>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={`/Resources/Models/${collection.image}`}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-houma-black via-houma-black/20 to-transparent" />
                    
                    {/* Collection Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-2xl font-display tracking-wider text-houma-white mb-2">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-houma-white/70 mb-4">{collection.description}</p>
                      
                      <div className="flex items-center text-houma-gold group-hover:gap-3 transition-all duration-300">
                        <span className="text-xs tracking-[0.2em]">DISCOVER</span>
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 relative">
        <div className="houma-container">
          <motion.div
            className="flex justify-between items-end mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">CURATED</p>
              <h2 className="text-4xl md:text-5xl font-display tracking-wider text-houma-white">
                FEATURED DROPS
              </h2>
            </div>
            <Link href="/shop">
              <button className="houma-link text-houma-gold text-sm tracking-[0.2em]">
                VIEW ALL
              </button>
            </Link>
          </motion.div>

          {/* Products Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index === 0 ? 'w-8 bg-houma-gold' : 'bg-houma-white/20'
                )}
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        
        <div className="houma-container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">OUR STORY</p>
              <h2 className="text-4xl md:text-5xl font-display tracking-wider text-houma-white mb-8">
                ROOTED IN <span className="text-stroke-gold">CULTURE</span>
              </h2>
              <p className="text-lg text-houma-white/70 leading-relaxed mb-6">
                Every thread tells a story. Every pattern carries meaning. From the geometric beauty of 
                Berber textiles to the flowing elegance of traditional garments, we honor our ancestors 
                while writing the future of fashion.
              </p>
              <p className="text-lg text-houma-white/70 leading-relaxed mb-8">
                HOUMA isn't just a brand—it's a bridge between worlds, a celebration of identity, 
                and a bold statement that luxury has many faces.
              </p>
              
              <Link href="/about">
                <button className="houma-button">
                  <span>OUR MANIFESTO</span>
                </button>
              </Link>
            </motion.div>

            <motion.div
              className="relative aspect-square"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 gold-glow rounded-lg" />
              <Image
                src="/Resources/Logos-and-Images/Logo_page-0013.jpg"
                alt="HOUMA Culture"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-gradient-desert relative">
        <div className="absolute inset-0 bg-houma-black/80" />
        
        <div className="houma-container relative">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display tracking-wider text-houma-white mb-4">
              JOIN THE MOVEMENT
            </h2>
            <p className="text-lg text-houma-white/70 mb-8">
              Be the first to know about exclusive drops and cultural events
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent border border-houma-gold/30 text-houma-white 
                         placeholder-houma-white/50 px-6 py-4 focus:outline-none focus:border-houma-gold 
                         transition-colors duration-300"
              />
              <button
                type="submit"
                className="bg-houma-gold text-houma-black px-8 py-4 uppercase tracking-widest 
                         font-light hover:bg-houma-gold-light transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default HomePage
