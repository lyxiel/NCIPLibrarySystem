'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [remember, setRemember] = useState(false)
  const [role, setRole] = useState('user')
  const [affiliation, setAffiliation] = useState('')
  const [nextPath, setNextPath] = useState('')

  useEffect(() => {
    try {
      const mode = searchParams?.get('mode')
      const next = searchParams?.get('next')
      if (mode === 'signup') setIsSignUp(true)
      if (mode === 'signin') setIsSignUp(false)
      if (next) setNextPath(next)
    } catch (e) {
      // ignore in SSR/no-search param environment
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password || (isSignUp && !name)) {
      setError('Please enter name, email and password')
      return
    }

    if (isSignUp && role === 'researcher' && !affiliation) {
      setError('Please provide your affiliation or credentials for researcher role')
      return
    }

    setLoading(true)
    try {
      let userCredential
      let user
      if (isSignUp) {
        // Create new user
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
        user = userCredential.user

        // Create user profile in Firestore
        const userDocRef = doc(db, 'users', user.uid)
        await setDoc(userDocRef, {
          uid: user.uid,
          name,
          email,
          role: role || 'user',
          affiliation: affiliation || '',
          createdAt: serverTimestamp(),
        })
      } else {
        // Sign in existing user
        userCredential = await signInWithEmailAndPassword(auth, email, password)
        user = userCredential.user
      }

      let userRole = 'user'
      try {
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) userRole = userDoc.data().role || 'user'
      } catch (firestoreErr) {
        console.warn('Could not fetch user role from Firestore:', firestoreErr)
        if (email.includes('admin@')) userRole = 'admin'
        else if (email.includes('staff@')) userRole = 'staff'
      }

      // Store user info in localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userRole', userRole)
      localStorage.setItem('token', await user.getIdToken())
      localStorage.setItem('uid', user.uid)
      if (remember) localStorage.setItem('rememberEmail', email)

      // Redirect: respect `next` param when present
      if (nextPath) {
        router.push(nextPath)
        return
      }

      if (userRole === 'admin') router.push('/admin')
      else router.push('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please sign in instead.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.')
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
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
            <img src="/Logo/ncip-office-logo.png" alt="NCIP Office on Policy, Planning & Research" className="h-16 w-16 object-contain" />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">NCIP</h1>
            <p className="text-foreground text-sm">Library Management System</p>
            <p className="text-muted-foreground text-xs mt-1">NCIP Office on Policy, Planning & Research</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mode Toggle */}
            <div className="text-sm text-center mb-2">
              {isSignUp ? (
                <>
                  <span>Already have an account?</span>
                  <button type="button" onClick={() => { setIsSignUp(false); setError('') }} className="ml-2 text-primary underline">Sign in</button>
                </>
              ) : (
                <>
                  <span>Don't have an account?</span>
                  <button type="button" onClick={() => { setIsSignUp(true); setError('') }} className="ml-2 text-primary underline">Sign up</button>
                </>
              )}
            </div>

            {/* Name Field for Sign Up */}
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Juan Dela Cruz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">Role</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  >
                    <option value="user">Community Member</option>
                    <option value="researcher">Researcher</option>
                  </select>
                </div>

                {role === 'researcher' && (
                  <div>
                    <label htmlFor="affiliation" className="block text-sm font-medium text-foreground mb-2">Affiliation / Institution</label>
                    <input
                      id="affiliation"
                      type="text"
                      placeholder="University / Organization"
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    />
                  </div>
                )}
              </>
            )}
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

            {/* Login / Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-gold-accent hover:text-dark-navy hover:shadow-lg hover:scale-105 transition-all duration-300 transform active:scale-95 mt-6 ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
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
