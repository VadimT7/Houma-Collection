import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/store'
import { formatPrice, getImagePath } from '@/lib/utils'
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

const Cart = () => {
  const [isClient, setIsClient] = useState(false)
  
  // Always call the hook, but handle hydration safely
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart()
  const totalPrice = isClient ? getTotalPrice() : 0

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />

          {/* Cart Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-96 lg:w-[450px] bg-houma-black border-l border-houma-gold/20 z-[101] overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-houma-gold/20">
                <div>
                  <h2 className="text-xl font-display tracking-wider text-houma-gold">YOUR BAG</h2>
                  <p className="text-xs text-houma-white/50 mt-1">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <button
                  onClick={toggleCart}
                  className="p-2 hover:bg-houma-white/10 rounded-full transition-colors duration-300"
                >
                  <XMarkIcon className="w-5 h-5 text-houma-white" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <p className="text-houma-white/50 text-center mb-6">Your bag is empty</p>
                    <Link href="/shop">
                      <button
                        className="houma-button"
                        onClick={toggleCart}
                      >
                        <span>CONTINUE SHOPPING</span>
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                        className="flex gap-4 pb-6 border-b border-houma-white/10 last:border-0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* Product Image */}
                        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-houma-smoke">
                          <Image
                            src={getImagePath(item.product.images[0])}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h3 className="text-sm font-light text-houma-white">{item.product.name}</h3>
                              <p className="text-xs text-houma-white/50 mt-1">
                                {item.selectedColor} / {item.selectedSize}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                              className="text-houma-white/50 hover:text-houma-gold transition-colors"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor,
                                  item.quantity - 1
                                )}
                                className="p-1 hover:bg-houma-white/10 rounded transition-colors"
                              >
                                <MinusIcon className="w-3 h-3 text-houma-white/70" />
                              </button>
                              <span className="text-sm text-houma-white min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor,
                                  item.quantity + 1
                                )}
                                className="p-1 hover:bg-houma-white/10 rounded transition-colors"
                              >
                                <PlusIcon className="w-3 h-3 text-houma-white/70" />
                              </button>
                            </div>

                            {/* Price */}
                            <p className="text-sm font-light text-houma-gold">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-houma-gold/20 p-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-sm text-houma-white/70">Subtotal</span>
                    <span className="text-lg font-light text-houma-gold">{formatPrice(totalPrice)}</span>
                  </div>
                  
                  <p className="text-xs text-houma-white/50 mb-6">
                    Shipping and taxes calculated at checkout
                  </p>

                  <div className="space-y-3">
                    <Link href="/checkout">
                      <button
                        className="w-full bg-houma-gold text-houma-black py-4 px-6 uppercase tracking-widest 
                                 font-light hover:bg-houma-gold-light transition-all duration-300"
                        onClick={toggleCart}
                      >
                        Checkout
                      </button>
                    </Link>
                    
                    <button
                      onClick={toggleCart}
                      className="w-full border border-houma-gold/20 text-houma-white py-4 px-6 uppercase 
                               tracking-widest font-light hover:bg-houma-white/10 transition-all duration-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Cart
