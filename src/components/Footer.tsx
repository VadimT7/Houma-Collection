import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const Footer = () => {
  const footerLinks = {
    shop: [
      { label: 'New Arrivals', href: '/shop?filter=new' },
      { label: 'Collections', href: '/collections' },
      { label: 'Best Sellers', href: '/shop?filter=bestsellers' },
      { label: 'Sale', href: '/shop?filter=sale' },
    ],
    about: [
      { label: 'Our Story', href: '/about' },
      { label: 'Culture', href: '/about#culture' },
      { label: 'Sustainability', href: '/about#sustainability' },
      { label: 'Press', href: '/press' },
    ],
    customer: [
      { label: 'Contact', href: '/contact' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Size Guide', href: '/size-guide' },
    ],
    social: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'Twitter', href: 'https://twitter.com' },
      { label: 'Facebook', href: 'https://facebook.com' },
      { label: 'YouTube', href: 'https://youtube.com' },
    ],
  }

  return (
    <footer className="relative bg-houma-black border-t border-houma-gold/10 mt-32">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 pattern-overlay opacity-30" />
      
      <div className="relative houma-container py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative w-48 h-16 mb-6">
                <Image
                  src="/Resources/Logos-and-Images/Logo-White-No-Background.png"
                  alt="HOUMA"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-houma-white/70 text-sm leading-relaxed mb-6 max-w-sm">
                Luxury streetwear rooted in North African culture. Where heritage meets modern edge.
              </p>
              
              {/* Arabic Tagline */}
              <div className="mb-8">
                <p className="houma-arabic text-2xl text-houma-gold mb-2">
                  القوة في التراث
                </p>
                <p className="text-xs text-houma-white/50 tracking-widest">
                  STRENGTH IN HERITAGE
                </p>
              </div>

              {/* Newsletter */}
              <div className="border-t border-houma-gold/20 pt-6">
                <h4 className="text-xs font-light tracking-[0.3em] text-houma-gold mb-4">
                  JOIN THE CULTURE
                </h4>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent border-b border-houma-white/20 text-houma-white 
                             placeholder-houma-white/30 text-sm py-2 px-0 focus:outline-none 
                             focus:border-houma-gold transition-colors duration-300"
                  />
                  <button
                    type="submit"
                    className="ml-4 text-houma-gold hover:text-houma-gold-light transition-colors duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xs font-light tracking-[0.3em] text-houma-gold mb-6">SHOP</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-sm text-houma-white/70 hover:text-houma-gold transition-colors duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xs font-light tracking-[0.3em] text-houma-gold mb-6">ABOUT</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-sm text-houma-white/70 hover:text-houma-gold transition-colors duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xs font-light tracking-[0.3em] text-houma-gold mb-6">SUPPORT</h4>
            <ul className="space-y-3">
              {footerLinks.customer.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-sm text-houma-white/70 hover:text-houma-gold transition-colors duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          className="border-t border-houma-gold/20 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-8 mb-6 md:mb-0">
              {footerLinks.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-houma-white/50 hover:text-houma-gold transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Bottom Text */}
            <div className="text-center md:text-right">
              <p className="text-xs text-houma-white/30">
                © 2024 HOUMA. All rights reserved. | Crafted with pride in MENA
              </p>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-20 bg-gradient-to-b from-houma-gold/20 to-transparent"
          initial={{ height: 0 }}
          whileInView={{ height: 80 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />
      </div>
    </footer>
  )
}

export default Footer
