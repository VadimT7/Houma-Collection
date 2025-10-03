require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

async function exportWaitlist() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env.local')
    process.exit(1)
  }
  
  const sql = neon(process.env.DATABASE_URL)
  
  try {
    console.log('Fetching waitlist emails...\n')
    
    const result = await sql`
      SELECT id, email, created_at 
      FROM waitlist 
      ORDER BY created_at ASC
    `
    
    console.log(`Total emails: ${result.length}\n`)
    console.log('=' .repeat(80))
    
    result.forEach((row, index) => {
      const date = new Date(row.created_at).toLocaleString()
      console.log(`${index + 1}. ${row.email} (joined: ${date})`)
    })
    
    console.log('=' .repeat(80))
    console.log('\nEmail list (CSV format):')
    console.log(result.map(r => r.email).join(','))
    
  } catch (error) {
    console.error('Error exporting waitlist:', error)
    process.exit(1)
  }
}

exportWaitlist()
