'use client'

import Link from 'next/link'
import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold-accent">NKLS</h3>
            <p className="text-sm text-slate-300 mb-4">
              NCIP Knowledge & Library System - Preserving Indigenous Knowledge, Protecting Cultural Heritage.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 hover:bg-gold-accent hover:text-slate-900 rounded-lg transition-colors" title="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 hover:bg-gold-accent hover:text-slate-900 rounded-lg transition-colors" title="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 hover:bg-gold-accent hover:text-slate-900 rounded-lg transition-colors" title="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-gold-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openInfoCard', { detail: { type: 'mandate' } })) }}
                  className="text-slate-300 hover:text-gold-accent transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Mandate
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openInfoCard', { detail: { type: 'vision' } })) }}
                  className="text-slate-300 hover:text-gold-accent transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Vision
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openInfoCard', { detail: { type: 'mission' } })) }}
                  className="text-slate-300 hover:text-gold-accent transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Mission
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openInfoCard', { detail: { type: 'corevalues' } })) }}
                  className="text-slate-300 hover:text-gold-accent transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Core Values
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4 text-gold-accent">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-slate-300 hover:text-gold-accent transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-gold-accent transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-gold-accent transition-colors">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-gold-accent transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4 text-gold-accent">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="flex-shrink-0 mt-0.5 text-gold-accent" />
                <span className="text-slate-300">
                  NCIP Central Office<br />
                  Quezon City, Philippines
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gold-accent" />
                <a href="tel:+639123456789" className="text-slate-300 hover:text-gold-accent transition-colors">
                  +63 (2) 1234-5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gold-accent" />
                <a href="mailto:info@ncip.gov.ph" className="text-slate-300 hover:text-gold-accent transition-colors">
                  info@ncip.gov.ph
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © {currentYear} NCIP Knowledge & Library System. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-gold-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-gold-accent transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-gold-accent transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
