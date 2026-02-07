'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Archive,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'

const Sidebar = () => {
  const pathname = usePathname()

  const isActive = (href) => pathname === href

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Book Catalog', href: '/books', icon: BookOpen },
    { label: 'Borrowing', href: '/borrowing', icon: BookOpen },
    { label: 'Members', href: '/members', icon: Users },
    { label: 'Indigenous Archive', href: '/archive', icon: Archive },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
    { label: 'Admin Panel', href: '/admin', icon: Settings },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold">NCIP</h1>
        <p className="text-sm text-sidebar-foreground/70">Library System</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                    : 'text-sidebar-foreground hover:bg-sidebar-primary/10'
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
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-primary/10 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
