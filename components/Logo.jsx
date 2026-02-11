import Link from 'next/link'
import Image from 'next/image'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
        <Image
          src="/oppr.svg"
          alt="NCIP Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="hidden sm:inline text-lg md:text-xl font-bold text-navy">NCIP</span>
    </Link>
  )
}
