import { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'

const MAX_SPOTS = 300
const FAKE_OFFSET = 127 // Faking enrollment to show 173 spots remaining

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const result = await query<{ count: string }>('SELECT COUNT(*) as count FROM waitlist')
    const actualCount = parseInt(result[0].count)
    const currentCount = actualCount + FAKE_OFFSET
    const spotsRemaining = Math.max(0, MAX_SPOTS - currentCount)
    
    res.status(200).json({ 
      spotsRemaining,
      totalSpots: MAX_SPOTS,
      currentCount
    })
  } catch (error) {
    console.error('Error getting waitlist status:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
