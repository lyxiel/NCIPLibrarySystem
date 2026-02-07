'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import StatusBadge from '@/components/StatusBadge'
import { mockReports } from '@/lib/mockData'
import { BarChart3, Download, Plus, X } from 'lucide-react'

export default function ReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState(mockReports)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'Circulation',
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  const handleGenerateReport = (e) => {
    e.preventDefault()
    const newReport = {
      id: Math.max(...reports.map((r) => r.id), 0) + 1,
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'Published',
    }
    setReports([...reports, newReport])
    setFormData({ title: '', type: 'Circulation' })
    setIsModalOpen(false)
  }

  const reportTypes = [
    { type: 'Circulation', description: 'Book circulation metrics and statistics' },
    { type: 'Collection', description: 'Collection development and inventory' },
    { type: 'Analytics', description: 'Member engagement and usage analytics' },
  ]

  return (
    <AppLayout>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Reports</h1>
            <p className="text-muted-foreground">View and generate library reports and analytics</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-secondary transition-colors font-semibold"
          >
            <Plus size={20} />
            Generate Report
          </button>
        </div>

        {/* Report Templates Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Report Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportTypes.map((report) => (
              <div key={report.type} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-primary">
                <div className="flex items-start justify-between mb-3">
                  <BarChart3 className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{report.type} Report</h3>
                <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                <button
                  onClick={() => {
                    setFormData({ title: `${report.type} Report - ${new Date().toLocaleDateString()}`, type: report.type })
                    setIsModalOpen(true)
                  }}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-semibold"
                >
                  Generate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports Section */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Reports</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Report Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{report.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{report.type}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{report.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors font-semibold">
                        <Download size={18} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generate Report Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Generate Report</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleGenerateReport} className="space-y-4">
                {/* Report Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Report Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter report title"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Report Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Report Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="Circulation">Circulation Report</option>
                    <option value="Collection">Collection Development</option>
                    <option value="Analytics">Member Analytics</option>
                  </select>
                </div>

                {/* Info Message */}
                <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                  Report will be generated with current library data and can be downloaded as PDF or Excel format.
                </p>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
