'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole, hasAccess, getUserRole } from '@/lib/roles'

export function useRouteProtection(requiredAccess?: string[]) {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userRole = localStorage.getItem('userRole') as UserRole

    // Not logged in - redirect to login
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    // Check role-based access
    if (requiredAccess && userRole) {
      const hasRequiredAccess = requiredAccess.some((access) =>
        hasAccess(userRole, access)
      )

      if (!hasRequiredAccess) {
        // User doesn't have access to this page
        router.push('/unauthorized')
      }
    }
  }, [router, requiredAccess])
}

export function useCheckRole() {
  const userRole = typeof window !== 'undefined' ? (localStorage.getItem('userRole') as UserRole) : 'user'
  return userRole || 'user'
}
