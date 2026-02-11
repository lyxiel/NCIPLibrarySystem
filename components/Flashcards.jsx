"use client"

import Link from 'next/link'
import { BookOpen, Shield, Globe, Users } from 'lucide-react'

const cards = [
  { key: 'mandate', title: 'Mandate', body: 'Protect and promote the well-being of ICCs/IPs', icon: Shield },
  { key: 'vision', title: 'Vision', body: 'A resilient and culturally grounded library network', icon: Globe },
  { key: 'mission', title: 'Mission', body: 'Support access, preservation, and community-led stewardship', icon: BookOpen },
  { key: 'corevalues', title: 'Core Values', body: 'Altruism, Trust, Nurturing, Culture-Sensitive, Integrity, Professionalism', icon: Users },
]

export default function Flashcards({ className = '' }) {
  const openCard = (key) => {
    window.dispatchEvent(new CustomEvent('openInfoCard', { detail: { type: key } }))
  }

  return (
    <section className={`min-h-screen w-full ${className}`}>
      {/* Top Navigation - About, Browse Materials, Login */}
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-end gap-4 items-center">
        <button
          onClick={() => openCard('about')}
          className="px-5 py-2 rounded-md font-semibold text-black hover:text-[#0B3C5D] transition-all duration-200 hover:shadow-md active:scale-95 cursor-pointer"
        >
          About
        </button>
        <Link
          href="/books"
          className="px-5 py-2 rounded-md font-semibold border-2 border-[#0B3C5D] text-black hover:bg-[#0B3C5D] hover:text-white transition-all duration-200 hover:shadow-md active:scale-95 cursor-pointer"
        >
          Browse Materials
        </Link>
        <Link
          href="/login"
          className="px-5 py-2 rounded-md font-semibold text-white transition-all duration-200 hover:shadow-md active:scale-95 cursor-pointer"
          style={{ backgroundColor: '#0B3C5D' }}
        >
          Login / Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-black">
            NCIP Knowledge and Library System
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-black/90 mb-6">
            Preserving Indigenous Knowledge, Protecting Cultural Heritage
          </p>
          <p className="mt-4 text-lg md:text-xl text-black/80 max-w-2xl mx-auto leading-relaxed">
            A comprehensive digital repository dedicated to safeguarding and promoting Indigenous knowledge systems, cultural heritage, and community resources with respect and dignity.
          </p>
        </div>

        {/* About Flash Cards Grid */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">About NKLS</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <button
                key={c.key}
                onClick={() => openCard(c.key)}
                className="text-left p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 active:scale-95 cursor-pointer overflow-hidden group"
                style={{ backgroundColor: '#FFF' }}
              >
                {/* Gold top border accent */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: '#CFAE70' }} />
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg transition-all duration-300 group-hover:shadow-md" style={{ backgroundColor: '#0B3C5D', color: '#CFAE70' }}>
                    <c.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: '#0B3C5D' }}>{c.title}</h3>
                </div>
                <p className="text-black/80 leading-relaxed text-sm">{c.body}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

