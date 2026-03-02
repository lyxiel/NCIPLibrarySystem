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

  // Landing page: full header with navigation (About, Browse Materials, Login)
  if (isLandingPage) {
    return (
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo on the left (smaller) */}
            <Logo />

            {/* Top-right navigation for landing only */}
            <nav className="flex items-center gap-3">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openInfoCard', { detail: { type: 'about' } }))}
                className="px-3 py-1.5 rounded-md font-semibold text-sm text-black hover:text-[#0B3C5D] transition-all duration-200 hover:shadow-sm active:scale-95 cursor-pointer"
              >
                About
              </button>

              <a href="/books" className="px-3 py-1.5 rounded-md text-sm font-semibold border-2 border-[#0B3C5D] text-black hover:bg-[#0B3C5D] hover:text-white transition-all duration-200 hover:shadow-sm active:scale-95 cursor-pointer">Browse Materials</a>

              <a href="/login" className="px-3 py-1.5 rounded-md text-sm font-semibold text-white transition-all duration-200 hover:shadow-sm active:scale-95 cursor-pointer" style={{ backgroundColor: '#0B3C5D' }}>
                Login / Sign In
              </a>
            </nav>
          </div>
        </div>
      </header>
    )
  }

  // All other pages: show large logo only on public pages (no logged-in user)
  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center bg-white/0">
      {(!userRole || userRole === null) && <Logo large />}
    </header>
  )
}
