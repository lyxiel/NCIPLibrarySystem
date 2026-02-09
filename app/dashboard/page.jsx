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
  const [userRole, setUserRole] = useState('user')

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const role = localStorage.getItem('userRole')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    setUserRole(role || 'user')
  }, [router])

  // Calculate percentages for progress indicators
  const bookUtilization = Math.round((mockDashboardStats.borrowedBooks / mockDashboardStats.totalBooks) * 100)
  const memberActivity = Math.round((mockDashboardStats.activeMembers / 500) * 100) // Assume 500 total members

  // ADMIN: Show system management dashboard
  const renderAdminDashboard = () => (
    <>
      <div className="gradient-navy-header rounded-lg p-8 shadow-lg-navy">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black">System Management Dashboard</h1>
            <p className="text-black text-opacity-70">System and account administration</p>
          </div>
          <TrendingUp size={48} className="text-black opacity-30" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users size={24} className="text-purple-600" />
            </div>
            <TrendingUp size={18} className="text-green-500" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Users</p>
          <p className="text-3xl font-bold text-foreground">156</p>
          <p className="text-xs text-green-600 mt-2">+8 this month</p>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Staff Members</p>
          <p className="text-3xl font-bold text-foreground">23</p>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">System Status</p>
          <p className="text-3xl font-bold text-foreground text-green-600">Online</p>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 rounded-lg">
              <AlertCircle size={24} className="text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Pending Tasks</p>
          <p className="text-3xl font-bold text-foreground">5</p>
        </div>
      </div>

      <div className="card-elevated">
        <h3 className="font-bold text-foreground mb-4 pb-3 border-b border-border">Admin Actions</h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
            <Settings size={18} />
            System Settings
          </button>
          <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-white hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
            <Users size={18} />
            Manage Users
          </button>
          <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-white hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
            <BarChart3 size={18} />
            View Reports
          </button>
        </div>
      </div>

      <ActivityLog activities={mockActivityLog} />
    </>
  )

  // STAFF: Show library operations dashboard
  const renderStaffDashboard = () => (
    <>
      <div className="gradient-navy-header rounded-lg p-8 shadow-lg-navy">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black">Library Operations Dashboard</h1>
            <p className="text-black text-opacity-70">Manage library materials, borrowings, and members</p>
          </div>
          <TrendingUp size={48} className="text-black opacity-30" />
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <AlertCircle size={20} className="text-orange-500" />
            <h3 className="font-bold text-foreground">Alerts</h3>
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
                <p className="text-sm font-medium text-foreground">12 new borrowings today</p>
                <p className="text-xs text-muted-foreground">Active lending activity</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-elevated">
          <h3 className="font-bold text-foreground mb-4 pb-3 border-b border-border">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
              <BookOpen size={18} />
              Add New Book
            </button>
            <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-white hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
              <Users size={18} />
              Register Member
            </button>
            <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-white hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
              <Archive size={18} />
              Upload IKSP Item
            </button>
          </div>
        </div>
      </div>

      <ActivityLog activities={mockActivityLog} />
    </>
  )

  // USER: Show personal borrowing dashboard
  const renderUserDashboard = () => (
    <>
      <div className="gradient-navy-header rounded-lg p-8 shadow-lg-navy">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black">My Library Dashboard</h1>
            <p className="text-black text-opacity-70">Browse and manage your borrowings</p>
          </div>
          <BookOpen size={48} className="text-black opacity-30" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <BookOpen size={24} className="text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Books Borrowed</p>
          <p className="text-3xl font-bold text-foreground">3</p>
          <p className="text-xs text-muted-foreground mt-2">Currently checked out</p>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Available to Borrow</p>
          <p className="text-3xl font-bold text-foreground">{mockDashboardStats.availableBooks}</p>
          <p className="text-xs text-green-600 mt-2">From our collection</p>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Days Until Due</p>
          <p className="text-3xl font-bold text-foreground">7</p>
          <p className="text-xs text-orange-600 mt-2">Earliest return date</p>
        </div>
      </div>

      <div className="card-elevated">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <BookOpen size={20} className="text-blue-500" />
          <h3 className="font-bold text-foreground">My Current Borrowings</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle size={16} className="text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">The History of NCIP</p>
              <p className="text-xs text-muted-foreground">Due: Feb 16, 2026</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle size={16} className="text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Indigenous Cultures & Heritage</p>
              <p className="text-xs text-muted-foreground">Due: Feb 18, 2026</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle size={16} className="text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Library Science Handbook</p>
              <p className="text-xs text-muted-foreground">Due: Feb 20, 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card-elevated">
        <h3 className="font-bold text-foreground mb-4 pb-3 border-b border-border">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
            <BookOpen size={18} />
            Browse Books
          </button>
          <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-white hover:bg-gold-accent hover:text-dark-navy font-medium transition-smooth text-left flex items-center gap-2">
            <Archive size={18} />
            View Archive
          </button>
        </div>
      </div>
    </>
  )

  return (
    <AppLayout>
      <div className="space-y-8">
        {userRole === 'admin' && renderAdminDashboard()}
        {userRole === 'staff' && renderStaffDashboard()}
        {userRole === 'user' && renderUserDashboard()}
      </div>
    </AppLayout>
  )
}
