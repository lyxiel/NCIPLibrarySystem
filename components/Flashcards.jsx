"use client"

import { useState } from 'react'
import Link from 'next/link'

const cardsData = [
  { title: 'Core Value — Altruism', body: 'We emphasize selfless concern for the well-being of others, prioritizing acts of kindness, generosity, and service to create positive impact.' },
  { title: 'Core Value — Trust', body: 'We are reliable, honest, and dependable. Commitments are met to build confidence and mutual respect.' },
  { title: 'Core Value — Nurturing', body: 'We foster an environment where employees are supported and encouraged to grow personally and professionally.' },
  { title: 'Core Value — Culture-Sensitive', body: 'We recognize and value diverse backgrounds and traditions, fostering respectful dialogue and understanding.' },
  { title: 'Core Value — Integrity', body: 'We uphold probity, ethical behavior, transparency, and fairness in all actions and communications.' },
  { title: 'Core Value — Professionalism', body: 'We adhere to the highest standards of behavior and performance, demonstrating competence and teamwork.' },
  { title: 'Mandate', body: 'Protect and promote the interest and well-being of Indigenous Cultural Communities/Indigenous Peoples, respecting their beliefs, customs, and institutions.' },
  { title: 'Vision (2040)', body: 'All ICCs/IPs fully empowered; rights fulfilled; cultural heritage preserved; ancestral domains sustainably protected; active participation in nation-building.' },
  { title: 'Mission', body: "A trusted partner and lead advocate of ICCs/IPs in upholding their rights and well-being as enshrined in the Indigenous Peoples’ Rights Act." },
]

export default function Flashcards({ className = '' }) {
  const [index, setIndex] = useState(0)

  const next = () => setIndex((i) => (i + 1) % cardsData.length)
  const prev = () => setIndex((i) => (i - 1 + cardsData.length) % cardsData.length)

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <h1 className="text-3xl font-bold mb-4 text-center">About NCIP</h1>
      <p className="text-center text-muted-foreground mb-6">A brief summary of core values, mandate, vision, and mission.</p>

      <div className="relative">
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[160px] flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">{cardsData[index].title}</h2>
            <p className="text-sm text-muted-foreground">{cardsData[index].body}</p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <button onClick={prev} className="px-3 py-1 rounded bg-card hover:bg-accent">Previous</button>
              <button onClick={next} className="px-3 py-1 rounded bg-primary text-white">Next</button>
            </div>
            <div className="text-sm text-muted-foreground">{index + 1} / {cardsData.length}</div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link href="/login">
            <a className="px-4 py-2 rounded bg-secondary text-white">Login</a>
          </Link>
          <Link href="/dashboard">
            <a className="px-4 py-2 rounded border border-border text-foreground">Dashboard</a>
          </Link>
        </div>
      </div>
    </div>
  )
}
