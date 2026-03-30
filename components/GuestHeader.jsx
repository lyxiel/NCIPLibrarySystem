'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, X } from 'lucide-react'

export default function GuestHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(!!loggedIn)
  }, [])

  if (isLoggedIn || !isVisible) return null

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 md:py-4 flex items-start md:items-center justify-between gap-3">
      <div className="flex items-start md:items-center gap-3 flex-1">
        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5 md:mt-0" size={20} />
        <div className="flex-1">
          <p className="text-sm md:text-base text-blue-900 font-medium">Browsing as Guest</p>
          <p className="text-xs md:text-sm text-blue-700 mt-1">You can browse our library materials freely. Use the header buttons to sign in or browse materials.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => setIsVisible(false)} className="p-2 hover:bg-blue-200 rounded-lg transition-colors text-blue-600" title="Close">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
