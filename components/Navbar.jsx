'use client'

import { Bell, User, Menu, LogOut, Settings, UserCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { mockUsers } from '@/lib/mockData'

const Navbar = ({ onMenuClick }) => {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    if (userRole === 'admin') {
      setCurrentUser({ name: 'Admin User', email: 'admin@ncip.gov.ph', role: 'Administrator' })
    } else if (userRole === 'staff') {
      setCurrentUser({ name: 'Staff Member', email: 'staff@ncip.gov.ph', role: 'Staff' })
    } else {
      setCurrentUser({ name: 'User Account', email: 'user@ncip.gov.ph', role: 'User' })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    router.push('/login')
  }

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-border shadow-sm flex items-center justify-between px-4 md:px-6 z-20">
      {/* Left side - Menu button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gold-accent hover:text-dark-navy hover:shadow-md rounded-lg transition-all duration-300 transform hover:scale-110"
          title="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Right side - Icons and user menu */}
      <div className="flex items-center gap-2 md:gap-4 relative">
        <button className="p-2 hover:bg-gold-accent hover:text-dark-navy hover:shadow-md rounded-lg transition-all duration-300 transform hover:scale-110" title="Notifications">
          <Bell size={20} className="text-foreground" />
        </button>
        
        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 hover:bg-gold-accent hover:text-dark-navy hover:shadow-md rounded-lg transition-all duration-300 transform hover:scale-110"
            title="User profile"
          >
            <User size={20} className="text-foreground" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-border rounded-lg shadow-lg z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-border bg-accent">
                <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground break-all">{currentUser.email}</p>
                <p className="text-xs text-muted-foreground mt-1">{currentUser.role}</p>
              </div>

              {/* Menu Items */}
              <Link href="/profile">
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent transition-smooth text-left"
                >
                  <UserCircle size={18} />
                  <span>View Profile</span>
                </button>
              </Link>

              <Link href="/account">
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent transition-smooth text-left border-t border-border"
                >
                  <Settings size={18} />
                  <span>Account Settings</span>
                </button>
              </Link>

              <button
                onClick={() => {
                  handleLogout()
                  setIsDropdownOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-smooth text-left border-t border-border"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
