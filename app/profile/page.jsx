'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { mockUsers, mockUserDashboard } from '@/lib/mockData'
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Book,
  Bookmark,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(mockUsers[1]) // Default to regular user
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (!loggedIn) {
      router.push('/login')
    } else {
      setIsLoggedIn(true)
      // In real app, fetch actual user data from backend
      const userRole = localStorage.getItem('userRole')
      if (userRole === 'admin') {
        setCurrentUser(mockUsers[0])
      }
    }
  }, [router])

  if (!isLoggedIn) return null

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="card-elevated">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                <User size={48} className="text-white" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mt-4 bg-green-100 text-green-700">
                {currentUser.status}
              </span>
            </div>

            {/* User Info Section */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{currentUser.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{currentUser.role}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">{currentUser.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium text-foreground">{currentUser.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium text-foreground">{currentUser.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Borrowed Books Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Book size={20} className="text-blue-500" />
              <h3 className="font-bold text-foreground">Currently Borrowed</h3>
            </div>
            <div className="space-y-3">
              {mockUserDashboard.borrowedBooks.map((book) => (
                <div key={book.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                    {book.status === 'Overdue' ? (
                      <AlertCircle size={18} className="text-red-500" />
                    ) : (
                      <CheckCircle size={18} className="text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Borrowed: {book.borrowDate}</span>
                    <span>Due: {book.dueDate}</span>
                  </div>
                  {book.status === 'Overdue' && (
                    <p className="text-xs text-red-600 mt-2 font-semibold">⚠ This item is overdue</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reserved Books Section */}
          <div className="card-elevated">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Bookmark size={20} className="text-amber-500" />
              <h3 className="font-bold text-foreground">Reserved Items</h3>
            </div>
            <div className="space-y-3">
              {mockUserDashboard.reservedBooks.map((book) => (
                <div key={book.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="font-medium text-foreground">{book.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-amber-600" />
                    <span className="text-xs text-muted-foreground">
                      Position in queue: <strong>#{book.position}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-elevated">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Clock size={20} className="text-purple-500" />
            <h3 className="font-bold text-foreground">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {mockUserDashboard.recentActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4 p-3 bg-purple-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.action} <span className="text-primary">{activity.item}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-soft">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{mockUserDashboard.borrowedBooks.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Books Borrowed</p>
            </div>
          </div>
          <div className="card-soft">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">{mockUserDashboard.reservedBooks.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Items Reserved</p>
            </div>
          </div>
          <div className="card-soft">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{mockUserDashboard.recentActivities.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Activities</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
