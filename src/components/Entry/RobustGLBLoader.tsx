import React, { useState, useEffect, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

interface RobustGLBLoaderProps {
  url: string
  onLoad: (gltf: any) => void
  onError: (error: Error) => void
  timeout?: number
}

export function useRobustGLBLoader(url: string, timeout: number = 10000) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [gltf, setGltf] = useState<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setLoading(true)
    setError(null)
    setGltf(null)

    // Set timeout
    timeoutRef.current = setTimeout(() => {
      setError(new Error('GLB loading timeout'))
      setLoading(false)
    }, timeout)

    // Try to load the GLB
    const loader = new GLTFLoader()
    loader.load(
      url,
      (loadedGltf) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        setGltf(loadedGltf)
        setLoading(false)
      },
      (progress) => {
        console.log('GLB loading progress:', (progress.loaded / progress.total) * 100 + '%')
      },
      (err) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        console.error('GLB loading error:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [url, timeout])

  return { loading, error, gltf }
}

// Alternative approach using useLoader with error boundary
export function GLBWithErrorBoundary({ url, children }: { url: string, children: (gltf: any) => React.ReactNode }) {
  const [hasError, setHasError] = useState(false)
  
  try {
    const gltf = useLoader(GLTFLoader, url)
    return <>{children(gltf)}</>
  } catch (error) {
    console.error('GLB loading failed:', error)
    if (!hasError) {
      setHasError(true)
    }
    return null
  }
}
