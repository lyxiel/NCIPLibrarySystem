'use client'

import { Bell, User, Menu, LogOut, Settings, UserCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { mockUsers } from '@/lib/mockData'

const Navbar = ({ onMenuClick }) => {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
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
    setIsDropdownOpen(false)
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
        {/* Notification Button */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="p-2 hover:bg-gold-accent hover:text-dark-navy hover:shadow-md rounded-lg transition-all duration-300 transform hover:scale-110" 
            title="Notifications"
          >
            <Bell size={20} className="text-foreground" />
          </button>
          
          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-border rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b border-border bg-accent">
                <p className="text-sm font-semibold text-foreground">Notifications</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-accent transition-smooth text-left border-b border-border/50">
                  <p className="text-sm font-medium text-foreground">Book Available</p>
                  <p className="text-xs text-muted-foreground mt-1">The book you reserved is now available for pickup.</p>
                  <p className="text-xs text-muted-foreground mt-2">Today at 10:30 AM</p>
                </div>
                <div className="px-4 py-3 hover:bg-accent transition-smooth text-left border-b border-border/50">
                  <p className="text-sm font-medium text-foreground">Borrowing Due Soon</p>
                  <p className="text-xs text-muted-foreground mt-1">Your borrowed book is due in 3 days.</p>
                  <p className="text-xs text-muted-foreground mt-2">Yesterday at 2:15 PM</p>
                </div>
                <div className="px-4 py-3 hover:bg-accent transition-smooth text-left">
                  <p className="text-sm font-medium text-foreground">System Update</p>
                  <p className="text-xs text-muted-foreground mt-1">New materials have been added to the library.</p>
                  <p className="text-xs text-muted-foreground mt-2">2 days ago</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
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
                <p className="text-sm font-medium text-foreground">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground break-all">{currentUser?.email}</p>
                <p className="text-xs text-muted-foreground mt-1">{currentUser?.role}</p>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  router.push('/profile')
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent transition-smooth text-left"
              >
                <UserCircle size={18} />
                <span>View Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  router.push('/account')
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent transition-smooth text-left border-t border-border"
              >
                <Settings size={18} />
                <span>Account Settings</span>
              </button>

              <button
                onClick={handleLogout}
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
