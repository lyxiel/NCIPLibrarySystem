'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Flashcards from '@/components/Flashcards'

export default function Page() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const logged = !!localStorage.getItem('isLoggedIn')
    setIsLoggedIn(logged)
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full px-4 py-12">
        <Flashcards />
      </div>
    </main>
  )
}
