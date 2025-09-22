import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface ChestSceneProps {
  isUnlocked: boolean
  onUnlockComplete: () => void
}

// Simple 3D chest that will definitely render
function Simple3DChest({ isUnlocked, onUnlockComplete }: { isUnlocked: boolean, onUnlockComplete: () => void }) {
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

// Main Scene
export default function Simple3DScene({ isUnlocked, onUnlockComplete }: ChestSceneProps) {
  return (
    <>
      {/* Basic lighting */}
      <ambientLight intensity={0.3} />
      <spotLight
        position={[0, 5, 3]}
        intensity={1.5}
        color="#D4AF37"
        angle={0.6}
        penumbra={0.8}
      />
      <pointLight position={[-3, 2, -2]} intensity={0.4} color="#8B4513" />
      <pointLight position={[3, 2, -2]} intensity={0.4} color="#8B4513" />
      
      {/* Simple chest */}
      <Simple3DChest 
        isUnlocked={isUnlocked} 
        onUnlockComplete={onUnlockComplete} 
      />
    </>
  )
}
