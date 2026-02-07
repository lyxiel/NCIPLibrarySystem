'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { mockArchiveItems } from '@/lib/mockData'
import { Search, Plus, BookOpen, Volume2, FileText, X } from 'lucide-react'

export default function ArchivePage() {
  const router = useRouter()
  const [archiveItems, setArchiveItems] = useState(mockArchiveItems)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'Oral History',
    content: '',
    contributor: '',
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  const filteredItems = archiveItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || item.type === filterType
    return matchesSearch && matchesType
  })

  const handleAddItem = (e) => {
    e.preventDefault()
    const newItem = {
      id: Math.max(...archiveItems.map((a) => a.id), 0) + 1,
      ...formData,
      date: new Date().toISOString().split('T')[0],
    }
    setArchiveItems([...archiveItems, newItem])
    setFormData({ title: '', type: 'Oral History', content: '', contributor: '' })
    setIsModalOpen(false)
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Oral History': Volume2,
      Video: BookOpen,
      'Written Documentation': FileText,
    }
    const Icon = icons[type] || BookOpen
    return <Icon size={24} />
  }

  return (
    <AppLayout>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Indigenous Knowledge Archive</h1>
            <p className="text-muted-foreground">Preserve and document indigenous cultural heritage</p>
          </div>
          <button
            onClick={() => {
              setFormData({ title: '', type: 'Oral History', content: '', contributor: '' })
              setIsModalOpen(true)
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-secondary transition-colors font-semibold"
          >
            <Plus size={20} />
            Add Archive Item
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search archive items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="">All Types</option>
            <option value="Oral History">Oral History</option>
            <option value="Video">Video</option>
            <option value="Written Documentation">Written Documentation</option>
          </select>
        </div>

        {/* Archive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-primary">{getTypeIcon(item.type)}</div>
                <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {item.type}
                </span>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.content}</p>

              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Contributor</p>
                <p className="text-sm font-medium text-foreground">{item.contributor}</p>
                <p className="text-xs text-muted-foreground mt-2">{item.date}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No archive items found</p>
          </div>
        )}

        {/* Add Archive Item Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Add Archive Item</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter archive item title"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="Oral History">Oral History</option>
                    <option value="Video">Video</option>
                    <option value="Written Documentation">Written Documentation</option>
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Content / Description
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Describe the archive item content..."
                    rows="4"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>

                {/* Contributor */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Contributor</label>
                  <input
                    type="text"
                    value={formData.contributor}
                    onChange={(e) => setFormData({ ...formData, contributor: e.target.value })}
                    placeholder="Enter contributor name"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>

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
                    Add Item
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
