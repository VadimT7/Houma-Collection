import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import toast from 'react-hot-toast'
import { 
  ShieldCheckIcon, 
  LockClosedIcon,
  ChevronLeftIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import { useCart } from '@/lib/store'
import { formatPrice, getImagePath } from '@/lib/utils'
import PaymentForm from '@/components/PaymentForm'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Debug: Log Stripe key
if (typeof window !== 'undefined') {
  console.log('Stripe publishable key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  console.log('Stripe promise:', stripePromise)
}

const CheckoutForm = () => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping')
  
  // Always call the hook, but handle hydration safely
  const { items, getTotalPrice, clearCart } = useCart()
  
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

  const subtotal = isClient ? getTotalPrice() : 0
  const shipping = subtotal > 200 ? 0 : 15
  const tax = subtotal * 0.14975 // 14.975% tax (calculated on subtotal, excluding shipping)
  const total = subtotal + shipping + tax

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only redirect if cart is empty and we're not processing payment or payment succeeded
    // Also don't redirect if we're in the middle of a payment flow or redirecting
    if (isClient && items.length === 0 && !isProcessing && !isPaymentSuccess && !isRedirecting && step === 'shipping') {
      console.log('Cart is empty, redirecting to shop')
      router.push('/shop')
    }
  }, [isClient, items.length, router, isProcessing, isPaymentSuccess, isRedirecting, step])

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
    
    // For payment step, we don't handle the form submission here
    // The PaymentForm component handles its own submission
    if (step === 'payment') {
      return
    }
  }

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      console.log('Payment success handler called with:', paymentIntent)
      setIsPaymentSuccess(true) // Prevent cart redirect
      setIsProcessing(false) // Stop processing state
      setIsRedirecting(true) // Prevent cart empty check from triggering
      
      // Generate order number
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let orderNumber = 'HOUMA-'
      for (let i = 0; i < 8; i++) {
        orderNumber += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      
      // Prepare order details for API
      const orderItems = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.selectedSize,
        color: item.selectedColor,
        image: item.product.images[0] || '',
      }))

      // Create order and deduct stock
      try {
        console.log('Creating order and deducting stock...')
        const orderResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderNumber,
            paymentIntentId: paymentIntent.id,
            items: orderItems,
            subtotal,
            shipping,
            tax,
            total,
            shippingAddress: {
              firstName: shippingInfo.firstName,
              lastName: shippingInfo.lastName,
              email: shippingInfo.email,
              phone: shippingInfo.phone,
              address: shippingInfo.address,
              apartment: shippingInfo.apartment,
              city: shippingInfo.city,
              postalCode: shippingInfo.postalCode,
              country: shippingInfo.country,
            }
          }),
        })
        
        const orderResult = await orderResponse.json()
        if (orderResponse.ok) {
          console.log('Order created successfully:', orderResult)
        } else {
          console.error('Failed to create order:', orderResult)
        }
      } catch (orderError) {
        console.error('Error creating order:', orderError)
      }
      
      // Send order confirmation email
      try {
        console.log('Sending order confirmation email...')
        const emailResponse = await fetch('/api/send-order-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: shippingInfo.email,
            orderDetails: {
              orderNumber,
              paymentIntentId: paymentIntent.id,
              items: orderItems,
              subtotal,
              shipping,
              tax,
              total,
              shippingAddress: {
                firstName: shippingInfo.firstName,
                lastName: shippingInfo.lastName,
                email: shippingInfo.email,
                address: shippingInfo.address,
                apartment: shippingInfo.apartment,
                city: shippingInfo.city,
                postalCode: shippingInfo.postalCode,
                country: shippingInfo.country,
                phone: shippingInfo.phone,
              },
            },
          }),
        })
        
        const emailResult = await emailResponse.json()
        console.log('Email result:', emailResult)
        
        if (emailResult.success) {
          toast.success('Payment successful! Confirmation email sent.')
        } else {
          console.error('Email sending failed:', emailResult.error)
      toast.success('Payment successful! Order placed.')
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        toast.success('Payment successful! Order placed.')
      }
      
      // Clear cart first to prevent any state conflicts
      clearCart()
      
      // Redirect immediately to order confirmation with email status
      const redirectUrl = `/order-confirmation?payment_intent=${paymentIntent.id}&order=${orderNumber}&email=${encodeURIComponent(shippingInfo.email)}&email_sent=true`
      console.log('Redirecting to:', redirectUrl)
      
      // Use window.location for a clean redirect
      window.location.href = redirectUrl
    } catch (error) {
      console.error('Error in payment success handler:', error)
      toast.error('Order processing failed. Please contact support.')
      setIsProcessing(false)
      setIsRedirecting(false)
    }
  }

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`)
  }

  // Test function to bypass payment and test redirect
  const handleTestPayment = () => {
    console.log('Testing payment redirect...')
    const mockPaymentIntent = {
      id: 'pi_test_1234567890',
      status: 'succeeded'
    }
    handlePaymentSuccess(mockPaymentIntent)
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
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
            <div className="flex items-center flex-shrink-0">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 text-xs sm:text-base ${
                  isActive ? 'bg-houma-gold text-houma-black' :
                  isCompleted ? 'bg-houma-gold/20 text-houma-gold' :
                  'bg-houma-white/10 text-houma-white/50'
                }`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span className={`ml-2 sm:ml-3 text-xs sm:text-sm ${
                isActive ? 'text-houma-white' : 'text-houma-white/50'
              }`}>
                <span className="hidden sm:inline">{label}</span>
              </span>
            </div>
            {index < 2 && (
              <div className={`w-12 sm:w-16 md:w-20 h-px mx-2 sm:mx-3 md:mx-4 transition-all duration-300 flex-shrink-0 ${
                isCompleted ? 'bg-houma-gold' : 'bg-houma-white/20'
              }`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )

  // Show loading state while hydrating
  if (!isClient) {
    return (
      <div className="min-h-screen bg-houma-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-houma-gold mx-auto mb-4"></div>
          <h2 className="text-2xl text-houma-white">Loading...</h2>
        </div>
      </div>
    )
  }

  if (items.length === 0 && !isProcessing && !isRedirecting) {
    return (
      <div className="min-h-screen bg-houma-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-houma-white mb-4">Your cart is empty</h2>
          <Link href="/shop">
            <button className="bg-houma-gold text-houma-black px-8 py-4 rounded uppercase tracking-wider">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Checkout - HOUMA</title>
        <meta name="description" content="Complete your HOUMA purchase securely" />
      </Head>

      <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 min-h-screen">
        <div className="houma-container px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display tracking-wider text-houma-white mb-3 sm:mb-4">
                CHECKOUT
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-houma-white/50">
                <LockClosedIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Secure Checkout</span>
                <span>•</span>
                <ShieldCheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>SSL Encrypted</span>
              </div>
            </div>

            {renderStepIndicator()}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
              {/* Form Section */}
              <div className="lg:col-span-2">
                {/* Shipping Information */}
                {step === 'shipping' && (
                  <form onSubmit={handleSubmit}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-lg sm:text-xl font-display tracking-wider text-houma-white mb-4 sm:mb-6">
                        SHIPPING INFORMATION
                      </h2>

                      <div className="space-y-4 sm:space-y-6">
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
                                     px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-houma-gold transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                       px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-houma-gold transition-colors"
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
                                       px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-houma-gold transition-colors"
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
                                     px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-houma-gold transition-colors"
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
                                     px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-houma-gold transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
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
                                       px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-houma-gold transition-colors"
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
                                       px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-houma-gold transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                       px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-houma-gold transition-colors"
                            >
                              <option value="">Select Country</option>
                              <option value="AF">Afghanistan</option>
                              <option value="AL">Albania</option>
                              <option value="DZ">Algeria</option>
                              <option value="AS">American Samoa</option>
                              <option value="AD">Andorra</option>
                              <option value="AO">Angola</option>
                              <option value="AI">Anguilla</option>
                              <option value="AQ">Antarctica</option>
                              <option value="AG">Antigua and Barbuda</option>
                              <option value="AR">Argentina</option>
                              <option value="AM">Armenia</option>
                              <option value="AW">Aruba</option>
                              <option value="AU">Australia</option>
                              <option value="AT">Austria</option>
                              <option value="AZ">Azerbaijan</option>
                              <option value="BS">Bahamas</option>
                              <option value="BH">Bahrain</option>
                              <option value="BD">Bangladesh</option>
                              <option value="BB">Barbados</option>
                              <option value="BY">Belarus</option>
                              <option value="BE">Belgium</option>
                              <option value="BZ">Belize</option>
                              <option value="BJ">Benin</option>
                              <option value="BM">Bermuda</option>
                              <option value="BT">Bhutan</option>
                              <option value="BO">Bolivia</option>
                              <option value="BA">Bosnia and Herzegovina</option>
                              <option value="BW">Botswana</option>
                              <option value="BV">Bouvet Island</option>
                              <option value="BR">Brazil</option>
                              <option value="IO">British Indian Ocean Territory</option>
                              <option value="BN">Brunei Darussalam</option>
                              <option value="BG">Bulgaria</option>
                              <option value="BF">Burkina Faso</option>
                              <option value="BI">Burundi</option>
                              <option value="KH">Cambodia</option>
                              <option value="CM">Cameroon</option>
                              <option value="CA">Canada</option>
                              <option value="CV">Cape Verde</option>
                              <option value="KY">Cayman Islands</option>
                              <option value="CF">Central African Republic</option>
                              <option value="TD">Chad</option>
                              <option value="CL">Chile</option>
                              <option value="CN">China</option>
                              <option value="CX">Christmas Island</option>
                              <option value="CC">Cocos (Keeling) Islands</option>
                              <option value="CO">Colombia</option>
                              <option value="KM">Comoros</option>
                              <option value="CG">Congo</option>
                              <option value="CD">Congo, The Democratic Republic of the</option>
                              <option value="CK">Cook Islands</option>
                              <option value="CR">Costa Rica</option>
                              <option value="CI">Côte d'Ivoire</option>
                              <option value="HR">Croatia</option>
                              <option value="CU">Cuba</option>
                              <option value="CY">Cyprus</option>
                              <option value="CZ">Czech Republic</option>
                              <option value="DK">Denmark</option>
                              <option value="DJ">Djibouti</option>
                              <option value="DM">Dominica</option>
                              <option value="DO">Dominican Republic</option>
                              <option value="EC">Ecuador</option>
                              <option value="EG">Egypt</option>
                              <option value="SV">El Salvador</option>
                              <option value="GQ">Equatorial Guinea</option>
                              <option value="ER">Eritrea</option>
                              <option value="EE">Estonia</option>
                              <option value="ET">Ethiopia</option>
                              <option value="FK">Falkland Islands (Malvinas)</option>
                              <option value="FO">Faroe Islands</option>
                              <option value="FJ">Fiji</option>
                              <option value="FI">Finland</option>
                              <option value="FR">France</option>
                              <option value="GF">French Guiana</option>
                              <option value="PF">French Polynesia</option>
                              <option value="TF">French Southern Territories</option>
                              <option value="GA">Gabon</option>
                              <option value="GM">Gambia</option>
                              <option value="GE">Georgia</option>
                              <option value="DE">Germany</option>
                              <option value="GH">Ghana</option>
                              <option value="GI">Gibraltar</option>
                              <option value="GR">Greece</option>
                              <option value="GL">Greenland</option>
                              <option value="GD">Grenada</option>
                              <option value="GP">Guadeloupe</option>
                              <option value="GU">Guam</option>
                              <option value="GT">Guatemala</option>
                              <option value="GN">Guinea</option>
                              <option value="GW">Guinea-Bissau</option>
                              <option value="GY">Guyana</option>
                              <option value="HT">Haiti</option>
                              <option value="HM">Heard Island and McDonald Islands</option>
                              <option value="VA">Holy See (Vatican City State)</option>
                              <option value="HN">Honduras</option>
                              <option value="HK">Hong Kong</option>
                              <option value="HU">Hungary</option>
                              <option value="IS">Iceland</option>
                              <option value="IN">India</option>
                              <option value="ID">Indonesia</option>
                              <option value="IR">Iran, Islamic Republic of</option>
                              <option value="IQ">Iraq</option>
                              <option value="IE">Ireland</option>
                              <option value="IL">Israel</option>
                              <option value="IT">Italy</option>
                              <option value="JM">Jamaica</option>
                              <option value="JP">Japan</option>
                              <option value="JO">Jordan</option>
                              <option value="KZ">Kazakhstan</option>
                              <option value="KE">Kenya</option>
                              <option value="KI">Kiribati</option>
                              <option value="KP">Korea, Democratic People's Republic of</option>
                              <option value="KR">Korea, Republic of</option>
                              <option value="KW">Kuwait</option>
                              <option value="KG">Kyrgyzstan</option>
                              <option value="LA">Lao People's Democratic Republic</option>
                              <option value="LV">Latvia</option>
                              <option value="LB">Lebanon</option>
                              <option value="LS">Lesotho</option>
                              <option value="LR">Liberia</option>
                              <option value="LY">Libyan Arab Jamahiriya</option>
                              <option value="LI">Liechtenstein</option>
                              <option value="LT">Lithuania</option>
                              <option value="LU">Luxembourg</option>
                              <option value="MO">Macao</option>
                              <option value="MK">Macedonia, The Former Yugoslav Republic of</option>
                              <option value="MG">Madagascar</option>
                              <option value="MW">Malawi</option>
                              <option value="MY">Malaysia</option>
                              <option value="MV">Maldives</option>
                              <option value="ML">Mali</option>
                              <option value="MT">Malta</option>
                              <option value="MH">Marshall Islands</option>
                              <option value="MQ">Martinique</option>
                              <option value="MR">Mauritania</option>
                              <option value="MU">Mauritius</option>
                              <option value="YT">Mayotte</option>
                              <option value="MX">Mexico</option>
                              <option value="FM">Micronesia, Federated States of</option>
                              <option value="MD">Moldova, Republic of</option>
                              <option value="MC">Monaco</option>
                              <option value="MN">Mongolia</option>
                              <option value="ME">Montenegro</option>
                              <option value="MS">Montserrat</option>
                              <option value="MA">Morocco</option>
                              <option value="MZ">Mozambique</option>
                              <option value="MM">Myanmar</option>
                              <option value="NA">Namibia</option>
                              <option value="NR">Nauru</option>
                              <option value="NP">Nepal</option>
                              <option value="NL">Netherlands</option>
                              <option value="AN">Netherlands Antilles</option>
                              <option value="NC">New Caledonia</option>
                              <option value="NZ">New Zealand</option>
                              <option value="NI">Nicaragua</option>
                              <option value="NE">Niger</option>
                              <option value="NG">Nigeria</option>
                              <option value="NU">Niue</option>
                              <option value="NF">Norfolk Island</option>
                              <option value="MP">Northern Mariana Islands</option>
                              <option value="NO">Norway</option>
                              <option value="OM">Oman</option>
                              <option value="PK">Pakistan</option>
                              <option value="PW">Palau</option>
                              <option value="PS">Palestinian Territory, Occupied</option>
                              <option value="PA">Panama</option>
                              <option value="PG">Papua New Guinea</option>
                              <option value="PY">Paraguay</option>
                              <option value="PE">Peru</option>
                              <option value="PH">Philippines</option>
                              <option value="PN">Pitcairn</option>
                              <option value="PL">Poland</option>
                              <option value="PT">Portugal</option>
                              <option value="PR">Puerto Rico</option>
                              <option value="QA">Qatar</option>
                              <option value="RE">Réunion</option>
                              <option value="RO">Romania</option>
                              <option value="RU">Russian Federation</option>
                              <option value="RW">Rwanda</option>
                              <option value="SH">Saint Helena</option>
                              <option value="KN">Saint Kitts and Nevis</option>
                              <option value="LC">Saint Lucia</option>
                              <option value="PM">Saint Pierre and Miquelon</option>
                              <option value="VC">Saint Vincent and the Grenadines</option>
                              <option value="WS">Samoa</option>
                              <option value="SM">San Marino</option>
                              <option value="ST">Sao Tome and Principe</option>
                              <option value="SA">Saudi Arabia</option>
                              <option value="SN">Senegal</option>
                              <option value="RS">Serbia</option>
                              <option value="SC">Seychelles</option>
                              <option value="SL">Sierra Leone</option>
                              <option value="SG">Singapore</option>
                              <option value="SK">Slovakia</option>
                              <option value="SI">Slovenia</option>
                              <option value="SB">Solomon Islands</option>
                              <option value="SO">Somalia</option>
                              <option value="ZA">South Africa</option>
                              <option value="GS">South Georgia and the South Sandwich Islands</option>
                              <option value="ES">Spain</option>
                              <option value="LK">Sri Lanka</option>
                              <option value="SD">Sudan</option>
                              <option value="SR">Suriname</option>
                              <option value="SJ">Svalbard and Jan Mayen</option>
                              <option value="SZ">Swaziland</option>
                              <option value="SE">Sweden</option>
                              <option value="CH">Switzerland</option>
                              <option value="SY">Syrian Arab Republic</option>
                              <option value="TW">Taiwan, Province of China</option>
                              <option value="TJ">Tajikistan</option>
                              <option value="TZ">Tanzania, United Republic of</option>
                              <option value="TH">Thailand</option>
                              <option value="TL">Timor-Leste</option>
                              <option value="TG">Togo</option>
                              <option value="TK">Tokelau</option>
                              <option value="TO">Tonga</option>
                              <option value="TT">Trinidad and Tobago</option>
                              <option value="TN">Tunisia</option>
                              <option value="TR">Turkey</option>
                              <option value="TM">Turkmenistan</option>
                              <option value="TC">Turks and Caicos Islands</option>
                              <option value="TV">Tuvalu</option>
                              <option value="UG">Uganda</option>
                              <option value="UA">Ukraine</option>
                              <option value="AE">United Arab Emirates</option>
                              <option value="GB">United Kingdom</option>
                              <option value="US">United States</option>
                              <option value="UM">United States Minor Outlying Islands</option>
                              <option value="UY">Uruguay</option>
                              <option value="UZ">Uzbekistan</option>
                              <option value="VU">Vanuatu</option>
                              <option value="VE">Venezuela</option>
                              <option value="VN">Viet Nam</option>
                              <option value="VG">Virgin Islands, British</option>
                              <option value="VI">Virgin Islands, U.S.</option>
                              <option value="WF">Wallis and Futuna</option>
                              <option value="EH">Western Sahara</option>
                              <option value="YE">Yemen</option>
                              <option value="ZM">Zambia</option>
                              <option value="ZW">Zimbabwe</option>
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
                                       px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-houma-gold transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Delivery Time Info */}
                      <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-houma-white/5 border border-houma-gold/20 rounded">
                        <p className="text-xs sm:text-sm text-houma-gold tracking-wider mb-3 sm:mb-4">DELIVERY TIME</p>
                        <div className="space-y-2">
                          <p className="text-xs sm:text-sm text-houma-white/80">
                            <span className="text-houma-white">Canada:</span> 2-6 business days
                          </p>
                          <p className="text-xs sm:text-sm text-houma-white/80">
                            <span className="text-houma-white">International:</span> 5-10 business days
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end mt-6 sm:mt-8">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full sm:w-auto bg-houma-gold text-houma-black px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base uppercase tracking-widest 
                                 hover:bg-houma-gold-light transition-all duration-300 disabled:opacity-50"
                      >
                        {isProcessing ? 'Processing...' : 'Continue'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Payment Information */}
                {step === 'payment' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-lg sm:text-xl font-display tracking-wider text-houma-white mb-4 sm:mb-6">
                        PAYMENT INFORMATION
                      </h2>

                      <PaymentForm
                        amount={total}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                      />
                    </motion.div>
                )}

                {/* Order Review */}
                {step === 'review' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-lg sm:text-xl font-display tracking-wider text-houma-white mb-4 sm:mb-6">
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
                            Credit/Debit Card<br />
                            Secure payment via Stripe
                          </p>
                        </div>
                      </div>
                    </motion.div>
                )}

                {/* Navigation Buttons */}
                {step === 'payment' && (
                  <div className="flex justify-start mt-6 sm:mt-8">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="flex items-center gap-2 text-sm sm:text-base text-houma-white/70 hover:text-houma-gold 
                               transition-colors"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                      Back
                    </button>
                    
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 sm:top-24 md:top-32">
                  <h2 className="text-lg sm:text-xl font-display tracking-wider text-houma-white mb-4 sm:mb-6">
                    ORDER SUMMARY
                  </h2>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    {items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                        className="flex gap-3 sm:gap-4"
                      >
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden bg-houma-smoke rounded">
                          <Image
                            src={getImagePath(item.product.images[0])}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm text-houma-white truncate">{item.product.name}</h3>
                          <p className="text-xs text-houma-white/50">
                            {item.selectedColor} / {item.selectedSize} / Qty: {item.quantity}
                          </p>
                          <p className="text-xs sm:text-sm text-houma-gold mt-1">
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

                  <div className="flex justify-between py-3 sm:py-4 border-t border-houma-white/10">
                    <span className="text-base sm:text-lg text-houma-white">Total</span>
                    <span className="text-base sm:text-lg text-houma-gold">{formatPrice(total)}</span>
                  </div>

                  {/* Security Badges */}
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-houma-smoke/30 rounded">
                    <div className="flex items-center gap-2 text-xs text-houma-white/50">
                      <ShieldCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>100% Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-houma-white/50 mt-2">
                      <LockClosedIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
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

const CheckoutPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}

export default CheckoutPage
