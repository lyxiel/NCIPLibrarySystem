'use client'

import { useEffect, useState } from 'react'
import { X, Info, AlertTriangle, CheckCircle, Lock, Star } from 'lucide-react'

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: Lock,
  iksp: Star,
}

const Banner = ({
  type = 'info',
  title,
  message,
  onClose,
  dismiss = 0,
  sticky = false,
  fullWidth = false,
  onClick,
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let t
    if (dismiss && dismiss > 0) {
      t = setTimeout(() => setVisible(false), dismiss)
    }
    return () => clearTimeout(t)
  }, [dismiss])

  useEffect(() => {
    if (!visible && onClose) onClose()
  }, [visible, onClose])

  if (!visible) return null

  const Icon = ICONS[type] || Info

  const typeClasses = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    iksp: 'bg-purple-100 text-purple-700',
    announce: 'bg-[hsl(205,54%,20%)] text-white',
  }

  return (
    <div
      className={`${
        fullWidth ? 'w-full' : 'w-auto'
      } ${typeClasses[type] || typeClasses.info} rounded-lg shadow-md p-4 transition-smooth animate-fade-in ${
        sticky ? 'sticky top-0 z-50' : ''
      }`} 
      role="status"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Icon size={20} />
        </div>
        <div className="flex-1">
          {title && <div className="font-semibold">{title}</div>}
          {message && <div className="text-sm mt-1">{message}</div>}
        </div>
        <div>
          <button
            onClick={() => setVisible(false)}
            className="p-2 rounded hover:bg-black/5 transition"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Banner
