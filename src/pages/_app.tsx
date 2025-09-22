import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '@/components/Layout'
import dynamic from 'next/dynamic'

// Dynamically import Entry to avoid SSR issues
const Entry = dynamic(() => import('@/components/Entry'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-houma-black z-[9999] flex items-center justify-center">
      <div className="text-center">
        <div className="text-houma-gold text-sm tracking-widest mb-4">Preparing Experience...</div>
        <div className="w-8 h-8 border-2 border-houma-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
})

export default function App({ Component, pageProps }: AppProps) {
  const [showEntry, setShowEntry] = useState(false)
  const [entryComplete, setEntryComplete] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true)
    
    // Only show entry on homepage
    const isHomepage = window.location.pathname === '/'
    if (isHomepage && !sessionStorage.getItem('houma-entry-shown')) {
      setShowEntry(true)
    } else {
      setEntryComplete(true)
    }
  }, [])

  const handleEntryComplete = () => {
    sessionStorage.setItem('houma-entry-shown', 'true')
    setEntryComplete(true)
    setShowEntry(false)
  }

  return (
    <>
      {isClient && showEntry && <Entry onComplete={handleEntryComplete} />}
      
      {entryComplete && (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#0A0A0A',
            color: '#FAFAF8',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#0A0A0A',
            },
          },
        }}
      />
    </>
  )
}
