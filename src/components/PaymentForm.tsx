import React, { useState, useEffect, useRef } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCardIcon } from '@heroicons/react/24/outline'

interface PaymentFormProps {
  amount: number
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [cardError, setCardError] = useState<string | null>(null)
  const isMountedRef = useRef(true)
  const paymentInProgressRef = useRef(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      paymentInProgressRef.current = false
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    // Prevent multiple payment attempts
    if (paymentInProgressRef.current || isProcessing) {
      console.log('Payment already in progress, ignoring duplicate submission')
      return
    }

    console.log('Payment form submitted!')
    console.log('Stripe object:', stripe)
    console.log('Elements object:', elements)

    if (!stripe || !elements) {
      console.error('Stripe not loaded or elements not available')
      console.log('Stripe loaded:', !!stripe)
      console.log('Elements loaded:', !!elements)
      return
    }

    console.log('Starting payment process with amount:', amount)
    paymentInProgressRef.current = true
    setIsProcessing(true)
    setCardError(null)

    const cardElement = elements.getElement(CardElement)
    console.log('Card element:', cardElement)

    if (!cardElement) {
      console.error('Card element not found')
      onError('Card element not found')
      setIsProcessing(false)
      paymentInProgressRef.current = false
      return
    }

    try {
      // Create payment intent
      console.log('Creating payment intent with amount:', Math.round(amount * 100))
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
        }),
      })

      console.log('API Response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response data:', data)
      const { clientSecret, error: apiError } = data

      if (apiError) {
        throw new Error(apiError)
      }

      if (!clientSecret) {
        throw new Error('No client secret received from server')
      }

      // Confirm payment with Stripe
      console.log('Confirming payment with Stripe...')
      
      // Add timeout to prevent hanging
      const confirmationPromise = stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Payment confirmation timeout')), 30000) // 30 second timeout
      })
      
      const { error, paymentIntent } = await Promise.race([confirmationPromise, timeoutPromise]) as any

      console.log('Stripe confirmation result:', { error, paymentIntent })

      if (error) {
        console.error('Payment failed:', error)
        setCardError(error.message || 'Payment failed')
        onError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent)
        onSuccess(paymentIntent)
      } else {
        console.error('Unexpected payment result:', { error, paymentIntent })
        onError('Unexpected payment result')
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      const errorMessage = err.message || 'An unexpected error occurred'
      setCardError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsProcessing(false)
      paymentInProgressRef.current = false
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#FAFAF8',
        fontFamily: 'Helvetica Neue, sans-serif',
        '::placeholder': {
          color: '#FAFAF8',
          opacity: 0.5,
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
  }

  // Show loading state if Stripe isn't ready
  if (!stripe || !elements) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-houma-smoke/30 border border-houma-gold/20 rounded">
          <div className="flex items-center gap-3 mb-2">
            <CreditCardIcon className="w-5 h-5 text-houma-gold" />
            <span className="text-sm text-houma-white">Credit / Debit Card</span>
          </div>
          <p className="text-xs text-houma-white/50">
            Loading secure payment form...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-houma-gold"></div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-houma-smoke/30 border border-houma-gold/20 rounded">
        <div className="flex items-center gap-3 mb-2">
          <CreditCardIcon className="w-5 h-5 text-houma-gold" />
          <span className="text-sm text-houma-white">Credit / Debit Card</span>
        </div>
        <p className="text-xs text-houma-white/50">
          All transactions are secure and encrypted
        </p>
      </div>

      <div>
        <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
          CARD INFORMATION *
        </label>
        <div className="p-4 bg-transparent border border-houma-white/20 rounded focus-within:border-houma-gold transition-colors">
          <CardElement options={cardElementOptions} />
        </div>
        {cardError && (
          <p className="text-red-400 text-sm mt-2">{cardError}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-houma-gold text-houma-black px-8 py-4 uppercase tracking-widest 
                 hover:bg-houma-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing Payment...' : 'Pay'}
      </button>
    </form>
  )
}

export default PaymentForm
