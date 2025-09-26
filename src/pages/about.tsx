import React, { useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const AboutPage = () => {
  const manifestoRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: manifestoRef,
    offset: ['start end', 'end start'],
  })

  const manifestoY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const manifestoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9])

  const [titleRef, titleInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  const values = [
    {
      title: 'HERITAGE',
      arabic: 'تراث',
      description: 'We honor the rich tapestry of North African culture, weaving stories of our ancestors into every thread.',
    },
    {
      title: 'AUTHENTICITY', 
      arabic: 'أصالة',
      description: 'No compromises, no apologies. We create from a place of truth, representing our culture with pride.',
    },
    {
      title: 'INNOVATION',
      arabic: 'ابتكار',
      description: 'Tradition doesn\'t mean stagnation. We push boundaries while staying rooted in our identity.',
    },
    {
      title: 'COMMUNITY',
      arabic: 'مجتمع',
      description: 'HOUMA means neighborhood. We build bridges between cultures and generations.',
    },
  ]

  const timeline = [
    { year: '2020', event: 'Founded in the heart of Algiers' },
    { year: '2021', event: 'First collection launch - Heritage Line' },
    { year: '2022', event: 'Expanded to Morocco and Tunisia' },
    { year: '2023', event: 'International expansion to Europe and North America' },
    { year: '2024', event: 'Global movement, local soul' },
  ]

  return (
    <>
      <Head>
        <title>About - HOUMA | Our Culture & Story</title>
        <meta name="description" content="Discover the story of HOUMA. Where North African heritage meets modern luxury streetwear. Our manifesto, our culture, our movement." />
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
            src="/Resources/Logos-and-Images/Logo_page-0013.jpg"
            alt="HOUMA Culture"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-houma-black/60 via-houma-black/40 to-houma-black" />
        </motion.div>

        <div className="relative h-full flex items-center justify-center text-center">
          <motion.div
            ref={titleRef}
            className="houma-container"
            initial={{ opacity: 0, y: 60 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-6">OUR STORY</p>
            <h1 className="text-6xl md:text-8xl font-display tracking-wider text-houma-white mb-6">
              CULTURE IS <span className="text-stroke-gold">LUXURY</span>
            </h1>
            <p className="text-xl text-houma-white/80 max-w-2xl mx-auto">
              Where the ancient medinas meet modern runways. Where tradition becomes rebellion.
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

      {/* Manifesto Section */}
      <section ref={manifestoRef} className="py-32 relative overflow-hidden" id="manifesto">
        <div className="absolute inset-0 pattern-overlay opacity-20" />
        
        <motion.div
          className="houma-container relative"
          style={{ y: manifestoY, scale: manifestoScale }}
        >
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-display tracking-wider text-houma-white text-center mb-16">
              OUR MANIFESTO
            </h2>

            <div className="space-y-8 text-lg text-houma-white/80 leading-relaxed">
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <span className="text-3xl text-houma-gold float-left mr-4 leading-none">H</span>
                OUMA isn't just a brand. It's a declaration. A statement that luxury doesn't belong 
                to one culture, one aesthetic, one narrative. We are the children of the Maghreb, 
                carrying the weight of empires and the lightness of desert winds.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                From the geometric perfection of Berber carpets to the fluid calligraphy of Arabic scripts, 
                from the spice-scented souks of Marrakech to the jasmine nights of Tunis—we draw from a 
                well that never runs dry. Our heritage is our haute couture.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                We reject the notion that streetwear can't be sacred, that tradition can't be 
                revolutionary. Every stitch is a story, every pattern a poem, every collection a 
                conversation between past and future.
              </motion.p>

              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="houma-arabic text-4xl text-houma-gold mb-4">
                  نحن حُومة
                </p>
                <p className="text-sm text-houma-white/50 tracking-[0.3em]">
                  WE ARE HOUMA
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              >
                This is not fashion for fashion's sake. This is identity made tangible. This is 
                culture you can wear. This is heritage you can feel. We don't follow trends—we 
                set them ablaze with the fire of a thousand-year legacy.
              </motion.p>

              <motion.p
                className="text-2xl text-houma-gold text-center font-display tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                viewport={{ once: true }}
              >
                LUXURY WITHOUT COMPROMISE.<br />
                CULTURE WITHOUT APOLOGY.<br />
                THIS IS HOUMA.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-20 relative overflow-hidden" id="culture">
        {/* Section Transition Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-houma-black via-houma-smoke/20 to-houma-black" />
        
        <div className="houma-container relative">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center justify-center gap-6 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-houma-gold" />
              <p className="text-houma-gold text-sm tracking-[0.4em] font-medium">FOUNDATION</p>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-houma-gold" />
            </motion.div>
            <h2 className="text-6xl lg:text-7xl font-display tracking-wider text-houma-white mb-6">
              OUR <span className="text-gradient-gold">VALUES</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-houma-gold to-transparent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center group relative"
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Hover Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-houma-gold/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 mb-8">
                  <motion.p 
                    className="houma-arabic text-5xl text-houma-gold mb-4 group-hover:text-houma-gold-light transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    {value.arabic}
                  </motion.p>
                  <motion.h3 
                    className="text-2xl font-display tracking-wider text-houma-white group-hover:text-houma-gold transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {value.title}
                  </motion.h3>
                </div>
                <p className="text-houma-white/70 leading-relaxed font-light group-hover:text-houma-white/90 transition-colors duration-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 relative bg-gradient-to-b from-houma-black to-houma-smoke">
        <div className="houma-container">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center justify-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-houma-gold" />
              <p className="text-houma-gold text-sm tracking-[0.4em] font-medium">JOURNEY</p>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-houma-gold" />
            </motion.div>
            <h2 className="text-6xl lg:text-7xl font-display tracking-wider text-houma-white mb-6">
              OUR <span className="text-gradient-gold">EVOLUTION</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-houma-gold to-transparent mx-auto" />
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className="flex items-center gap-12 mb-16 last:mb-0 group"
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                {/* Year Section */}
                <div className="w-32 text-right">
                  <motion.span 
                    className="text-4xl lg:text-5xl font-display text-houma-gold group-hover:text-houma-gold-light transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.year}
                  </motion.span>
                </div>

                {/* Timeline Dot */}
                <div className="relative flex-shrink-0">
                  <div className="w-6 h-6 bg-houma-gold rounded-full relative group-hover:scale-125 transition-transform duration-300">
                    <div className="absolute inset-0 bg-houma-gold rounded-full animate-ping opacity-30" />
                    <div className="absolute inset-1 bg-houma-black rounded-full" />
                  </div>
                  {/* Connecting Line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-houma-gold/60 to-houma-gold/20" />
                  )}
                </div>

                {/* Event Description */}
                <div className="flex-1">
                  <motion.p 
                    className="text-xl lg:text-2xl text-houma-white/80 group-hover:text-houma-white transition-colors duration-300 leading-relaxed font-light"
                    whileHover={{ x: 8 }}
                  >
                    {item.event}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Decorative Bottom Element */}
          <motion.div
            className="mt-20 flex items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-houma-gold/50" />
            <div className="w-3 h-3 bg-houma-gold rounded-full" />
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-houma-gold/50" />
          </motion.div>
        </div>
      </section>

      {/* Sustainability Section - Complete Redesign */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="sustainability">
        {/* Ultra-Luxury Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-houma-deep-black via-houma-black to-houma-smoke" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-houma-gold/8 via-transparent to-transparent" />
        
        {/* Floating Geometric Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-houma-gold/10 rounded-full opacity-20 animate-float" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-houma-gold/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-houma-gold/15 rotate-45 rounded-lg opacity-30" />
        
        {/* Main Content Container */}
        <div className="houma-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center min-h-screen py-20">
            
            {/* Left Side - Visual Impact */}
            <div className="lg:col-span-5">
              <motion.div
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                {/* Main Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <Image
                    src="/Resources/Models/Models2.jpeg"
                    alt="Sustainable Luxury"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Sophisticated Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-houma-black/60 via-transparent to-houma-gold/5" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-houma-gold/3 to-houma-black/40" />
                  
                  {/* Luxury Border */}
                  <div className="absolute inset-4 border border-houma-gold/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                
                {/* Floating Stats Cards */}
                <motion.div
                  className="absolute -top-8 -right-8 bg-houma-black/80 backdrop-blur-xl border border-houma-gold/20 rounded-2xl p-6 luxury-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-display text-houma-gold mb-1">100%</div>
                    <div className="text-xs text-houma-white/70 tracking-wider">ETHICAL</div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-8 -left-8 bg-houma-black/80 backdrop-blur-xl border border-houma-gold/20 rounded-2xl p-6 luxury-shadow"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-display text-houma-gold mb-1">FULLY</div>
                    <div className="text-xs text-houma-white/70 tracking-wider">SUSTAINABLE</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Side - Content */}
            <div className="lg:col-span-7">
              <motion.div
                className="max-w-2xl"
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                {/* Section Badge */}
                <motion.div
                  className="inline-flex items-center gap-3 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-px bg-houma-gold" />
                  <span className="text-houma-gold text-sm tracking-[0.3em] font-medium">RESPONSIBILITY</span>
                  <div className="w-8 h-px bg-houma-gold" />
                </motion.div>

                {/* Main Title */}
                <motion.h2
                  className="text-6xl lg:text-8xl font-display tracking-tight text-houma-white mb-8 leading-none"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  SUSTAINABLE
                  <br />
                  <span className="text-gradient-gold">LUXURY</span>
                </motion.h2>

                {/* Description */}
                <motion.div
                  className="space-y-6 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <p className="text-xl lg:text-2xl text-houma-white/80 leading-relaxed font-light">
                    Luxury means respecting the earth that gives us our materials, the hands that craft 
                    our pieces, and the communities that inspire our designs.
                  </p>
                  <p className="text-lg text-houma-white/70 leading-relaxed">
                    We work with artisans across North Africa, ensuring fair wages and preserving 
                    traditional craftsmanship. Every HOUMA piece is made to last generations, not seasons.
                  </p>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-40 relative overflow-hidden">
        {/* Section Transition Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-houma-smoke via-houma-black to-houma-deep-black" />
        
        <div className="houma-container relative">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center justify-center gap-6 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-houma-gold" />
              <p className="text-houma-gold text-sm tracking-[0.4em] font-medium">CREATORS</p>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-houma-gold" />
            </motion.div>
            <h2 className="text-6xl lg:text-7xl font-display tracking-wider text-houma-white mb-8">
              THE <span className="text-gradient-gold">VISIONARIES</span>
            </h2>
            <motion.p 
              className="text-xl text-houma-white/80 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              A collective of designers, artists, and cultural ambassadors united by a vision: 
              to elevate North African aesthetics to the global stage.
            </motion.p>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-houma-gold to-transparent mx-auto mt-8"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            />
          </motion.div>

          <motion.div
            className="text-center relative"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-block p-12 border border-houma-gold/20 relative group cursor-pointer"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-houma-gold/10 via-houma-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-4 border border-houma-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.p 
                className="relative text-3xl text-houma-white/90 italic mb-6 leading-relaxed group-hover:text-houma-white transition-colors duration-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                "Fashion is temporary. Culture is eternal.<br />
                We're not just making clothes. We're making history."
              </motion.p>
              <motion.p 
                className="relative text-sm text-houma-gold tracking-[0.3em] group-hover:text-houma-gold-light transition-colors duration-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
              >
                — HOUMA COLLECTIVE
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
