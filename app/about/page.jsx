'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BookOpen, Shield, Users, Globe, Target, Heart, Clock, Lock, Eye, FileText, Layers, Zap } from 'lucide-react'

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const sections = [
    {
      id: 'about',
      title: 'About the System',
      icon: BookOpen,
      description: 'NCIP Knowledge and Library System (NKLS)',
      content: 'NKLS is a comprehensive digital repository dedicated to safeguarding and promoting Indigenous knowledge systems, cultural heritage, and community resources with respect and dignity. Our mission is to ensure that Indigenous knowledge remains under community control while being accessible to those who benefit from it.',
      background: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    {
      id: 'access',
      title: 'Who Can Access',
      icon: Users,
      description: 'User Roles & Capabilities',
      content: 'NKLS serves guests, community members, researchers, staff, and administrators. Guests can browse all public materials without logging in. Registered members gain access to borrowing, and staff/administrators manage system content and operations.',
      background: 'bg-gradient-to-br from-slate-50 to-slate-100'
    },
    {
      id: 'browse',
      title: 'How to Browse',
      icon: Eye,
      description: 'Exploring Materials',
      content: 'Begin by navigating to Browse Materials from the landing page. Use search and filter tools to find items by title, author, subject, or category. All public materials are accessible anytime, 24/7, without requiring authentication.',
      background: 'bg-gradient-to-br from-emerald-50 to-emerald-100'
    },
    {
      id: 'capabilities',
      title: 'Guest vs Logged-in',
      icon: Lock,
      description: 'Feature Access Levels',
      content: 'Guests: Browse public materials, search, filter, view details. Logged-in Members: All guest features plus borrowing, personal library, tracking, renewals, and access to restricted materials based on permissions. Login is seamless—borrow actions prompt authentication.',
      background: 'bg-gradient-to-br from-amber-50 to-amber-100'
    },
    {
      id: 'borrowing',
      title: 'Borrowing Flow',
      icon: Clock,
      description: 'Step-by-Step Process',
      content: '1. Browse and locate material. 2. Click Borrow. 3. Log in if needed. 4. Confirm request. 5. Track in your dashboard. Default borrowing period is 14 days for members. Renewals and extensions available based on material policies.',
      background: 'bg-gradient-to-br from-purple-50 to-purple-100'
    },
    {
      id: 'indicators',
      title: 'Material Indicators',
      icon: Layers,
      description: 'IKSP & Cultural Labels',
      content: 'Materials are labeled with indicators: IKSP (Indigenous Knowledge & Skills Program), CL (Cultural Legacy), Restricted, Sacred, or Public. Each label denotes access level and cultural protocols. Sacred and Restricted materials require FPIC (Free, Prior, Informed Consent).',
      background: 'bg-gradient-to-br from-pink-50 to-pink-100'
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-150784272343-583f20270319?w=1200&h=400&fit=crop')" }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(7,42,64,0.8), rgba(7,42,64,0.6) 50%, rgba(207,174,112,0.1) 100%)' }}
            aria-hidden
          />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
              About NKLS
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-3 font-semibold">
              NCIP Knowledge and Library System
            </p>
            <p className="text-lg md:text-xl text-white/80">
              Preserving Indigenous Knowledge, Protecting Cultural Heritage
            </p>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, idx) => {
              const IconComponent = section.icon
              return (
                <div
                  key={section.id}
                  className={`${section.background} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-default border border-white/60`}
                >
                  {/* Top Accent Line */}
                  <div className="h-1 w-12 mb-6" style={{ backgroundColor: '#CFAE70' }} />

                  {/* Header with Icon */}
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: '#0B3C5D', color: '#CFAE70' }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: '#0B3C5D' }}>
                        {section.title}
                      </h3>
                      <p className="text-sm text-black/60 font-medium">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-8 mb-4" style={{ backgroundColor: '#CFAE70' }} />

                  {/* Content */}
                  <p className="text-black/80 leading-relaxed text-sm md:text-base">
                    {section.content}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Key Features Section */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Key Features
            </h2>
            <div className="w-12 h-1 mx-auto mb-12" style={{ backgroundColor: '#CFAE70' }} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, title: 'Extensive Collection', desc: 'Thousands of Indigenous materials' },
                { icon: Shield, title: 'Cultural Protection', desc: 'FPIC & sensitivity protocols' },
                { icon: Users, title: 'Community-Focused', desc: 'Designed with communities' },
                { icon: Zap, title: '24/7 Access', desc: 'Always available online' }
              ].map((feature, idx) => {
                const IconComp = feature.icon
                return (
                  <div key={idx} className="p-6 bg-white/10 rounded-xl border border-white/20 hover:border-gold-accent/50 transition-all duration-300 backdrop-blur-sm">
                    <IconComp className="w-8 h-8 mb-3" style={{ color: '#CFAE70' }} />
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/75">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Cultural Sensitivity Section */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0B3C5D' }}>
            Cultural Sensitivity & Restricted Access
          </h2>
          <div className="w-12 h-1 mb-8" style={{ backgroundColor: '#CFAE70' }} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 border-l-4" style={{ borderColor: '#0B3C5D' }}>
              <div className="flex gap-3 mb-4">
                <Shield className="flex-shrink-0" style={{ color: '#0B3C5D' }} size={24} />
                <h3 className="text-lg font-bold" style={{ color: '#0B3C5D' }}>
                  Sacred Materials
                </h3>
              </div>
              <p className="text-black/80">
                Some materials are designated as sacred by their respective Indigenous communities. These require special consent protocols and may have restricted access to ensure cultural respect and protection.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-8 border-l-4" style={{ borderColor: '#CFAE70' }}>
              <div className="flex gap-3 mb-4">
                <Lock className="flex-shrink-0" style={{ color: '#CFAE70' }} size={24} />
                <h3 className="text-lg font-bold" style={{ color: '#0B3C5D' }}>
                  FPIC Protocol
                </h3>
              </div>
              <p className="text-black/80">
                Free, Prior, and Informed Consent ensures that communities authorize and control access to their materials. All users must agree to respect these designations when accessing restricted content.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-900 via-slate-800 to-slate-900 text-white py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Explore?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Discover the rich heritage and knowledge of Indigenous peoples. Start browsing our collection today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/books" 
                className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer hover:shadow-lg text-dark-navy"
                style={{ backgroundColor: '#CFAE70' }}
              >
                Browse Materials
              </a>
              <a 
                href="/login" 
                className="px-8 py-3 rounded-lg font-semibold border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
                style={{ borderColor: '#CFAE70', color: '#CFAE70' }}
              >
                Sign In / Register
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
