'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import Table from '@/components/Table'
import StatusBadge from '@/components/StatusBadge'
import BorrowingModal from '@/components/BorrowingModal'
import { mockBorrowingHistory, mockMembers, mockBooks } from '@/lib/mockData'
import { Plus, RotateCw, Search } from 'lucide-react'

export default function BorrowingPage() {
  const router = useRouter()
  const [borrowings, setBorrowings] = useState(mockBorrowingHistory)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  const getMemberName = (memberId) => {
    const member = mockMembers.find((m) => m.id === memberId)
    return member ? member.name : 'Unknown Member'
  }

  const getBookTitle = (bookId) => {
    const book = mockBooks.find((b) => b.id === bookId)
    return book ? book.title : 'Unknown Book'
  }

  const filteredBorrowings = borrowings.filter((borrowing) => {
    const memberName = getMemberName(borrowing.memberId)
    const bookTitle = getBookTitle(borrowing.bookId)

    const matchesSearch =
      memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !filterStatus || borrowing.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleBorrowBook = (formData) => {
    const newBorrowing = {
      id: Math.max(...borrowings.map((b) => b.id), 0) + 1,
      memberId: parseInt(formData.memberId),
      bookId: parseInt(formData.bookId),
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      returnDate: null,
      status: 'Active',
    }
    setBorrowings([...borrowings, newBorrowing])
    setIsBorrowModalOpen(false)
  }

  const handleReturnBook = (borrowingId) => {
    setBorrowings(
      borrowings.map((borrowing) =>
        borrowing.id === borrowingId
          ? {
              ...borrowing,
              returnDate: new Date().toISOString().split('T')[0],
              status: 'Returned',
            }
          : borrowing
      )
    )
    setIsReturnModalOpen(false)
  }

  const columns = [
    { key: 'member', label: 'Member', width: '20%' },
    { key: 'book', label: 'Book', width: '25%' },
    { key: 'borrowDate', label: 'Borrow Date', width: '12%' },
    { key: 'dueDate', label: 'Due Date', width: '12%' },
    { key: 'returnDate', label: 'Return Date', width: '12%' },
    { key: 'status', label: 'Status', width: '10%' },
    { key: 'actions', label: 'Actions', width: '9%' },
  ]

  const renderRow = (borrowing) => (
    <>
      <td className="px-6 py-4 text-sm text-foreground font-medium">
        {getMemberName(borrowing.memberId)}
      </td>
      <td className="px-6 py-4 text-sm text-muted-foreground">
        {getBookTitle(borrowing.bookId)}
      </td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{borrowing.borrowDate}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{borrowing.dueDate}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">
        {borrowing.returnDate || '-'}
      </td>
      <td className="px-6 py-4 text-sm">
        <StatusBadge status={borrowing.status} />
      </td>
      <td className="px-6 py-4 text-sm">
        {borrowing.status === 'Active' && (
          <button
            onClick={() => handleReturnBook(borrowing.id)}
            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
            title="Return book"
          >
            <RotateCw size={18} />
          </button>
        )}
      </td>
    </>
  )

  return (
    <AppLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Book Borrowing</h1>
            <p className="text-muted-foreground">Manage book loans and returns</p>
          </div>
          <button
            onClick={() => setIsBorrowModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-secondary transition-colors font-semibold"
          >
            <Plus size={20} />
            Borrow Book
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by member name or book title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Returned">Returned</option>
          </select>
        </div>

        {/* Borrowings Table */}
        <Table columns={columns} data={filteredBorrowings} renderRow={renderRow} />

        {/* Borrow Modal */}
        <BorrowingModal
          isOpen={isBorrowModalOpen}
          onClose={() => setIsBorrowModalOpen(false)}
          onSubmit={handleBorrowBook}
          members={mockMembers}
          books={mockBooks}
          isBorrowing={true}
        />
      </div>
    </AppLayout>
  )
}
