 'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'
import { Toaster } from './ui/toaster'

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState('light')

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    try {
      const t = localStorage.getItem('theme') || 'light'
      setTheme(t)
      if (t === 'navy') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (e) {
      // ignore
    }
  }, [])

  // No longer open info cards as modals - navigate to /about instead

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex flex-1">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col w-full lg:ml-64">
          <Navbar onMenuClick={toggleSidebar} />
          <main className="flex-1 overflow-auto mt-16">
            <div className="p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  )
}

export default AppLayout
