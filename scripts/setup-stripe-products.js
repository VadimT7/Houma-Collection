/**
 * Script to setup products in Stripe with proper metadata for the HOUMA website
 * 
 * Usage:
 * 1. Set your STRIPE_SECRET_KEY environment variable
 * 2. Run: node scripts/setup-stripe-products.js
 * 
 * This script will create sample products in Stripe with all the necessary metadata
 * for the website filters and display to work properly.
 */

const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Sample products data that matches the original site structure
const sampleProducts = [
  {
    name: 'MEDINA HOODIE',
    description: 'Luxury streetwear hoodie crafted from premium cotton blend with traditional Maghrebi embroidery patterns.',
    images: [], // Images will be uploaded through Stripe Dashboard
    metadata: {
      culturalStory: 'Inspired by the ancient medinas of Fez and Tunis, this piece features hand-stitched geometric patterns that tell stories of the souks and artisan quarters.',
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Midnight Black', 'Desert Sand', 'Atlas White']),
      category: 'Hoodies',
      collection: 'Heritage Collection',
      inStock: 'true',
      featured: 'true'
    },
    default_price_data: {
      currency: 'usd',
      unit_amount: 28000, // $280.00 in cents
    }
  },
  {
    name: 'KASBAH BOMBER',
    description: 'Premium bomber jacket featuring gold-thread embroidery and luxury satin lining.',
    images: [],
    metadata: {
      culturalStory: 'Drawing inspiration from the fortress cities of the Maghreb, this bomber represents strength and cultural pride with its bold silhouette.',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Obsidian', 'Sahara Gold']),
      category: 'Jackets',
      collection: 'Signature Line',
      inStock: 'true',
      featured: 'true'
    },
    default_price_data: {
      currency: 'usd',
      unit_amount: 45000, // $450.00 in cents
    }
  },
  {
    name: 'SOUK PANTS',
    description: 'Contemporary cargo pants with North African textile influences and utility design.',
    images: [],
    metadata: {
      culturalStory: 'Inspired by the flowing garments of traditional souk merchants, reimagined for modern street culture.',
      sizes: JSON.stringify(['28', '30', '32', '34', '36', '38']),
      colors: JSON.stringify(['Charcoal', 'Olive Night', 'Sand Storm']),
      category: 'Pants',
      collection: 'Street Essentials',
      inStock: 'true',
      featured: 'false'
    },
    default_price_data: {
      currency: 'usd',
      unit_amount: 22000, // $220.00 in cents
    }
  },
  {
    name: 'ATLAS TEE',
    description: 'Premium cotton t-shirt with subtle calligraphy print and luxury fit.',
    images: [],
    metadata: {
      culturalStory: 'Features Arabic calligraphy that reads "Strength in Heritage" - a testament to cultural pride.',
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Pure Black', 'Bone White', 'Stone Grey']),
      category: 'T-Shirts',
      collection: 'Core Collection',
      inStock: 'true',
      featured: 'false'
    },
    default_price_data: {
      currency: 'usd',
      unit_amount: 12000, // $120.00 in cents
    }
  },
  {
    name: 'BERBER TRACKSUIT',
    description: 'Luxury tracksuit with Amazigh-inspired patterns and premium athletic fit.',
    images: [],
    metadata: {
      culturalStory: 'Celebrating Berber heritage with geometric patterns that have adorned North African textiles for millennia.',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Noir', 'Royal Blue', 'Forest Green']),
      category: 'Tracksuits',
      collection: 'Heritage Collection',
      inStock: 'true',
      featured: 'true'
    },
    default_price_data: {
      currency: 'usd',
      unit_amount: 38000, // $380.00 in cents
    }
  }
];

async function setupProducts() {
  console.log('🚀 Starting Stripe product setup...\n');

  for (const productData of sampleProducts) {
    try {
      // Create the product
      const product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
        images: productData.images.length > 0 ? productData.images : undefined,
        metadata: productData.metadata,
        default_price_data: productData.default_price_data,
      });

      console.log(`✅ Created product: ${product.name} (ID: ${product.id})`);
    } catch (error) {
      console.error(`❌ Error creating product ${productData.name}:`, error.message);
    }
  }

  console.log('\n✨ Product setup complete!');
  console.log('\n📝 Important metadata fields for filtering:');
  console.log('- category: Product category (Hoodies, Jackets, etc.)');
  console.log('- collection: Product collection (Heritage Collection, etc.)');
  console.log('- sizes: JSON array of available sizes');
  console.log('- colors: JSON array of available colors');
  console.log('- featured: "true" or "false" for featured products');
  console.log('- inStock: "true" or "false" for stock status');
  console.log('- culturalStory: Optional cultural narrative for the product');
  
  console.log('\n🖼️  To add product images:');
  console.log('1. Go to your Stripe Dashboard → Products');
  console.log('2. Click on each product');
  console.log('3. Upload images in the "Images" section');
  console.log('4. Images will automatically appear on the website');
}

// Run the setup
setupProducts().catch(console.error);
