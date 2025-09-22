import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

interface DynamicCanvasProps {
  isUnlocked: boolean
  onUnlockComplete: () => void
}

// Dynamically import Canvas and GLBChestScene only when this component mounts
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="text-houma-gold text-lg tracking-widest mb-4 uppercase">
          Loading 3D Scene
        </div>
        <div className="w-8 h-8 border-2 border-houma-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
})

const GLBChestScene = dynamic(() => import('./GLBChestScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="text-houma-gold text-sm tracking-widest mb-4 uppercase">
          Loading Chest Model
        </div>
        <div className="w-6 h-6 border-2 border-houma-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
})

export default function DynamicCanvas({ isUnlocked, onUnlockComplete }: DynamicCanvasProps) {
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Small delay to ensure everything is properly loaded
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    // Timeout after 5 seconds
    const errorTimer = setTimeout(() => {
      if (!isReady) {
        setHasError(true)
      }
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(errorTimer)
    }
  }, [isReady])

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-houma-gold text-lg tracking-widest mb-4 uppercase">
            3D Loading Failed
          </div>
          <div className="text-houma-gold/70 text-sm mb-4">
            Using fallback mode
          </div>
        </div>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-houma-gold text-lg tracking-widest mb-4 uppercase">
            Initializing 3D Engine
          </div>
          <div className="w-8 h-8 border-2 border-houma-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <Canvas
      className="absolute inset-0"
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <GLBChestScene 
        isUnlocked={isUnlocked}
        onUnlockComplete={onUnlockComplete}
      />
    </Canvas>
  )
}
