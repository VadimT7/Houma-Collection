import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import * as THREE from 'three'

interface RobustGLBEntryProps {
  onComplete: () => void
}

// Procedural Chest Component
function ProceduralChest({ isUnlocked }: { isUnlocked: boolean }) {
  const meshRef = useRef<THREE.Group>(null)
  const [showParticles, setShowParticles] = useState(false)
  
  // Unlock animation
  useEffect(() => {
    if (isUnlocked && meshRef.current) {
      const timeline = gsap.timeline()
      
      timeline
        .to(meshRef.current.rotation, {
          x: 0.05,
          y: 0.1,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power2.inOut"
        })
        .to(meshRef.current.scale, {
          x: 1.15,
          y: 1.15,
          z: 1.15,
          duration: 0.8,
          ease: "back.out(1.7)"
        }, "-=0.3")
      
      setTimeout(() => setShowParticles(true), 600)
    }
  }, [isUnlocked])
  
  // Floating animation
  useFrame((state) => {
    if (meshRef.current && !isUnlocked) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })
  
  return (
    <group ref={meshRef}>
      {/* Main chest body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.5, 1.5]} />
        <meshStandardMaterial 
          color="#8B4513" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#332200"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Chest lid */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.3, 1.6]} />
        <meshStandardMaterial 
          color="#A0522D" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Gold trim */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2.2, 0.1, 1.7]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Lock */}
      <mesh position={[0.7, 0.3, 0.8]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Decorative studs */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[-0.6 + i * 0.24, 0.3, 0.8]} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#D4AF37"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      
      {/* Glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial 
          color="#D4AF37" 
          transparent 
          opacity={isUnlocked ? 0.2 : 0.05}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Particles */}
      {showParticles && <GoldParticles />}
    </group>
  )
}

// Particle System
function GoldParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 150
  
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle = (i / 3) * 0.1
      const radius = 0.5 + Math.random() * 2
      pos[i] = Math.cos(angle) * radius
      pos[i + 1] = (Math.random() - 0.5) * 2
      pos[i + 2] = Math.sin(angle) * radius
    }
    return pos
  }, [])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.01
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] *= 1.02
        positions[i + 1] += 0.02
        positions[i + 2] *= 1.02
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      
      // Update material opacity with type safety
      const material = particlesRef.current.material
      const targetOpacity = Math.max(0, 1 - state.clock.elapsedTime * 0.2)
      if (Array.isArray(material)) {
        material.forEach(mat => {
          if ('opacity' in mat) {
            mat.opacity = targetOpacity
          }
        })
      } else if (material && 'opacity' in material) {
        material.opacity = targetOpacity
      }
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFD700"
        size={0.05}
        transparent
        opacity={1}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Main Entry Component
export default function RobustGLBEntry({ onComplete }: RobustGLBEntryProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(-1)
  const [canInteract, setCanInteract] = useState(false)
  const [isReady, setIsReady] = useState(false)
  
  const messages = [
    "Welcome to HOUMA",
    "Not everyone is allowed inside",
    "This is more than fashion",
    "This is heritage. This is power",
    "Welcome to the inner circle"
  ]
  
  useEffect(() => {
    // Enable interaction after loading
    const timer = setTimeout(() => {
      setIsReady(true)
      setCanInteract(true)
    }, 1500) // Reduced from 2000ms
    
    return () => clearTimeout(timer)
  }, [])
  
  const handleUnlock = () => {
    if (!canInteract || isUnlocked) return
    
    setIsUnlocked(true)
    setCanInteract(false)
    
    // Start message sequence
    let messageIndex = 0
    const messageInterval = setInterval(() => {
      setCurrentMessage(messageIndex)
      messageIndex++
      
      if (messageIndex >= messages.length) {
        clearInterval(messageInterval)
        setTimeout(() => {
          setCurrentMessage(-1)
          setTimeout(onComplete, 1000)
        }, 2500)
      }
    }, 2500)
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black z-[9999] cursor-pointer overflow-hidden"
      onClick={handleUnlock}
    >
      {/* 3D Scene */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[0, 2, 2]} intensity={0.5} color="#FFD700" />
          <spotLight
            position={[0, 5, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            castShadow
          />
          
          {/* Environment */}
          <Environment preset="warehouse" background={false} />
          <fog attach="fog" args={['#000000', 5, 15]} />
          
          {/* Chest Model - Always use procedural for reliability */}
          <ProceduralChest isUnlocked={isUnlocked} />
          
          {/* Camera Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-30" />
      </div>
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            className="absolute inset-0 bg-black flex items-center justify-center z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-[#D4AF37] text-lg tracking-[0.3em] mb-4 uppercase font-light">
                Preparing Your Experience
              </div>
              <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Interaction Hint - Properly Centered */}
      <AnimatePresence>
        {canInteract && !isUnlocked && (
          <motion.div
            className="absolute inset-x-0 bottom-20 flex flex-col items-center z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="flex flex-col items-center"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-[#D4AF37] text-sm tracking-[0.4em] mb-3 uppercase font-light">
                Click to unlock
              </p>
              <motion.div 
                className="w-px h-16 bg-gradient-to-b from-[#D4AF37] to-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Messages - Non-overlapping with smooth transitions */}
      <AnimatePresence mode="wait">
        {currentMessage >= 0 && (
          <motion.div
            key={currentMessage}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-display tracking-[0.3em] text-white uppercase text-center px-8"
              initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, scale: 1.1, filter: "blur(10px)" }}
              transition={{ 
                duration: 1,
                ease: [0.22, 1, 0.36, 1]
              }}
              style={{
                textShadow: '0 0 40px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.3)',
                letterSpacing: '0.3em'
              }}
            >
              {messages[currentMessage]}
            </motion.h1>
            
            {/* Message underline */}
            <motion.div
              className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              exit={{ width: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Corner Ornaments */}
      <div className="absolute top-8 left-8 opacity-50">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path
            d="M0 0 L80 0 L80 15 L15 15 L15 80 L0 80 Z"
            fill="url(#gold-gradient-1)"
          />
          <defs>
            <linearGradient id="gold-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="absolute top-8 right-8 rotate-90 opacity-50">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path
            d="M0 0 L80 0 L80 15 L15 15 L15 80 L0 80 Z"
            fill="url(#gold-gradient-2)"
          />
          <defs>
            <linearGradient id="gold-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="absolute bottom-8 left-8 -rotate-90 opacity-50">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path
            d="M0 0 L80 0 L80 15 L15 15 L15 80 L0 80 Z"
            fill="url(#gold-gradient-3)"
          />
          <defs>
            <linearGradient id="gold-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="absolute bottom-8 right-8 rotate-180 opacity-50">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path
            d="M0 0 L80 0 L80 15 L15 15 L15 80 L0 80 Z"
            fill="url(#gold-gradient-4)"
          />
          <defs>
            <linearGradient id="gold-gradient-4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Atmospheric particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  )
}
