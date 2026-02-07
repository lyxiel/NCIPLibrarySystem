'use client'

import { Bell, User, Menu } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-border shadow-sm flex items-center justify-between px-6 z-10">
      {/* Left side - Page title area */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden">
          <Menu size={24} />
        </button>
      </div>

      {/* Right side - Icons and user menu */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell size={20} className="text-foreground" />
        </button>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <User size={20} className="text-foreground" />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
