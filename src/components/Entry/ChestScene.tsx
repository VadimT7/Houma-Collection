import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box, Sphere, Float } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface ChestSceneProps {
  isUnlocked: boolean
  onUnlockComplete: () => void
}

// Custom shader for glowing effect
const glowVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const glowFragmentShader = `
  uniform vec3 glowColor;
  uniform float glowIntensity;
  uniform float time;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    vec3 glow = glowColor * intensity * glowIntensity;
    
    // Pulsing effect
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    glow *= (0.5 + pulse * 0.5);
    
    // Add golden shimmer
    float shimmer = sin(vPosition.x * 10.0 + time * 3.0) * sin(vPosition.y * 10.0 - time * 2.0) * 0.5 + 0.5;
    glow += vec3(0.8, 0.6, 0.2) * shimmer * 0.3;
    
    gl_FragColor = vec4(glow, intensity);
  }
`

// Particle system for the burst effect
function ParticleSystem({ isActive }: { isActive: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 2000
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Initial position at chest center
      positions[i3] = 0
      positions[i3 + 1] = 0
      positions[i3 + 2] = 0
      
      // Golden/sand colors
      const isGold = Math.random() > 0.5
      if (isGold) {
        colors[i3] = 0.831 // Gold
        colors[i3 + 1] = 0.686
        colors[i3 + 2] = 0.216
      } else {
        colors[i3] = 0.96 // Sand
        colors[i3 + 1] = 0.87
        colors[i3 + 2] = 0.70
      }
      
      sizes[i] = Math.random() * 0.05 + 0.01
      
      // Random burst velocities
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 0.3 + 0.1
      const lift = Math.random() * 0.2
      
      velocities[i3] = Math.cos(angle) * speed
      velocities[i3 + 1] = lift
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
      
      if (isActive) {
        // Update positions with velocities
        positions[i3] += velocities[i3] * delta
        positions[i3 + 1] += velocities[i3 + 1] * delta
        positions[i3 + 2] += velocities[i3 + 2] * delta
        
        // Add gravity
        velocities[i3 + 1] -= delta * 0.1
        
        // Slow down over time
        velocities[i3] *= 0.99
        velocities[i3 + 2] *= 0.99
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
      />
    </points>
  )
}

// Arabic calligraphy floating elements
function FloatingCalligraphy({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  
  const symbols = ['حُومة', 'قوة', 'تراث', 'فخر']
  
  useFrame((state) => {
    if (!groupRef.current || !isActive) return
    
    groupRef.current.rotation.y += 0.001
    groupRef.current.children.forEach((child, index) => {
      child.position.y += Math.sin(state.clock.elapsedTime + index) * 0.001
    })
  })
  
  if (!isActive) return null
  
  return (
    <group ref={groupRef}>
      {symbols.map((symbol, index) => {
        const angle = (index / symbols.length) * Math.PI * 2
        return (
          <Float
            key={index}
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
            position={[
              Math.cos(angle) * 3,
              Math.random() * 2 - 1,
              Math.sin(angle) * 3,
            ]}
          >
            <group>
              {/* Create a glowing plane with symbol texture */}
              <mesh>
                <planeGeometry args={[1, 0.5]} />
                <meshStandardMaterial
                  color="#D4AF37"
                  metalness={0.8}
                  roughness={0.2}
                  emissive="#D4AF37"
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Glow effect behind the symbol */}
              <mesh position={[0, 0, -0.1]}>
                <planeGeometry args={[1.5, 0.75]} />
                <meshBasicMaterial
                  color="#D4AF37"
                  transparent
                  opacity={0.2}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          </Float>
        )
      })}
    </group>
  )
}

// The main chest component
function Chest({ isUnlocked, onUnlockComplete }: { isUnlocked: boolean, onUnlockComplete: () => void }) {
  const chestRef = useRef<THREE.Group>(null)
  const lidRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.ShaderMaterial>(null)
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
      
      // Glow intensify
      if (glowRef.current) {
        timeline.to(glowRef.current.uniforms.glowIntensity, {
          value: 3,
          duration: 1,
          ease: "power2.in"
        }, "-=0.5")
      }
      
      // Lid open with dramatic pause
      timeline.to(lidRef.current.rotation, {
        x: -Math.PI / 2.5,
        duration: 2,
        ease: "power2.out"
      }, "+=0.5")
      
      // Camera zoom into chest
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
  
  // Animate glow shader
  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.uniforms.time.value = state.clock.elapsedTime
      
      if (!isUnlocked) {
        // Subtle pulsing when locked
        glowRef.current.uniforms.glowIntensity.value = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      }
    }
  })
  
  return (
    <group ref={chestRef}>
      {/* Chest Base */}
      <Box args={[2, 1, 1.5]} position={[0, -0.5, 0]}>
        <meshStandardMaterial
          color="#1a0f0a"
          metalness={0.7}
          roughness={0.3}
          envMapIntensity={0.5}
        />
      </Box>
      
      {/* Chest Lid */}
      <Box ref={lidRef} args={[2, 0.3, 1.5]} position={[0, 0.15, 0]}>
        <meshStandardMaterial
          color="#1a0f0a"
          metalness={0.7}
          roughness={0.3}
          envMapIntensity={0.5}
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
      
      {/* Glow Effect */}
      <Box args={[2.5, 1.8, 2]} position={[0, -0.2, 0]}>
        <shaderMaterial
          ref={glowRef}
          vertexShader={glowVertexShader}
          fragmentShader={glowFragmentShader}
          uniforms={{
            glowColor: { value: new THREE.Color('#D4AF37') },
            glowIntensity: { value: 0.8 },
            time: { value: 0 }
          }}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </Box>
    </group>
  )
}

export default function ChestScene({ isUnlocked, onUnlockComplete }: ChestSceneProps) {
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
      <Chest isUnlocked={isUnlocked} onUnlockComplete={onUnlockComplete} />
      
      {/* Particle Burst */}
      <ParticleSystem isActive={isUnlocked} />
      
      {/* Floating Calligraphy */}
      <FloatingCalligraphy isActive={isUnlocked} />
    </>
  )
}
