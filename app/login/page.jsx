'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)

  const mockUsers = [
    { role: 'admin', email: 'admin@ncip.gov.ph', password: 'admin123' },
    { role: 'staff', email: 'staff@ncip.gov.ph', password: 'staff123' },
    { role: 'user', email: 'user@ncip.gov.ph', password: 'user123' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    setLoading(true)
    // simulate async auth
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email && u.password === password)
      if (user) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', user.role)
        if (remember) localStorage.setItem('rememberEmail', email)
        router.push('/dashboard')
      } else {
        setError('Invalid credentials — try mock users below')
      }
      setLoading(false)
    }, 900)
  }

  const autofillUser = (u) => {
    setEmail(u.email)
    setPassword(u.password)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--primary))] bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-blue))] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">NCIP</h1>
          <p className="text-[rgba(255,255,255,0.9)] text-sm md:text-base">Library Management System</p>
          <p className="text-[rgba(255,255,255,0.85)] text-xs md:text-sm mt-2">National Commission on Indigenous Peoples</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <small className="text-xs text-[rgba(255,255,255,0.8)]">Quick mock users:</small>
            {mockUsers.map((u) => (
              <button
                key={u.role}
                onClick={() => autofillUser(u)}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-md transition"
              >
                {u.role}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
          <p className="text-muted-foreground mb-6">Sign in to access the library system</p>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@ncip.gov.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                Remember me
              </label>
              <a href="#" className="text-gold-accent hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-gold-accent hover:text-dark-navy hover:shadow-lg hover:scale-105 transition-all duration-300 transform active:scale-95 mt-6 ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            For system access, contact your administrator
          </p>
        </div>
      </div>
    </div>
  )
}
