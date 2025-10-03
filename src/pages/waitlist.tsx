import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const WaitlistPage = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [spotsRemaining, setSpotsRemaining] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Fetch current spots remaining
    fetchSpotsRemaining()

    // Mouse tracking for subtle parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const fetchSpotsRemaining = async () => {
    try {
      const response = await fetch('/api/waitlist-status')
      const data = await response.json()
      setSpotsRemaining(data.spotsRemaining)
    } catch (error) {
      console.error('Error fetching waitlist status:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/join-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubscribed(true)
        setSpotsRemaining(data.spotsRemaining)
        toast.success('Welcome to the inner circle', {
          duration: 5000,
        })
      } else if (response.status === 400 && data.message === 'Already on waitlist') {
        toast.error('You are already part of the movement', {
          duration: 4000,
        })
      } else if (response.status === 400 && data.message === 'Waitlist full') {
        toast.error('The gates have closed. All 100 spots are taken.', {
          duration: 5000,
        })
      } else {
        throw new Error(data.message || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error joining waitlist:', error)
      toast.error('An error occurred. Please try again.', {
        duration: 4000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>HOUMA - Exclusive Waitlist | Pre-Launch Access</title>
        <meta name="description" content="Join the exclusive HOUMA waitlist. Only 100 spots available. Members receive free shipping on their first order." />
      </Head>

      <div className="min-h-screen bg-houma-black relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-houma-black via-[#0f0f0f] to-houma-black" />
          
          {/* Floating geometric shapes */}
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 border border-houma-gold/10 rotate-45"
            animate={{
              rotate: [45, 50, 45],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
          />
          <motion.div
            className="absolute bottom-32 right-32 w-48 h-48 border border-houma-gold/5"
            animate={{
              rotate: [0, -360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)`,
            }}
          />
          
          {/* Luxury pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)
              `,
            }} />
          </div>
        </div>

        {/* Main content */}
        <div className="relative min-h-screen flex flex-col items-center justify-start px-4 pb-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <Image
              src="/Resources/Logos-and-Images/Logo-White-No-Background.png"
              alt="HOUMA"
              width={200}
              height={80}
              priority
              className="w-48 md:w-64 h-auto"
            />
          </motion.div>

          {/* Content container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-2xl w-full text-center"
          >
            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.div
                  key="signup-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Pre-launch badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="inline-block mb-10"
                  >
                    <span className="px-4 py-2 border border-houma-gold/30 text-houma-gold text-xs tracking-[0.3em] uppercase">
                      Pre-Launch Access
                    </span>
                  </motion.div>

                  {/* Main heading */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-5xl md:text-7xl font-display tracking-wider text-houma-white mb-10"
                  >
                    THE MOVEMENT
                    <span className="block text-gradient-gold mt-2">BEGINS HERE</span>
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-lg text-houma-white/70 mb-10 max-w-lg mx-auto"
                  >
                    Be among the chosen few. Join our exclusive waitlist and receive{' '}
                    <span className="relative inline-block">
                      <span className="text-houma-gold font-bold text-xl tracking-wide relative z-10">
                        FREE SHIPPING
                      </span>
                      <motion.span
                        className="absolute inset-0 bg-houma-gold/20 blur-lg"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </span>
                    {' '}on your first order when we launch.
                  </motion.p>

                  {/* Spots remaining indicator */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-12"
                  >
                    {spotsRemaining !== null && (
                      <div className="inline-flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-houma-gold/20 blur-xl" />
                          <div className="relative px-6 py-3 border border-houma-gold/50 bg-houma-black/80">
                            <span className="text-3xl font-display text-houma-gold">
                              {spotsRemaining}
                            </span>
                            <span className="text-xs text-houma-white/60 uppercase tracking-widest block">
                              Spots Remaining
                            </span>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-houma-white/50 uppercase tracking-wider">
                            Limited to
                          </p>
                          <p className="text-2xl font-display text-houma-white">
                            300 Members
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Email form */}
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto"
                  >
                    <div className="relative group">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        disabled={spotsRemaining === 0}
                        className="w-full bg-transparent border-b-2 border-houma-gold/30 text-houma-white 
                                 placeholder-houma-white/40 px-2 py-4 focus:outline-none focus:border-houma-gold 
                                 transition-all duration-500 text-center text-lg tracking-wider
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-[2px] bg-houma-gold transition-all duration-500 group-focus-within:w-full" />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || spotsRemaining === 0}
                      className="mt-10 houma-button min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={spotsRemaining !== 0 ? { scale: 1.05 } : {}}
                      whileTap={spotsRemaining !== 0 ? { scale: 0.95 } : {}}
                    >
                      <span>{isSubmitting ? 'JOINING...' : spotsRemaining === 0 ? 'WAITLIST FULL' : 'CLAIM YOUR SPOT'}</span>
                    </motion.button>
                  </motion.form>

                  {/* Arabic text accent */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 1.2, duration: 2 }}
                    className="houma-arabic text-7xl text-houma-gold/20 mt-16"
                  >
                    حُومة
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.618, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center"
                >
                  {/* Success icon */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: 0.618, 
                      duration: 1.618,
                      type: "spring", 
                      stiffness: 80,
                      damping: 20
                    }}
                    className="mx-auto w-24 h-24 bg-houma-gold rounded-full flex items-center justify-center mb-12"
                  >
                    <CheckIcon className="w-12 h-12 text-houma-black" />
                  </motion.div>

                  {/* Success message */}
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 1.236,
                      duration: 1.618,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="text-4xl md:text-6xl font-display tracking-wider text-houma-white mb-8"
                  >
                    WELCOME TO THE
                    <span className="block text-gradient-gold mt-3">INNER CIRCLE</span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 1.854,
                      duration: 1.618,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="text-lg text-houma-white/70 mb-10 max-w-lg mx-auto"
                  >
                    You are now one of the chosen few. 
                    Your exclusive access has been secured.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 2.472,
                      duration: 1.618,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="space-y-4"
                  >
                    <div className="inline-block px-6 py-3 border border-houma-gold/30 bg-houma-gold/10">
                      <p className="text-sm text-houma-gold uppercase tracking-widest mb-1">
                        Your Benefits
                      </p>
                      <p className="text-houma-white">
                        Free Shipping on First Order • Early Access • Exclusive Updates
                      </p>
                    </div>
                  </motion.div>

                  {/* Cult-like message */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ 
                      delay: 3.09,
                      duration: 2.618,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="text-sm text-houma-gold tracking-[0.4em] uppercase mt-16 font-medium"
                    style={{
                      textShadow: '0 0 20px rgba(212, 175, 55, 0.8), 0 0 40px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.3)'
                    }}
                  >
                    Strength in Heritage • Unity in Purpose
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default WaitlistPage
