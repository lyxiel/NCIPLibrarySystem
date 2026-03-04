import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 bg-white text-slate-900">
        <section className="bg-blue-600 text-white">
          <div className="max-w-5xl mx-auto px-6 py-6 md:py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">About the System</h1>
                <p className="text-sm md:text-base mt-1">NKLS Information Card</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <article className="mx-auto text-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#0B3C5D' }}>NCIP Knowledge and Library System (NKLS)</h2>
            <div className="h-1 w-16 mb-6" style={{ backgroundColor: '#CFAE70' }} />

            <h3 className="text-lg font-semibold mt-4">What is NKLS?</h3>
            <p className="mt-2 leading-relaxed text-sm md:text-base">
              NKLS is a comprehensive digital repository dedicated to safeguarding and promoting Indigenous knowledge systems, cultural heritage, and community resources with respect and dignity. Our mission is to ensure Indigenous knowledge remains under community control while being accessible to those who legitimately benefit from it.
            </p>

            <h3 className="text-lg font-semibold mt-6">Who Can Use It?</h3>
            <p className="mt-2 leading-relaxed text-sm md:text-base">NKLS serves a broad range of users with different access levels:</p>
            <ul className="list-disc pl-6 mt-2 text-sm md:text-base space-y-1">
              <li>Guests: Browse publicly available materials without logging in.</li>
              <li>Members: Borrow materials, save favorites, and track loans.</li>
              <li>Staff: Tools for content curation and metadata management.</li>
              <li>Administrators: Oversight, user management, and system settings.</li>
              <li>Researchers: Access to scholarly and community-approved resources.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6">Guest Access</h3>
            <p className="mt-2 leading-relaxed text-sm md:text-base">
              Guests can freely browse materials without signing in. Authentication is required only when performing account-specific actions like borrowing, reserving, or requesting restricted items.
            </p>

            <h3 className="text-lg font-semibold mt-6">How to Browse Materials</h3>
            <ol className="list-decimal pl-6 mt-2 text-sm md:text-base space-y-1">
              <li>Click "Browse Materials" on the landing page.</li>
              <li>Explore categories, cultural groups, and curated collections.</li>
              <li>Use search and filters to narrow by title, author, subject, or access level.</li>
              <li>Open an item to view metadata, cultural notes, and access instructions.</li>
            </ol>

            <h3 className="text-lg font-semibold mt-6">How to Search and Filter</h3>
            <p className="mt-2 leading-relaxed text-sm md:text-base">
              Use the search bar to find materials quickly by title, author, or subject. Apply filters (material type, cultural group, year, access label) to refine results. Sorting options help prioritize relevance or newest additions.
            </p>

            <h3 className="text-lg font-semibold mt-6">Borrowing</h3>
            <p className="mt-2 leading-relaxed text-sm md:text-base">
              To borrow an item: locate the material, click "Borrow", and follow the authentication prompts. Loan periods and renewal rules depend on the material's access label and library policy. Track active loans in your dashboard.
            </p>

            <h3 className="text-lg font-semibold mt-6">Access Labels & Protocols</h3>
            <p className="mt-2 leading-relaxed text-sm md:text-base">
              Materials are labeled to indicate cultural sensitivity and access requirements. Common labels include:
            </p>
            <ul className="list-disc pl-6 mt-2 text-sm md:text-base space-y-1">
              <li><strong>Public</strong> — Open access to all users.</li>
              <li><strong>Restricted</strong> — Requires approval or special permission.</li>
              <li><strong>Sacred</strong> — Access governed by community protocols and may be limited.</li>
              <li><strong>IKSP / CL</strong> — Items related to Indigenous Knowledge & Skills Program or Cultural Legacy with contextual guidance.</li>
            </ul>
            <p className="mt-2 leading-relaxed text-sm md:text-base">
              Some materials require Free, Prior, and Informed Consent (FPIC) from communities before access is granted. Users must respect all cultural protocols and restrictions associated with these items.
            </p>

            <h3 className="text-lg font-semibold mt-6">How to Request Access</h3>
            <p className="mt-2 leading-relaxed text-sm md:text-base">
              For restricted or community-sensitive materials, follow the item-specific request workflow. Provide necessary details and community contact information when prompted. NCIP staff will coordinate with communities to process access requests.
            </p>

            <h3 className="text-lg font-semibold mt-6">Support & Contact</h3>
            <p className="mt-2 leading-relaxed text-sm md:text-base">
              If you need help or want to request access to restricted content, contact NCIP Central Office:
            </p>
            <ul className="list-none pl-0 mt-2 text-sm md:text-base space-y-1">
              <li>Email: <a href="mailto:info@ncip.gov.ph" className="text-blue-600 hover:underline">info@ncip.gov.ph</a></li>
              <li>Phone: <a href="tel:+63212345678" className="text-blue-600 hover:underline">+63 (2) 1234-5678</a></li>
            </ul>

            <p className="mt-6 text-sm md:text-base">For full guidelines, policies, and FAQs, please consult the Resources section or contact NCIP support.</p>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  )
}
