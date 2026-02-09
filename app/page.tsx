'use client'

import { useEffect, useState } from 'react'
import Flashcards from '@/components/Flashcards'

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Background image - replace /placeholder.svg with a better NCIP-themed image in /public
  return (
    <main className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://beyondpesticides.org/dailynewsblog/wp-content/uploads/2023/10/DN-10.6.23-1024x576.png')" }}
        aria-hidden
      />

      {/* Navy overlay gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(7,42,64,0.7), rgba(7,42,64,0.25) 40%, rgba(7,42,64,0.05) 80%, transparent 100%)' }}
        aria-hidden
      />

      <div className="relative z-10">
        <Flashcards />
      </div>
    </main>
  )
}
