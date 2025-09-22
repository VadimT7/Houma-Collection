import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@/lib/store'
import { formatPrice, getImagePath } from '@/lib/utils'
import { EyeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

interface ProductCardProps {
  product: Product
  index?: number
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (product.images.length > 1) {
      setImageIndex(1)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setImageIndex(0)
  }

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-houma-smoke">
          {/* Product Images */}
          <motion.div
            className="relative w-full h-full"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={getImagePath(product.images[imageIndex])}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>

          {/* Overlay on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-houma-black/80 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Quick Actions */}
          <motion.div
            className="absolute bottom-4 left-4 right-4 flex justify-between items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="p-3 bg-houma-black/50 backdrop-blur-sm border border-houma-gold/30 hover:bg-houma-gold hover:text-houma-black transition-all duration-300">
              <EyeIcon className="w-5 h-5" />
            </button>
            <button className="p-3 bg-houma-black/50 backdrop-blur-sm border border-houma-gold/30 hover:bg-houma-gold hover:text-houma-black transition-all duration-300">
              <ShoppingBagIcon className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-houma-gold text-houma-black text-xs font-light tracking-wider">
                FEATURED
              </span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-houma-black/60 flex items-center justify-center">
              <span className="text-houma-white text-sm tracking-widest">SOLD OUT</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-sm font-light text-houma-white group-hover:text-houma-gold transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-xs text-houma-white/50 mt-1">{product.collection}</p>
          </div>
          <p className="text-sm font-light text-houma-gold">{formatPrice(product.price)}</p>
        </div>

        {/* Color Options Preview */}
        {product.colors.length > 1 && (
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-houma-white/20"
                style={{
                  backgroundColor: 
                    color === 'Midnight Black' ? '#000000' :
                    color === 'Desert Sand' ? '#D2B48C' :
                    color === 'Atlas White' ? '#FFFFFF' :
                    color === 'Obsidian' ? '#1C1C1C' :
                    color === 'Sahara Gold' ? '#D4AF37' :
                    color === 'Charcoal' ? '#36454F' :
                    '#2C2C2C'
                }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-houma-white/30">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProductCard
