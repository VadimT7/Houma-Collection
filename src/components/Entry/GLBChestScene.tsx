import React, { useRef, useEffect, useState, Suspense } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import * as THREE from 'three'

interface GLBChestSceneProps {
  isUnlocked: boolean
  onUnlockComplete: () => void
}

function GLBChest({ isUnlocked, onUnlockComplete }: GLBChestSceneProps) {
  const meshRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [showParticles, setShowParticles] = useState(false)
  const [loadError, setLoadError] = useState(false)
  
  // Try to load the GLB model
  let gltf = null
  try {
    gltf = useLoader(GLTFLoader, '/Resources/GLB_Models/chest.glb')
  } catch (error) {
    console.error('Failed to load GLB model:', error)
    setLoadError(true)
  }
  
  // If GLB failed to load, use fallback
  if (loadError || !gltf) {
    return <FallbackChest isUnlocked={isUnlocked} onUnlockComplete={onUnlockComplete} />
  }
  
  // Clone the scene to avoid modifying the original
  const chestScene = gltf.scene.clone()
  
  // Enhance materials
  chestScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Make materials more metallic and reflective
      if (child.material) {
        child.material.metalness = 0.8
        child.material.roughness = 0.2
        child.material.envMapIntensity = 1.0
        
        // Add emissive glow for gold parts
        if (child.material.color) {
          const color = child.material.color
          if (color.r > 0.7 && color.g > 0.5 && color.b < 0.3) { // Gold-ish colors
            child.material.emissive = new THREE.Color(0x332200)
            child.material.emissiveIntensity = 0.1
          }
        }
      }
    }
  })
  
  // Animation on unlock
  useEffect(() => {
    if (isUnlocked && meshRef.current) {
      // Shake animation
      gsap.to(meshRef.current.rotation, {
        x: 0.1,
        y: 0.2,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut"
      })
      
      // Scale up slightly
      gsap.to(meshRef.current.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 0.5,
        ease: "power2.out"
      })
      
      // Show particles after shake
      setTimeout(() => {
        setShowParticles(true)
      }, 500)
      
      // Complete after particles
      setTimeout(() => {
        onUnlockComplete()
      }, 3000)
    }
  }, [isUnlocked, onUnlockComplete])
  
  // Continuous floating animation
  useFrame((state) => {
    if (meshRef.current && !isUnlocked) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y += 0.005
    }
    
    // Glow effect
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })
  
  return (
    <group ref={meshRef}>
      {/* Main chest model */}
      <primitive object={chestScene} scale={[2, 2, 2]} />
      
      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial 
          color="#D4AF37" 
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Particle system */}
      {showParticles && <ParticleBurst />}
    </group>
  )
}

function ParticleBurst() {
  const particlesRef = useRef<THREE.Points>(null)
  const [particles, setParticles] = useState<THREE.Vector3[]>([])
  
  useEffect(() => {
    // Create 100 particles
    const newParticles = []
    for (let i = 0; i < 100; i++) {
      newParticles.push(new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ))
    }
    setParticles(newParticles)
  }, [])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.01
      
      // Animate particles outward
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] *= 1.02 // x
        positions[i + 1] *= 1.02 // y
        positions[i + 2] *= 1.02 // z
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  if (particles.length === 0) return null
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#D4AF37" 
        size={0.1} 
        transparent 
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Fallback chest when GLB fails to load
function FallbackChest({ isUnlocked, onUnlockComplete }: GLBChestSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [showParticles, setShowParticles] = useState(false)
  
  useEffect(() => {
    if (isUnlocked && meshRef.current) {
      // Shake animation
      gsap.to(meshRef.current.rotation, {
        x: 0.1,
        y: 0.2,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut"
      })
      
      // Scale up slightly
      gsap.to(meshRef.current.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 0.5,
        ease: "power2.out"
      })
      
      // Show particles after shake
      setTimeout(() => {
        setShowParticles(true)
      }, 500)
      
      // Complete after particles
      setTimeout(() => {
        onUnlockComplete()
      }, 3000)
    }
  }, [isUnlocked, onUnlockComplete])
  
  useFrame((state) => {
    if (meshRef.current && !isUnlocked) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y += 0.005
    }
  })
  
  return (
    <group ref={meshRef}>
      {/* Simple procedural chest */}
      <mesh>
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
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[2.1, 0.3, 1.6]} />
        <meshStandardMaterial 
          color="#A0522D" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Lock */}
      <mesh position={[0.7, 0.3, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Particle system */}
      {showParticles && <ParticleBurst />}
    </group>
  )
}

export default function GLBChestScene({ isUnlocked, onUnlockComplete }: GLBChestSceneProps) {
  return (
    <Suspense fallback={null}>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#D4AF37" />
      
      {/* Environment */}
      <fog attach="fog" args={['#0A0A0A', 10, 50]} />
      
      {/* Chest */}
      <GLBChest isUnlocked={isUnlocked} onUnlockComplete={onUnlockComplete} />
      
      {/* Camera controls */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate={!isUnlocked}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </Suspense>
  )
}