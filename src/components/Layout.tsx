import React, { ReactNode } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import Cart from './Cart'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-houma-black">
      <Navigation />
      <Cart />
      <main className="relative">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
