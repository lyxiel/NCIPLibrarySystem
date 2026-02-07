'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import DashboardCard from '@/components/DashboardCard'
import {
  Settings,
  Users,
  Database,
  Shield,
  Lock,
  Bell,
  HardDrive,
  Clock,
} from 'lucide-react'

export default function AdminPanel() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [systemSettings, setSystemSettings] = useState({
    libraryName: 'NCIP Library System',
    borrowDays: 30,
    maxBooksPerMember: 5,
    lateFeePerDay: 10,
    notificationsEnabled: true,
    maintenanceMode: false,
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  const handleSettingChange = (key, value) => {
    setSystemSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings))
    alert('Settings saved successfully!')
  }

  const tabs = [
    { id: 'overview', label: 'System Overview' },
    { id: 'settings', label: 'System Settings' },
    { id: 'users', label: 'User Management' },
    { id: 'security', label: 'Security' },
  ]

  return (
    <AppLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage library system settings and configuration</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Users"
                value={34}
                icon={Users}
                color="primary"
              />
              <DashboardCard
                title="Database Size"
                value="2.4 GB"
                icon={Database}
                color="secondary"
              />
              <DashboardCard
                title="System Uptime"
                value="99.8%"
                icon={Clock}
                color="accent"
              />
              <DashboardCard
                title="Storage Used"
                value="64%"
                icon={HardDrive}
                color="blue"
              />
            </div>

            {/* System Health */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                  <span className="text-foreground font-medium">Database Connection</span>
                  <span className="px-3 py-1 bg-green-200 text-green-800 text-sm font-semibold rounded-full">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                  <span className="text-foreground font-medium">API Server</span>
                  <span className="px-3 py-1 bg-green-200 text-green-800 text-sm font-semibold rounded-full">
                    Running
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                  <span className="text-foreground font-medium">File Storage</span>
                  <span className="px-3 py-1 bg-green-200 text-green-800 text-sm font-semibold rounded-full">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">System Settings</h2>
            <div className="space-y-6 max-w-2xl">
              {/* Library Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Library Name</label>
                <input
                  type="text"
                  value={systemSettings.libraryName}
                  onChange={(e) => handleSettingChange('libraryName', e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              {/* Borrow Duration */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Default Borrow Duration (days)
                </label>
                <input
                  type="number"
                  value={systemSettings.borrowDays}
                  onChange={(e) => handleSettingChange('borrowDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              {/* Max Books */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Max Books Per Member
                </label>
                <input
                  type="number"
                  value={systemSettings.maxBooksPerMember}
                  onChange={(e) => handleSettingChange('maxBooksPerMember', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              {/* Late Fee */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Late Fee Per Day (PHP)
                </label>
                <input
                  type="number"
                  value={systemSettings.lateFeePerDay}
                  onChange={(e) => handleSettingChange('lateFeePerDay', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4 border-t border-border pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.notificationsEnabled}
                    onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-foreground font-medium">Enable Email Notifications</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-foreground font-medium">Maintenance Mode</span>
                </label>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-border">
                <button
                  onClick={handleSaveSettings}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-secondary transition-colors font-semibold"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">User Management</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Manage administrator accounts and user permissions
              </p>
              <div className="border border-border rounded-lg p-4 bg-blue-50">
                <h3 className="font-semibold text-foreground mb-2">Current Administrators</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• System Administrator (Full Access)</li>
                  <li>• Librarian Manager (Books & Members)</li>
                  <li>• Archive Manager (Archive & Reports)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Security Settings</h2>
            <div className="space-y-6 max-w-2xl">
              <div className="border border-border rounded-lg p-4 bg-yellow-50">
                <div className="flex gap-3 mb-4">
                  <Shield className="text-yellow-600" size={24} />
                  <div>
                    <h3 className="font-bold text-foreground">Security Status</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your system is protected with SSL encryption and regular backups
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-bold text-foreground mb-4">Security Options</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-between">
                    <span className="text-foreground font-medium">Change Admin Password</span>
                    <Lock size={20} className="text-primary" />
                  </button>
                  <button className="w-full text-left px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-between">
                    <span className="text-foreground font-medium">Enable Two-Factor Authentication</span>
                    <Shield size={20} className="text-primary" />
                  </button>
                  <button className="w-full text-left px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-between">
                    <span className="text-foreground font-medium">View Security Logs</span>
                    <Lock size={20} className="text-primary" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
