import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RealGLBLoaderProps {
  onComplete: () => void
}

export default function RealGLBLoader({ onComplete }: RealGLBLoaderProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(-1)
  const [canInteract, setCanInteract] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [glbLoaded, setGlbLoaded] = useState(false)
  const [glbError, setGlbError] = useState(false)
  const [chestVisible, setChestVisible] = useState(true)
  const [showSkipButton, setShowSkipButton] = useState(false)
  const [isSkipping, setIsSkipping] = useState(false)
  const [isFadingIn, setIsFadingIn] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const chestRef = useRef<any>(null)
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const messages = [
    "Welcome to HOUMA",
    "Not everyone is allowed inside",
    "This is more than fashion",
    "This is heritage. This is power",
    "Welcome to the inner circle"
  ]
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current)
      }
    }
  }, [])
  
  // Cinematic fade-in function
  const fadeInModel = () => {
    if (!chestRef.current) return
    
    setIsFadingIn(true)
    const fadeStart = Date.now()
    const fadeIn = () => {
      const fadeElapsed = Date.now() - fadeStart
      if (fadeElapsed < 2000) { // 2 second fade-in
        const opacity = Math.min(1, fadeElapsed / 2000)
        chestRef.current.traverse((child: any) => {
          if (child.material) {
            child.material.transparent = true
            child.material.opacity = opacity
          }
        })
        requestAnimationFrame(fadeIn)
      } else {
        // Fade-in complete
        setIsFadingIn(false)
        setCanInteract(true)
      }
    }
    fadeIn()
  }
  
  useEffect(() => {
    // Ensure we're on client side
    setIsClient(true)
    
    // Load Three.js and GLB after component mounts
    const loadGLB = async () => {
      try {
        console.log('Loading Three.js and GLB...')
        
        // Dynamically import Three.js
        const THREE = await import('three')
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
        
        if (!canvasRef.current) return
        
        // Setup Three.js scene
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ 
          canvas: canvasRef.current,
          antialias: true,
          alpha: true
        })
        
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.5
        renderer.outputColorSpace = THREE.SRGBColorSpace
        
         // Very bright lighting for maximum visibility
         const ambientLight = new THREE.AmbientLight(0xffffff, 2.5)
         scene.add(ambientLight)
         
         const directionalLight = new THREE.DirectionalLight(0xffffff, 4.0)
         directionalLight.position.set(5, 5, 5)
         directionalLight.castShadow = true
         scene.add(directionalLight)
         
         const pointLight = new THREE.PointLight(0xffffff, 3.5)
         pointLight.position.set(0, 2, 2)
         scene.add(pointLight)
         
         // Additional fill light for brightness
         const fillLight = new THREE.DirectionalLight(0xffffff, 2.5)
         fillLight.position.set(-3, 2, 3)
         scene.add(fillLight)
         
         // Extra rim light for definition
         const rimLight = new THREE.DirectionalLight(0xffffff, 2.0)
         rimLight.position.set(0, 0, -5)
         scene.add(rimLight)
         
         // Additional golden accent light
         const goldenLight = new THREE.PointLight(0xD4AF37, 2.0)
         goldenLight.position.set(2, 1, 3)
         scene.add(goldenLight)
        
         // Camera position - normal view since model is moved lower
         camera.position.set(0, 1, 4)
         camera.lookAt(-0.1, 0.5, 0)
         cameraRef.current = camera
        
        // Load GLB with proper error handling
        const loader = new GLTFLoader()
        
        // Set up loading manager for better progress tracking
        const loadingManager = new THREE.LoadingManager()
        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
          console.log(`Loading progress: ${itemsLoaded}/${itemsTotal} - ${url}`)
        }
        
        loader.setPath('/Resources/GLB_Models/')
        loader.load(
          'logo_basic_pbr.glb',
          (gltf: any) => {
            console.log('✅ GLB loaded successfully!', gltf)
            
            // Clone and enhance the model
            const chest = gltf.scene.clone()
            
            // Calculate proper scale based on bounding box
            const box = new THREE.Box3().setFromObject(chest)
            const size = box.getSize(new THREE.Vector3())
            const maxDimension = Math.max(size.x, size.y, size.z)
            const targetSize = 3 // Target size for the chest
            const scale = targetSize / maxDimension
            
             chest.scale.set(scale, scale, scale)
             
             // Center the chest at origin and move it lower
             const center = box.getCenter(new THREE.Vector3())
             chest.position.sub(center.multiplyScalar(scale))
             chest.position.set(0, -1.5, 0) // Move the model lower in the scene
             
             // Enhance materials for better visibility
             chest.traverse((child: any) => {
               if (child instanceof THREE.Mesh) {
                 // Enable shadows
                 child.castShadow = true
                 child.receiveShadow = true
                 
                 // Dramatically enhance material properties for maximum brightness
                 if (child.material) {
                   // Set initial opacity to 0 for fade-in effect
                   child.material.transparent = true
                   child.material.opacity = 0
                   
                   // Add strong emissive glow
                   if (child.material.emissive) {
                     child.material.emissive.multiplyScalar(0.8)
                   } else {
                     child.material.emissive = new THREE.Color(0x333333)
                   }
                   
                   // Significantly increase metalness for better light reflection
                   if (child.material.metalness !== undefined) {
                     child.material.metalness = Math.min(child.material.metalness * 1.8, 1.0)
                   }
                   
                   // Reduce roughness for maximum light reflection
                   if (child.material.roughness !== undefined) {
                     child.material.roughness = Math.max(child.material.roughness * 0.3, 0.05)
                   }
                   
                   // Increase overall brightness
                   if (child.material.color) {
                     child.material.color.multiplyScalar(1.5)
                   }
                   
                   // Ensure material is updated
                   child.material.needsUpdate = true
                 }
               }
             })
            
            scene.add(chest)
            chestRef.current = chest
            sceneRef.current = scene
            rendererRef.current = renderer
            
            setGlbLoaded(true)
            
            // Start render loop immediately
            animate()
            
            // Start cinematic fade-in after a brief delay
            setTimeout(() => {
              fadeInModel()
            }, 500)
          },
          (progress: any) => {
            // Progress tracking removed for smooth transition
            console.log(`📊 Loading progress: ${((progress.loaded / progress.total) * 100).toFixed(1)}%`)
          },
          (error: any) => {
            console.error('❌ GLB loading failed:', error)
            console.error('Error details:', error.message)
            console.error('Trying alternative path...')
            
            // Try alternative path
            loader.setPath('/')
            loader.load(
              'Resources/GLB_Models/logo_basic_pbr.glb',
              (gltf: any) => {
                console.log('✅ GLB loaded with alternative path!', gltf)
                // Same processing as above
                const chest = gltf.scene.clone()
                
                // Calculate proper scale based on bounding box
                const box = new THREE.Box3().setFromObject(chest)
                const size = box.getSize(new THREE.Vector3())
                const maxDimension = Math.max(size.x, size.y, size.z)
                const targetSize = 3 // Target size for the chest
                const scale = targetSize / maxDimension
                
                 chest.scale.set(scale, scale, scale)
                 
                 // Center the chest at origin and move it lower
                 const center = box.getCenter(new THREE.Vector3())
                 chest.position.sub(center.multiplyScalar(scale))
                 chest.position.set(0, -1.5, 0) // Move the model lower in the scene
                 
                 chest.traverse((child: any) => {
                   if (child instanceof THREE.Mesh) {
                     // Set initial opacity to 0 for fade-in effect
                     child.castShadow = true
                     child.receiveShadow = true
                     if (child.material) {
                       child.material.transparent = true
                       child.material.opacity = 0
                     }
                   }
                 })
                
                scene.add(chest)
                chestRef.current = chest
                sceneRef.current = scene
                rendererRef.current = renderer
                cameraRef.current = camera
                
                setGlbLoaded(true)
                animate()
                
                // Start cinematic fade-in after a brief delay
                setTimeout(() => {
                  fadeInModel()
                }, 500)
              },
              (progress: any) => {
                // Progress tracking removed for smooth transition
                console.log(`📊 Alt path progress: ${((progress.loaded / progress.total) * 100).toFixed(1)}%`)
              },
              (altError: any) => {
                console.error('❌ Alternative path also failed:', altError)
                setGlbError(true)
                setCanInteract(true)
              }
            )
          }
        )
        
      } catch (error) {
        console.error('Failed to load Three.js:', error)
        setGlbError(true)
        setCanInteract(true)
      }
    }
    
    loadGLB()
  }, [])
  
  const animate = () => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return
    
    requestAnimationFrame(animate)
    
     // Floating animation - no rotation
     if (!isUnlocked && chestRef.current) {
       chestRef.current.position.y = Math.sin(Date.now() * 0.001 * 0.8) * 0.05
       // No rotation - chest stays still
     }
    
    rendererRef.current.render(sceneRef.current, cameraRef.current)
  }
  
  const handleUnlock = () => {
    if (!canInteract || isUnlocked) return
    
    setIsUnlocked(true)
    setCanInteract(false)
    
     // Animate chest - just fade out smoothly
     if (chestRef.current) {
       // Smooth fade out animation
       const fadeStart = Date.now()
       const fadeOut = () => {
         const fadeElapsed = Date.now() - fadeStart
         if (fadeElapsed < 1500) {
           const opacity = Math.max(0, 1 - (fadeElapsed / 1500))
           chestRef.current.traverse((child: any) => {
             if (child.material) {
               child.material.transparent = true
               child.material.opacity = opacity
             }
           })
           requestAnimationFrame(fadeOut)
         } else {
           // Hide chest completely
           setChestVisible(false)
         }
       }
       fadeOut()
     }
    
    // Start message sequence after a shorter delay
    setTimeout(() => {
      let messageIndex = 0
      const messageInterval = setInterval(() => {
        setCurrentMessage(messageIndex)
        messageIndex++
        
        // Show skip button a few seconds after first message appears
        if (messageIndex === 1) {
          setTimeout(() => {
            setShowSkipButton(true)
          }, 2000) // 2 second delay after first message appears
        }
        
        if (messageIndex >= messages.length) {
          clearInterval(messageInterval)
          messageIntervalRef.current = null
          // Special longer duration for the final "Welcome to the Inner Circle" message
          setTimeout(() => {
            setCurrentMessage(-1)
            // Smooth zoom transition to homepage
            setTimeout(onComplete, 500) // Quick transition to start zoom effect
          }, 4000) // 4 seconds for the final message to have more impact
        }
      }, 3500) // Increased from 2500ms to 3500ms for better pacing
      
      messageIntervalRef.current = messageInterval
    }, 500) // Reduced from 1000ms to 500ms for faster transition
  }
  
  const handleSkip = () => {
    if (isSkipping) return
    
    setIsSkipping(true)
    setShowSkipButton(false)
    
    // Clear the message interval if it exists
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current)
      messageIntervalRef.current = null
    }
    
    // Clear current message and trigger the same transition as the final message
    setCurrentMessage(-1)
    
    // Use the same timing as the final message transition
    setTimeout(() => {
      setTimeout(onComplete, 500) // Quick transition to start zoom effect
    }, 1000) // Short delay to allow message to fade out
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
       {/* Three.js Canvas */}
       <canvas 
         ref={canvasRef}
         className="absolute inset-0 w-full h-full"
         style={{ 
           background: 'transparent',
           opacity: chestVisible ? 1 : 0,
           transition: 'opacity 0.5s ease-out'
         }}
       />
      
      
      
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
               className={`text-4xl md:text-6xl lg:text-7xl font-display tracking-[0.3em] uppercase text-center px-8 ${
                 currentMessage === 4 ? 'text-[#D4AF37]' : 'text-white'
               }`}
               initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
               animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
               exit={{ opacity: 0, y: -30, scale: 1.1, filter: "blur(10px)" }}
               transition={{ 
                 duration: 1,
                 ease: [0.22, 1, 0.36, 1]
               }}
               style={{
                 textShadow: currentMessage === 4 
                   ? '0 0 40px rgba(212, 175, 55, 0.8), 0 0 80px rgba(212, 175, 55, 0.6)' 
                   : '0 0 40px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.3)',
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
      
      {/* Skip Button */}
      <AnimatePresence>
        {showSkipButton && !isSkipping && (
          <motion.div
            className="absolute inset-x-0 bottom-8 flex flex-col items-center z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <motion.div
              className="flex flex-col items-center cursor-pointer"
              onClick={handleSkip}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-[#D4AF37]/60 text-sm tracking-[0.4em] mb-3 uppercase font-light">
                Press to skip
              </p>
              <motion.div 
                className="w-px h-16 bg-gradient-to-b from-[#D4AF37]/40 to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
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
