# HOUMA - Luxury Streetwear E-Commerce

A premium, culturally-authentic luxury streetwear website for HOUMA, featuring North African heritage-inspired design with cutting-edge web technologies and immersive user experience.

## 🌟 Features

- **Luxury Design**: Ultra-premium aesthetics with custom animations and transitions
- **Cultural Authenticity**: Deep integration of North African (Tunisia/Algeria/Morocco) cultural elements
- **Full E-Commerce**: Complete shopping experience with cart, checkout, and Stripe integration
- **Responsive Design**: Flawless experience across all devices
- **Performance Optimized**: Blazing fast with Next.js and optimized images
- **SEO Ready**: Full SEO optimization for maximum visibility

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd houma-luxury-streetwear
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Edit `.env.local` with your Stripe keys:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
```

5. Copy the Resources folder to the public directory:
```bash
# Copy the Resources folder with all images to /public/Resources
cp -r Resources public/
```

6. Run the development server:
```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
houma-luxury-streetwear/
├── public/
│   └── Resources/         # Brand assets and images
│       ├── Logos-and-Images/
│       └── Models/
├── src/
│   ├── components/        # React components
│   ├── lib/              # Utilities and store
│   ├── pages/            # Next.js pages
│   │   ├── api/          # API routes
│   │   └── product/      # Dynamic product pages
│   └── styles/           # Global styles
├── package.json
├── tailwind.config.ts    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## 📄 Pages

- **Homepage** (`/`): Hero section, collections carousel, featured products
- **Shop** (`/shop`): Filterable product grid with categories and collections
- **Product Detail** (`/product/[id]`): Individual product pages with zoom and cultural storytelling
- **Collections** (`/collections`): All collections showcase
- **About/Culture** (`/about`): Brand manifesto and cultural heritage
- **Lookbook** (`/lookbook`): Editorial and campaign showcases
- **Contact** (`/contact`): Contact form and support
- **Checkout** (`/checkout`): Multi-step checkout with Stripe integration

## 🎨 Design System

### Colors
- **Primary**: Gold (#D4AF37)
- **Background**: Deep Black (#0A0A0A)
- **Text**: Off-White (#FAFAF8)
- **Accents**: Desert tones

### Typography
- **Display**: Bebas Neue
- **Body**: Helvetica Neue
- **Cultural**: Amiri (Arabic)

### Components
- Custom animations with Framer Motion
- Luxury-focused UI components
- Cultural pattern overlays
- Advanced hover effects

## 💳 Payment Integration

This project uses Stripe for payment processing. To fully enable payments:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Add them to your `.env.local` file
4. Test with Stripe's test card numbers

## 🚢 Deployment

### Production Build

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm start
# or
yarn start
```

### Deploy to Vercel

```bash
vercel
```

## 🛠️ Technologies Used

- **Next.js 14**: React framework with SSR/SSG
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Advanced animations
- **Stripe**: Payment processing
- **Zustand**: State management
- **React Hot Toast**: Notifications

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Customization

### Adding Products

Edit `src/lib/products.ts` to add or modify products:

```typescript
{
  id: 'unique-id',
  name: 'Product Name',
  price: 299,
  description: 'Product description',
  culturalStory: 'Cultural narrative',
  images: ['image1.jpg', 'image2.jpg'],
  sizes: ['S', 'M', 'L'],
  colors: ['Black', 'White'],
  category: 'Category',
  collection: 'Collection Name',
  inStock: true,
  featured: true
}
```

### Modifying Styles

Update the Tailwind configuration in `tailwind.config.ts` to change:
- Color schemes
- Typography
- Animations
- Custom utilities

## 🌍 Localization

The site includes Arabic text elements. To add more languages:

1. Install i18n packages
2. Create translation files
3. Implement language switcher

## 📈 Analytics

To add analytics:

1. Install analytics package (Google Analytics, Plausible, etc.)
2. Add tracking code to `_app.tsx`
3. Configure events for e-commerce tracking

## 🔒 Security

- SSL encryption for all transactions
- Secure payment processing with Stripe
- Input validation and sanitization
- CORS configuration for API routes

## 📝 License

This project is proprietary and confidential.

## 🤝 Support

For support, email support@houma.com

---

**HOUMA** - Where Heritage Meets Modern Edge
*Luxury Without Compromise. Culture Without Apology.*
