require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env.local')
    process.exit(1)
  }
  
  const sql = neon(process.env.DATABASE_URL)
  
  try {
    console.log('Creating waitlist table...')
    
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    console.log('✅ Waitlist table created successfully!')
    
    // Check current count
    const result = await sql`SELECT COUNT(*) as count FROM waitlist`
    console.log(`Current waitlist count: ${result[0].count}`)
    
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  }
}

setupDatabase()
