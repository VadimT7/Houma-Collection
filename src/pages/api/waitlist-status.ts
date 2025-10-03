import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const WAITLIST_FILE = path.join(process.cwd(), 'waitlist.json')
const MAX_SPOTS = 100

type WaitlistData = {
  emails: string[]
  createdAt: string[]
}

const getWaitlistData = (): WaitlistData => {
  try {
    if (fs.existsSync(WAITLIST_FILE)) {
      const data = fs.readFileSync(WAITLIST_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading waitlist file:', error)
  }
  return { emails: [], createdAt: [] }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const waitlistData = getWaitlistData()
    const spotsRemaining = Math.max(0, MAX_SPOTS - waitlistData.emails.length)
    
    res.status(200).json({ 
      spotsRemaining,
      totalSpots: MAX_SPOTS,
      currentCount: waitlistData.emails.length
    })
  } catch (error) {
    console.error('Error getting waitlist status:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
