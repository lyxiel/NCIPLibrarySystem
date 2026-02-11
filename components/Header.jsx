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
              {/* Logo only for landing page to keep header minimal */}
              <Logo />
            </div>
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
