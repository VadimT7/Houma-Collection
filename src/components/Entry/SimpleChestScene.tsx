import React, { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box, Sphere, Float } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface ChestSceneProps {
  isUnlocked: boolean
  onUnlockComplete: () => void
}

// Simple particle system
function SimpleParticles({ isActive }: { isActive: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 500
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Initial position at chest center
      positions[i3] = 0
      positions[i3 + 1] = 0
      positions[i3 + 2] = 0
      
      // Golden colors
      colors[i3] = 0.831
      colors[i3 + 1] = 0.686
      colors[i3 + 2] = 0.216
    }
    
    return { positions, colors }
  }, [])
  
  useFrame((state, delta) => {
    if (!particlesRef.current || !isActive) return
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      if (isActive) {
        // Simple burst pattern
        const angle = (i / particleCount) * Math.PI * 2
        const speed = 0.1
        const time = state.clock.elapsedTime
        
        positions[i3] += Math.cos(angle) * speed * delta
        positions[i3 + 1] += speed * delta * 0.5
        positions[i3 + 2] += Math.sin(angle) * speed * delta
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={isActive ? 1 : 0}
        size={0.05}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// Simple chest component
function SimpleChest({ isUnlocked, onUnlockComplete }: { isUnlocked: boolean, onUnlockComplete: () => void }) {
  const chestRef = useRef<THREE.Group>(null)
  const lidRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  
  // Animate chest unlock
  useEffect(() => {
    if (isUnlocked && chestRef.current && lidRef.current) {
      const timeline = gsap.timeline({
        onComplete: onUnlockComplete
      })
      
      // Chest shake
      timeline.to(chestRef.current.position, {
        x: "+=0.02",
        duration: 0.05,
        repeat: 10,
        yoyo: true,
        ease: "power2.inOut"
      })
      
      // Lid open
      timeline.to(lidRef.current.rotation, {
        x: -Math.PI / 2.5,
        duration: 2,
        ease: "power2.out"
      }, "+=0.5")
      
      // Camera zoom
      timeline.to(camera.position, {
        z: 1,
        y: 0.5,
        duration: 3,
        ease: "power2.inOut"
      }, "-=1")
      
      // Final push through
      timeline.to(camera.position, {
        z: -5,
        duration: 1.5,
        ease: "power3.in"
      }, "+=0.5")
    }
  }, [isUnlocked, camera, onUnlockComplete])
  
  return (
    <group ref={chestRef}>
      {/* Chest Base */}
      <Box args={[2, 1, 1.5]} position={[0, -0.5, 0]}>
        <meshStandardMaterial
          color="#1a0f0a"
          metalness={0.7}
          roughness={0.3}
        />
      </Box>
      
      {/* Chest Lid */}
      <Box ref={lidRef} args={[2, 0.3, 1.5]} position={[0, 0.15, 0]}>
        <meshStandardMaterial
          color="#1a0f0a"
          metalness={0.7}
          roughness={0.3}
        />
      </Box>
      
      {/* Gold Ornaments */}
      <Box args={[1.8, 0.02, 1.3]} position={[0, 0.31, 0]}>
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Lock */}
      <Sphere args={[0.15]} position={[0, 0, 0.76]}>
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={isUnlocked ? 0.5 : 0.1}
        />
      </Sphere>
    </group>
  )
}

export default function SimpleChestScene({ isUnlocked, onUnlockComplete }: ChestSceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <spotLight
        position={[0, 5, 5]}
        intensity={1}
        color="#D4AF37"
        angle={0.3}
        penumbra={0.5}
      />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#8B4513" />
      <pointLight position={[5, 3, -5]} intensity={0.5} color="#8B4513" />
      
      {/* Fog for atmosphere */}
      <fog attach="fog" args={["#0A0A0A", 1, 10]} />
      
      {/* The Chest */}
      <SimpleChest isUnlocked={isUnlocked} onUnlockComplete={onUnlockComplete} />
      
      {/* Particle Burst */}
      <SimpleParticles isActive={isUnlocked} />
    </>
  )
}
