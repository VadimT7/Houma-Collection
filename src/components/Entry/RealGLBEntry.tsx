import React, { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

interface RealGLBEntryProps {
  onComplete: () => void
}

// GLB Loader Component
function GLBLoader({ isUnlocked, onLoadComplete }: { isUnlocked: boolean, onLoadComplete: () => void }) {
  const meshRef = useRef<any>(null)
  const [gltf, setGltf] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [THREE, setTHREE] = useState<any>(null)
  
  useEffect(() => {
    // Dynamically import Three.js only on client
    const loadThree = async () => {
      const three = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader')
      
      setTHREE(three)
      
      console.log('Starting GLB load...')
      // Load GLB manually with proper error handling
      const loader = new GLTFLoader()
    
      loader.load(
        '/Resources/GLB_Models/chest.glb',
        (loadedGltf) => {
          console.log('✅ GLB loaded successfully:', loadedGltf)
          setGltf(loadedGltf)
          setLoading(false)
          onLoadComplete()
        },
        (progress) => {
          console.log('📊 Loading progress:', (progress.loaded / progress.total) * 100 + '%')
        },
        (err) => {
          console.error('❌ GLB loading failed:', err)
          setError(true)
          setLoading(false)
          onLoadComplete()
        }
      )
    }
    
    loadThree()
  }, [onLoadComplete])
  
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
  
  if (loading) {
    return null // Loading is handled by parent
  }
  
  if (error || !gltf) {
    return (
      <group>
        {/* Fallback simple chest */}
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
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.3, 1.6]} />
          <meshStandardMaterial 
            color="#A0522D" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
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
      </group>
    )
  }
  
  // Enhance the GLB model
  React.useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            const mat = child.material as THREE.MeshStandardMaterial
            mat.metalness = 0.7
            mat.roughness = 0.3
            mat.envMapIntensity = 1.5
            
            // Add golden glow to gold parts
            if (mat.color && mat.color.r > 0.6 && mat.color.g > 0.4) {
              mat.emissive = new THREE.Color(0x442200)
              mat.emissiveIntensity = 0.2
            }
          }
          
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [gltf])
  
  return (
    <group ref={meshRef} scale={[1.5, 1.5, 1.5]}>
      <primitive object={gltf.scene} />
      
      {/* Glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial 
          color="#D4AF37" 
          transparent 
          opacity={isUnlocked ? 0.3 : 0.1}
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
      particlesRef.current.material.opacity = Math.max(0, 1 - state.clock.elapsedTime * 0.2)
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
export default function RealGLBEntry({ onComplete }: RealGLBEntryProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(-1)
  const [canInteract, setCanInteract] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [glbLoaded, setGlbLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  const messages = [
    "You are entering HOUMA",
    "Not everyone is allowed inside",
    "This is more than fashion",
    "This is heritage. This is power",
    "Welcome to the inner circle"
  ]
  
  useEffect(() => {
    // Ensure we're on client side
    setIsClient(true)
    // Enable interaction immediately - NO WAITING AT ALL
    setIsReady(true)
    setCanInteract(true)
  }, [])
  
  const handleLoadComplete = () => {
    setGlbLoaded(true)
  }
  
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
  
  // Don't render until client-side
  if (!isClient) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 bg-black z-[9999] cursor-pointer overflow-hidden"
      onClick={handleUnlock}
    >
      {/* 3D Scene - Only render on client */}
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
          
          {/* REAL GLB Chest Model */}
          <GLBLoader isUnlocked={isUnlocked} onLoadComplete={handleLoadComplete} />
          
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
      
      {/* NO LOADING OVERLAY - REMOVED COMPLETELY */}
      
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
