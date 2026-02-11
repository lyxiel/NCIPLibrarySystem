'use client'

import { useEffect, useState } from 'react'
import Flashcards from '@/components/Flashcards'
import Footer from '@/components/Footer'
import InfoModal from '@/components/InfoModal'

export default function Page() {
  const [isClient, setIsClient] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('about')

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    function onOpenInfoCard(e) {
      const type = e?.detail?.type || 'about'
      setModalType(type)
      setModalOpen(true)
    }
    window.addEventListener('openInfoCard', onOpenInfoCard)
    return () => window.removeEventListener('openInfoCard', onOpenInfoCard)
  }, [])

  // Background image with light overlay (70-85% white/gray) for black text readability
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 min-h-screen w-full relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://beyondpesticides.org/dailynewsblog/wp-content/uploads/2023/10/DN-10.6.23-1024x576.png')" }}
          aria-hidden
        />

        {/* Light overlay gradient (70-85% white/gray) for black text readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.75), rgba(250,250,250,0.80) 40%, rgba(248,248,248,0.75) 80%, rgba(255,255,255,0.70) 100%)' }}
          aria-hidden
        />

        <div className="relative z-10">
          <Flashcards />
        </div>
      </main>
      <Footer />
      <InfoModal open={modalOpen} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  )
}
