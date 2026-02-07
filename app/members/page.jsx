'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import Table from '@/components/Table'
import StatusBadge from '@/components/StatusBadge'
import { mockMembers } from '@/lib/mockData'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'

export default function MembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState(mockMembers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Researcher',
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !filterType || member.type === filterType

    return matchesSearch && matchesType
  })

  const handleAddMember = (e) => {
    e.preventDefault()
    if (editingMember) {
      setMembers(
        members.map((member) =>
          member.id === editingMember.id ? { ...member, ...formData } : member
        )
      )
      setEditingMember(null)
    } else {
      const newMember = {
        ...formData,
        id: Math.max(...members.map((m) => m.id), 0) + 1,
        joinDate: new Date().toISOString().split('T')[0],
        booksCheckedOut: 0,
        status: 'Active',
      }
      setMembers([...members, newMember])
    }
    setFormData({ name: '', email: '', type: 'Researcher' })
    setIsModalOpen(false)
  }

  const handleEditMember = (member) => {
    setEditingMember(member)
    setFormData({ name: member.name, email: member.email, type: member.type })
    setIsModalOpen(true)
  }

  const handleDeleteMember = (memberId) => {
    if (confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter((member) => member.id !== memberId))
    }
  }

  const columns = [
    { key: 'name', label: 'Name', width: '20%' },
    { key: 'email', label: 'Email', width: '25%' },
    { key: 'type', label: 'Type', width: '12%' },
    { key: 'joinDate', label: 'Join Date', width: '13%' },
    { key: 'booksCheckedOut', label: 'Books Out', width: '10%' },
    { key: 'status', label: 'Status', width: '10%' },
    { key: 'actions', label: 'Actions', width: '10%' },
  ]

  const renderRow = (member) => (
    <>
      <td className="px-6 py-4 text-sm text-foreground font-medium">{member.name}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{member.email}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{member.type}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{member.joinDate}</td>
      <td className="px-6 py-4 text-sm text-foreground font-medium">{member.booksCheckedOut}</td>
      <td className="px-6 py-4 text-sm">
        <StatusBadge status={member.status} />
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="flex gap-2">
          <button
            onClick={() => handleEditMember(member)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit member"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteMember(member.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete member"
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Members & Researchers</h1>
            <p className="text-muted-foreground">Manage library members and researchers</p>
          </div>
          <button
            onClick={() => {
              setEditingMember(null)
              setFormData({ name: '', email: '', type: 'Researcher' })
              setIsModalOpen(true)
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-secondary transition-colors font-semibold"
          >
            <Plus size={20} />
            Add Member
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
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
            <option value="Researcher">Researcher</option>
            <option value="Academic">Academic</option>
          </select>
        </div>

        {/* Members Table */}
        <Table columns={columns} data={filteredMembers} renderRow={renderRow} />

        {/* Add/Edit Member Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h2>

              <form onSubmit={handleAddMember} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter member name"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="member@ncip.gov.ph"
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
                    <option value="Researcher">Researcher</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingMember(null)
                    }}
                    className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
                  >
                    {editingMember ? 'Update' : 'Add Member'}
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
