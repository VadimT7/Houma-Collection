import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ShoppingBagIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const { toggleCart, getTotalItems } = useCart()
  const totalItems = getTotalItems()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/shop', label: 'SHOP', hasDropdown: true },
    { href: '/collections', label: 'COLLECTIONS' },
    { href: '/lookbook', label: 'LOOKBOOK' },
    { href: '/about', label: 'CULTURE' },
    { href: '/contact', label: 'CONTACT' },
  ]

  const shopCategories = [
    { label: 'NEW ARRIVALS', href: '/shop?filter=new' },
    { label: 'HOODIES', href: '/shop?category=hoodies' },
    { label: 'JACKETS', href: '/shop?category=jackets' },
    { label: 'PANTS', href: '/shop?category=pants' },
    { label: 'T-SHIRTS', href: '/shop?category=t-shirts' },
    { label: 'ACCESSORIES', href: '/shop?category=accessories' },
  ]

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
          isScrolled 
            ? 'bg-houma-black/90 backdrop-blur-xl border-b border-houma-gold/20' 
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="houma-container">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href="/">
              <motion.div 
                className="relative w-32 h-12 lg:w-40 lg:h-14 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/Resources/Logos-and-Images/Logo-White-No-Background.png"
                  alt="HOUMA"
                  fill
                  className="object-contain"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-houma-gold/0 via-houma-gold/20 to-houma-gold/0 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-12">
              {navLinks.map((link, index) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setIsMegaMenuOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setIsMegaMenuOpen(false)}
                >
                  <Link href={link.href}>
                    <motion.span
                      className="text-sm font-light tracking-[0.2em] text-houma-white hover:text-houma-gold transition-colors duration-300 cursor-pointer relative group"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {link.label}
                      <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-houma-gold group-hover:w-full transition-all duration-500" />
                    </motion.span>
                  </Link>
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-6">
              {/* Cart Icon */}
              <motion.button
                onClick={toggleCart}
                className="relative group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingBagIcon className="w-6 h-6 text-houma-white group-hover:text-houma-gold transition-colors duration-300" />
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-houma-gold text-houma-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="w-6 h-6 text-houma-white" />
                  ) : (
                    <Bars3Icon className="w-6 h-6 text-houma-white" />
                  )}
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-houma-black/95 backdrop-blur-xl border-b border-houma-gold/20 hidden lg:block"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <div className="houma-container py-12">
                <div className="grid grid-cols-6 gap-8">
                  {shopCategories.map((category, index) => (
                    <Link key={category.label} href={category.href}>
                      <motion.div
                        className="group cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <h3 className="text-sm font-light tracking-[0.2em] text-houma-white group-hover:text-houma-gold transition-colors duration-300">
                          {category.label}
                        </h3>
                        <div className="mt-1 h-[1px] w-0 bg-houma-gold group-hover:w-full transition-all duration-500" />
                      </motion.div>
                    </Link>
                  ))}
                </div>
                
                {/* Featured Image in Mega Menu */}
                <div className="mt-8 grid grid-cols-3 gap-8">
                  <div className="col-span-2">
                    <p className="text-houma-gold text-xs tracking-[0.3em] mb-2">FEATURED DROP</p>
                    <h2 className="text-3xl font-display text-houma-white mb-4">HERITAGE COLLECTION</h2>
                    <Link href="/collections/heritage">
                      <button className="houma-button">
                        <span>EXPLORE NOW</span>
                      </button>
                    </Link>
                  </div>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src="/Resources/Models/Models1.jpeg"
                      alt="Featured Collection"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-houma-black/50 to-transparent" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-houma-black z-40 lg:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={link.href}>
                    <span
                      className="text-2xl font-display tracking-[0.3em] text-houma-white hover:text-houma-gold transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
