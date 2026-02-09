'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Archive,
  BarChart3,
  Settings,
  LogOut,
  X,
  UserCircle,
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname()
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [userRole, setUserRole] = useState('user')

  useEffect(() => {
    setMounted(true)
    try {
      const role = localStorage.getItem('userRole') || 'user'
      setUserRole(role)
    } catch (e) {
      setUserRole('user')
    }
  }, [])

  const isActive = (href) => pathname === href

  // Avoid rendering role-dependent menu on server to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  // ADMIN: Can manage account and system only
  const adminMenuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Admin Panel', href: '/admin', icon: Settings },
    { label: 'My Profile', href: '/profile', icon: UserCircle },
    { label: 'Account Settings', href: '/account', icon: Settings },
  ]

  // STAFF: Can do CRUD operations
  const staffMenuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Library Materials', href: '/books', icon: BookOpen },
    { label: 'Borrowing', href: '/borrowing', icon: BookOpen },
    { label: 'Members', href: '/members', icon: Users },
    { label: 'Indigenous Archive', href: '/archive', icon: Archive },
    { label: 'IKSP/CL', href: '/iksp-cl', icon: Archive },
    { label: 'My Profile', href: '/profile', icon: UserCircle },
    { label: 'Account Settings', href: '/account', icon: Settings },
  ]

  // USER: Can borrow and read only
  const userMenuItems = [
    { label: 'Browse Books', href: '/books', icon: BookOpen },
    { label: 'My Borrowings', href: '/borrowing', icon: BookOpen },
    { label: 'Indigenous Archive', href: '/archive', icon: Archive },
    { label: 'My Profile', href: '/profile', icon: UserCircle },
    { label: 'Account Settings', href: '/account', icon: Settings },
  ]

  const getMenuItems = () => {
    if (userRole === 'admin') return adminMenuItems
    if (userRole === 'staff') return staffMenuItems
    return userMenuItems
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    localStorage.removeItem('rememberEmail')
    router.push('/login')
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex-col border-r border-sidebar-border z-40">
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
          <img src="/oppr.svg" alt="OPPR - NCIP" className="w-16 h-16 object-contain rounded-md" />
          <div>
            <h1 className="text-lg font-bold">NCIP</h1>
            <p className="text-xs text-sidebar-foreground/70">Office of Policy, Planning & Research</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 transform ${
                    active
                      ? 'bg-sidebar-accent text-white font-semibold shadow-lg'
                      : 'text-sidebar-foreground hover:bg-gold-accent hover:text-dark-navy hover:shadow-md hover:translate-x-1'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-gold-accent hover:text-dark-navy hover:shadow-md hover:translate-x-1 transition-all duration-300 transform">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border z-40 transform transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">NCIP</h1>
            <p className="text-sm text-sidebar-foreground/70">Library System</p>
          </div>
          <button onClick={onClose} className="lg:hidden">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 transform ${
                    active
                      ? 'bg-sidebar-accent text-white font-semibold shadow-lg'
                      : 'text-sidebar-foreground hover:bg-gold-accent hover:text-dark-navy hover:shadow-md hover:translate-x-1'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-gold-accent hover:text-dark-navy hover:shadow-md hover:translate-x-1 transition-all duration-300 transform">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
