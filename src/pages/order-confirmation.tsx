import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useAnimation } from 'framer-motion'
import { useRouter } from 'next/router'
import { 
  ArrowRightIcon, 
  HomeIcon, 
  ShoppingBagIcon,
  CheckCircleIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const OrderConfirmation = () => {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    // Get payment intent ID from URL if available
    const { payment_intent } = router.query
    if (payment_intent) {
      setPaymentIntentId(payment_intent as string)
    }
    
    // Generate a random order number
    const orderNum = `HOUMA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    setOrderNumber(orderNum)
    
    // Trigger visibility after a brief delay
    setTimeout(() => setIsVisible(true), 300)
    setTimeout(() => setShowParticles(true), 1000)
    
    // Start the main animation sequence
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    })
  }, [router.query, controls])

  // Handle potential errors gracefully
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.log('Caught error:', event.error)
      // Don't let errors break the page
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log('Caught unhandled promise rejection:', event.reason)
      // Don't let promise rejections break the page
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Order Confirmed - HOUMA | Welcome to the Family</title>
        <meta name="description" content="Your HOUMA order has been confirmed. Welcome to the exclusive family of luxury streetwear." />
      </Head>

      <div className="min-h-screen bg-houma-black relative overflow-hidden">
        {/* Divine Background Animation */}
        <div className="absolute inset-0">
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%), radial-gradient(circle at 20% 60%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Floating Golden Orbs */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute w-4 h-4 bg-houma-gold/30 rounded-full blur-sm"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + i * 10}%`
              }}
              animate={{
                y: [0, -60, 0],
                x: [0, 30, 0],
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 10 + i * 0.8,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Elegant Light Rays */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute w-px h-60 bg-gradient-to-b from-houma-gold/40 via-houma-gold/20 to-transparent"
              style={{
                left: `${15 + i * 15}%`,
                top: '5%',
                transform: `rotate(${10 + i * 12}deg)`
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scaleY: [0.3, 1.8, 0.3]
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Flowing Energy Lines */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`flowing-line-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-houma-gold/30 to-transparent"
              style={{
                width: `${250 + i * 40}px`,
                left: `${5 + i * 12}%`,
                top: `${20 + i * 10}%`,
                transform: `rotate(${-15 + i * 8}deg)`
              }}
              animate={{
                x: [0, 120, 0],
                opacity: [0, 0.7, 0],
                scaleX: [0.3, 1.6, 0.3]
              }}
              transition={{
                duration: 12 + i * 0.8,
                repeat: Infinity,
                delay: i * 1.8,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-40">
          <div className="max-w-6xl mx-auto text-center">
            

            {/* Main Message with Enhanced Typography */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 60 }}
              transition={{ delay: 0.2, duration: 1.5 }}
            >
              <motion.h1 
                className="text-8xl md:text-9xl font-display text-houma-white mb-8 tracking-wider leading-none"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.span
                  className="block"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(255,255,255,0)",
                      "0 0 30px rgba(255,255,255,0.4)",
                      "0 0 0px rgba(255,255,255,0)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1.8 }}
                >
                  WELCOME
                </motion.span>
                <motion.span 
                  className="block text-houma-gold mt-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(212,175,55,0)",
                        "0 0 40px rgba(212,175,55,0.7)",
                        "0 0 0px rgba(212,175,55,0)"
                      ]
                    }}
                    transition={{ duration: 5, repeat: Infinity, delay: 2.2 }}
                  >
                    TO THE FAMILY
                  </motion.span>
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl md:text-3xl text-houma-white/80 mb-20 max-w-4xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 1.2 }}
              >
                <motion.span
                  className="inline-block"
                  animate={{
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2.8 }}
                >
                  Your order has been confirmed and is being prepared with the utmost care. 
                  You are now part of an exclusive community that values authenticity, 
                  craftsmanship, and cultural heritage.
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Luxury Order Details Card */}
            <motion.div
              className="bg-houma-white/5 backdrop-blur-3xl border border-houma-gold/20 rounded-3xl p-16 mb-20 max-w-4xl mx-auto relative overflow-hidden"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ 
                opacity: isVisible ? 1 : 0, 
                y: isVisible ? 0 : 40,
                scale: isVisible ? 1 : 0.95
              }}
              transition={{ delay: 1.5, duration: 1.2 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 30px 60px rgba(212, 175, 55, 0.15)"
              }}
            >
              {/* Subtle Card Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-houma-gold/8 via-transparent to-houma-gold/8 rounded-3xl"
                animate={{
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              
              {/* Floating Elements inside Card */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`card-particle-${i}`}
                  className="absolute w-2 h-2 bg-houma-gold/40 rounded-full"
                  style={{
                    left: `${15 + i * 20}%`,
                    top: `${10 + i * 15}%`
                  }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.8
                  }}
                />
              ))}
              
              <h2 className="text-4xl font-display text-houma-white mb-12 tracking-wider">
                ORDER CONFIRMATION
              </h2>
              
              <div className="space-y-8">
                <motion.div 
                  className="flex justify-between items-center py-6 border-b border-houma-white/10"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.0 + 0 * 0.15, duration: 0.8 }}
                >
                  <span className="text-houma-white/70 text-xl">Order Number</span>
                  <span className="text-houma-gold font-mono tracking-wider text-xl">{orderNumber}</span>
                </motion.div>
                
                <motion.div 
                  className="flex justify-between items-center py-6 border-b border-houma-white/10"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.0 + 1 * 0.15, duration: 0.8 }}
                >
                  <span className="text-houma-white/70 text-xl">Status</span>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-houma-gold" />
                    <span className="text-houma-gold text-xl font-light">Confirmed</span>
                  </div>
                </motion.div>
                
                {paymentIntentId && (
                  <motion.div 
                    className="flex justify-between items-center py-6 border-b border-houma-white/10"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.0 + 2 * 0.15, duration: 0.8 }}
                  >
                    <span className="text-houma-white/70 text-xl">Payment ID</span>
                    <span className="text-houma-gold font-mono text-lg">{paymentIntentId}</span>
                  </motion.div>
                )}
                
                <motion.div 
                  className="flex justify-between items-center py-6 border-b border-houma-white/10"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.0 + 3 * 0.15, duration: 0.8 }}
                >
                  <span className="text-houma-white/70 text-xl">Estimated Delivery</span>
                  <span className="text-houma-white text-xl">3-5 Business Days</span>
                </motion.div>
                
                <motion.div 
                  className="flex justify-between items-center py-6"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.0 + 4 * 0.15, duration: 0.8 }}
                >
                  <span className="text-houma-white/70 text-xl">Email Confirmation</span>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-houma-gold" />
                    <span className="text-houma-white text-xl">Sent</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Cultural Heritage Message */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ delay: 2.5, duration: 1.5 }}
            >
              <div className="relative max-w-5xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-houma-gold/20 to-transparent h-px top-1/2"></div>
                <div className="bg-houma-black px-16">
                  <motion.p 
                    className="text-2xl text-houma-white/60 italic font-light leading-relaxed"
                    animate={{
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 3 }}
                  >
                    "Every thread tells a story. Every piece preserves a legacy. 
                    You are now a guardian of cultural authenticity."
                  </motion.p>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ delay: 2.8, duration: 1 }}
            >
              <Link href="/shop">
                <motion.button
                  className="houma-button group px-16 py-6 text-xl relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 3.0, duration: 0.8 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-houma-gold to-houma-gold-light"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <span className="relative flex items-center">
                    CONTINUE SHOPPING
                    <ArrowRightIcon className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </motion.button>
              </Link>
              
              <Link href="/">
                <motion.button
                  className="px-16 py-6 bg-houma-white/8 border border-houma-white/20 text-houma-white hover:bg-houma-white/15 hover:border-houma-gold/40 transition-all duration-500 rounded-xl group text-xl font-light relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 3.2, duration: 0.8 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-houma-gold/10 to-transparent"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <span className="relative flex items-center">
                    RETURN HOME
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Social Sharing with Enhanced Design */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ delay: 3.5, duration: 1 }}
            >
              <motion.p 
                className="text-houma-gold mb-12 text-lg tracking-widest"
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 4 }}
              >
                SHARE YOUR EXPERIENCE
              </motion.p>
              <div className="flex justify-center space-x-8">
                {[
                  {
                    name: 'Instagram',
                    icon: (
                      <svg className="w-6 h-6" fill="url(#instagram-gradient)" viewBox="0 0 24 24">
                        <defs>
                          <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f09433" />
                            <stop offset="25%" stopColor="#e6683c" />
                            <stop offset="50%" stopColor="#dc2743" />
                            <stop offset="75%" stopColor="#cc2366" />
                            <stop offset="100%" stopColor="#bc1888" />
                          </linearGradient>
                        </defs>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    ),
                    url: 'https://instagram.com/houma_official'
                  },
                  {
                    name: 'Twitter',
                    icon: (
                      <svg className="w-6 h-6" fill="#1DA1F2" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    ),
                    url: 'https://twitter.com/houma_official'
                  },
                  {
                    name: 'Facebook',
                    icon: (
                      <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ),
                    url: 'https://facebook.com/houma.official'
                  }
                ].map((platform, index) => (
                  <motion.a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-6 bg-houma-white/5 border border-houma-white/10 hover:border-houma-gold/30 transition-all duration-500 rounded-xl relative overflow-hidden group"
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0 + index * 0.2 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-houma-gold/5 to-transparent"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 0.5
                      }}
                    />
                    <span className="relative flex items-center justify-center">
                      {platform.icon}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Micro Particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`micro-particle-${i}`}
              className="absolute w-1 h-1 bg-houma-gold/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -120, 0],
                x: [0, Math.sin(i) * 50, 0],
                opacity: [0, 1, 0],
                scale: [0, 2, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeOut"
              }}
            />
          ))}
          
          {/* Larger Floating Orbs */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`large-orb-${i}`}
              className="absolute w-4 h-4 bg-houma-gold/20 rounded-full blur-sm"
              style={{
                left: `${20 + i * 15}%`,
                top: `${25 + i * 12}%`
              }}
              animate={{
                y: [0, -80, 0],
                x: [0, 40, 0],
                opacity: [0.1, 0.5, 0.1],
                scale: [0.8, 1.3, 0.8]
              }}
              transition={{
                duration: 12 + i * 1.5,
                repeat: Infinity,
                delay: i * 2.5,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Elegant Light Streaks */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`streak-${i}`}
              className="absolute w-32 h-px bg-gradient-to-r from-transparent via-houma-gold/30 to-transparent"
              style={{
                left: `${15 + i * 20}%`,
                top: `${35 + i * 15}%`,
                transform: `rotate(${-20 + i * 15}deg)`
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scaleX: [0.3, 1.8, 0.3]
              }}
              transition={{
                duration: 10 + i * 0.8,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default OrderConfirmation