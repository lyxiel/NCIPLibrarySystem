"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { mockBooks, mockActivityLog } from '@/lib/mockData'

export default function ReportsPage() {
  const router = useRouter()
  const [resultRows, setResultRows] = useState(null)
  const [reportName, setReportName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const role = localStorage.getItem('userRole')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    if (role !== 'admin') {
      router.push('/dashboard')
      return
    }
  }, [router])

  const downloadCSV = (rows = [], filename = 'report.csv') => {
    if (!rows || rows.length === 0) return
    const keys = Object.keys(rows[0])
    const csv = [keys.join(',')].concat(rows.map(r => keys.map(k => `"${String(r[k] ?? '')}"`).join(','))).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  // 1) Collection report: summarize policy docs, research studies, reference materials
  const generateCollectionReport = () => {
    // For demo, we treat all mockBooks as part of the collection; in production filter by type/tag
    const rows = mockBooks.map(b => ({ id: b.id, title: b.title, resourceType: b.resourceType || 'Unknown', datePublished: b.datePublished || '', status: b.status || '' }))
    setReportName('Collection Report')
    setResultRows(rows)
  }

  // 2) Categorized counts: number of resources per category, year, access level (access level assumed 'public' when missing)
  const generateCategorizedCounts = () => {
    const byCategory = {}
    const byYear = {}
    const byAccess = {}
    mockBooks.forEach(b => {
      const c = b.resourceType || 'Unknown'
      const y = (b.datePublished || '').split('-')[0] || 'Unknown'
      const a = b.accessLevel || 'public'
      byCategory[c] = (byCategory[c] || 0) + 1
      byYear[y] = (byYear[y] || 0) + 1
      byAccess[a] = (byAccess[a] || 0) + 1
    })
    const rows = []
    Object.keys(byCategory).forEach(k => rows.push({ metric: `Category:${k}`, count: byCategory[k] }))
    Object.keys(byYear).forEach(k => rows.push({ metric: `Year:${k}`, count: byYear[k] }))
    Object.keys(byAccess).forEach(k => rows.push({ metric: `Access:${k}`, count: byAccess[k] }))
    setReportName('Categorized Counts')
    setResultRows(rows)
  }

  // (Monthly delta removed per request)

  // 4) Usage/access report: identify most accessed resources (simple count from activity log)
  const generateUsageReport = () => {
    const counts = {}
    const titleRegex = /"([^"]+)"/g
    mockActivityLog.forEach(a => {
      const matches = [...(a.description.matchAll(titleRegex) || [])]
      matches.forEach(m => { counts[m[1]] = (counts[m[1]] || 0) + 1 })
    })
    const rows = Object.keys(counts).map(k => ({ title: k, accesses: counts[k] })).sort((a,b) => b.accesses - a.accesses)
    setReportName('Usage & Access Report')
    setResultRows(rows)
  }

  // 5) Real-time report: generate by date range for activity and resources
  const generateRealTimeReport = () => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates')
      return
    }
    const s = new Date(startDate)
    const e = new Date(endDate)
    // activities in range
    const activities = mockActivityLog.filter(a => {
      const t = new Date(a.timestamp)
      return t >= s && t <= e
    }).map(a => ({ action: a.action, description: a.description, timestamp: a.timestamp }))
    setReportName(`Real-time Report (${startDate} → ${endDate})`)
    setResultRows(activities)
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Reports — I-LEARN (Admin)</h1>

        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold">Available reports</h3>
              <p className="text-sm text-muted-foreground">Choose a report type or run a real-time activity report.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={generateCollectionReport} className="px-4 py-2 bg-primary text-primary-foreground rounded shadow-sm hover:shadow-md hover:text-white">Collection Report</button>
              <button onClick={generateCategorizedCounts} className="px-4 py-2 bg-primary text-primary-foreground rounded shadow-sm hover:shadow-md hover:text-white">Categorized Counts</button>
              <button onClick={generateUsageReport} className="px-4 py-2 bg-primary text-primary-foreground rounded shadow-sm hover:shadow-md hover:text-white">Usage & Access</button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="report-start-date" className="text-xs text-muted-foreground mb-1 block">Start date</label>
              <input id="report-start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 border border-border rounded w-full" />
            </div>

            <div>
              <label htmlFor="report-end-date" className="text-xs text-muted-foreground mb-1 block">End date</label>
              <input id="report-end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 border border-border rounded w-full" />
            </div>

            <div className="flex items-center justify-end">
              <button onClick={generateRealTimeReport} className="px-4 py-2 bg-primary text-primary-foreground rounded w-full sm:w-auto hover:text-white">Generate Real-time</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-lg font-semibold">{reportName || 'No report generated yet'}</h2>
            {resultRows && resultRows.length > 0 && (
              <button onClick={() => downloadCSV(resultRows, `${reportName.replace(/\s+/g,'-').toLowerCase() || 'report'}.csv`)} className="text-sm text-blue-600">Export CSV</button>
            )}
          </div>

          <div className="overflow-x-auto">
            {resultRows && resultRows.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    {Object.keys(resultRows[0]).map((k) => (
                      <th key={k} className="px-3 py-2 font-medium text-xs uppercase tracking-wide">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {resultRows.map((r, i) => (
                    <tr key={i} className="bg-white">
                      {Object.keys(r).map((k) => (
                        <td key={k} className="px-3 py-3 align-top text-sm text-foreground">{String(r[k])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">Use the buttons above to generate a report.</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
