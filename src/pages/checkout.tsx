import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import toast from 'react-hot-toast'
import { 
  ShieldCheckIcon, 
  LockClosedIcon,
  ChevronLeftIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import { useCart } from '@/lib/store'
import { formatPrice, getImagePath } from '@/lib/utils'

// Initialize Stripe (you'll need to add your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY')

const CheckoutPage = () => {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping')
  
  const [shippingInfo, setShippingInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
  })

  const [billingInfo, setBillingInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    sameAsShipping: true,
  })

  const subtotal = getTotalPrice()
  const shipping = subtotal > 200 ? 0 : 15
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (items.length === 0) {
      router.push('/shop')
    }
  }, [items, router])

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setBillingInfo({
      ...billingInfo,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 'shipping') {
      setStep('payment')
      return
    }
    
    if (step === 'payment') {
      setStep('review')
      return
    }

    // Process payment
    setIsProcessing(true)
    
    try {
      // Here you would normally process the payment with Stripe
      // This is a simplified example
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Order placed successfully!')
      clearCart()
      router.push('/order-confirmation')
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {['Shipping', 'Payment', 'Review'].map((label, index) => {
        const stepNumber = index + 1
        const isActive = 
          (step === 'shipping' && index === 0) ||
          (step === 'payment' && index === 1) ||
          (step === 'review' && index === 2)
        const isCompleted = 
          (step === 'payment' && index === 0) ||
          (step === 'review' && index <= 1)

        return (
          <React.Fragment key={label}>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'bg-houma-gold text-houma-black' :
                  isCompleted ? 'bg-houma-gold/20 text-houma-gold' :
                  'bg-houma-white/10 text-houma-white/50'
                }`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span className={`ml-3 text-sm ${
                isActive ? 'text-houma-white' : 'text-houma-white/50'
              }`}>
                {label}
              </span>
            </div>
            {index < 2 && (
              <div className={`w-20 h-px mx-4 transition-all duration-300 ${
                isCompleted ? 'bg-houma-gold' : 'bg-houma-white/20'
              }`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )

  if (items.length === 0) {
    return null
  }

  return (
    <>
      <Head>
        <title>Checkout - HOUMA</title>
        <meta name="description" content="Complete your HOUMA purchase securely" />
      </Head>

      <section className="pt-32 pb-20 min-h-screen">
        <div className="houma-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-display tracking-wider text-houma-white mb-4">
                CHECKOUT
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-houma-white/50">
                <LockClosedIcon className="w-4 h-4" />
                <span>Secure Checkout</span>
                <span>•</span>
                <ShieldCheckIcon className="w-4 h-4" />
                <span>SSL Encrypted</span>
              </div>
            </div>

            {renderStepIndicator()}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit}>
                  {/* Shipping Information */}
                  {step === 'shipping' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-xl font-display tracking-wider text-houma-white mb-6">
                        SHIPPING INFORMATION
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                            EMAIL ADDRESS *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={shippingInfo.email}
                            onChange={handleShippingChange}
                            required
                            className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                     px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                              FIRST NAME *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={shippingInfo.firstName}
                              onChange={handleShippingChange}
                              required
                              className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                       px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                              LAST NAME *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={shippingInfo.lastName}
                              onChange={handleShippingChange}
                              required
                              className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                       px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                            ADDRESS *
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={shippingInfo.address}
                            onChange={handleShippingChange}
                            required
                            className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                     px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                            APARTMENT, SUITE, ETC.
                          </label>
                          <input
                            type="text"
                            name="apartment"
                            value={shippingInfo.apartment}
                            onChange={handleShippingChange}
                            className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                     px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                              CITY *
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={shippingInfo.city}
                              onChange={handleShippingChange}
                              required
                              className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                       px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                              POSTAL CODE *
                            </label>
                            <input
                              type="text"
                              name="postalCode"
                              value={shippingInfo.postalCode}
                              onChange={handleShippingChange}
                              required
                              className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                       px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                              COUNTRY *
                            </label>
                            <select
                              name="country"
                              value={shippingInfo.country}
                              onChange={handleShippingChange}
                              required
                              className="w-full bg-houma-black border border-houma-white/20 text-houma-white 
                                       px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                            >
                              <option value="">Select Country</option>
                              <option value="US">United States</option>
                              <option value="TN">Tunisia</option>
                              <option value="FR">France</option>
                              <option value="MA">Morocco</option>
                              <option value="DZ">Algeria</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                              PHONE NUMBER *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={shippingInfo.phone}
                              onChange={handleShippingChange}
                              required
                              className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                       px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Payment Information */}
                  {step === 'payment' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-xl font-display tracking-wider text-houma-white mb-6">
                        PAYMENT INFORMATION
                      </h2>

                      <div className="space-y-6">
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
                            CARD NUMBER *
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={billingInfo.cardNumber}
                            onChange={handleBillingChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                     px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                            CARDHOLDER NAME *
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={billingInfo.cardName}
                            onChange={handleBillingChange}
                            required
                            className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                     px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                              EXPIRY DATE *
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={billingInfo.expiryDate}
                              onChange={handleBillingChange}
                              placeholder="MM/YY"
                              required
                              className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                       px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={billingInfo.cvv}
                              onChange={handleBillingChange}
                              placeholder="123"
                              required
                              className="w-full bg-transparent border border-houma-white/20 text-houma-white 
                                       px-4 py-3 focus:outline-none focus:border-houma-gold transition-colors"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="sameAsShipping"
                            checked={billingInfo.sameAsShipping}
                            onChange={handleBillingChange}
                            className="w-4 h-4 bg-transparent border-houma-white/20 text-houma-gold 
                                     focus:ring-houma-gold"
                          />
                          <label className="text-sm text-houma-white/70">
                            Billing address same as shipping
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Order Review */}
                  {step === 'review' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-xl font-display tracking-wider text-houma-white mb-6">
                        REVIEW YOUR ORDER
                      </h2>

                      <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="p-4 border border-houma-white/10">
                          <h3 className="text-sm text-houma-gold tracking-[0.2em] mb-3">
                            SHIPPING ADDRESS
                          </h3>
                          <p className="text-sm text-houma-white/70">
                            {shippingInfo.firstName} {shippingInfo.lastName}<br />
                            {shippingInfo.address}<br />
                            {shippingInfo.apartment && `${shippingInfo.apartment}, `}
                            {shippingInfo.city}, {shippingInfo.postalCode}<br />
                            {shippingInfo.country}
                          </p>
                        </div>

                        {/* Payment Method */}
                        <div className="p-4 border border-houma-white/10">
                          <h3 className="text-sm text-houma-gold tracking-[0.2em] mb-3">
                            PAYMENT METHOD
                          </h3>
                          <p className="text-sm text-houma-white/70">
                            Card ending in {billingInfo.cardNumber.slice(-4)}<br />
                            {billingInfo.cardName}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    {step !== 'shipping' && (
                      <button
                        type="button"
                        onClick={() => setStep(step === 'payment' ? 'shipping' : 'payment')}
                        className="flex items-center gap-2 text-houma-white/70 hover:text-houma-gold 
                                 transition-colors"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Back
                      </button>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="ml-auto bg-houma-gold text-houma-black px-8 py-4 uppercase tracking-widest 
                               hover:bg-houma-gold-light transition-all duration-300 disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 
                       step === 'review' ? 'Place Order' : 'Continue'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-32">
                  <h2 className="text-xl font-display tracking-wider text-houma-white mb-6">
                    ORDER SUMMARY
                  </h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                        className="flex gap-4"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-houma-smoke">
                          <Image
                            src={getImagePath(item.product.images[0])}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm text-houma-white">{item.product.name}</h3>
                          <p className="text-xs text-houma-white/50">
                            {item.selectedColor} / {item.selectedSize} / Qty: {item.quantity}
                          </p>
                          <p className="text-sm text-houma-gold mt-1">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 py-6 border-t border-houma-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-houma-white/70">Subtotal</span>
                      <span className="text-houma-white">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-houma-white/70">Shipping</span>
                      <span className="text-houma-white">
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-houma-white/70">Tax</span>
                      <span className="text-houma-white">{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between py-4 border-t border-houma-white/10">
                    <span className="text-lg text-houma-white">Total</span>
                    <span className="text-lg text-houma-gold">{formatPrice(total)}</span>
                  </div>

                  {/* Security Badges */}
                  <div className="mt-6 p-4 bg-houma-smoke/30 rounded">
                    <div className="flex items-center gap-2 text-xs text-houma-white/50">
                      <ShieldCheckIcon className="w-4 h-4" />
                      <span>100% Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-houma-white/50 mt-2">
                      <LockClosedIcon className="w-4 h-4" />
                      <span>SSL Encrypted Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default CheckoutPage
