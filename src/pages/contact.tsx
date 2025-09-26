import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [isFormFocused, setIsFormFocused] = useState(false)
  const [videoBlurred, setVideoBlurred] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the form data to your backend
    toast.success('Message sent! We\'ll get back to you soon.')
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
  }

  // Cinematic video transition sequence
  useEffect(() => {
    if (isVideoLoaded) {
      // Let video play for 1 second before starting blur
      const blurTimer = setTimeout(() => {
        setVideoBlurred(true)
      }, 1000)
      
      // Show content 0.5 seconds after blur starts
      const contentTimer = setTimeout(() => {
        setShowContent(true)
      }, 1500)
      
      // Show particles 2 seconds after video loads
      const particlesTimer = setTimeout(() => {
        setShowParticles(true)
      }, 2000)
      
      // Show scroll hint 3-4 seconds after content appears (4.5-5.5 seconds total)
      const scrollHintTimer = setTimeout(() => {
        setShowScrollHint(true)
      }, 4500)
      
      return () => {
        clearTimeout(blurTimer)
        clearTimeout(contentTimer)
        clearTimeout(particlesTimer)
        clearTimeout(scrollHintTimer)
      }
    }
  }, [isVideoLoaded])

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'EMAIL',
      details: ['info@houma.com', 'support@houma.com'],
    },
    {
      icon: PhoneIcon,
      title: 'PHONE',
      details: ['+216 71 234 567', '+33 1 23 45 67 89'],
    },
  ]

  const faqItems = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase for unworn items with tags attached.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship worldwide. International shipping rates and times vary by location.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email to monitor your delivery.',
    },
  ]

  return (
    <>
      <Head>
        <title>Contact - HOUMA | Get in Touch</title>
        <meta name="description" content="Contact HOUMA for inquiries, support, or collaboration. We're here to help with your luxury streetwear needs." />
      </Head>

      {/* Cinematic Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover filter brightness-30 transition-all duration-2000 ease-out ${
              videoBlurred ? 'blur-[3px]' : 'blur-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src="/Resources/Logos-and-Images/Logo-Tapestry.mp4" type="video/mp4" />
          </video>
          
          {/* Luxury Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-houma-black/80 via-houma-black/60 to-houma-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-houma-black via-transparent to-houma-black/50" />
          
          {/* Golden Light Effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-houma-gold/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-houma-gold/8 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-houma-gold/6 rounded-full blur-2xl animate-pulse delay-500" />
        </div>

        {/* Floating Particles */}
        <AnimatePresence>
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-houma-gold/40 rounded-full"
                  initial={{ 
                    opacity: 0, 
                    x: Math.random() * window.innerWidth, 
                    y: window.innerHeight + 20 
                  }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    y: -20,
                    x: Math.random() * window.innerWidth * 0.3
                  }}
                  transition={{ 
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
        <motion.div
            className="houma-container text-center"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 80 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Arabic Text */}
            <motion.p
              className="houma-arabic text-2xl md:text-3xl text-houma-gold/80 mb-6 font-amiri"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ 
                opacity: showContent ? 1 : 0, 
                scale: showContent ? 1 : 0.5,
                y: showContent ? 0 : 20
              }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              تواصل معنا
            </motion.p>
            
            {/* Main Title */}
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-display tracking-wider text-houma-white mb-8"
              initial={{ opacity: 0, y: 60, scale: 0.8 }}
              animate={{ 
                opacity: showContent ? 1 : 0, 
                y: showContent ? 0 : 60,
                scale: showContent ? 1 : 0.8
              }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              GET IN TOUCH
            </motion.h1>
            
            {/* Subtitle */}
            <motion.div
              className="max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ 
                opacity: showContent ? 1 : 0, 
                y: showContent ? 0 : 40
              }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xl md:text-2xl text-houma-white/90 mb-4 font-light">
                Where tradition meets innovation
              </p>
              <p className="text-lg text-houma-white/70 font-light">
                Experience the luxury of connection. Every message is a journey into the heart of Houma.
              </p>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="flex items-center justify-center gap-8 mt-12"
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ 
                opacity: showContent ? 1 : 0, 
                scale: showContent ? 1 : 0.6,
                y: showContent ? 0 : 20
              }}
              transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-houma-gold to-transparent" />
              <SparklesIcon className="w-6 h-6 text-houma-gold animate-pulse" />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-houma-gold to-transparent" />
            </motion.div>
          </motion.div>
          </div>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, 10, 0] 
              }}
              transition={{ 
                opacity: { duration: 0.8 },
                scale: { duration: 0.8 },
                y: { repeat: Infinity, duration: 2 }
              }}
            >
              <div className="w-px h-16 bg-gradient-to-b from-houma-gold to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Luxury Contact Form Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pattern-overlay opacity-5" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-houma-gold/30 to-transparent" />
        
        <div className="houma-container relative">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">CONNECT</p>
            <h2 className="text-4xl md:text-6xl font-display tracking-wider text-houma-white mb-6">
              BEGIN THE JOURNEY
            </h2>
            <p className="text-lg text-houma-white/70 max-w-2xl mx-auto font-light">
              Every conversation is an invitation to explore the depths of luxury and culture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Form Container with Luxury Border */}
                <div className="relative p-8 md:p-12 bg-houma-smoke/20 backdrop-blur-sm 
                              border border-houma-gold/20 luxury-shadow">
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-houma-gold/40" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-houma-gold/40" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-houma-gold/40" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-houma-gold/40" />

                  <div className="flex items-center gap-4 mb-8">
                    <PaperAirplaneIcon className="w-6 h-6 text-houma-gold" />
                    <h3 className="text-2xl font-display tracking-wider text-houma-white">
                SEND US A MESSAGE
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8" onFocus={() => setIsFormFocused(true)} onBlur={() => setIsFormFocused(false)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="group">
                        <label htmlFor="name" className="block text-xs text-houma-gold tracking-[0.2em] mb-3 group-focus-within:text-houma-gold-light">
                      NAME *
                    </label>
                        <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                            className="w-full bg-transparent border-b-2 border-houma-white/20 text-houma-white 
                                     py-3 px-0 focus:outline-none focus:border-houma-gold transition-all duration-500
                                     placeholder-houma-white/30"
                            placeholder="Your name"
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-houma-gold transition-all duration-500 group-focus-within:w-full" />
                        </div>
                  </div>

                      <div className="group">
                        <label htmlFor="email" className="block text-xs text-houma-gold tracking-[0.2em] mb-3 group-focus-within:text-houma-gold-light">
                      EMAIL *
                    </label>
                        <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                            className="w-full bg-transparent border-b-2 border-houma-white/20 text-houma-white 
                                     py-3 px-0 focus:outline-none focus:border-houma-gold transition-all duration-500
                                     placeholder-houma-white/30"
                            placeholder="your@email.com"
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-houma-gold transition-all duration-500 group-focus-within:w-full" />
                        </div>
                  </div>
                </div>

                    <div className="group">
                      <label htmlFor="subject" className="block text-xs text-houma-gold tracking-[0.2em] mb-3 group-focus-within:text-houma-gold-light">
                    SUBJECT *
                  </label>
                      <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                          className="w-full bg-transparent border-b-2 border-houma-white/20 text-houma-white 
                                   py-3 px-0 focus:outline-none focus:border-houma-gold transition-all duration-500
                                   appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-houma-black">Select a subject</option>
                          <option value="general" className="bg-houma-black">General Inquiry</option>
                          <option value="order" className="bg-houma-black">Order Support</option>
                          <option value="returns" className="bg-houma-black">Returns & Exchanges</option>
                          <option value="wholesale" className="bg-houma-black">Wholesale Inquiry</option>
                          <option value="press" className="bg-houma-black">Press & Media</option>
                          <option value="collaboration" className="bg-houma-black">Collaboration</option>
                  </select>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-houma-gold transition-all duration-500 group-focus-within:w-full" />
                      </div>
                </div>

                    <div className="group">
                      <label htmlFor="message" className="block text-xs text-houma-gold tracking-[0.2em] mb-3 group-focus-within:text-houma-gold-light">
                    MESSAGE *
                  </label>
                      <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                          className="w-full bg-transparent border-b-2 border-houma-white/20 text-houma-white 
                                   py-3 px-0 focus:outline-none focus:border-houma-gold transition-all duration-500 
                                   resize-none placeholder-houma-white/30"
                          placeholder="Share your thoughts, dreams, or inquiries..."
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-houma-gold transition-all duration-500 group-focus-within:w-full" />
                      </div>
                </div>

                    <motion.button
                  type="submit"
                      className="houma-button min-w-[240px] group relative overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <PaperAirplaneIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        SEND MESSAGE
                      </span>
                    </motion.button>
              </form>
                </div>
              </div>
            </motion.div>

            {/* Luxury Contact Info */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="sticky top-24">
                {/* Arabic Section */}
                <div className="text-center mb-12">
                  <motion.p
                    className="houma-arabic text-3xl text-houma-gold/80 mb-4 font-amiri"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    تواصل معنا
                  </motion.p>
                  <div className="w-16 h-px bg-houma-gold mx-auto" />
                </div>

                <div className="space-y-10">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                      className="group"
                    initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                  >
                      <div className="relative p-6 bg-houma-smoke/10 backdrop-blur-sm 
                                    border border-houma-gold/10 hover:border-houma-gold/30 
                                    transition-all duration-500 group-hover:bg-houma-smoke/20">
                    <div className="flex items-start gap-4">
                          <div className="p-2 bg-houma-gold/10 rounded-full group-hover:bg-houma-gold/20 
                                        transition-colors duration-500">
                            <info.icon className="w-5 h-5 text-houma-gold" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xs text-houma-gold tracking-[0.2em] mb-3 font-medium">
                          {info.title}
                        </h3>
                            <div className="space-y-1">
                              {info.details.map((detail, detailIndex) => (
                                <p key={detail} className="text-sm text-houma-white/80 group-hover:text-houma-white 
                                                          transition-colors duration-300 leading-relaxed">
                            {detail}
                          </p>
                        ))}
                            </div>
                          </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

                {/* Luxury Social Section */}
                <motion.div
                  className="mt-16 pt-8 border-t border-houma-gold/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xs text-houma-gold tracking-[0.2em] mb-2">
                      FOLLOW OUR JOURNEY
                </h3>
                    <div className="w-8 h-px bg-houma-gold mx-auto" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {['Instagram', 'Twitter', 'Facebook', 'YouTube'].map((social, index) => (
                      <motion.a
                      key={social}
                      href={`https://${social.toLowerCase()}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                        className="group flex items-center justify-center gap-2 p-3 
                                 bg-houma-smoke/10 border border-houma-gold/10 
                                 hover:border-houma-gold/40 hover:bg-houma-gold/5
                                 transition-all duration-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <StarIcon className="w-4 h-4 text-houma-gold/60 group-hover:text-houma-gold 
                                           transition-colors duration-300" />
                        <span className="text-xs text-houma-white/70 group-hover:text-houma-white 
                                        transition-colors duration-300 tracking-wide">
                      {social}
                        </span>
                      </motion.a>
                  ))}
                </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Luxury FAQ Section */}
      <section className="py-32 bg-gradient-luxury relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10" />
        
        <div className="houma-container relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">SUPPORT</p>
            <h2 className="text-4xl md:text-6xl font-display tracking-wider text-houma-white mb-6">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="w-24 h-px bg-houma-gold mx-auto" />
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.question}
                className="group mb-8 last:mb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative p-8 bg-houma-smoke/10 backdrop-blur-sm 
                              border border-houma-gold/10 group-hover:border-houma-gold/30 
                              transition-all duration-500 group-hover:bg-houma-smoke/20">
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-houma-gold/30 
                                group-hover:border-houma-gold/60 transition-colors duration-500" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-houma-gold/30 
                                group-hover:border-houma-gold/60 transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-houma-gold/30 
                                group-hover:border-houma-gold/60 transition-colors duration-500" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-houma-gold/30 
                                group-hover:border-houma-gold/60 transition-colors duration-500" />
                  
                  <h3 className="text-xl font-display text-houma-white mb-4 group-hover:text-houma-gold 
                                transition-colors duration-300">
                  {item.question}
                </h3>
                  <p className="text-base text-houma-white/70 leading-relaxed font-light">
                  {item.answer}
                </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="relative inline-block">
              <p className="text-base text-houma-white/60 mb-6 font-light">
              Can't find what you're looking for?
            </p>
              <motion.a
              href="mailto:support@houma.com"
                className="text-houma-gold hover:text-houma-gold-light transition-colors duration-300 
                         text-lg font-medium relative group"
                whileHover={{ scale: 1.05 }}
            >
              support@houma.com
                <div className="absolute bottom-0 left-0 w-0 h-px bg-houma-gold-light 
                              group-hover:w-full transition-all duration-500" />
              </motion.a>
          </div>
          </motion.div>
        </div>
      </section>

    </>
  )
}

export default ContactPage
