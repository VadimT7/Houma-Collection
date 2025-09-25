import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [showHomepage, setShowHomepage] = useState(false)

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true)
    
    // Only show entry on homepage
    const isHomepage = window.location.pathname === '/'
    if (isHomepage && !sessionStorage.getItem('houma-entry-shown')) {
      setShowEntry(true)
    } else {
      setEntryComplete(true)
      // If entry was already shown, immediately show the homepage content
      setShowHomepage(true)
    }
  }, [])

  const handleEntryComplete = () => {
    sessionStorage.setItem('houma-entry-shown', 'true')
    setEntryComplete(true)
    setShowEntry(false)
    
    // Smooth zoom-in transition to homepage
    setTimeout(() => {
      setShowHomepage(true)
    }, 100)
  }

  return (
    <>
      {isClient && showEntry && <Entry onComplete={handleEntryComplete} />}
      
      <AnimatePresence>
        {entryComplete && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: showHomepage ? 1 : 0.8, 
              opacity: showHomepage ? 1 : 0 
            }}
            transition={{ 
              duration: 2,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </motion.div>
        )}
      </AnimatePresence>
      
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
