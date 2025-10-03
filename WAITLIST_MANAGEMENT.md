# HOUMA Waitlist Management Guide

## Overview
During the pre-launch phase, all visitors to the HOUMA website are redirected to an exclusive waitlist page. This waitlist is limited to 100 spots and offers free shipping on the first order to members.

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
- **Duplicate prevention**: Same email can't sign up twice
- **Exclusive benefits**: Free shipping on first order for waitlist members
- **Modern, luxury design**: Aligned with HOUMA brand identity

## API Endpoints

### `POST /api/join-waitlist`
Adds an email to the waitlist.

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
Returns current waitlist status.

**Response:**
```json
{
  "spotsRemaining": 95,
  "totalSpots": 100,
  "currentCount": 5
}
```

## Data Storage
- Waitlist data is stored in `waitlist.json` at the project root
- This file contains emails and signup timestamps
- **Important**: This file is in `.gitignore` to protect user data

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

## Managing Waitlist Data

### Viewing Waitlist Emails
The waitlist emails are stored in `waitlist.json`:
```json
{
  "emails": ["email1@example.com", "email2@example.com"],
  "createdAt": ["2023-01-01T00:00:00Z", "2023-01-02T00:00:00Z"]
}
```

### Exporting Waitlist
To export the waitlist for marketing purposes:
1. Copy the `waitlist.json` file
2. Use the email list for your email marketing platform
3. Remember to honor the free shipping promise for these users

### Clearing the Waitlist
To reset the waitlist:
1. Edit `waitlist.json`
2. Set both arrays to empty: `{ "emails": [], "createdAt": [] }`

## Security Considerations
- Email validation is performed server-side
- Waitlist data file is excluded from version control
- Rate limiting should be added for production use
- Consider adding CAPTCHA for bot prevention

## Customization

### Changing the Limit
To change the 100-spot limit:
1. Edit `MAX_SPOTS` constant in both API files:
   - `src/pages/api/join-waitlist.ts`
   - `src/pages/api/waitlist-status.ts`

### Modifying Benefits
To change the waitlist benefits, edit the text in:
- `src/pages/waitlist.tsx` (lines ~115-118)

### Styling Changes
The waitlist page uses the existing HOUMA design system:
- Colors: `houma-black`, `houma-gold`, `houma-white`
- Fonts: `font-display` for headings
- Animations: Framer Motion for smooth transitions
- Patterns: Luxury overlays and geometric shapes

## Production Deployment
Before deploying to production:
1. Ensure `waitlist.json` is properly initialized
2. Consider using a database instead of JSON file for better scalability
3. Add proper error logging
4. Implement rate limiting
5. Add email verification if needed
6. Set up backup system for waitlist data
