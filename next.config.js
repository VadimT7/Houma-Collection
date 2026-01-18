/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // Using remotePatterns for more flexible external image handling
    remotePatterns: [
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: 'files.stripe.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.blob.core.windows.net' },  // Azure Blob Storage
      { protocol: 'https', hostname: '*.vercel-storage.com' },     // Vercel Blob
      { protocol: 'https', hostname: '*.supabase.co' },            // Supabase Storage
      { protocol: 'https', hostname: 's3.amazonaws.com' },         // AWS S3
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },       // AWS S3 buckets
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Removed experimental optimizeCss to prevent critters dependency issues
  
  // Add headers to allow Stripe resources
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://api.stripe.com",
              "frame-src 'self' https://js.stripe.com",
            ].join('; ')
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
