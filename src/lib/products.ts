import { Product } from './store'

export const products: Product[] = [
  {
    id: '1',
    name: 'MEDINA HOODIE',
    price: 280,
    description: 'Luxury streetwear hoodie crafted from premium cotton blend with traditional Maghrebi embroidery patterns.',
    culturalStory: 'Inspired by the ancient medinas of Fez and Tunis, this piece features hand-stitched geometric patterns that tell stories of the souks and artisan quarters.',
    images: [
      'Illustration_sans_titre 2_pages-to-jpg-0001.jpg',
      'Illustration_sans_titre 2_pages-to-jpg-0002.jpg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Midnight Black', 'Desert Sand', 'Atlas White'],
    category: 'Hoodies',
    collection: 'Heritage Collection',
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    name: 'KASBAH BOMBER',
    price: 450,
    description: 'Premium bomber jacket featuring gold-thread embroidery and luxury satin lining.',
    culturalStory: 'Drawing inspiration from the fortress cities of the Maghreb, this bomber represents strength and cultural pride with its bold silhouette.',
    images: [
      'Illustration_sans_titre 2_pages-to-jpg-0003.jpg',
      'Illustration_sans_titre 2_pages-to-jpg-0004.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian', 'Sahara Gold'],
    category: 'Jackets',
    collection: 'Signature Line',
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    name: 'SOUK PANTS',
    price: 220,
    description: 'Contemporary cargo pants with North African textile influences and utility design.',
    culturalStory: 'Inspired by the flowing garments of traditional souk merchants, reimagined for modern street culture.',
    images: [
      'Models1.jpeg',
      'Models2.jpeg',
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Charcoal', 'Olive Night', 'Sand Storm'],
    category: 'Pants',
    collection: 'Street Essentials',
    inStock: true,
  },
  {
    id: '4',
    name: 'ATLAS TEE',
    price: 120,
    description: 'Premium cotton t-shirt with subtle calligraphy print and luxury fit.',
    culturalStory: 'Features Arabic calligraphy that reads "Strength in Heritage" - a testament to cultural pride.',
    images: [
      'Illustration_sans_titre 2_pages-to-jpg-0005.jpg',
      'Illustration_sans_titre 2_pages-to-jpg-0006.jpg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Pure Black', 'Bone White', 'Stone Grey'],
    category: 'T-Shirts',
    collection: 'Core Collection',
    inStock: true,
  },
  {
    id: '5',
    name: 'BERBER TRACKSUIT',
    price: 380,
    description: 'Luxury tracksuit with Amazigh-inspired patterns and premium athletic fit.',
    culturalStory: 'Celebrating Berber heritage with geometric patterns that have adorned North African textiles for millennia.',
    images: [
      'Models3.jpeg',
      'Illustration_sans_titre 2_pages-to-jpg-0007.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Royal Blue', 'Forest Green'],
    category: 'Tracksuits',
    collection: 'Heritage Collection',
    inStock: true,
    featured: true,
  },
  {
    id: '6',
    name: 'TUNIS OVERSHIRT',
    price: 320,
    description: 'Oversized shirt jacket with traditional button details and modern cut.',
    culturalStory: 'A contemporary take on the traditional Tunisian shirt, blending old-world craftsmanship with street aesthetics.',
    images: [
      'Illustration_sans_titre 2_pages-to-jpg-0008.jpg',
      'Illustration_sans_titre 2_pages-to-jpg-0009.jpg',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Midnight', 'Camel', 'Sage'],
    category: 'Shirts',
    collection: 'Signature Line',
    inStock: true,
  },
  {
    id: '7',
    name: 'FEZ CAP',
    price: 85,
    description: 'Modern interpretation of the classic fez in premium wool blend.',
    culturalStory: 'Reimagining the iconic fez for contemporary street culture while honoring its cultural significance.',
    images: [
      'Illustration_sans_titre 2_pages-to-jpg-0010.jpg',
      'Models1.jpeg',
    ],
    sizes: ['One Size'],
    colors: ['Crimson', 'Black', 'Navy'],
    category: 'Accessories',
    collection: 'Accessories',
    inStock: true,
  },
  {
    id: '8',
    name: 'SAHARA SHORTS',
    price: 180,
    description: 'Premium cotton shorts with embroidered details and comfort fit.',
    culturalStory: 'Desert-inspired comfort meets urban functionality in these versatile shorts.',
    images: [
      'Models2.jpeg',
      'Models3.jpeg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sand', 'Black', 'Khaki'],
    category: 'Shorts',
    collection: 'Summer Drop',
    inStock: true,
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category)
}

export function getProductsByCollection(collection: string): Product[] {
  return products.filter(product => product.collection === collection)
}

export const collections = [
  'Heritage Collection',
  'Signature Line',
  'Street Essentials',
  'Core Collection',
  'Summer Drop',
]

export const categories = [
  'Hoodies',
  'Jackets',
  'Pants',
  'T-Shirts',
  'Tracksuits',
  'Shirts',
  'Shorts',
  'Accessories',
]
