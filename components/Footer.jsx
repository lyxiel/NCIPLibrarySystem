'use client'

import Link from 'next/link'
import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-lg font-bold mb-2 text-gold-accent">NCIP I-LEARN SYSTEM</h3>
            <p className="text-sm text-slate-300">
              Indigenous Library, Education, Archive, and Resource Network — preserving indigenous knowledge and cultural heritage.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2 text-gold-accent">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="flex-shrink-0 mt-0.5 text-gold-accent" />
                <span>
                  NCIP Central Office, Quezon City
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gold-accent" />
                <a href="tel:+639123456789" className="hover:text-gold-accent transition-colors">+63 (2) 1234-5678</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gold-accent" />
                <a href="mailto:info@ncip.gov.ph" className="hover:text-gold-accent transition-colors">info@ncip.gov.ph</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-6 pt-4">
          <p className="text-xs text-slate-400 text-center">© {currentYear} NCIP I-LEARN SYSTEM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
