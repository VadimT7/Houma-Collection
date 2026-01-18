import { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'

const MAX_SPOTS = 300
const FAKE_OFFSET = 127 // Faking enrollment to show 173 spots remaining

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    // Validate email
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check current count
    const countResult = await query<{ count: string }>('SELECT COUNT(*) as count FROM waitlist')
    const actualCount = parseInt(countResult[0]?.count || '0')
    const currentCount = actualCount + FAKE_OFFSET

    // Check if waitlist is full
    if (currentCount >= MAX_SPOTS) {
      return res.status(400).json({ 
        message: 'Waitlist full',
        spotsRemaining: 0 
      })
    }

    // Try to insert email
    try {
      await query(
        'INSERT INTO waitlist (email) VALUES ($1)',
        [normalizedEmail]
      )
      
      const spotsRemaining = MAX_SPOTS - (currentCount + 1)

      res.status(200).json({ 
        message: 'Successfully joined waitlist',
        spotsRemaining,
        position: currentCount + 1
      })
    } catch (insertError: any) {
      // Check if it's a duplicate email error
      if (insertError.code === '23505' || insertError.message?.includes('duplicate') || insertError.message?.includes('unique')) {
        return res.status(400).json({ 
          message: 'Already on waitlist',
          spotsRemaining: MAX_SPOTS - currentCount
        })
      }
      throw insertError
    }
  } catch (error) {
    console.error('Error joining waitlist:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}