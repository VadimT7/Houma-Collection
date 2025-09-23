import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { buffer } from 'micro'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('PaymentIntent succeeded:', paymentIntent.id)
      
      // Here you would typically:
      // 1. Update your database with the successful payment
      // 2. Send confirmation email to customer
      // 3. Update inventory
      // 4. Create order record
      
      // For now, we'll just log it
      console.log('Payment succeeded for amount:', paymentIntent.amount)
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent
      console.log('PaymentIntent failed:', failedPayment.id)
      
      // Here you would typically:
      // 1. Log the failure
      // 2. Send notification to customer
      // 3. Update order status
      
      break

    case 'payment_method.attached':
      const paymentMethod = event.data.object as Stripe.PaymentMethod
      console.log('PaymentMethod attached:', paymentMethod.id)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  res.status(200).json({ received: true })
}
