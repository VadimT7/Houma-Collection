import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

interface ChestSceneProps {
  isUnlocked: boolean
  onUnlockComplete: () => void
}

export default function CSSAnimatedChest({ isUnlocked, onUnlockComplete }: ChestSceneProps) {
  const [showParticles, setShowParticles] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)
  
  const messages = [
    "You are entering HOUMA.",
    "Not everyone is allowed inside.",
    "This is more than fashion.",
    "This is heritage. This is power.",
    "Welcome to the inner circle."
  ]
  
  useEffect(() => {
    if (isUnlocked) {
      // Show particles
      setShowParticles(true)
      
      // Cycle through messages
      const messageInterval = setInterval(() => {
        setCurrentMessage(prev => {
          if (prev >= messages.length - 1) {
            clearInterval(messageInterval)
            setTimeout(() => {
              onUnlockComplete()
            }, 2000)
            return prev
          }
          return prev + 1
        })
      }, 2000)
      
      return () => clearInterval(messageInterval)
    }
  }, [isUnlocked, onUnlockComplete, messages.length])
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-houma-black via-houma-black/90 to-houma-black" />
      
          {/* Chest Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={isUnlocked ? {
            scale: [1, 1.2, 1.1],
            rotateY: [0, 5, 0]
          } : {
            y: [0, -10, 0],
            rotateY: [0, 2, 0]
          }}
          transition={{
            duration: isUnlocked ? 2 : 4,
            repeat: isUnlocked ? 0 : Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Chest Base */}
          <div className="relative">
            {/* Main chest body */}
            <div className="w-40 h-24 bg-gradient-to-b from-amber-900 via-amber-800 to-amber-950 rounded-lg shadow-2xl border-2 border-amber-700 relative overflow-hidden">
              {/* Wood grain texture */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-600 to-transparent transform rotate-12 scale-150" />
                <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent transform -rotate-12 scale-150" />
              </div>
              
              {/* Chest lid */}
              <motion.div
                className="absolute -top-3 left-0 w-40 h-8 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 rounded-t-lg border-2 border-amber-600 origin-bottom relative overflow-hidden"
                animate={isUnlocked ? {
                  rotateX: -90
                } : {}}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Lid wood grain */}
                <div className="absolute inset-0 opacity-15">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent transform rotate-6 scale-150" />
                </div>
              </motion.div>
              
              {/* Gold trim on lid */}
              <div className="absolute -top-2 left-1 w-38 h-5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-t-lg opacity-90 shadow-lg" />
              
              {/* Gold corner reinforcements */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-bl from-yellow-400 to-yellow-600 rounded-tr-lg" />
              
              {/* Lock */}
              <motion.div
                className="absolute top-3 right-4 w-5 h-5 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-lg relative"
                animate={isUnlocked ? {
                  scale: [1, 1.3, 1.1],
                  boxShadow: [
                    "0 0 10px rgba(212, 175, 55, 0.5)",
                    "0 0 30px rgba(212, 175, 55, 1)",
                    "0 0 20px rgba(212, 175, 55, 0.8)"
                  ]
                } : {
                  boxShadow: [
                    "0 0 10px rgba(212, 175, 55, 0.3)",
                    "0 0 20px rgba(212, 175, 55, 0.6)",
                    "0 0 10px rgba(212, 175, 55, 0.3)"
                  ]
                }}
                transition={{
                  duration: isUnlocked ? 1.5 : 2,
                  repeat: isUnlocked ? 0 : Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Lock keyhole */}
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-800 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </motion.div>
              
              {/* Decorative studs */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full opacity-70 shadow-sm" />
              <div className="absolute top-4 right-8 w-2 h-2 bg-yellow-400 rounded-full opacity-70 shadow-sm" />
              <div className="absolute top-4 left-1/2 w-2 h-2 bg-yellow-400 rounded-full opacity-70 shadow-sm transform -translate-x-1/2" />
              
              {/* Bottom decorative elements */}
              <div className="absolute bottom-4 left-6 w-4 h-1 bg-amber-700 rounded shadow-sm" />
              <div className="absolute bottom-4 right-6 w-4 h-1 bg-amber-700 rounded shadow-sm" />
              <div className="absolute bottom-4 left-1/2 w-4 h-1 bg-amber-700 rounded shadow-sm transform -translate-x-1/2" />
              
              {/* Side handles */}
              <div className="absolute top-1/2 -left-2 w-2 h-6 bg-gradient-to-r from-amber-700 to-amber-800 rounded-l-lg transform -translate-y-1/2" />
              <div className="absolute top-1/2 -right-2 w-2 h-6 bg-gradient-to-l from-amber-700 to-amber-800 rounded-r-lg transform -translate-y-1/2" />
            </div>
            
            {/* Enhanced glow effect */}
            <motion.div
              className="absolute inset-0 w-40 h-24 bg-yellow-400 rounded-lg opacity-0 blur-xl"
              animate={isUnlocked ? {
                opacity: [0, 0.4, 0.2],
                scale: [1, 1.6, 1.3]
              } : {
                opacity: [0, 0.15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: isUnlocked ? 1.5 : 3,
                repeat: isUnlocked ? 0 : Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Additional atmospheric glow */}
            <motion.div
              className="absolute inset-0 w-40 h-24 bg-amber-400 rounded-lg opacity-0 blur-2xl"
              animate={isUnlocked ? {
                opacity: [0, 0.2, 0.1],
                scale: [1, 1.8, 1.4]
              } : {
                opacity: [0, 0.08, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: isUnlocked ? 1.5 : 3,
                repeat: isUnlocked ? 0 : Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Particle Effects */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                initial={{
                  x: "50%",
                  y: "50%",
                  opacity: 1,
                  scale: 0
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  opacity: [1, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
      
      {/* Messages */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center px-8">
              <motion.h1
                key={currentMessage}
                className="text-3xl md:text-5xl lg:text-6xl font-display tracking-[0.2em] text-houma-white uppercase"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 1.1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {messages[currentMessage]}
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Corner ornaments */}
      <div className="absolute top-8 left-8">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M0 0 L60 0 L60 10 L10 10 L10 60 L0 60 Z"
            fill="url(#gold-gradient)"
            opacity="0.3"
          />
          <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8B6914" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="absolute top-8 right-8 rotate-90">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M0 0 L60 0 L60 10 L10 10 L10 60 L0 60 Z"
            fill="url(#gold-gradient)"
            opacity="0.3"
          />
        </svg>
      </div>
      
      <div className="absolute bottom-8 left-8 -rotate-90">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M0 0 L60 0 L60 10 L10 10 L10 60 L0 60 Z"
            fill="url(#gold-gradient)"
            opacity="0.3"
          />
        </svg>
      </div>
      
      <div className="absolute bottom-8 right-8 rotate-180">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M0 0 L60 0 L60 10 L10 10 L10 60 L0 60 Z"
            fill="url(#gold-gradient)"
            opacity="0.3"
          />
        </svg>
      </div>
    </div>
  )
}
