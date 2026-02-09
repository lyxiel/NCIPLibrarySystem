"use client"

import Link from 'next/link'
import { BookOpen, Shield, Star, Globe, Users, Heart, LogIn, Grid } from 'lucide-react'

const cards = [
  { title: 'Mandate', body: 'Preserve and protect Indigenous cultural heritage and knowledge systems.', icon: Shield },
  { title: 'Vision', body: 'A resilient and culturally grounded library network for Indigenous communities.', icon: Globe },
  { title: 'Mission', body: 'Support access, preservation, and community-led stewardship of materials.', icon: BookOpen },
  { title: 'Core Values', body: 'Respect, Reciprocity, Community, Stewardship, Responsibility.', icon: Users },
  { title: 'Access', body: 'Rights to use, learn from, and share cultural resources with dignity.', icon: BookOpen },
  { title: 'Protection', body: 'Safeguard culturally sensitive materials and respect Free, Prior, Informed Consent.', icon: Star },
]

export default function Flashcards({ className = '' }) {
  return (
    <section className={`max-w-7xl mx-auto py-24 px-4 ${className}`}>
      <div className="max-w-3xl mx-auto text-center mb-12 text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">NCIP Library System</h1>
        <p className="mt-4 text-lg md:text-xl opacity-90">Protecting and promoting Indigenous knowledge, culture, and community rights.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-4 mb-3">
              <div style={{ backgroundColor: 'rgba(11,60,93,0.8)', color: '#CFAE70' }} className="p-2 rounded-md">
                <c.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">{c.title}</h3>
            </div>
            <p className="text-sm opacity-85 text-white leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/login" style={{ background: 'linear-gradient(to right,#CFAE70,#FFD36A)', color: '#072A40' }} className="px-6 py-3 rounded-md font-semibold shadow-lg link-underline cta-navy">Login</Link>
        <Link href="/dashboard" className="px-6 py-3 rounded-md border border-white/20 text-white link-underline">Dashboard</Link>
        <Link href="/books" className="px-6 py-3 rounded-md bg-transparent text-white/90 border border-white/10 link-underline">View Materials</Link>
      </div>
    </section>
  )
}

