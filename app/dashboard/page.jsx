'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/AppLayout'
import DashboardCard from '@/components/DashboardCard'
import ActivityLog from '@/components/ActivityLog'
import { 
  BookOpen, 
  BookMarked, 
  AlertCircle, 
  Users,
  TrendingUp,
  Clock,
  Archive,
  FileText,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import { mockDashboardStats, mockActivityLog } from '@/lib/mockData'

export default function DashboardPage() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState('all')

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  // Calculate percentages for progress indicators
  const bookUtilization = Math.round((mockDashboardStats.borrowedBooks / mockDashboardStats.totalBooks) * 100)
  const memberActivity = Math.round((mockDashboardStats.activeMembers / 500) * 100) // Assume 500 total members

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header Section with Gradient */}
        <div className="gradient-navy-header text-white rounded-lg p-8 shadow-lg-navy">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Library Operations Dashboard</h1>
              <p className="text-blue-100">Real-time statistics and activity overview</p>
            </div>
            <TrendingUp size={48} className="opacity-20" />
          </div>
        </div>

        {/* Filter and Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {['all', 'library', 'cultural', 'system'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                selectedFilter === filter
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-card border border-border text-foreground hover:bg-accent'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Primary Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <BookOpen size={24} className="text-primary" />
              </div>
              <TrendingUp size={18} className="text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Books</p>
            <p className="text-3xl font-bold text-foreground">{mockDashboardStats.totalBooks}</p>
            <p className="text-xs text-green-600 mt-2">+12 this month</p>
          </div>

          <div className="card-elevated">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <span className="inline-block px-2 py-1 rounded text-xs font-semibold badge-available">
                Available
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Available Books</p>
            <p className="text-3xl font-bold text-foreground">{mockDashboardStats.availableBooks}</p>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${((mockDashboardStats.availableBooks / mockDashboardStats.totalBooks) * 100)}%` }}
              />
            </div>
          </div>

          <div className="card-elevated">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <Clock size={24} className="text-orange-600" />
              </div>
              <span className="inline-block px-2 py-1 rounded text-xs font-semibold badge-borrowed">
                Borrowed
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Borrowed Books</p>
            <p className="text-3xl font-bold text-foreground">{mockDashboardStats.borrowedBooks}</p>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${bookUtilization}%` }}
              />
            </div>
          </div>

          <div className="card-elevated">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users size={24} className="text-purple-600" />
              </div>
              <TrendingUp size={18} className="text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Active Members</p>
            <p className="text-3xl font-bold text-foreground">{mockDashboardStats.activeMembers}</p>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${memberActivity}%` }}
              />
            </div>
          </div>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-soft border-accent-left">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-lg">
                <BookMarked size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reserved Books</p>
                <p className="text-2xl font-bold text-foreground">{mockDashboardStats.reservedBooks}</p>
              </div>
            </div>
          </div>

          <div className="card-soft border-accent-left">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Returns</p>
                <p className="text-2xl font-bold text-foreground">{mockDashboardStats.pendingReturns}</p>
              </div>
            </div>
          </div>

          <div className="card-soft border-accent-left">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Archive size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IKSP/CL Items</p>
                <p className="text-2xl font-bold text-foreground">248</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Alerts */}
          <div className="card-elevated">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <AlertCircle size={20} className="text-orange-500" />
              <h3 className="font-bold text-foreground">System Alerts</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                <AlertTriangle size={16} className="text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">5 overdue books</p>
                  <p className="text-xs text-muted-foreground">Members have exceeded return deadline</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">All IKSP items catalogued</p>
                  <p className="text-xs text-muted-foreground">Cultural records updated successfully</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Reports generated</p>
                  <p className="text-xs text-muted-foreground">Monthly statistics ready for review</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-elevated">
            <h3 className="font-bold text-foreground mb-4 pb-3 border-b border-border">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
                <BookOpen size={18} />
                Add New Book
              </button>
              <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
                <Users size={18} />
                Register Member
              </button>
              <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
                <Archive size={18} />
                Upload IKSP Item
              </button>
              <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
                <FileText size={18} />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <ActivityLog activities={mockActivityLog} />
      </div>
    </AppLayout>
  )
}
