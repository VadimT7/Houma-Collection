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
    { year: '2023', event: 'International recognition at Paris Fashion Week' },
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
      <section className="py-32 bg-gradient-luxury" id="culture">
        <div className="houma-container">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">FOUNDATION</p>
            <h2 className="text-5xl font-display tracking-wider text-houma-white">
              OUR VALUES
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  <p className="houma-arabic text-4xl text-houma-gold mb-2">
                    {value.arabic}
                  </p>
                  <h3 className="text-xl font-display tracking-wider text-houma-white">
                    {value.title}
                  </h3>
                </div>
                <p className="text-sm text-houma-white/60 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 relative">
        <div className="houma-container">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">JOURNEY</p>
            <h2 className="text-5xl font-display tracking-wider text-houma-white">
              OUR EVOLUTION
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className="flex items-center gap-8 mb-12 last:mb-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-24 text-right">
                  <span className="text-2xl font-display text-houma-gold">
                    {item.year}
                  </span>
                </div>
                <div className="w-4 h-4 bg-houma-gold rounded-full relative">
                  <div className="absolute inset-0 bg-houma-gold rounded-full animate-ping" />
                </div>
                <div className="flex-1">
                  <p className="text-houma-white/70">
                    {item.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-32 bg-gradient-luxury relative" id="sustainability">
        <div className="absolute inset-0 noise-overlay opacity-10" />
        
        <div className="houma-container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="relative aspect-square"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Image
                src="/Resources/Models/Models2.jpeg"
                alt="Sustainable Fashion"
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-houma-black/50 to-transparent rounded-lg" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">RESPONSIBILITY</p>
              <h2 className="text-4xl font-display tracking-wider text-houma-white mb-8">
                SUSTAINABLE <span className="text-gradient-gold">LUXURY</span>
              </h2>
              <p className="text-lg text-houma-white/70 leading-relaxed mb-6">
                Luxury means respecting the earth that gives us our materials, the hands that craft 
                our pieces, and the communities that inspire our designs.
              </p>
              <p className="text-lg text-houma-white/70 leading-relaxed mb-8">
                We work with artisans across North Africa, ensuring fair wages and preserving 
                traditional craftsmanship. Every HOUMA piece is made to last generations, not seasons.
              </p>
              
              <ul className="space-y-3 text-sm text-houma-white/60">
                <li className="flex items-start gap-3">
                  <span className="text-houma-gold">✦</span>
                  <span>Ethically sourced materials from certified suppliers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-houma-gold">✦</span>
                  <span>Support for local artisan communities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-houma-gold">✦</span>
                  <span>Zero-waste production initiatives</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-houma-gold">✦</span>
                  <span>Carbon-neutral shipping by 2025</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32">
        <div className="houma-container">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">CREATORS</p>
            <h2 className="text-5xl font-display tracking-wider text-houma-white mb-8">
              THE VISIONARIES
            </h2>
            <p className="text-lg text-houma-white/70 max-w-2xl mx-auto">
              A collective of designers, artists, and cultural ambassadors united by a vision: 
              to elevate North African aesthetics to the global stage.
            </p>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block p-8 border border-houma-gold/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-houma-gold/10 to-transparent" />
              <p className="relative text-2xl text-houma-white/80 italic mb-4">
                "Fashion is temporary. Culture is eternal.<br />
                We're not just making clothes. We're making history."
              </p>
              <p className="relative text-sm text-houma-gold tracking-[0.2em]">
                — HOUMA COLLECTIVE
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
