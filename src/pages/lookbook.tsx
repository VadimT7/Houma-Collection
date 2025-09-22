import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface Editorial {
  id: string
  title: string
  subtitle: string
  season: string
  images: string[]
  description: string
  quote?: string
}

const LookbookPage = () => {
  const [selectedEditorial, setSelectedEditorial] = useState<Editorial | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const editorials: Editorial[] = [
    {
      id: '1',
      title: 'DESERT DREAMS',
      subtitle: 'Where sand meets street',
      season: 'SS24',
      images: [
        'Illustration_sans_titre 2_pages-to-jpg-0001.jpg',
        'Illustration_sans_titre 2_pages-to-jpg-0002.jpg',
        'Illustration_sans_titre 2_pages-to-jpg-0003.jpg',
      ],
      description: 'A journey through the Sahara reimagined in concrete jungles. This collection bridges the ancient caravan routes with modern urban pathways.',
      quote: 'The desert teaches us that luxury is found in simplicity.',
    },
    {
      id: '2',
      title: 'MEDINA NIGHTS',
      subtitle: 'After dark in the old city',
      season: 'FW24',
      images: [
        'Illustration_sans_titre 2_pages-to-jpg-0004.jpg',
        'Illustration_sans_titre 2_pages-to-jpg-0005.jpg',
        'Illustration_sans_titre 2_pages-to-jpg-0006.jpg',
      ],
      description: 'When the sun sets over the medina, a different energy emerges. Gold threads catch moonlight, and shadows become statements.',
      quote: 'In darkness, we find our brightest expression.',
    },
    {
      id: '3',
      title: 'ATLAS RISING',
      subtitle: 'Mountains of possibility',
      season: 'SS25',
      images: [
        'Models1.jpeg',
        'Models2.jpeg',
        'Models3.jpeg',
      ],
      description: 'Inspired by the Atlas Mountains that spine North Africa, this editorial explores elevation—both literal and metaphorical.',
      quote: 'We climb not to escape, but to see further.',
    },
    {
      id: '4',
      title: 'SOUK STORIES',
      subtitle: 'Markets and memories',
      season: 'CAPSULE',
      images: [
        'Illustration_sans_titre 2_pages-to-jpg-0007.jpg',
        'Illustration_sans_titre 2_pages-to-jpg-0008.jpg',
        'Illustration_sans_titre 2_pages-to-jpg-0009.jpg',
      ],
      description: 'Every market stall tells a story. This capsule collection captures the vibrant chaos and hidden order of North African souks.',
    },
  ]

  const nextImage = () => {
    if (selectedEditorial) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedEditorial.images.length
      )
    }
  }

  const prevImage = () => {
    if (selectedEditorial) {
      setCurrentImageIndex((prev) => 
        (prev - 1 + selectedEditorial.images.length) % selectedEditorial.images.length
      )
    }
  }

  // Auto-play functionality
  React.useEffect(() => {
    if (isPlaying && selectedEditorial) {
      const interval = setInterval(nextImage, 3000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, selectedEditorial, currentImageIndex])

  return (
    <>
      <Head>
        <title>Lookbook - HOUMA | Editorial & Campaigns</title>
        <meta name="description" content="Explore HOUMA's editorial lookbooks and campaigns. Where North African culture meets high fashion photography." />
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
            src="/Resources/Logos-and-Images/Logo_page-0007.jpg"
            alt="HOUMA Lookbook"
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
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-6">EDITORIAL</p>
            <h1 className="text-6xl md:text-8xl font-display tracking-wider text-houma-white mb-6">
              LOOKBOOK
            </h1>
            <p className="text-xl text-houma-white/80 max-w-2xl mx-auto">
              Visual narratives that transcend fashion. Each editorial is a cultural statement, 
              a story told through fabric and form.
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

      {/* Editorial Grid */}
      <section className="py-20">
        <div className="houma-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {editorials.map((editorial, index) => (
              <motion.div
                key={editorial.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => {
                  setSelectedEditorial(editorial)
                  setCurrentImageIndex(0)
                  setIsPlaying(false)
                }}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-houma-smoke">
                  <Image
                    src={`/Resources/Models/${editorial.images[0]}`}
                    alt={editorial.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-houma-black via-transparent to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 
                                group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-houma-gold text-xs tracking-[0.3em] mb-2">
                      {editorial.season}
                    </p>
                    <h2 className="text-3xl font-display tracking-wider text-houma-white mb-2">
                      {editorial.title}
                    </h2>
                    <p className="text-sm text-houma-white/70">
                      {editorial.subtitle}
                    </p>
                  </div>

                  {/* View More Indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-20 h-20 bg-houma-black/50 backdrop-blur-sm rounded-full 
                                  flex items-center justify-center border border-houma-gold/30">
                      <span className="text-xs text-houma-white tracking-wider">VIEW</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Magazine Layout Section */}
      <section className="py-32 bg-gradient-luxury relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10" />
        
        <div className="houma-container relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">FEATURED</p>
            <h2 className="text-4xl font-display tracking-wider text-houma-white">
              CAMPAIGN HIGHLIGHTS
            </h2>
          </motion.div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-12 gap-4">
            <motion.div
              className="col-span-12 md:col-span-8 aspect-[16/9] relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Image
                src="/Resources/Models/Illustration_sans_titre 2_pages-to-jpg-0010.jpg"
                alt="Campaign Feature"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-houma-black/50 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-3xl font-display text-houma-white mb-2">
                  HERITAGE REIMAGINED
                </h3>
                <p className="text-houma-white/70">Spring/Summer 2024</p>
              </div>
            </motion.div>

            <motion.div
              className="col-span-12 md:col-span-4 aspect-square relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Image
                src="/Resources/Logos-and-Images/Logo_page-0002.jpg"
                alt="Logo Design"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              className="col-span-6 md:col-span-4 aspect-[3/4] relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Image
                src="/Resources/Models/Models1.jpeg"
                alt="Editorial 1"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              className="col-span-6 md:col-span-4 aspect-[3/4] relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Image
                src="/Resources/Models/Models2.jpeg"
                alt="Editorial 2"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              className="col-span-12 md:col-span-4 bg-houma-smoke p-8 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <p className="houma-arabic text-3xl text-houma-gold mb-4">
                  الجمال في التفاصيل
                </p>
                <p className="text-xs text-houma-white/50 tracking-[0.2em]">
                  BEAUTY IN DETAILS
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Behind The Scenes */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pattern-overlay opacity-5" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-transparent via-houma-gold to-transparent" />
        <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-transparent via-houma-gold to-transparent" />
        
        <div className="houma-container relative">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-houma-gold" />
              <p className="text-houma-gold text-xs tracking-[0.3em]">PROCESS</p>
              <div className="w-8 h-px bg-houma-gold" />
            </div>
            <h2 className="text-3xl md:text-5xl font-display tracking-wider text-houma-white mb-4">
              BEHIND THE LENS
            </h2>
            <p className="text-sm text-houma-white/60 tracking-[0.2em]">
              THE ARTISTRY OF VISUAL STORYTELLING
            </p>
          </motion.div>

          {/* Main Video Section */}
          <motion.div
            className="relative aspect-video bg-houma-smoke overflow-hidden group rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <video
              className="w-full h-full object-cover filter brightness-40 blur-[1px]"
              controls
              preload="metadata"
              poster="/Resources/Models/Models3.jpeg"
              loop
              autoPlay
              muted
              playsInline
            >
              <source src="/Resources/Models/BTSVideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-houma-black/80 via-houma-black/40 to-houma-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-houma-black/30 via-transparent to-houma-black/30" />
            
            {/* Text overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-center px-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="max-w-4xl">
                <motion.p 
                  className="text-houma-gold text-sm tracking-[0.4em] mb-6 font-light"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  EVERY SHOOT IS A CEREMONY
                </motion.p>
                <motion.h3 
                  className="text-2xl md:text-4xl font-display tracking-wider text-houma-white mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  A CELEBRATION OF CULTURE, CRAFT, AND CREATIVITY
                </motion.h3>
                <motion.p 
                  className="text-base md:text-lg text-houma-white/80 max-w-2xl mx-auto leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  Witness the artistry behind our visual narratives. Where tradition meets innovation, 
                  and every frame tells a story of heritage reimagined.
                </motion.p>
              </div>
            </motion.div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-houma-gold/30" />
            <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-houma-gold/30" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-houma-gold/30" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-houma-gold/30" />
          </motion.div>

          {/* Bottom Quote Section */}
          <motion.div
            className="mt-12 md:mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-px bg-houma-gold/50" />
                <div className="w-2 h-2 bg-houma-gold rounded-full" />
                <div className="w-16 h-px bg-houma-gold/50" />
              </div>
              <blockquote className="text-lg md:text-xl text-houma-white/70 italic font-light leading-relaxed">
                "In every frame, we capture not just fashion, but the soul of a culture that refuses to be forgotten."
              </blockquote>
              <p className="text-sm text-houma-gold/70 mt-4 tracking-[0.2em]">
                — HOUMA CREATIVE DIRECTOR
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Editorial Viewer Modal */}
      <AnimatePresence>
        {selectedEditorial && (
          <motion.div
            className="fixed inset-0 bg-houma-black z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 z-10 bg-gradient-to-b from-houma-black to-transparent">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-houma-gold text-xs tracking-[0.3em] mb-2">
                    {selectedEditorial.season}
                  </p>
                  <h2 className="text-3xl font-display text-houma-white">
                    {selectedEditorial.title}
                  </h2>
                  <p className="text-sm text-houma-white/70 mt-1">
                    {selectedEditorial.subtitle}
                  </p>
                </div>
                
                <button
                  onClick={() => setSelectedEditorial(null)}
                  className="p-2 hover:bg-houma-white/10 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-houma-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Image Viewer */}
            <div className="relative h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  className="relative w-full h-full max-w-6xl mx-auto px-4"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={`/Resources/Models/${selectedEditorial.images[currentImageIndex]}`}
                    alt={`${selectedEditorial.title} - ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 p-3 bg-houma-black/50 backdrop-blur-sm rounded-full 
                         hover:bg-houma-black/70 transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6 text-houma-white" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 p-3 bg-houma-black/50 backdrop-blur-sm rounded-full 
                         hover:bg-houma-black/70 transition-colors"
              >
                <ChevronRightIcon className="w-6 h-6 text-houma-white" />
              </button>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-houma-black to-transparent">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 hover:bg-houma-white/10 rounded-full transition-colors"
                    >
                      {isPlaying ? (
                        <PauseIcon className="w-5 h-5 text-houma-white" />
                      ) : (
                        <PlayIcon className="w-5 h-5 text-houma-white" />
                      )}
                    </button>
                    
                    <div className="flex gap-1">
                      {selectedEditorial.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={cn(
                            'w-2 h-2 rounded-full transition-all duration-300',
                            currentImageIndex === index 
                              ? 'w-8 bg-houma-gold' 
                              : 'bg-houma-white/30'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm text-houma-white/50">
                    {currentImageIndex + 1} / {selectedEditorial.images.length}
                  </p>
                </div>

                {selectedEditorial.description && (
                  <p className="text-houma-white/70 mb-4">
                    {selectedEditorial.description}
                  </p>
                )}

                {selectedEditorial.quote && (
                  <p className="text-lg text-houma-gold italic">
                    "{selectedEditorial.quote}"
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default LookbookPage
