'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
  const isAdminPage = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {!isLoginPage && !isAdminPage && <Header />}
        {children}
      </body>
    </html>
  )
}
