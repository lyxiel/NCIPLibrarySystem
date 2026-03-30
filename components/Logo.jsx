import Link from 'next/link'
import Image from 'next/image'

export default function Logo({ large = false }) {
  // default (used in landing header): compact dimensions
  const containerClass = large
    ? 'relative w-64 h-20 md:w-96 md:h-28 flex-shrink-0'
    : 'relative w-44 h-12 md:w-56 md:h-16 flex-shrink-0'

  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
      <div className={containerClass}>
        <Image
          src="/Logo/ncip-office-logo.png"
          alt="NCIP Office on Policy, Planning & Research"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  )
}
