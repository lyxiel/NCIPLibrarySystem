'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { mockUsers } from '@/lib/mockData'
import { Settings, Bell, Lock, Shield, LogOut, Save, X } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(mockUsers[1])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [formData, setFormData] = useState({ ...mockUsers[1] })
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (!loggedIn) {
      router.push('/login')
    } else {
      setIsLoggedIn(true)
      const userRole = localStorage.getItem('userRole')
      if (userRole === 'admin') {
        setCurrentUser(mockUsers[0])
        setFormData(mockUsers[0])
      }
    }
  }, [router])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasChanges(true)
  }

  const handleSaveChanges = () => {
    setCurrentUser(formData)
    setHasChanges(false)
    alert('Changes saved successfully!')
  }

  const handleCancel = () => {
    setFormData(currentUser)
    setHasChanges(false)
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userRole')
      router.push('/login')
    }
  }

  if (!isLoggedIn) return null

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Settings size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and security</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="card-soft h-fit">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-smooth ${
                  activeTab === 'profile'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-smooth ${
                  activeTab === 'security'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-smooth ${
                  activeTab === 'notifications'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-smooth ${
                  activeTab === 'privacy'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                Privacy
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="card-elevated space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-3">
                  Profile Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      disabled
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-accent text-muted-foreground cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Role cannot be changed here. Contact administrator.</p>
                  </div>
                </div>

                {hasChanges && (
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                      onClick={handleSaveChanges}
                      className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-gold-accent hover:text-dark-navy transition-smooth font-medium"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2.5 border border-border text-foreground rounded-lg hover:bg-accent transition-smooth font-medium"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="card-elevated space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-3">
                  Security Settings
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lock size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-foreground">Change Password</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          We recommend changing your password regularly for better security.
                        </p>
                        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-smooth text-sm font-medium">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield size={20} className="text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add an extra layer of security to your account.
                        </p>
                        <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-smooth text-sm font-medium">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="card-elevated space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-3">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Book Availability Notifications</p>
                        <p className="text-sm text-muted-foreground">Get notified when reserved items become available</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Overdue Reminders</p>
                        <p className="text-sm text-muted-foreground">Remind me about books that are due soon</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-primary" />
                      <div>
                        <p className="font-medium text-foreground">New Material Updates</p>
                        <p className="text-sm text-muted-foreground">Updates on new IKSP/CL items and library materials</p>
                      </div>
                    </div>
                    <input type="checkbox" className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="card-elevated space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-3">
                  Privacy Settings
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Activity Log Visibility</h4>
                        <p className="text-sm text-muted-foreground mt-1">Control who can see your library activity</p>
                      </div>
                      <select className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                        <option>Only me</option>
                        <option>Administrators</option>
                        <option>Everyone</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Data Collection</h4>
                        <p className="text-sm text-muted-foreground mt-1">Help us improve by sharing usage analytics</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer mt-1" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-smooth font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
