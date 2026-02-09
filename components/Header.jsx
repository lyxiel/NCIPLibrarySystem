'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    setMounted(true)
    // Only read localStorage on client side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole')
      setUserRole(role)
    }
  }, [])

  if (!mounted) return null

  // Landing page: full header with navigation
  if (isLandingPage) {
    return (
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="/books" className="text-navy hover:text-gold-accent transition-colors link-underline">
                Library
              </a>
              {userRole ? (
                <a href="/login" className="text-navy hover:text-gold-accent transition-colors link-underline">
                  Logout
                </a>
              ) : (
                <a href="/login" style={{ background: 'linear-gradient(to right,#CFAE70,#FFD36A)', color: '#072A40' }} className="px-4 py-2 rounded-md font-semibold link-underline">
                  Login
                </a>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2 border-t border-gray-200">
              <a href="/books" className="block px-4 py-2 text-navy hover:bg-gray-100 rounded-md">
                Library
              </a>
              {userRole ? (
                <a href="/login" className="block px-4 py-2 text-navy hover:bg-gray-100 rounded-md">
                  Logout
                </a>
              ) : (
                <a href="/login" className="block px-4 py-2 text-navy hover:bg-gray-100 rounded-md font-semibold">
                  Login
                </a>
              )}
            </nav>
          )}
        </div>
      </header>
    )
  }

  // All other pages: logo only, minimal header
  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <Logo />
    </header>
  )
}
