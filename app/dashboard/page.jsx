'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import DashboardCard from '@/components/DashboardCard'
import ActivityLog from '@/components/ActivityLog'
import { BookOpen, BookMarked, AlertCircle, Users } from 'lucide-react'
import { mockDashboardStats, mockActivityLog } from '@/lib/mockData'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  return (
    <AppLayout>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Overview of library operations and statistics</p>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Book"
            value={mockDashboardStats.totalBooks}
            icon={BookOpen}
            color="primary"
          />
          <DashboardCard
            title="Available Books"
            value={mockDashboardStats.availableBooks}
            icon={BookMarked}
            color="secondary"
          />
          <DashboardCard
            title="Borrowed Books"
            value={mockDashboardStats.borrowedBooks}
            icon={AlertCircle}
            color="accent"
          />
          <DashboardCard
            title="Active Members"
            value={mockDashboardStats.activeMembers}
            icon={Users}
            color="blue"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DashboardCard
            title="Reserved Books"
            value={mockDashboardStats.reservedBooks}
            icon={BookOpen}
            color="primary"
          />
          <DashboardCard
            title="Pending Returns"
            value={mockDashboardStats.pendingReturns}
            icon={AlertCircle}
            color="accent"
          />
        </div>

        {/* Activity Log */}
        <ActivityLog activities={mockActivityLog} />
      </div>
    </AppLayout>
  )
}
