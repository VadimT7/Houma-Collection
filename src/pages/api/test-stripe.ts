import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const secretKey = process.env.STRIPE_SECRET_KEY
  
  res.status(200).json({
    publishableKeyExists: !!publishableKey,
    secretKeyExists: !!secretKey,
    publishableKeyPrefix: publishableKey?.substring(0, 10),
    secretKeyPrefix: secretKey?.substring(0, 10),
    message: 'Stripe configuration check'
  })
}
