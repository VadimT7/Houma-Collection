import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface ChestSceneProps {
  isUnlocked: boolean
  onUnlockComplete: () => void
}

// Simple procedural chest that always works
function SimpleChest({ isUnlocked, onUnlockComplete }: { isUnlocked: boolean, onUnlockComplete: () => void }) {
  const chestRef = useRef<THREE.Group>(null)
  const lidRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const [glowIntensity, setGlowIntensity] = useState(0.5)
  
  // Animate unlock
  useEffect(() => {
    if (isUnlocked && chestRef.current && lidRef.current) {
      const timeline = gsap.timeline({
        onComplete: () => {
          setTimeout(onUnlockComplete, 500)
        }
      })
      
      // Shake
      timeline.to(chestRef.current.position, {
        x: "+=0.03",
        duration: 0.05,
        repeat: 20,
        yoyo: true,
        ease: "power2.inOut"
      })
      
      // Glow pulse
      .to({}, {
        duration: 1.5,
        onUpdate: function() {
          const progress = this.progress()
          setGlowIntensity(1 + Math.sin(progress * Math.PI * 2) * 2)
        }
      }, 0)
      
      // Lid opens
      .to(lidRef.current.rotation, {
        x: -Math.PI / 2.5,
        duration: 2,
        ease: "power2.out"
      }, 0.5)
      
      // Scale up
      .to(chestRef.current.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 1.5,
        ease: "back.out(1.7)"
      }, 0.5)
      
      // Camera zoom
      .to(camera.position, {
        z: 2,
        y: 1,
        duration: 2.5,
        ease: "power2.inOut"
      }, "-=1")
      
      // Fly through
      .to(camera.position, {
        z: -10,
        duration: 2,
        ease: "power4.in"
      }, "+=0.5")
    }
  }, [isUnlocked, camera, onUnlockComplete])
  
  // Idle animation
  useFrame((state) => {
    if (chestRef.current && !isUnlocked) {
      chestRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      chestRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03
    }
  })
  
  return (
    <group ref={chestRef} position={[0, 0, 0]}>
      {/* Chest Base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2, 1, 1.5]} />
        <meshStandardMaterial 
          color="#1a0f0a" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#D4AF37"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Chest Lid */}
      <mesh ref={lidRef} position={[0, 0.15, 0]}>
        <boxGeometry args={[2, 0.3, 1.5]} />
        <meshStandardMaterial 
          color="#1a0f0a" 
          metalness={0.7} 
          roughness={0.3}
        />
      </mesh>
      
      {/* Gold Trim */}
      <mesh position={[0, 0.31, 0]}>
        <boxGeometry args={[1.8, 0.02, 1.3]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Lock */}
      <mesh position={[0, 0, 0.76]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={isUnlocked ? 0.8 : 0.2}
        />
      </mesh>
      
      {/* Glow light */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={glowIntensity}
        color="#D4AF37"
        distance={4}
      />
    </group>
  )
}

// GLB Chest Component
function GLBChest({ isUnlocked, onUnlockComplete }: { isUnlocked: boolean, onUnlockComplete: () => void }) {
  const chestRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/Resources/GLB_Models/logo_basic_pbr.glb')
  const { camera } = useThree()
  const [glowIntensity, setGlowIntensity] = useState(0.5)
  
  // Setup the GLB scene
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            const mat = child.material as THREE.MeshStandardMaterial
            mat.metalness = 0.7
            mat.roughness = 0.3
            mat.envMapIntensity = 1.5
          }
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [scene])
  
  // Animate unlock
  useEffect(() => {
    if (isUnlocked && chestRef.current) {
      const timeline = gsap.timeline({
        onComplete: () => {
          setTimeout(onUnlockComplete, 500)
        }
      })
      
      // Shake
      timeline.to(chestRef.current.position, {
        x: "+=0.03",
        duration: 0.05,
        repeat: 20,
        yoyo: true,
        ease: "power2.inOut"
      })
      
      // Glow pulse
      .to({}, {
        duration: 1.5,
        onUpdate: function() {
          const progress = this.progress()
          setGlowIntensity(1 + Math.sin(progress * Math.PI * 2) * 2)
        }
      }, 0)
      
      // Rotate and scale
      .to(chestRef.current.rotation, {
        y: Math.PI * 0.15,
        duration: 1.5,
        ease: "power2.out"
      }, 0.5)
      .to(chestRef.current.scale, {
        x: 1.15,
        y: 1.15,
        z: 1.15,
        duration: 1.5,
        ease: "back.out(1.7)"
      }, 0.5)
      
      // Camera zoom
      .to(camera.position, {
        z: 2,
        y: 1,
        duration: 2.5,
        ease: "power2.inOut"
      }, "-=1")
      
      // Fly through
      .to(camera.position, {
        z: -10,
        duration: 2,
        ease: "power4.in"
      }, "+=0.5")
    }
  }, [isUnlocked, camera, onUnlockComplete])
  
  // Idle animation
  useFrame((state) => {
    if (chestRef.current && !isUnlocked) {
      chestRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      chestRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03
    }
  })
  
  return (
    <group ref={chestRef} scale={[0.7, 0.7, 0.7]}>
      <primitive object={scene} />
      
      {/* Glow light */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={glowIntensity}
        color="#D4AF37"
        distance={4}
      />
    </group>
  )
}

// Particle Burst
function ParticleBurst({ isActive }: { isActive: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 1500
  
  const particles = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Start at center
      positions[i3] = 0
      positions[i3 + 1] = 0.5
      positions[i3 + 2] = 0
      
      // Gold colors
      colors[i3] = 0.831
      colors[i3 + 1] = 0.686
      colors[i3 + 2] = 0.216
      
      sizes[i] = Math.random() * 0.05 + 0.02
      
      // Burst velocities
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 0.5 + 0.3
      
      velocities[i3] = Math.cos(angle) * speed
      velocities[i3 + 1] = Math.random() * speed + 0.2
      velocities[i3 + 2] = Math.sin(angle) * speed
    }
    
    return { positions, colors, sizes, velocities }
  }, [])
  
  useFrame((state, delta) => {
    if (!particlesRef.current || !isActive) return
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    const velocities = particles.velocities
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      positions[i3] += velocities[i3] * delta
      positions[i3 + 1] += velocities[i3 + 1] * delta
      positions[i3 + 2] += velocities[i3 + 2] * delta
      
      velocities[i3 + 1] -= delta * 0.3
      velocities[i3] *= 0.98
      velocities[i3 + 2] *= 0.98
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    
    // Fade out
    const material = particlesRef.current.material
    if (Array.isArray(material)) {
      material.forEach(mat => {
        if ('opacity' in mat && mat.opacity > 0) {
          mat.opacity -= delta * 0.2
        }
      })
    } else if (material && 'opacity' in material && material.opacity > 0) {
      material.opacity -= delta * 0.2
    }
  })
  
  if (!isActive) return null
  
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
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={particles.sizes}
          itemSize={1}
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Main Scene - Try GLB first, fallback to procedural
export default function SimpleWorkingChest({ isUnlocked, onUnlockComplete }: ChestSceneProps) {
  const [useGLB, setUseGLB] = useState(true)
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <spotLight
        position={[0, 5, 3]}
        intensity={1.5}
        color="#D4AF37"
        angle={0.6}
        penumbra={0.8}
        castShadow
      />
      <pointLight position={[-3, 2, -2]} intensity={0.4} color="#8B4513" />
      <pointLight position={[3, 2, -2]} intensity={0.4} color="#8B4513" />
      
      {/* Fog */}
      <fog attach="fog" args={["#0A0A0A", 2, 12]} />
      
      {/* Try GLB first, fallback to procedural */}
      {useGLB ? (
        <GLBChest 
          isUnlocked={isUnlocked} 
          onUnlockComplete={onUnlockComplete} 
        />
      ) : (
        <SimpleChest 
          isUnlocked={isUnlocked} 
          onUnlockComplete={onUnlockComplete} 
        />
      )}
      
      {/* Sparkles */}
      <Sparkles
        count={80}
        scale={4}
        size={2}
        speed={0.4}
        opacity={isUnlocked ? 0 : 0.8}
        color="#D4AF37"
      />
      
      {/* Particle burst */}
      <ParticleBurst isActive={isUnlocked} />
    </>
  )
}

// Preload model
useGLTF.preload('/Resources/GLB_Models/logo_basic_pbr.glb')
