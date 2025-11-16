import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion'

const WaitlistPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
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

  return (
    <>
      <Head>
        <title>HOUMA - Launching Soon</title>
        <meta name="description" content="HOUMA is launching soon. Please check back later." />
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
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
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
            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-5xl md:text-7xl font-display tracking-wider text-houma-white mb-8"
            >
              This site is temporarily unavailable.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg md:text-xl text-houma-white/70 mb-12 max-w-lg mx-auto"
            >
              Please check back later.
            </motion.p>

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
        </div>
      </div>
    </>
  )
}

export default WaitlistPage
