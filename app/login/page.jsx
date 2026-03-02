'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      let userRole = 'user' // default role
      
      // Try to get user role from Firestore (optional)
      try {
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          userRole = userDoc.data().role || 'user'
        }
      } catch (firestoreErr) {
        console.warn('Could not fetch user role from Firestore:', firestoreErr)
        // Fallback: determine role from email domain
        if (email.includes('admin@')) {
          userRole = 'admin'
        } else if (email.includes('staff@')) {
          userRole = 'staff'
        }
      }
      
      // Store user info in localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userRole', userRole)
      localStorage.setItem('token', await user.getIdToken())
      localStorage.setItem('uid', user.uid)
      if (remember) localStorage.setItem('rememberEmail', email)
      
      // Redirect based on role
      if (userRole === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.')
      } else {
        setError('Authentication failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const autofillUser = (role) => {
    const mockUsers = {
      admin: { email: 'admin@ncip.gov.ph', password: 'admin123' },
      staff: { email: 'staff@ncip.gov.ph', password: 'staff123' },
      user: { email: 'user@ncip.gov.ph', password: 'user123' },
    }
    if (mockUsers[role]) {
      setEmail(mockUsers[role].email)
      setPassword(mockUsers[role].password)
      setError('')
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-[hsl(var(--primary))] bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent-blue))] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Form Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <img src="/Logo/R.png" alt="NCIP Logo" className="h-16 w-16 object-contain" />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">NCIP</h1>
            <p className="text-foreground text-sm">Library Management System</p>
            <p className="text-muted-foreground text-xs mt-1">National Commission on Indigenous Peoples</p>
          </div>

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
