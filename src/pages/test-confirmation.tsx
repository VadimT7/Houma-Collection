import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const TestConfirmation = () => {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-houma-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl text-houma-white mb-8">Test Order Confirmation</h1>
        <p className="text-houma-white/70 mb-8">This is a test page to verify the order confirmation works.</p>
        <Link href="/order-confirmation?payment_intent=pi_test_1234567890">
          <button className="bg-houma-gold text-houma-black px-8 py-4 rounded">
            Test Order Confirmation Page
          </button>
        </Link>
      </div>
    </div>
  )
}

export default TestConfirmation
