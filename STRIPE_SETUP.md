# Stripe Payment Integration Setup

This document provides complete instructions for setting up Stripe payments in the HOUMA luxury streetwear website.

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Get Your Stripe Keys

1. **Create a Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**: 
   - Go to your Stripe Dashboard → Developers → API Keys
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)

### 3. Set Up Webhooks (Optional but Recommended)

1. **Create Webhook Endpoint**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://yourdomain.com/api/webhook` (or `http://localhost:3000/api/webhook` for development)
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_method.attached`
   - Copy the **Webhook signing secret** (starts with `whsec_`)

## 💳 Payment Flow

### How It Works

1. **Customer fills shipping information** → proceeds to payment
2. **Stripe Elements secure card input** → customer enters card details
3. **Payment processing** → Stripe handles the secure payment
4. **Success/Error handling** → appropriate feedback to customer
5. **Order confirmation** → redirect to confirmation page with payment details

### Key Features

- ✅ **Secure Card Input**: Uses Stripe Elements for PCI compliance
- ✅ **Real-time Validation**: Instant feedback on card errors
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **Webhook Support**: Server-side payment confirmation
- ✅ **Mobile Optimized**: Responsive design for all devices
- ✅ **Luxury UX**: Seamless integration with HOUMA's design

## 🧪 Testing

### Test Card Numbers

Use these test card numbers in development:

```
# Successful Payment
4242 4242 4242 4242

# Declined Payment
4000 0000 0000 0002

# Requires Authentication
4000 0025 0000 3155
```

**Test Details**:
- Use any future expiry date (e.g., 12/25)
- Use any 3-digit CVC (e.g., 123)
- Use any billing address

### Testing the Flow

1. Add items to cart
2. Go to checkout
3. Fill in shipping information
4. Use test card numbers for payment
5. Verify success/error handling

## 🔧 Technical Implementation

### Files Modified/Created

- `src/components/PaymentForm.tsx` - Stripe Elements payment form
- `src/pages/checkout.tsx` - Updated checkout flow with Stripe integration
- `src/pages/api/create-payment-intent.ts` - Server-side payment intent creation
- `src/pages/api/webhook.ts` - Webhook handler for payment events
- `src/pages/order-confirmation.tsx` - Updated to show payment details

### Dependencies Added

- `@stripe/react-stripe-js` - React components for Stripe
- `micro` - For webhook request parsing

### Security Features

- **PCI Compliance**: Card data never touches your servers
- **Webhook Verification**: Ensures webhook requests are from Stripe
- **Environment Variables**: Sensitive keys stored securely
- **HTTPS Required**: Production requires SSL certificates

## 🚀 Production Deployment

### Before Going Live

1. **Switch to Live Keys**: Replace test keys with live keys
2. **Update Webhook URL**: Point to your production domain
3. **SSL Certificate**: Ensure HTTPS is enabled
4. **Test Thoroughly**: Use real (small) transactions to verify

### Environment Variables for Production

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid API Key"**: Check your environment variables are correct
2. **"Webhook signature verification failed"**: Verify webhook secret matches
3. **"Card declined"**: Use valid test card numbers
4. **"CORS errors"**: Ensure proper domain configuration in Stripe

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```env
STRIPE_DEBUG=true
```

## 📞 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available in your Stripe Dashboard
- **Test Mode**: Use test keys for development, live keys for production

---

**Note**: This integration is production-ready and follows Stripe's best practices for security and user experience.
