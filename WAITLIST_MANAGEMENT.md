# HOUMA Waitlist Management Guide

## Overview
During the pre-launch phase, all visitors to the HOUMA website are redirected to an exclusive waitlist page. This waitlist is limited to 100 spots and offers free shipping on the first order to members.

## Database Setup
The waitlist now uses **Neon PostgreSQL** database for reliable, production-ready storage.

### Database Schema
```sql
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Environment Variables
Required in `.env.local` (local) and Vercel (production):
```
DATABASE_URL=postgresql://[connection-string]
```

## How It Works

### Automatic Redirect
- All traffic is automatically redirected to `/waitlist` page
- Only exceptions are:
  - The waitlist page itself (`/waitlist`)
  - API routes (`/api/*`)
- This redirect is handled in `src/pages/_app.tsx`

### Waitlist Features
- **Limited to 100 spots**: Once 100 people sign up, the waitlist closes
- **Real-time counter**: Shows remaining spots
- **Duplicate prevention**: Same email can't sign up twice (enforced by database)
- **Exclusive benefits**: Free shipping on first order for waitlist members
- **Modern, luxury design**: Aligned with HOUMA brand identity
- **Production-ready**: Uses Neon PostgreSQL for reliable data persistence

## API Endpoints

### `POST /api/join-waitlist`
Adds an email to the waitlist (stores in database).

**Request body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
- Success (200): `{ message, spotsRemaining, position }`
- Already registered (400): `{ message: "Already on waitlist", spotsRemaining }`
- Waitlist full (400): `{ message: "Waitlist full", spotsRemaining: 0 }`

### `GET /api/waitlist-status`
Returns current waitlist status from database.

**Response:**
```json
{
  "spotsRemaining": 95,
  "totalSpots": 100,
  "currentCount": 5
}
```

## Database Management

### Setup Database Table
To create the waitlist table (already done):
```bash
node scripts/setup-waitlist-db.js
```

### Export Waitlist Emails
To view and export all waitlist emails:
```bash
node scripts/export-waitlist.js
```

This will display:
- All emails with signup timestamps
- CSV format for easy import to email marketing tools

### Viewing Waitlist Data
You can query the database directly using the Neon console or any PostgreSQL client:
```sql
-- View all waitlist entries
SELECT * FROM waitlist ORDER BY created_at DESC;

-- Count current entries
SELECT COUNT(*) FROM waitlist;

-- Get specific email
SELECT * FROM waitlist WHERE email = 'user@example.com';
```

### Clearing the Waitlist
To reset the waitlist (use with caution):
```sql
TRUNCATE TABLE waitlist;
```

Or using Node.js:
```javascript
require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')
const sql = neon(process.env.DATABASE_URL)
await sql`TRUNCATE TABLE waitlist`
```

## Launching the Site

To disable the waitlist and launch the full site:

1. Open `src/pages/_app.tsx`
2. Comment out or remove the pre-launch redirect code (lines 26-33)
3. Uncomment the original entry logic (lines 36-46)
4. Remove the skip entry lines (lines 49-50)

The code section to modify looks like this:
```tsx
// PRE-LAUNCH MODE: Redirect all traffic to waitlist page
const isWaitlistPage = window.location.pathname === '/waitlist'
const isApiRoute = window.location.pathname.startsWith('/api/')

if (!isWaitlistPage && !isApiRoute) {
  router.push('/waitlist')
  return
}
```

## Production Deployment

### Environment Variables in Vercel
The `DATABASE_URL` is already configured in Vercel's environment variables for production.

To update or verify:
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Ensure `DATABASE_URL` is set for Production

### Deploying
```bash
vercel --prod
```

### Post-Deployment Checklist
- ✅ Database table created
- ✅ Environment variables set in Vercel
- ✅ API endpoints working
- ✅ Email validation active
- ✅ Duplicate prevention working
- ✅ Spot counter displaying correctly

## Security Considerations
- ✅ Email validation performed server-side
- ✅ Database enforces unique emails
- ✅ Connection pooling for performance
- ✅ SSL required for database connections
- 🔄 Consider adding rate limiting for production
- 🔄 Consider adding CAPTCHA for bot prevention

## Customization

### Changing the Limit
To change the 100-spot limit, update `MAX_SPOTS` constant in:
- `src/pages/api/join-waitlist.ts`
- `src/pages/api/waitlist-status.ts`

### Modifying Benefits
To change the waitlist benefits, edit the text in:
- `src/pages/waitlist.tsx` (lines ~203-221)

### Styling Changes
The waitlist page uses the existing HOUMA design system:
- Colors: `houma-black`, `houma-gold`, `houma-white`
- Fonts: `font-display` for headings
- Animations: Framer Motion for smooth transitions
- Patterns: Luxury overlays and geometric shapes

## Monitoring
Check waitlist status at any time:
```bash
node scripts/export-waitlist.js
```

Or query the database directly through Neon console:
- Visit: https://console.neon.tech
- Select your project
- Use SQL Editor

## Backup & Recovery
Neon automatically backs up your database. To export for safekeeping:
```bash
# Using the export script
node scripts/export-waitlist.js > waitlist-backup-$(date +%Y%m%d).txt
```

## Technical Details
- **Database**: Neon PostgreSQL (serverless)
- **Client**: @neondatabase/serverless (edge-compatible)
- **Connection**: Pooled connections for optimal performance
- **Concurrency**: Safe for multiple simultaneous signups
- **Persistence**: Data survives deployments and server restarts