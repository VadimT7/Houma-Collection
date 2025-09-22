import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { ArrowRightIcon, HomeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

const OrderConfirmation = () => {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Generate a random order number
    const orderNum = `HOUMA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    setOrderNumber(orderNum)
    
    // Trigger visibility after a brief delay
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  return (
    <>
      <Head>
        <title>Order Confirmed - HOUMA | Thank You</title>
        <meta name="description" content="Your HOUMA order has been confirmed. Welcome to the family." />
      </Head>

       <div className="min-h-screen bg-houma-black relative overflow-hidden pt-32">
         {/* Divine Background Animation */}
         <div className="absolute inset-0">
           <motion.div
             className="absolute inset-0 bg-gradient-to-br from-houma-gold/3 via-transparent to-houma-gold/5"
             animate={{
               background: [
                 "linear-gradient(45deg, rgba(212, 175, 55, 0.03) 0%, transparent 50%, rgba(212, 175, 55, 0.05) 100%)",
                 "linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, transparent 50%, rgba(212, 175, 55, 0.03) 100%)",
                 "linear-gradient(225deg, rgba(212, 175, 55, 0.03) 0%, transparent 50%, rgba(212, 175, 55, 0.05) 100%)",
                 "linear-gradient(315deg, rgba(212, 175, 55, 0.05) 0%, transparent 50%, rgba(212, 175, 55, 0.03) 100%)"
               ]
             }}
             transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
           />
           
           {/* Floating Golden Orbs */}
           {[...Array(6)].map((_, i) => (
             <motion.div
               key={`orb-${i}`}
               className="absolute w-3 h-3 bg-houma-gold/40 rounded-full blur-sm"
               style={{
                 left: `${10 + i * 15}%`,
                 top: `${15 + i * 12}%`
               }}
               animate={{
                 y: [0, -40, 0],
                 x: [0, 20, 0],
                 scale: [1, 1.8, 1],
                 opacity: [0.4, 0.8, 0.4]
               }}
               transition={{
                 duration: 8 + i * 0.5,
                 repeat: Infinity,
                 delay: i * 0.8,
                 ease: "easeInOut"
               }}
             />
           ))}
           
           {/* Elegant Light Rays */}
           {[...Array(4)].map((_, i) => (
             <motion.div
               key={`ray-${i}`}
               className="absolute w-px h-40 bg-gradient-to-b from-houma-gold/50 via-houma-gold/30 to-transparent"
               style={{
                 left: `${20 + i * 20}%`,
                 top: '10%',
                 transform: `rotate(${15 + i * 10}deg)`
               }}
               animate={{
                 opacity: [0.3, 0.7, 0.3],
                 scaleY: [0.5, 1.5, 0.5]
               }}
               transition={{
                 duration: 6 + i * 0.3,
                 repeat: Infinity,
                 delay: i * 1.2,
                 ease: "easeInOut"
               }}
             />
           ))}
           
           {/* Flowing Lines */}
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={`flowing-line-${i}`}
               className="absolute h-px bg-gradient-to-r from-transparent via-houma-gold/40 to-transparent"
               style={{
                 width: `${200 + i * 50}px`,
                 left: `${10 + i * 15}%`,
                 top: `${20 + i * 15}%`,
                 transform: `rotate(${-20 + i * 8}deg)`
               }}
               animate={{
                 x: [0, 100, 0],
                 opacity: [0, 0.8, 0],
                 scaleX: [0.5, 1.4, 0.5]
               }}
               transition={{
                 duration: 8 + i * 0.5,
                 repeat: Infinity,
                 delay: i * 1.5,
                 ease: "easeInOut"
               }}
             />
           ))}
           
           {/* Curved Flowing Lines */}
           {[...Array(3)].map((_, i) => (
             <motion.div
               key={`curved-line-${i}`}
               className="absolute h-px bg-gradient-to-r from-transparent via-houma-gold/35 to-transparent"
               style={{
                 width: `${300 + i * 100}px`,
                 left: `${5 + i * 25}%`,
                 top: `${60 + i * 10}%`,
                 transform: `rotate(${10 + i * 15}deg)`
               }}
               animate={{
                 x: [-50, 50, -50],
                 y: [0, -20, 0],
                 opacity: [0, 0.7, 0],
                 scaleX: [0.3, 1.2, 0.3]
               }}
               transition={{
                 duration: 12 + i * 1,
                 repeat: Infinity,
                 delay: i * 2,
                 ease: "easeInOut"
               }}
             />
           ))}
           
           {/* Micro Particles */}
           {[...Array(20)].map((_, i) => (
             <motion.div
               key={`micro-particle-${i}`}
               className="absolute w-1 h-1 bg-houma-gold/50 rounded-full"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`
               }}
               animate={{
                 y: [0, -100, 0],
                 x: [0, Math.sin(i) * 30, 0],
                 opacity: [0, 1, 0],
                 scale: [0, 2, 0]
               }}
               transition={{
                 duration: 6 + Math.random() * 4,
                 repeat: Infinity,
                 delay: Math.random() * 3,
                 ease: "easeOut"
               }}
             />
           ))}
         </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-5xl mx-auto text-center">
            
             {/* HOUMA Logo */}
             <motion.div
               className="mb-16"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
               transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
             >
               <div className="relative">
                 {/* HOUMA Logo */}
                 <motion.div
                   className="w-32 h-32 mx-auto relative"
                   initial={{ opacity: 0, rotateY: -90 }}
                   animate={{ 
                     opacity: 1, 
                     rotateY: 0,
                     scale: [1, 1.05, 1]
                   }}
                   transition={{ 
                     duration: 1.5, 
                     delay: 0.5,
                     scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                   }}
                 >
                   <Image
                     src="/Resources/Logos-and-Images/Logo-White-No-Background.png"
                     alt="HOUMA"
                     fill
                     className="object-contain"
                     priority
                   />
                 </motion.div>
                 
                 {/* Divine Glow Effect */}
                 <motion.div
                   className="absolute inset-0 w-32 h-32 mx-auto border border-houma-gold/10 rounded-full"
                   animate={{
                     scale: [1, 1.2, 1],
                     opacity: [0.2, 0.1, 0.2],
                     rotate: [0, 360]
                   }}
                   transition={{ 
                     duration: 8, 
                     repeat: Infinity,
                     ease: "easeInOut"
                   }}
                 />
                 
                 {/* Floating Particles around Logo */}
                 {[...Array(8)].map((_, i) => (
                   <motion.div
                     key={`logo-particle-${i}`}
                     className="absolute w-1 h-1 bg-houma-gold/40 rounded-full"
                     style={{
                       left: '50%',
                       top: '50%',
                       transformOrigin: '0 0'
                     }}
                     animate={{
                       x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                       y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                       opacity: [0, 0.8, 0],
                       scale: [0, 1, 0]
                     }}
                     transition={{
                       duration: 4,
                       repeat: Infinity,
                       delay: i * 0.2,
                       ease: "easeOut"
                     }}
                   />
                 ))}
               </div>
             </motion.div>

            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <motion.h1 
                className="text-7xl md:text-9xl font-display text-houma-white mb-8 tracking-wider leading-none"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.span
                  className="block"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(255,255,255,0)",
                      "0 0 20px rgba(255,255,255,0.3)",
                      "0 0 0px rgba(255,255,255,0)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  ORDER
                </motion.span>
                <motion.span 
                  className="block text-houma-gold mt-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(212,175,55,0)",
                        "0 0 30px rgba(212,175,55,0.5)",
                        "0 0 0px rgba(212,175,55,0)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                  >
                    CONFIRMED
                  </motion.span>
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-houma-white/70 mb-16 max-w-3xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
              >
                <motion.span
                  className="inline-block"
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
                >
                  Your order has been received and is being prepared with the utmost care. 
                  Welcome to the HOUMA family.
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Order Details - Luxury Card */}
            <motion.div
              className="bg-houma-white/3 backdrop-blur-2xl border border-houma-gold/10 rounded-3xl p-12 mb-16 max-w-3xl mx-auto relative overflow-hidden"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ 
                opacity: isVisible ? 1 : 0, 
                y: isVisible ? 0 : 30,
                scale: isVisible ? 1 : 0.95
              }}
              transition={{ delay: 1.2, duration: 0.8 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(212, 175, 55, 0.1)"
              }}
            >
              {/* Subtle Card Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-houma-gold/5 via-transparent to-houma-gold/5 rounded-3xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              {/* Floating Elements inside Card */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`card-particle-${i}`}
                  className="absolute w-1 h-1 bg-houma-gold/30 rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${10 + i * 20}%`
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.7
                  }}
                />
              ))}
              
              <h2 className="text-3xl font-display text-houma-white mb-10 tracking-wider">
                ORDER DETAILS
              </h2>
              
              <div className="space-y-6">
                <motion.div 
                  className="flex justify-between items-center py-4 border-b border-houma-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + 0 * 0.1, duration: 0.6 }}
                >
                  <span className="text-houma-white/60 text-lg">Order Number</span>
                  <span className="text-houma-gold font-mono tracking-wider text-lg">{orderNumber}</span>
                </motion.div>
                
                <motion.div 
                  className="flex justify-between items-center py-4 border-b border-houma-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + 1 * 0.1, duration: 0.6 }}
                >
                  <span className="text-houma-white/60 text-lg">Status</span>
                  <span className="text-houma-gold text-lg font-light">Confirmed</span>
                </motion.div>
                
                <motion.div 
                  className="flex justify-between items-center py-4 border-b border-houma-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + 2 * 0.1, duration: 0.6 }}
                >
                  <span className="text-houma-white/60 text-lg">Estimated Delivery</span>
                  <span className="text-houma-white text-lg">3-5 Business Days</span>
                </motion.div>
                
                <motion.div 
                  className="flex justify-between items-center py-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + 3 * 0.1, duration: 0.6 }}
                >
                  <span className="text-houma-white/60 text-lg">Email Confirmation</span>
                  <span className="text-houma-white text-lg">Sent</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Cultural Message */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ delay: 1.6, duration: 1 }}
            >
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-houma-gold/10 to-transparent h-px top-1/2"></div>
                <div className="bg-houma-black px-12">
                  <p className="text-xl text-houma-white/50 italic font-light">
                    "Every piece tells a story. Every order preserves a legacy."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-8 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <Link href="/shop">
                <motion.button
                  className="houma-button group px-12 py-5 text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center">
                    CONTINUE SHOPPING
                    <ArrowRightIcon className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.button>
              </Link>
              
              <Link href="/">
                <motion.button
                  className="px-12 py-5 bg-houma-white/5 border border-houma-white/10 text-houma-white hover:bg-houma-white/10 hover:border-houma-gold/30 transition-all duration-500 rounded-lg group text-lg font-light"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center">
                    RETURN HOME
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Social Sharing */}
            <motion.div
              className="mt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ delay: 2.4, duration: 0.8 }}
            >
              <p className="text-houma-white/40 mb-8 text-sm tracking-widest">SHARE YOUR EXPERIENCE</p>
              <div className="flex justify-center space-x-8">
                {['Instagram', 'Twitter', 'Facebook'].map((platform, index) => (
                  <motion.button
                    key={platform}
                    className="px-8 py-4 bg-houma-white/3 border border-houma-white/5 text-houma-white/60 hover:text-houma-gold hover:border-houma-gold/20 transition-all duration-500 rounded-lg text-sm tracking-wider"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                    transition={{ delay: 2.6 + index * 0.1 }}
                  >
                    {platform}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

         {/* Divine Floating Elements */}
         <div className="absolute inset-0 pointer-events-none">
           {[...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-px h-px bg-houma-gold/20"
               style={{
                 left: `${10 + i * 8}%`,
                 top: `${15 + i * 6}%`
               }}
               animate={{
                 y: [0, -40, 0],
                 x: [0, Math.sin(i) * 20, 0],
                 opacity: [0.2, 0.8, 0.2],
                 scale: [0.5, 1.5, 0.5]
               }}
               transition={{
                 duration: 6 + i * 0.4,
                 repeat: Infinity,
                 delay: i * 0.3,
                 ease: "easeInOut"
               }}
             />
           ))}
           
           {/* Larger Floating Orbs */}
           {[...Array(4)].map((_, i) => (
             <motion.div
               key={`large-orb-${i}`}
               className="absolute w-3 h-3 bg-houma-gold/10 rounded-full blur-sm"
               style={{
                 left: `${25 + i * 20}%`,
                 top: `${30 + i * 15}%`
               }}
               animate={{
                 y: [0, -60, 0],
                 x: [0, 30, 0],
                 opacity: [0.1, 0.4, 0.1],
                 scale: [0.8, 1.2, 0.8]
               }}
               transition={{
                 duration: 10 + i * 1,
                 repeat: Infinity,
                 delay: i * 2,
                 ease: "easeInOut"
               }}
             />
           ))}
           
           {/* Elegant Light Streaks */}
           {[...Array(3)].map((_, i) => (
             <motion.div
               key={`streak-${i}`}
               className="absolute w-20 h-px bg-gradient-to-r from-transparent via-houma-gold/20 to-transparent"
               style={{
                 left: `${20 + i * 25}%`,
                 top: `${40 + i * 20}%`,
                 transform: `rotate(${-15 + i * 15}deg)`
               }}
               animate={{
                 opacity: [0, 0.6, 0],
                 scaleX: [0.5, 1.5, 0.5]
               }}
               transition={{
                 duration: 8 + i * 0.5,
                 repeat: Infinity,
                 delay: i * 1.5,
                 ease: "easeInOut"
               }}
             />
           ))}
           
           {/* Wavy Flowing Lines */}
           {[...Array(4)].map((_, i) => (
             <motion.div
               key={`wavy-line-${i}`}
               className="absolute h-px bg-gradient-to-r from-transparent via-houma-gold/45 to-transparent"
               style={{
                 width: `${150 + i * 30}px`,
                 left: `${15 + i * 20}%`,
                 top: `${30 + i * 18}%`,
                 transform: `rotate(${-10 + i * 12}deg)`
               }}
               animate={{
                 x: [0, 80, 0],
                 y: [0, Math.sin(i * 0.5) * 15, 0],
                 opacity: [0, 0.9, 0],
                 scaleX: [0.3, 1.5, 0.3]
               }}
               transition={{
                 duration: 10 + i * 0.8,
                 repeat: Infinity,
                 delay: i * 1.8,
                 ease: "easeInOut"
               }}
             />
           ))}
           
           {/* Energy Streams */}
           {[...Array(6)].map((_, i) => (
             <motion.div
               key={`energy-stream-${i}`}
               className="absolute w-px h-48 bg-gradient-to-b from-houma-gold/40 via-houma-gold/60 to-transparent"
               style={{
                 left: `${12 + i * 14}%`,
                 top: `${10 + i * 12}%`,
                 transform: `rotate(${5 + i * 8}deg)`
               }}
               animate={{
                 y: [0, 50, 0],
                 opacity: [0.4, 1, 0.4],
                 scaleY: [0.5, 1.8, 0.5]
               }}
               transition={{
                 duration: 7 + i * 0.4,
                 repeat: Infinity,
                 delay: i * 0.9,
                 ease: "easeInOut"
               }}
             />
           ))}
           
           {/* Floating Dust Particles */}
           {[...Array(15)].map((_, i) => (
             <motion.div
               key={`dust-particle-${i}`}
               className="absolute w-1.5 h-1.5 bg-houma-gold/40 rounded-full"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`
               }}
               animate={{
                 y: [0, -80, 0],
                 x: [0, Math.cos(i * 0.3) * 40, 0],
                 opacity: [0, 0.8, 0],
                 scale: [0, 1.5, 0]
               }}
               transition={{
                 duration: 8 + Math.random() * 6,
                 repeat: Infinity,
                 delay: Math.random() * 4,
                 ease: "easeOut"
               }}
             />
           ))}
         </div>
      </div>
    </>
  )
}

export default OrderConfirmation
