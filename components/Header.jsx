'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import Link from 'next/link'
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

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/about" className="px-4 py-2 rounded-md font-semibold text-[#0B3C5D] hover:text-white hover:bg-[#0B3C5D] transition-all duration-200">
                About
              </Link>
              <Link href="/books" className="px-4 py-2 rounded-md font-semibold border-2 border-[#0B3C5D] text-[#0B3C5D] hover:bg-[#0B3C5D] hover:text-white transition-all duration-200">
                Browse Materials
              </Link>
              <Link href="/login" className="px-4 py-2 rounded-md font-semibold bg-[#0B3C5D] text-white hover:bg-[#083244] transition-all duration-200">
                Login / Sign In
              </Link>
            </nav>

            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-[#0B3C5D] hover:bg-gray-100">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile menu panel */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 pb-4">
              <div className="flex flex-col gap-2">
                <Link href="/about" className="block px-4 py-2 rounded-md font-semibold text-[#0B3C5D] hover:bg-gray-50">About</Link>
                <Link href="/books" className="block px-4 py-2 rounded-md font-semibold text-[#0B3C5D] hover:bg-gray-50">Browse Materials</Link>
                <Link href="/login" className="block px-4 py-2 rounded-md font-semibold bg-[#0B3C5D] text-white">Login / Sign In</Link>
              </div>
            </div>
          )}
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
