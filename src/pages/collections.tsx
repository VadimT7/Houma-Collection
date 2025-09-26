import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline'

const CollectionsPage = () => {
  const router = useRouter()
  const [waitlistStep, setWaitlistStep] = useState<'button' | 'email' | 'success'>('button')
  const [email, setEmail] = useState('')
  
  const handleJoinWaitlist = () => {
    setWaitlistStep('email')
  }
  
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setWaitlistStep('success')
      // Here you would normally send the email to your backend
      console.log('Waitlist email:', email)
    }
  }
  
  const collections = [
    {
      id: 'heritage',
      name: 'HERITAGE COLLECTION',
      season: 'FW24',
      description: 'Where tradition meets rebellion. Each piece in this collection tells a story of North African heritage reimagined for modern streets.',
      tagline: 'Roots Run Deep',
      image: 'Illustration_sans_titre 2_pages-to-jpg-0001.jpg',
      featured: true,
    },
    {
      id: 'signature',
      name: 'SIGNATURE LINE',
      season: 'PERMANENT',
      description: 'The essence of HOUMA. Timeless pieces that define luxury streetwear with unmistakable North African DNA.',
      tagline: 'Icons of Identity',
      image: 'Illustration_sans_titre 2_pages-to-jpg-0003.jpg',
      featured: true,
    },
    {
      id: 'essentials',
      name: 'STREET ESSENTIALS',
      season: 'SS24',
      description: 'Daily culture, elevated. Essential pieces for the modern nomad who carries heritage in every step.',
      tagline: 'Everyday Luxury',
      image: 'Models1.jpeg',
      featured: false,
    },
    {
      id: 'core',
      name: 'CORE COLLECTION',
      season: 'PERMANENT',
      description: 'The foundation of your wardrobe. Minimalist designs with maximum cultural impact.',
      tagline: 'Pure Expression',
      image: 'Illustration_sans_titre 2_pages-to-jpg-0005.jpg',
      featured: false,
    },
    {
      id: 'summer',
      name: 'SUMMER DROP',
      season: 'SS25',
      description: 'Desert heat meets street cool. Light fabrics and bold statements for the endless summer.',
      tagline: 'Solar Power',
      image: 'Models2.jpeg',
      featured: false,
    },
  ]

  const upcomingDrops = [
    {
      name: 'RAMADAN CAPSULE',
      date: 'MARCH 2025',
      description: 'A spiritual journey through fabric',
    },
    {
      name: 'ATLAS EXPEDITION',
      date: 'MAY 2025',
      description: 'Mountain-inspired technical wear',
    },
    {
      name: 'MEDINA NIGHTS',
      date: 'JULY 2025',
      description: 'After-dark luxury collection',
    },
  ]

  return (
    <>
      <Head>
        <title>Collections - HOUMA | Luxury Streetwear Lines</title>
        <meta name="description" content="Explore HOUMA's exclusive collections. From Heritage to Signature lines, discover luxury streetwear rooted in North African culture." />
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
            src="/Resources/Logos-and-Images/Logo_page-0006.jpg"
            alt="HOUMA Collections"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-houma-black/60 via-houma-black/40 to-houma-black" />
        </motion.div>

        <div className="relative h-full flex items-center justify-center text-center">
          <motion.div
            className="houma-container"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-6">CURATED</p>
            <h1 className="text-6xl md:text-8xl font-display tracking-wider text-houma-white mb-6">
              COLLECTIONS
            </h1>
            <p className="text-xl text-houma-white/80 max-w-2xl mx-auto">
              Each collection is a chapter in our story. A celebration of heritage, 
              a statement of identity, a vision of the future.
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

      {/* Featured Collections */}
      <section className="py-20">
        <div className="houma-container">
          {collections.filter(c => c.featured).map((collection, index) => (
            <motion.div
              key={collection.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32 last:mb-0 ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Image */}
              <div className={`relative aspect-[3/4] overflow-hidden ${
                index % 2 === 1 ? 'lg:col-start-2' : ''
              }`}>
                <Image
                  src={`/Resources/Models/${collection.image}`}
                  alt={collection.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-houma-black/30 to-transparent" />
                
                {/* Season Badge */}
                <div className="absolute top-8 left-8">
                  <span className="px-4 py-2 bg-houma-black/50 backdrop-blur-sm text-houma-gold text-xs tracking-[0.3em]">
                    {collection.season}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className={`flex flex-col justify-center ${
                index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''
              }`}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">
                    {collection.tagline.toUpperCase()}
                  </p>
                  <h2 className="text-4xl font-display tracking-wider text-houma-white mb-6">
                    {collection.name}
                  </h2>
                  <p className="text-lg text-houma-white/70 leading-relaxed mb-8">
                    {collection.description}
                  </p>
                  
                  <Link href={`/shop?collection=${collection.id}`}>
                    <button className="houma-button group">
                      <span className="flex items-center gap-3">
                        EXPLORE COLLECTION
                        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                      </span>
                    </button>
                  </Link>

                  {/* Arabic accent */}
                  <div className="mt-12 pt-8 border-t border-houma-white/10">
                    <p className="houma-arabic text-2xl text-houma-gold/50">
                      مجموعة التراث
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Collections Grid */}
      <section className="py-20 bg-gradient-luxury">
        <div className="houma-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">EXPLORE</p>
            <h2 className="text-4xl font-display tracking-wider text-houma-white">
              ALL COLLECTIONS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                className="group relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/shop?collection=${collection.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={`/Resources/Models/${collection.image}`}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-houma-black via-houma-black/20 to-transparent" />
                    
                    {/* Collection Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-xs text-houma-gold tracking-[0.2em] mb-2">
                        {collection.season}
                      </p>
                      <h3 className="text-xl font-display tracking-wider text-houma-white mb-2">
                        {collection.name}
                      </h3>
                      <p className="text-xs text-houma-white/60">
                        {collection.tagline}
                      </p>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-houma-black/60 opacity-0 group-hover:opacity-100 
                                  transition-opacity duration-500 flex items-center justify-center">
                      <div className="text-center transform translate-y-4 group-hover:translate-y-0 
                                    transition-transform duration-500">
                        <p className="text-houma-gold text-sm tracking-[0.2em] mb-2">DISCOVER</p>
                        <ArrowRightIcon className="w-6 h-6 text-houma-gold mx-auto" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Drops */}
      <section className="py-20">
        <div className="houma-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">FUTURE</p>
            <h2 className="text-4xl font-display tracking-wider text-houma-white">
              UPCOMING DROPS
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {upcomingDrops.map((drop, index) => (
              <motion.div
                key={drop.name}
                className="flex items-center justify-between py-8 border-b border-houma-white/10 last:border-0"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div>
                  <h3 className="text-xl font-display tracking-wider text-houma-white mb-1">
                    {drop.name}
                  </h3>
                  <p className="text-sm text-houma-white/60">
                    {drop.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-houma-gold text-sm tracking-[0.2em]">
                    {drop.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-16 min-h-[120px] flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              {waitlistStep === 'button' && (
                <motion.div
                  key="button"
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <p className="text-sm text-houma-white/50 mb-6">
                    Be the first to know about new drops
                  </p>
                  <button onClick={handleJoinWaitlist} className="houma-button">
                    <span>JOIN THE WAITLIST</span>
                  </button>
                </motion.div>
              )}
              
              {waitlistStep === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-md mx-auto"
                >
                  <p className="text-sm text-houma-white/50 mb-6">
                    Enter your email to join the waitlist
                  </p>
                  <form onSubmit={handleEmailSubmit} className="flex gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 bg-transparent border border-houma-gold/30 text-houma-white 
                               placeholder-houma-white/50 px-6 py-4 focus:outline-none focus:border-houma-gold 
                               transition-colors duration-300"
                    />
                    <button
                      type="submit"
                      className="bg-houma-gold text-houma-black px-8 py-4 uppercase tracking-widest 
                               font-light hover:bg-houma-gold-light transition-all duration-300 whitespace-nowrap"
                    >
                      JOIN
                    </button>
                  </form>
                </motion.div>
              )}
              
              {waitlistStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto w-16 h-16 bg-houma-gold rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckIcon className="w-8 h-8 text-houma-black" />
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-2xl font-display tracking-wider text-houma-white mb-2"
                  >
                    WELCOME TO THE WAITLIST
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-sm text-houma-white/70 mb-4"
                  >
                    You'll be the first to know about exclusive drops
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-xs text-houma-gold/80 tracking-[0.3em] font-light"
                  >
                    EXCLUSIVE ACCESS • EARLY RELEASE
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Luxury Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-houma-black via-houma-smoke/20 to-houma-black">
          {/* Flowing Gold Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-houma-gold/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          
          {/* Flowing Lines */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-houma-gold/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-houma-gold/15 to-transparent"
              animate={{
                x: ['100%', '-100%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
          
          {/* Central Glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-houma-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="houma-container relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            {/* Heritage Badge */}
            <motion.div
              className="inline-block mb-8"
              initial={{ scale: 0, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-houma-gold/20 blur-xl rounded-full" />
                <div className="relative bg-gradient-to-r from-houma-gold/10 to-houma-gold/5 backdrop-blur-sm border border-houma-gold/30 rounded-full px-8 py-3">
                  <p className="text-houma-gold text-xs tracking-[0.4em] font-light">
                    HERITAGE
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h2
              className="text-5xl md:text-6xl font-display tracking-wider text-houma-white mb-8 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <span className="relative">
                HOUMA. THE HISTORY OF ONE.
                {/* Title Glow */}
                <div className="absolute inset-0 text-houma-gold/20 blur-sm">
                  HOUMA. THE HISTORY OF ONE.
                </div>
              </span>
            </motion.h2>

            {/* Description */}
            <motion.div
              className="max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-houma-white/80 leading-relaxed mb-6">
                Discover the rich cultural tapestry that shapes HOUMA. From ancient traditions 
                to modern innovation, learn how our heritage continues to shape all luxury streetwear.
              </p>
              
              {/* Arabic Accent */}
              <motion.div
                className="inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <p className="houma-arabic text-2xl text-houma-gold/60 font-light">
                  تراث عميق
                </p>
              </motion.div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              viewport={{ once: true }}
            >
              <Link href="/about">
                <motion.button
                  className="group relative overflow-hidden bg-gradient-to-r from-houma-gold/10 to-houma-gold/5 
                           backdrop-blur-sm border border-houma-gold/40 text-houma-gold px-12 py-4 
                           uppercase tracking-[0.3em] font-light transition-all duration-500 hover:border-houma-gold/80
                           hover:from-houma-gold/20 hover:to-houma-gold/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Button Glow */}
                  <div className="absolute inset-0 bg-houma-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Button Content */}
                  <span className="relative flex items-center gap-3">
                    LEARN OUR STORY
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRightIcon className="w-4 h-4" />
                    </motion.div>
                  </span>
                  
                  {/* Flowing Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-houma-gold/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default CollectionsPage
