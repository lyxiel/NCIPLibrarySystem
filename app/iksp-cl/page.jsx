'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import Table from '@/components/Table'
import StatusBadge from '@/components/StatusBadge'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'

export default function IKSPCLPage() {
  const router = useRouter()
  const [materials, setMaterials] = useState([
    {
      id: 1,
      codeNumber: 'IKSP-001',
      region: 'Region IV-A',
      province: 'Laguna',
      municipality: 'Paete',
      barangay: 'Tinanggap',
      group: 'Batak',
      title: 'Traditional Weaving Techniques',
      type: 'Document',
      copies: 3,
      lastUpdated: '2024-03-15',
      subject: 'Traditional Arts, Crafts',
      remarks: 'Well-preserved document',
    },
    {
      id: 2,
      codeNumber: 'IKSP-002',
      region: 'Region XI',
      province: 'Davao del Sur',
      municipality: 'Malita',
      barangay: 'Baliangao',
      group: 'T\'boli',
      title: 'Sacred Rituals and Ceremonies',
      type: 'Audio Recording',
      copies: 2,
      lastUpdated: '2024-02-28',
      subject: 'Spiritual Practices, Rituals',
      remarks: 'Digital copy available',
    },
    {
      id: 3,
      codeNumber: 'IKSP-003',
      region: 'Region I',
      province: 'Pangasinan',
      municipality: 'Bolinao',
      barangay: 'Balingasay',
      group: 'Pangasinan',
      title: 'Agricultural Knowledge Systems',
      type: 'Video',
      copies: 1,
      lastUpdated: '2024-01-20',
      subject: 'Agriculture, Traditional Methods',
      remarks: 'Recently digitized',
    },
    {
      id: 4,
      codeNumber: 'IKSP-004',
      region: 'Region VIII',
      province: 'Leyte',
      municipality: 'Baybay',
      barangay: 'Cambatog',
      group: 'Waray-Waray',
      title: 'Medicinal Plants and Healing',
      type: 'Manuscript',
      copies: 2,
      lastUpdated: '2024-02-10',
      subject: 'Medicinal Plants, Traditional Medicine',
      remarks: 'Requires preservation',
    },
    {
      id: 5,
      codeNumber: 'IKSP-005',
      region: 'Region VI',
      province: 'Capiz',
      municipality: 'Panay',
      barangay: 'Passi',
      group: 'Panay Bukidnon',
      title: 'Oral Legends and Folk Stories',
      type: 'Transcription',
      copies: 4,
      lastUpdated: '2024-03-01',
      subject: 'Oral Traditions, Cultural Heritage',
      remarks: 'Complete collection',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.codeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.province.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !filterType || material.type === filterType

    return matchesSearch && matchesType
  })

  const handleAddMaterial = () => {
    // Add material logic
  }

  const handleEditMaterial = (material) => {
    // Edit material logic
  }

  const handleDeleteMaterial = (materialId) => {
    if (confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter((material) => material.id !== materialId))
    }
  }

  const columns = [
    { key: 'codeNumber', label: 'Code Number', width: '8%' },
    { key: 'region', label: 'Region', width: '8%' },
    { key: 'province', label: 'Province', width: '10%' },
    { key: 'municipality', label: 'Municipality', width: '10%' },
    { key: 'barangay', label: 'Barangay', width: '10%' },
    { key: 'group', label: 'Group', width: '8%' },
    { key: 'title', label: 'Title', width: '12%' },
    { key: 'type', label: 'Type', width: '8%' },
    { key: 'copies', label: 'Number of Copies', width: '8%' },
    { key: 'lastUpdated', label: 'Last Updated/Published', width: '10%' },
    { key: 'subject', label: 'Subject', width: '12%' },
    { key: 'remarks', label: 'Remarks', width: '10%' },
    { key: 'actions', label: 'Actions', width: '8%' },
  ]

  const renderRow = (material) => (
    <>
      <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{material.codeNumber}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.region}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.province}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.municipality}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.barangay}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.group}</td>
      <td className="px-6 py-4 text-sm text-foreground font-medium">{material.title}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.type}</td>
      <td className="px-6 py-4 text-sm text-foreground font-medium text-center">{material.copies}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.lastUpdated}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.subject}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.remarks}</td>
      <td className="px-6 py-4 text-sm">
        <div className="flex gap-2">
          <button
            onClick={() => handleEditMaterial(material)}
            className="p-2 text-blue-500 hover:bg-blue-50 hover:shadow-md hover:scale-125 rounded-lg transition-all duration-300 transform"
            title="Edit material"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteMaterial(material.id)}
            className="p-2 text-red-500 hover:bg-red-50 hover:shadow-md hover:scale-125 rounded-lg transition-all duration-300 transform"
            title="Delete material"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </>
  )

  return (
    <AppLayout>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">IKSP/CL</h1>
            <p className="text-muted-foreground">Indigenous Knowledge and Skills Portfolio / Cultural Library</p>
          </div>
          <button
            onClick={handleAddMaterial}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-gold-accent hover:text-dark-navy hover:shadow-lg hover:scale-105 transition-all duration-300 transform font-semibold active:scale-95"
          >
            <Plus size={20} />
            Add Material
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by code, title, group, or province..."
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
            <option value="Document">Document</option>
            <option value="Audio Recording">Audio Recording</option>
            <option value="Video">Video</option>
            <option value="Manuscript">Manuscript</option>
            <option value="Transcription">Transcription</option>
          </select>
        </div>

        {/* Materials Table */}
        <Table columns={columns} data={filteredMaterials} renderRow={renderRow} />
      </div>
    </AppLayout>
  )
}
