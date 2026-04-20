'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import GuestHeader from '@/components/GuestHeader'
import Table from '@/components/Table'
import StatusBadge from '@/components/StatusBadge'
import MaterialModal from '@/components/MaterialModal'
import { Plus, Search, Edit, Trash2, Lock, CheckCircle, AlertCircle, FileUp, Check } from 'lucide-react'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { toast } from '@/hooks/use-toast'

export default function IKSPCLPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [userRole, setUserRole] = useState('user')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [materials, setMaterials] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    // Prefer server-side user role when possible
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true)
        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userSnap = await getDoc(userDocRef)
          if (userSnap.exists()) {
            setUserRole(userSnap.data().role || 'user')
            localStorage.setItem('userRole', userSnap.data().role || 'user')
          } else {
            const role = localStorage.getItem('userRole') || 'user'
            setUserRole(role)
          }
        } catch (e) {
          const role = localStorage.getItem('userRole') || 'user'
          setUserRole(role)
        }
      } else {
        setIsLoggedIn(false)
        setUserRole('user')
      }
    })

    // Fetch materials from Firestore
    const fetchMaterials = async () => {
      try {
        const snap = await getDocs(collection(db, 'iksp-cl'))
        const fbMaterials = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setMaterials(fbMaterials)
      } catch (err) {
        console.error('Error fetching IKSP materials:', err)
      }
    }

    fetchMaterials()

    return () => unsub()
  }, [])

  const filteredMaterials = materials.filter((material) => {
    // Check sensitivity level
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn')
    if (material.sensitivity === 'Restricted' && !isLoggedIn) {
      return false // Hide restricted items from guests
    }
    if (material.sensitivity === 'Sacred' && !isLoggedIn) {
      return false // Hide sacred items from guests
    }

    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.codeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.province.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !filterType || material.type === filterType

    return matchesSearch && matchesType
  })

  const handleAddMaterial = async (formData) => {
    // Editing existing material
    if (editingMaterial) {
      try {
        if (editingMaterial.id) {
          const matRef = doc(db, 'iksp-cl', String(editingMaterial.id))
          const dataToUpdate = { ...formData }
          dataToUpdate.copies = Number(dataToUpdate.copies) || 0
          await updateDoc(matRef, dataToUpdate)
        }

        setMaterials(
          materials.map((material) =>
            material.id === editingMaterial.id ? { ...formData, id: editingMaterial.id } : material
          )
        )
        setEditingMaterial(null)
        setIsModalOpen(false)
        try { toast({ title: 'Material updated', description: `${formData.title || 'Material'} updated.` }) } catch (e) {}
        return
      } catch (err) {
        console.error('Error updating material:', err)
        alert('Failed to update material. Check console for details.')
        return
      }
    }

    // Creating new material
    try {
      const dataToSave = { ...formData }
      dataToSave.copies = Number(dataToSave.copies) || 0
      dataToSave.lastUpdated = dataToSave.lastUpdated || new Date().toISOString().split('T')[0]
      dataToSave.createdAt = serverTimestamp()

      const docRef = await addDoc(collection(db, 'iksp-cl'), dataToSave)
      const newMaterial = { ...dataToSave, id: docRef.id }
      setMaterials((prev) => [...prev, newMaterial])
      setIsModalOpen(false)
      try { toast({ title: 'Material added', description: `${formData.title || 'Material'} added.` }) } catch (e) {}
    } catch (err) {
      console.error('Error saving material:', err)
      alert('Failed to save material. Check console for details.')
    }
  }

  const handleEditMaterial = (material) => {
    setEditingMaterial(material)
    setIsModalOpen(true)
  }

  const handleDeleteMaterial = async (materialId) => {
    if (!confirm('Are you sure you want to delete this material?')) return

    try {
      // If materialId is a Firestore id (string), attempt delete on server
      if (typeof materialId === 'string') {
        await deleteDoc(doc(db, 'iksp-cl', String(materialId)))
      }
      setMaterials(materials.filter((material) => material.id !== materialId))
      try { toast({ title: 'Material deleted', description: 'Material removed.', variant: 'destructive' }) } catch (e) {}
    } catch (err) {
      console.error('Error deleting material:', err)
      alert('Failed to delete material. Check console for details.')
    }
  }

  const handleImportCSV = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = String(event.target?.result || '')
        const lines = text.split('\n')
        const headers = lines[0].split(',')
        
        const newMaterials = lines.slice(1)
          .filter(line => line.trim())
          .map((line) => {
            const values = line.split(',')
            return {
              id: Math.max(...materials.map((m) => m.id), 0) + 1,
              codeNumber: values[0]?.trim() || '',
              title: values[1]?.trim() || '',
              group: values[2]?.trim() || '',
              type: values[3]?.trim() || '',
              copies: parseInt(values[4]) || 0,
              sensitivity: values[5]?.trim() || 'Public',
              fpicRequired: values[6]?.trim().toLowerCase() === 'true',
              subject: values[7]?.trim() || '',
              remarks: values[8]?.trim() || '',
              region: values[9]?.trim() || '',
              province: values[10]?.trim() || '',
              municipality: values[11]?.trim() || '',
              barangay: values[12]?.trim() || '',
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          })
        
        // Save each imported material to Firestore and local state
        try {
          const added = []
          for (const m of newMaterials) {
            const dataToSave = { ...m }
            dataToSave.createdAt = serverTimestamp()
            const r = await addDoc(collection(db, 'iksp-cl'), dataToSave)
            added.push({ ...dataToSave, id: r.id })
          }
          setMaterials((prev) => [...prev, ...added])
          alert(`Successfully imported ${added.length} materials from CSV`)
        } catch (err) {
          console.error('Error importing CSV to Firestore:', err)
          alert('Imported to local state failed. Check console for details.')
        }
      } catch (error) {
        alert('Error importing CSV: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
    reader.readAsText(file)
  }

  const columns = [
    { key: 'codeNumber', label: 'Code Number', width: '7%' },
    { key: 'title', label: 'Title', width: '13%' },
    { key: 'availability', label: 'Availability', width: '8%' },
    { key: 'group', label: 'Group', width: '8%' },
    { key: 'type', label: 'Type', width: '8%' },
    { key: 'copies', label: 'Copies', width: '6%' },
    { key: 'sensitivity', label: 'Sensitivity', width: '9%' },
    { key: 'fpic', label: 'FPIC', width: '6%' },
    { key: 'subject', label: 'Subject', width: '12%' },
    { key: 'remarks', label: 'Remarks', width: '10%' },
    { key: 'actions', label: 'Actions', width: '8%' },
  ]

  const renderRow = (material) => (
    <tr key={material.id} className="border-b border-border hover:bg-[hsl(205,30%,88%)] dark:hover:bg-[hsl(205,54%,20%)] transition-all duration-300 ease-in-out">
      <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{material.codeNumber}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.availability || 'Both'}</td>
      <td className="px-6 py-4 text-sm text-foreground font-medium">{material.title}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.group}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.type}</td>
      <td className="px-6 py-4 text-sm text-foreground font-medium text-center">{material.copies}</td>
      <td className="px-6 py-4 text-sm">
        <StatusBadge status={material.sensitivity} />
      </td>
      <td className="px-6 py-4 text-sm text-center">
        {material.fpicRequired ? (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded badge-restricted">
            <Lock size={14} />
            <span>Required</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.subject}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{material.remarks}</td>
      <td className="px-6 py-4 text-sm">
        <div className="flex gap-2">
          {(userRole === 'admin' || userRole === 'staff') ? (
            <>
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
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Read-only</span>
          )}
        </div>
      </td>
    </tr>
  )

  return (
    <AppLayout>
      <GuestHeader />
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">IKSP/CL</h1>
            <p className="text-muted-foreground">Indigenous Knowledge and Skills Portfolio / Cultural Library</p>
          </div>
          {(userRole === 'admin' || userRole === 'staff') && (
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  setEditingMaterial(null)
                  setIsModalOpen(true)
                }}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-gold-accent hover:text-dark-navy hover:shadow-lg hover:scale-105 transition-all duration-300 transform font-semibold active:scale-95"
              >
                <Plus size={20} />
                Add Material
              </button>
              <label className="w-full md:w-auto flex items-center justify-center gap-2 bg-secondary text-foreground px-4 py-2.5 rounded-lg hover:bg-gold-accent hover:text-dark-navy hover:shadow-lg hover:scale-105 transition-all duration-300 transform font-semibold active:scale-95 cursor-pointer">
                <FileUp size={20} />
                Import CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Info Box */}
        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-900">
              <strong>Welcome to IKSP/CL!</strong> Browse public Indigenous Knowledge and Skills Portfolio materials freely. Some materials marked as Sacred or Restricted require FPIC (Free, Prior, and Informed Consent) and are available only to registered members. Log in to access these materials.
            </p>
          </div>
        )}

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

        {/* Material Modal */}
        {(userRole === 'admin' || userRole === 'staff') && (
          <MaterialModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false)
                setEditingMaterial(null)
              }}
              onSubmit={handleAddMaterial}
              initialData={editingMaterial}
              typeOptions={['IKSP', 'CL']}
            />
        )}
      </div>
    </AppLayout>
  )
}
