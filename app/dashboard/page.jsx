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
  Settings,
  BarChart3,
} from 'lucide-react'
import { mockDashboardStats, mockActivityLog } from '@/lib/mockData'
import { db, auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, collection, getDocs, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore'
import { toast } from '@/hooks/use-toast'

export default function DashboardPage() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [userRole, setUserRole] = useState('user')
  const [stats, setStats] = useState(mockDashboardStats)
  const [activities, setActivities] = useState(mockActivityLog)
  const [editingStats, setEditingStats] = useState(false)
  const [statsForm, setStatsForm] = useState(mockDashboardStats)
  const [newActivity, setNewActivity] = useState({ action: '', description: '', type: 'borrow' })

  useEffect(() => {
    // Use Firebase auth to determine role and load data
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }
      // load role from users doc if available
      try {
        const userRef = doc(db, 'users', user.uid)
        const uSnap = await getDoc(userRef)
        const role = uSnap.exists() ? (uSnap.data().role || localStorage.getItem('userRole') || 'user') : (localStorage.getItem('userRole') || 'user')
        setUserRole(role)
      } catch (err) {
        setUserRole(localStorage.getItem('userRole') || 'user')
      }

      // fetch dashboard stats and activity log from Firestore
      try {
        const statsRef = doc(db, 'dashboard', 'stats')
        const sSnap = await getDoc(statsRef)
        if (sSnap.exists()) {
          setStats(sSnap.data())
          setStatsForm(sSnap.data())
        } else {
          // initialize from mock if absent
          await setDoc(statsRef, mockDashboardStats)
          setStats(mockDashboardStats)
          setStatsForm(mockDashboardStats)
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err)
        setStats(mockDashboardStats)
        setStatsForm(mockDashboardStats)
      }

      try {
        const snap = await getDocs(collection(db, 'activity-log'))
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b)=> (b.timestamp||'').localeCompare(a.timestamp||''))
        setActivities(items.length ? items : mockActivityLog)
      } catch (err) {
        console.error('Error loading activity log:', err)
        setActivities(mockActivityLog)
      }
    })

    return () => unsub()
  }, [router])

  const handleStatsChange = (e) => {
    const { name, value } = e.target
    setStatsForm((s) => ({ ...s, [name]: Number(value) }))
  }

  const saveStats = async () => {
    try {
      const ref = doc(db, 'dashboard', 'stats')
      await setDoc(ref, statsForm, { merge: true })
      setStats(statsForm)
      setEditingStats(false)
      try { toast({ title: 'Stats updated' }) } catch (e) {}
    } catch (err) {
      console.error('Error saving stats:', err)
      alert('Failed to save stats. Check console for details.')
    }
  }

  const handleNewActivityChange = (e) => {
    const { name, value } = e.target
    setNewActivity((n) => ({ ...n, [name]: value }))
  }

  const addActivity = async () => {
    try {
      const data = { ...newActivity, timestamp: new Date().toISOString() }
      const r = await addDoc(collection(db, 'activity-log'), data)
      setActivities((prev) => [{ id: r.id, ...data }, ...prev])
      setNewActivity({ action: '', description: '', type: 'borrow' })
      try { toast({ title: 'Activity added' }) } catch (e) {}
    } catch (err) {
      console.error('Error adding activity:', err)
      alert('Failed to add activity. Check console for details.')
    }
  }

  const deleteActivity = async (id) => {
    if (!confirm('Delete this activity?')) return
    try {
      await deleteDoc(doc(db, 'activity-log', id))
      setActivities((prev) => prev.filter(a => a.id !== id))
      try { toast({ title: 'Activity deleted', variant: 'destructive' }) } catch (e) {}
    } catch (err) {
      console.error('Error deleting activity:', err)
      alert('Failed to delete activity. Check console for details.')
    }
  }

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

      <div className="card-elevated">
        <h3 className="font-bold text-foreground mb-4 pb-3 border-b border-border">Dashboard Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setEditingStats((s) => !s)} className="px-3 py-2 rounded-lg bg-secondary text-white">{editingStats ? 'Cancel Edit' : 'Edit Stats'}</button>
            {editingStats ? (
              <div className="flex gap-2 items-center">
                <input name="totalBooks" value={statsForm.totalBooks} onChange={handleStatsChange} className="w-28 px-2 py-1 border rounded" />
                <input name="availableBooks" value={statsForm.availableBooks} onChange={handleStatsChange} className="w-28 px-2 py-1 border rounded" />
                <input name="borrowedBooks" value={statsForm.borrowedBooks} onChange={handleStatsChange} className="w-28 px-2 py-1 border rounded" />
                <input name="reservedBooks" value={statsForm.reservedBooks} onChange={handleStatsChange} className="w-28 px-2 py-1 border rounded" />
                <input name="activeMembers" value={statsForm.activeMembers} onChange={handleStatsChange} className="w-28 px-2 py-1 border rounded" />
                <input name="pendingReturns" value={statsForm.pendingReturns} onChange={handleStatsChange} className="w-28 px-2 py-1 border rounded" />
                <button onClick={saveStats} className="px-3 py-2 rounded-lg bg-primary text-white">Save</button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Current stats are editable via the Edit Stats button.</div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Activity Log Management</h4>
            <div className="flex gap-2 mb-3">
              <input name="action" value={newActivity.action} onChange={handleNewActivityChange} placeholder="Action" className="px-2 py-1 border rounded w-32" />
              <input name="type" value={newActivity.type} onChange={handleNewActivityChange} placeholder="Type" className="px-2 py-1 border rounded w-24" />
              <input name="description" value={newActivity.description} onChange={handleNewActivityChange} placeholder="Description" className="px-2 py-1 border rounded flex-1" />
              <button onClick={addActivity} className="px-3 py-1 rounded-lg bg-primary text-white">Add</button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activities.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{a.action} <span className="text-xs text-muted-foreground">({a.type})</span></div>
                    <div className="text-xs text-muted-foreground">{a.description}</div>
                    <div className="text-xs text-muted-foreground">{a.timestamp}</div>
                  </div>
                  <div>
                    <button onClick={() => deleteActivity(a.id)} className="px-2 py-1 text-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ActivityLog activities={activities} />
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
