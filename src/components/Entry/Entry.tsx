import React, { useState, useEffect, useRef, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import Cookies from 'js-cookie'

// Canvas will be imported dynamically only when needed

const CSSAnimatedChest = dynamic(() => import('./CSSAnimatedChest'), {
  ssr: false
})

const DynamicCanvas = dynamic(() => import('./DynamicCanvas'), {
  ssr: false
})

const RealGLBLoader = dynamic(() => import('./RealGLBLoader'), {
  ssr: false
})

const SimpleChestScene = dynamic(() => import('./SimpleChestScene'), {
  ssr: false
})

interface EntryProps {
  onComplete: () => void
}

// Fallback for devices that can't handle 3D
function FallbackEntry({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: onComplete
    })
    
    timeline.from('.fallback-text', {
      opacity: 0,
      y: 30,
      stagger: 0.3,
      duration: 1,
      ease: 'power3.out'
    })
    .to('.fallback-container', {
      scale: 50,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.in'
    }, '+=1')
  }, [onComplete])
  
  return (
    <div className="fallback-container fixed inset-0 bg-houma-black flex items-center justify-center z-[9999]">
      <div className="text-center">
        <div className="fallback-text mb-8">
          <h1 className="text-6xl md:text-8xl font-display tracking-wider text-houma-gold mb-4">
            حُومة
          </h1>
        </div>
        <div className="fallback-text mb-8">
          <h2 className="text-4xl md:text-6xl font-display tracking-[0.3em] text-houma-white">
            HOUMA
          </h2>
        </div>
        <div className="fallback-text">
          <p className="text-sm tracking-[0.2em] text-houma-gold/70">
            ENTER THE INNER CIRCLE
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Entry({ onComplete }: EntryProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [canInteract, setCanInteract] = useState(false)
  const [use3D, setUse3D] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const messages = [
    "Welcome to HOUMA.",
    "Not everyone is allowed inside.",
    "This is more than fashion.",
    "This is heritage. This is power.",
    "Welcome to the inner circle."
  ]
  
  // Check if entry was already shown
  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true)
    
    const hasSeenEntry = Cookies.get('houma-entry-seen')
    
    // Skip entry if already seen (uncomment in production)
    // if (hasSeenEntry) {
    //   onComplete()
    //   return
    // }
    
    // Check 3D capability
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      setUse3D(false)
    }
    
    // Enable interaction after a delay
    setTimeout(() => {
      setCanInteract(true)
      setIsLoading(false)
    }, 2000)
    
    // Set cookie for 24 hours
    Cookies.set('houma-entry-seen', 'true', { expires: 1 })
  }, [onComplete])
  
  // Handle chest unlock
  const handleUnlock = () => {
    if (!canInteract || isUnlocked) return
    
    setIsUnlocked(true)
    setShowMessages(true)
    
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        if (prev >= messages.length - 1) {
          clearInterval(messageInterval)
          setTimeout(() => {
            onComplete()
          }, 2000)
          return prev
        }
        return prev + 1
      })
    }, 2000)
  }
  
  // Handle unlock completion from 3D scene
  const handleUnlockComplete = () => {
    // Final transition is handled by the scene
    setTimeout(onComplete, 500)
  }
  
  // Don't render until client-side
  if (!isClient) {
    return null
  }
  
  // Use fallback if 3D not supported
  if (!use3D) {
    return <FallbackEntry onComplete={onComplete} />
  }
  
  // Use the GLB Entry component if client-side, otherwise fallback
  if (!isClient) {
    return null // No loading screen at all
  }

  // Return the REAL GLB Loader component
  return <RealGLBLoader onComplete={onComplete} />
}
