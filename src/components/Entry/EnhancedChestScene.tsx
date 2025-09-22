import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box, Sphere, Float, Torus, Cylinder, Text } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface ChestSceneProps {
  isUnlocked: boolean
  onUnlockComplete: () => void
  playSound?: boolean
}

// Enhanced custom shader for more dramatic glow
const enhancedGlowVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const enhancedGlowFragmentShader = `
  uniform vec3 glowColor;
  uniform float glowIntensity;
  uniform float time;
  uniform bool isUnlocking;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    // Core glow
    float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    vec3 glow = glowColor * intensity * glowIntensity;
    
    // Pulsing effect
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    glow *= (0.7 + pulse * 0.3);
    
    // Dramatic shimmer patterns
    float shimmer1 = sin(vPosition.x * 15.0 + time * 3.0) * sin(vPosition.y * 15.0 - time * 2.0) * 0.5 + 0.5;
    float shimmer2 = cos(vPosition.z * 10.0 - time * 4.0) * 0.5 + 0.5;
    vec3 shimmerColor = mix(vec3(0.8, 0.6, 0.2), vec3(1.0, 0.9, 0.5), shimmer1);
    glow += shimmerColor * shimmer2 * 0.4;
    
    // Add energy waves when unlocking
    if (isUnlocking) {
      float wave = sin(length(vPosition.xy) * 5.0 - time * 5.0) * 0.5 + 0.5;
      glow += vec3(1.0, 0.8, 0.3) * wave * 0.6;
    }
    
    // UV-based patterns for mystical effect
    float pattern = sin(vUv.x * 30.0) * sin(vUv.y * 30.0) * 0.5 + 0.5;
    glow += vec3(0.6, 0.4, 0.1) * pattern * 0.2;
    
    gl_FragColor = vec4(glow, intensity * 1.2);
  }
`

// Enhanced particle system with multiple layers
function MultiLayerParticleSystem({ isActive }: { isActive: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)
  const dustRef = useRef<THREE.Points>(null)
  const sparklesRef = useRef<THREE.Points>(null)
  
  const particleCount = 3000
  const dustCount = 1000
  const sparkleCount = 500
  
  const particles = useMemo(() => {
    // Main burst particles
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      positions[i3] = 0
      positions[i3 + 1] = 0
      positions[i3 + 2] = 0
      
      // Varied colors - gold, sand, bronze
      const colorType = Math.random()
      if (colorType < 0.4) {
        colors[i3] = 0.831
        colors[i3 + 1] = 0.686
        colors[i3 + 2] = 0.216
      } else if (colorType < 0.7) {
        colors[i3] = 0.96
        colors[i3 + 1] = 0.87
        colors[i3 + 2] = 0.70
      } else {
        colors[i3] = 0.8
        colors[i3 + 1] = 0.5
        colors[i3 + 2] = 0.2
      }
      
      sizes[i] = Math.random() * 0.08 + 0.02
      
      // Spherical burst pattern
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = Math.random() * 0.4 + 0.2
      
      velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed
      velocities[i3 + 1] = Math.cos(phi) * speed * 0.8
      velocities[i3 + 2] = Math.sin(phi) * Math.sin(theta) * speed
    }
    
    // Dust particles
    const dustPositions = new Float32Array(dustCount * 3)
    const dustVelocities = new Float32Array(dustCount * 3)
    
    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3
      dustPositions[i3] = (Math.random() - 0.5) * 0.5
      dustPositions[i3 + 1] = Math.random() * 0.2
      dustPositions[i3 + 2] = (Math.random() - 0.5) * 0.5
      
      dustVelocities[i3] = (Math.random() - 0.5) * 0.02
      dustVelocities[i3 + 1] = Math.random() * 0.05
      dustVelocities[i3 + 2] = (Math.random() - 0.5) * 0.02
    }
    
    // Sparkles
    const sparklePositions = new Float32Array(sparkleCount * 3)
    for (let i = 0; i < sparkleCount; i++) {
      const i3 = i * 3
      sparklePositions[i3] = (Math.random() - 0.5) * 4
      sparklePositions[i3 + 1] = Math.random() * 3
      sparklePositions[i3 + 2] = (Math.random() - 0.5) * 4
    }
    
    return { 
      positions, colors, sizes, velocities,
      dustPositions, dustVelocities,
      sparklePositions
    }
  }, [])
  
  useFrame((state, delta) => {
    if (!isActive) return
    
    // Update main particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const velocities = particles.velocities
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        positions[i3] += velocities[i3] * delta
        positions[i3 + 1] += velocities[i3 + 1] * delta
        positions[i3 + 2] += velocities[i3 + 2] * delta
        
        velocities[i3 + 1] -= delta * 0.15 // gravity
        velocities[i3] *= 0.985 // air resistance
        velocities[i3 + 2] *= 0.985
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.material.opacity = Math.max(0, 1 - state.clock.elapsedTime * 0.1)
    }
    
    // Update dust
    if (dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array as Float32Array
      const velocities = particles.dustVelocities
      
      for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3
        positions[i3] += velocities[i3]
        positions[i3 + 1] += velocities[i3 + 1]
        positions[i3 + 2] += velocities[i3 + 2]
      }
      
      dustRef.current.geometry.attributes.position.needsUpdate = true
      dustRef.current.rotation.y += delta * 0.1
    }
    
    // Animate sparkles
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y += delta * 0.5
      sparklesRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5
    }
  })
  
  return (
    <>
      {/* Main burst */}
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
          opacity={isActive ? 1 : 0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Dust layer */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustCount}
            array={particles.dustPositions}
            itemSize={3}
            args={[particles.dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#D4AF37"
          size={0.01}
          transparent
          opacity={isActive ? 0.3 : 0}
          depthWrite={false}
        />
      </points>
      
      {/* Sparkles */}
      <points ref={sparklesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={sparkleCount}
            array={particles.sparklePositions}
            itemSize={3}
            args={[particles.sparklePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FFD700"
          size={0.03}
          transparent
          opacity={isActive ? 1 : 0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

// Mystical symbols floating around
function MysticalSymbols({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!groupRef.current || !isActive) return
    
    groupRef.current.rotation.y += 0.002
    groupRef.current.children.forEach((child, index) => {
      child.rotation.z += 0.01 * (index % 2 === 0 ? 1 : -1)
      child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.2
    })
  })
  
  if (!isActive) return null
  
  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, index) => {
        const angle = (index / 8) * Math.PI * 2
        const radius = 3 + Math.sin(index * 1.5) * 0.5
        
        return (
          <Float
            key={index}
            speed={1.5}
            rotationIntensity={0.3}
            floatIntensity={0.3}
            position={[
              Math.cos(angle) * radius,
              Math.sin(index * 2) * 0.5,
              Math.sin(angle) * radius,
            ]}
          >
            <group>
              {/* Sacred geometry - rotating rings */}
              <Torus args={[0.3, 0.05, 8, 16]}>
                <meshStandardMaterial
                  color="#D4AF37"
                  metalness={0.9}
                  roughness={0.1}
                  emissive="#D4AF37"
                  emissiveIntensity={0.4}
                />
              </Torus>
              <Torus args={[0.25, 0.03, 6, 12]} rotation={[Math.PI / 4, 0, 0]}>
                <meshStandardMaterial
                  color="#B8860B"
                  metalness={0.8}
                  roughness={0.2}
                  emissive="#B8860B"
                  emissiveIntensity={0.3}
                />
              </Torus>
            </group>
          </Float>
        )
      })}
    </group>
  )
}

// Enhanced chest with more ornate details
function OrnateChest({ isUnlocked, onUnlockComplete }: { isUnlocked: boolean, onUnlockComplete: () => void }) {
  const chestRef = useRef<THREE.Group>(null)
  const lidRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.ShaderMaterial>(null)
  const lockRef = useRef<THREE.Group>(null)
  const { camera, scene } = useThree()
  const [isUnlocking, setIsUnlocking] = useState(false)
  
  // Play sound effects
  useEffect(() => {
    if (isUnlocked && typeof window !== 'undefined') {
      setIsUnlocking(true)
      
      // Optional: Add sound effects here
      // const audio = new Audio('/sounds/chest-unlock.mp3')
      // audio.play()
    }
  }, [isUnlocked])
  
  // Enhanced unlock animation
  useEffect(() => {
    if (isUnlocked && chestRef.current && lidRef.current && lockRef.current) {
      const timeline = gsap.timeline({
        onComplete: () => {
          setTimeout(onUnlockComplete, 500)
        }
      })
      
      // Lock glow and rotation
      timeline.to(lockRef.current.rotation, {
        z: Math.PI * 2,
        duration: 1,
        ease: "power2.inOut"
      })
      .to(lockRef.current.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 0.5,
        ease: "back.out"
      }, 0)
      
      // Chest shake intensifies
      timeline.to(chestRef.current.position, {
        x: "+=0.03",
        duration: 0.03,
        repeat: 20,
        yoyo: true,
        ease: "power2.inOut"
      }, 0)
      
      // Glow explosion
      if (glowRef.current) {
        timeline.to(glowRef.current.uniforms.glowIntensity, {
          value: 5,
          duration: 1.5,
          ease: "power2.in"
        }, 0)
      }
      
      // Lid opens dramatically
      timeline.to(lidRef.current.rotation, {
        x: -Math.PI / 2.2,
        duration: 2.5,
        ease: "power3.out"
      }, "+=0.5")
      
      // Camera movement - zoom and rise
      timeline.to(camera.position, {
        z: 2,
        y: 1,
        duration: 2.5,
        ease: "power2.inOut"
      }, "-=2")
      
      // Final push through the chest
      timeline.to(camera.position, {
        z: -10,
        y: 0,
        duration: 2,
        ease: "power4.in"
      }, "+=0.5")
      
      // Fade to black effect
      timeline.to(scene.fog, {
        near: 0.1,
        far: 2,
        duration: 1.5,
        ease: "power2.in"
      }, "-=1")
    }
  }, [isUnlocked, camera, scene, onUnlockComplete])
  
  // Animate idle glow
  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.uniforms.time.value = state.clock.elapsedTime
      glowRef.current.uniforms.isUnlocking.value = isUnlocking
      
      if (!isUnlocked) {
        // Breathing effect when locked
        glowRef.current.uniforms.glowIntensity.value = 
          1.0 + Math.sin(state.clock.elapsedTime * 2) * 0.3
      }
    }
    
    // Subtle floating animation
    if (chestRef.current && !isUnlocked) {
      chestRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })
  
  return (
    <group ref={chestRef}>
      {/* Chest Base with carved details */}
      <Box args={[2, 1, 1.5]} position={[0, -0.5, 0]}>
        <meshStandardMaterial
          color="#0D0907"
          metalness={0.6}
          roughness={0.4}
          envMapIntensity={0.8}
        />
      </Box>
      
      {/* Base ornamental trim */}
      <Box args={[2.1, 0.05, 1.6]} position={[0, -1.01, 0]}>
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.95}
          roughness={0.05}
        />
      </Box>
      
      {/* Chest Lid */}
      <group ref={lidRef} position={[0, 0, 0.75]}>
        <Box args={[2, 0.3, 1.5]} position={[0, 0.15, -0.75]}>
          <meshStandardMaterial
            color="#0D0907"
            metalness={0.6}
            roughness={0.4}
            envMapIntensity={0.8}
          />
        </Box>
        
        {/* Lid ornamental layer */}
        <Box args={[1.9, 0.02, 1.4]} position={[0, 0.31, -0.75]}>
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.95}
            roughness={0.05}
            emissive="#D4AF37"
            emissiveIntensity={0.15}
          />
        </Box>
      </group>
      
      {/* Corner reinforcements */}
      {[[-0.95, -0.5, 0.7], [0.95, -0.5, 0.7], [-0.95, -0.5, -0.7], [0.95, -0.5, -0.7]].map((pos, i) => (
        <Cylinder key={i} args={[0.08, 0.08, 1, 8]} position={pos as [number, number, number]}>
          <meshStandardMaterial
            color="#8B4513"
            metalness={0.8}
            roughness={0.2}
          />
        </Cylinder>
      ))}
      
      {/* Lock mechanism group */}
      <group ref={lockRef} position={[0, 0, 0.76]}>
        {/* Main lock */}
        <Sphere args={[0.15]}>
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.95}
            roughness={0.05}
            emissive="#D4AF37"
            emissiveIntensity={isUnlocked ? 0.8 : 0.2}
          />
        </Sphere>
        
        {/* Lock details - keyhole */}
        <Box args={[0.03, 0.08, 0.05]} position={[0, -0.02, 0.1]}>
          <meshStandardMaterial color="#1A1A1A" />
        </Box>
        <Cylinder args={[0.02, 0.02, 0.05, 16]} position={[0, 0.03, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#1A1A1A" />
        </Cylinder>
        
        {/* Lock plate */}
        <Box args={[0.3, 0.25, 0.02]} position={[0, 0, -0.1]}>
          <meshStandardMaterial
            color="#B8860B"
            metalness={0.9}
            roughness={0.1}
          />
        </Box>
      </group>
      
      {/* Decorative handles */}
      <Torus args={[0.12, 0.02, 8, 16]} position={[-0.8, 0, 0.76]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </Torus>
      <Torus args={[0.12, 0.02, 8, 16]} position={[0.8, 0, 0.76]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </Torus>
      
      {/* Magical glow effect */}
      <Box args={[2.5, 1.8, 2]} position={[0, -0.2, 0]}>
        <shaderMaterial
          ref={glowRef}
          vertexShader={enhancedGlowVertexShader}
          fragmentShader={enhancedGlowFragmentShader}
          uniforms={{
            glowColor: { value: new THREE.Color('#D4AF37') },
            glowIntensity: { value: 1.0 },
            time: { value: 0 },
            isUnlocking: { value: false }
          }}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </Box>
      
      {/* Inner light that becomes visible when opened */}
      {isUnlocked && (
        <pointLight
          position={[0, 0, 0]}
          intensity={2}
          color="#FFD700"
          distance={5}
        />
      )}
    </group>
  )
}

// Main enhanced scene
export default function EnhancedChestScene({ isUnlocked, onUnlockComplete, playSound = true }: ChestSceneProps) {
  return (
    <>
      {/* Atmospheric lighting */}
      <ambientLight intensity={0.05} />
      
      {/* Key light */}
      <spotLight
        position={[0, 5, 5]}
        intensity={1.5}
        color="#D4AF37"
        angle={0.4}
        penumbra={0.6}
        castShadow
      />
      
      {/* Rim lights */}
      <pointLight position={[-5, 3, -3]} intensity={0.4} color="#8B4513" />
      <pointLight position={[5, 3, -3]} intensity={0.4} color="#8B4513" />
      
      {/* Fill light */}
      <pointLight position={[0, -2, 4]} intensity={0.3} color="#4A3C28" />
      
      {/* Mysterious fog */}
      <fog attach="fog" args={["#0A0A0A", 2, 15]} />
      
      {/* The ornate chest */}
      <OrnateChest isUnlocked={isUnlocked} onUnlockComplete={onUnlockComplete} />
      
      {/* Multi-layer particle system */}
      <MultiLayerParticleSystem isActive={isUnlocked} />
      
      {/* Mystical floating symbols */}
      <MysticalSymbols isActive={isUnlocked} />
    </>
  )
}
