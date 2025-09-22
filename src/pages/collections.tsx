import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const CollectionsPage = () => {
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
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-houma-white/50 mb-6">
              Be the first to know about new drops
            </p>
            <button className="houma-button">
              <span>JOIN THE WAITLIST</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Archive Section */}
      <section className="py-20 bg-houma-smoke">
        <div className="houma-container">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">LEGACY</p>
            <h2 className="text-3xl font-display tracking-wider text-houma-white mb-8">
              COLLECTION ARCHIVE
            </h2>
            <p className="text-houma-white/60 max-w-2xl mx-auto mb-8">
              Every collection is part of our journey. Explore past drops that defined moments 
              in HOUMA's evolution and continue to inspire our future.
            </p>
            <Link href="/archive">
              <button className="text-houma-gold hover:text-houma-gold-light transition-colors duration-300 
                             text-sm tracking-[0.2em] flex items-center gap-2 mx-auto">
                VIEW ARCHIVE
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default CollectionsPage
