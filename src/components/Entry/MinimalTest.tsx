import React from 'react'

// Minimal test component to see if basic 3D works
export default function MinimalTest() {
  return (
    <div className="w-full h-full bg-houma-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-houma-gold text-2xl mb-4">Minimal Test</div>
        <div className="text-houma-white text-sm">If you see this, the component is loading</div>
        <div className="w-8 h-8 border-2 border-houma-gold border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
      </div>
    </div>
  )
}
