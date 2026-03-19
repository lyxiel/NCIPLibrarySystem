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

  return (
    <section className={`min-h-screen w-full ${className}`}>
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
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link href="/books">
              <button className="px-6 py-3 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-gold-accent transition">Browse Materials</button>
            </Link>
            <Link href="/about">
              <button className="px-6 py-3 bg-background text-foreground rounded-lg border border-border hover:bg-accent transition">Learn more</button>
            </Link>
          </div>
        </div>

        {/* About Flash Cards Grid */}
          <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">About NKLS</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
                <Link
                  href={`/about#${c.key}`}
                  key={c.key}
                  className="relative block text-left p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 active:scale-95 cursor-pointer overflow-hidden group bg-white"
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
                </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

