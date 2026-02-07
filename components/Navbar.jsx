'use client'

import { Bell, User, Menu } from 'lucide-react'

const Navbar = ({ onMenuClick }) => {
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
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 hover:bg-gold-accent hover:text-dark-navy hover:shadow-md rounded-lg transition-all duration-300 transform hover:scale-110" title="Notifications">
          <Bell size={20} className="text-foreground" />
        </button>
        <button className="p-2 hover:bg-gold-accent hover:text-dark-navy hover:shadow-md rounded-lg transition-all duration-300 transform hover:scale-110" title="User profile">
          <User size={20} className="text-foreground" />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
