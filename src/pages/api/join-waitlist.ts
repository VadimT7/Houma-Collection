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

const saveWaitlistData = (data: WaitlistData): void => {
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(data, null, 2))
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const waitlistData = getWaitlistData()

    // Check if waitlist is full
    if (waitlistData.emails.length >= MAX_SPOTS) {
      return res.status(400).json({ 
        message: 'Waitlist full',
        spotsRemaining: 0 
      })
    }

    // Check if email already exists
    if (waitlistData.emails.includes(normalizedEmail)) {
      return res.status(400).json({ 
        message: 'Already on waitlist',
        spotsRemaining: MAX_SPOTS - waitlistData.emails.length 
      })
    }

    // Add to waitlist
    waitlistData.emails.push(normalizedEmail)
    waitlistData.createdAt.push(new Date().toISOString())
    saveWaitlistData(waitlistData)

    const spotsRemaining = MAX_SPOTS - waitlistData.emails.length

    res.status(200).json({ 
      message: 'Successfully joined waitlist',
      spotsRemaining,
      position: waitlistData.emails.length
    })
  } catch (error) {
    console.error('Error joining waitlist:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
