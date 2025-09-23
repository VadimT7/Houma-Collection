import React, { useState } from 'react'
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setCardError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      onError('Card element not found')
      setIsProcessing(false)
      return
    }

    try {
      // Create payment intent
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

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (error) {
        setCardError(error.message || 'Payment failed')
        onError(error.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent)
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred'
      setCardError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsProcessing(false)
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
        {isProcessing ? 'Processing Payment...' : `Pay ${amount.toFixed(2)}`}
      </button>
    </form>
  )
}

export default PaymentForm
