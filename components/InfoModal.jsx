'use client'

import { X, Globe, Shield, Zap, Target, Heart } from 'lucide-react'
import { useEffect } from 'react'

export default function InfoModal({ open, type, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  const contentMap = {
    about: {
      title: 'About the System',
      body: `NCIP Knowledge and Library System (NKLS)

What is NKLS?
NKLS is a comprehensive digital repository dedicated to safeguarding and promoting Indigenous knowledge systems, cultural heritage, and community resources with respect and dignity.

Who Can Use It?
• Guests: Browse materials without login
• Staff: Access tools for content management
• Administrators: System management and oversight
• Researchers: Access to scholarly resources

Guest Access
Guests can freely browse materials without signing in. Login is required only when you wish to borrow materials, track due dates, or perform other account-specific actions.

How to Browse Materials
1. Click "Browse Materials" on the landing page
2. Explore our collection of Indigenous knowledge, books, and cultural resources
3. Search or filter by category, author, or keywords
4. Click on any item to view details

How to Search and Filter
Use the search bar to find materials by title, author, or subject. Apply filters to narrow results by material type, cultural group, or access level.

How Borrowing Works
1. Select a material from the collection
2. Click "Borrow" to request the item
3. Log in or create an account if you haven't already
4. Confirm your borrowing request
5. Track your borrowed items in your profile

IKSP and CL Material Indicators
• IKSP: Indigenous Knowledge and Skills Program materials
• CL: Cultural Legacy resources
• Look for icons or labels indicating material type and access level

Cultural Sensitivity and Restricted Access
Certain materials are marked as restricted or sacred by their respective Indigenous communities. These materials may have special access requirements or usage guidelines. We respect all community protocols and cultural sensitivities in managing these resources.`, 
    },
    mandate: {
      title: 'MANDATE',
      body: `The NCIP shall protect and promote the interest and well-being of the Indigenous Cultural Communities/Indigenous Peoples with due regard to their beliefs, customs, traditions, and institutions.`,
    },
    vision: {
      title: 'VISION',
      body: `By 2040, all Philippine Indigenous Cultural Communities/Indigenous Peoples will be fully empowered, their rights genuinely fulfilled and realized, their cultural heritage observed, respected, and preserved, and their ancestral domains and land sustainably protected and developed, ensuring active participation and contribution to nation-building with their identity remaining intact as they adapt to evolving times, and thus securing a lasting legacy for future generations`,
    },
    mission: {
      title: 'MISSION',
      body: `A trusted partner and lead advocate of ICCs/IPs in upholding their rights and well-being as enshrined in the Indigenous Peoples’ Rights Act.`,
    },
    corevalues: {
      title: 'CORE VALUES',
      body:
        `Altruism
We emphasize selfless concern for the well-being of others. It encourages us to prioritize acts of kindness, generosity, and service, not only for our employees but also for our clientele, communities, and society at large. This value drives our organization to focus on creating positive impacts, fostering a culture of care, and placing people in decision-making.

Trust
Being reliable, honest, and dependable shall be lived out by every NCIP employee. It involves consistently demonstrating and ensuring that commitments and promises are met and quality results are achieved, hence building a culture of confidence and mutual respect.

Nurturing
NCIP promotes an environment where employees feel supported, valued, and encouraged to grow personally and professionally. Valuing each individual’s contributions and fostering a culture of mutual respect drives and encourages innovation, creativity, and personal growth within our agency; working with empathy and compassion.

Culture-Sensitive
At NCIP, recognizing, respecting, and valuing the diverse backgrounds, perspectives, and traditions of all employees and stakeholders is vital. We understand and acknowledge cultural differences and their impact on every interaction and decision we make. We demonstrate empathy and understanding for the unique experiences and challenges of others by fostering an open, respectful dialogue that embraces cultural diversity.

Integrity
NCIP consistently upholds probity, ethical behavior, transparency, fairness, and a steadfast commitment to ethical conduct in all services and actions at all times. Being truthful in all communications and transactions.

Professionalism
Adhering to the highest standards of behavior and performance in the workplace is exemplary at NCIP. We demonstrate competence, commitment, teamwork, and discipline leading to a more productive and positive work environment; and we treat colleagues, partners, and stakeholders with courtesy and respect.`,
    },
  }

  const data = contentMap[type] || contentMap.about

  // Icons for each modal type
  const iconMap = {
    about: <Globe className="w-6 h-6" />,
    mandate: <Shield className="w-6 h-6" />,
    vision: <Zap className="w-6 h-6" />,
    mission: <Target className="w-6 h-6" />,
    corevalues: <Heart className="w-6 h-6" />
  }

  const headerGradients = {
    about: 'from-blue-600 to-blue-700',
    mandate: 'from-purple-600 to-purple-700',
    vision: 'from-amber-600 to-amber-700',
    mission: 'from-emerald-600 to-emerald-700',
    corevalues: 'from-red-600 to-red-700'
  }

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .info-modal-content {
          animation: fadeInScale 0.3s ease-out;
        }
        .modal-pattern {
          background-image: 
            radial-gradient(circle at 1px 1px, rgba(207, 174, 112, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />

        <div className="info-modal-content relative z-60 max-w-3xl w-full mx-4 md:mx-0">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Gold top accent line */}
            <div className="h-1" style={{ backgroundColor: '#CFAE70' }} />

            {/* Gradient Header with Icon */}
            <div className={`bg-gradient-to-r ${headerGradients[type]} text-white p-6 flex items-center gap-4 relative overflow-hidden`}>
              {/* Subtle decorative pattern background */}
              <div className="absolute inset-0 opacity-10 modal-pattern" />
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative z-10 flex items-center gap-4 flex-1">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  {iconMap[type]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{data.title}</h3>
                  <p className="text-white/80 text-sm">NKLS Information Card</p>
                </div>
              </div>

              {/* Close button in header */}
              <button 
                onClick={onClose}
                className="relative z-10 p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 cursor-pointer active:scale-90"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ backgroundColor: '#CFAE70' }} />

            {/* Content Body with subtle background */}
            <div 
              className="p-8 max-h-[65vh] overflow-y-auto"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(207,174,112,0.02) 0%, rgba(11,60,93,0.02) 100%)'
              }}
            >
              <div className="text-black whitespace-pre-wrap leading-relaxed text-sm md:text-base space-y-4">
                {data.body.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-black/85">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Layered card effect - bottom shadow layer */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-xl" />
          </div>
        </div>
      </div>
    </>
  )
}
