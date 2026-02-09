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
  const [userRole, setUserRole] = useState('user')
  const [currentUserId, setCurrentUserId] = useState(1) // Mock current user ID

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    const role = localStorage.getItem('userRole') || 'user'
    setUserRole(role)
    // For users, they see their own borrowings (mocked as user ID 1)
    if (role === 'user') {
      setCurrentUserId(1)
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

    // Users only see their own borrowings
    const isOwnBorrowing = userRole === 'user' ? borrowing.memberId === currentUserId : true

    return matchesSearch && matchesStatus && isOwnBorrowing
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

  const columns = userRole === 'user' 
    ? [
        { key: 'book', label: 'Book', width: '30%' },
        { key: 'borrowDate', label: 'Borrow Date', width: '15%' },
        { key: 'dueDate', label: 'Due Date', width: '15%' },
        { key: 'returnDate', label: 'Return Date', width: '15%' },
        { key: 'status', label: 'Status', width: '12%' },
        { key: 'actions', label: 'Actions', width: '13%' },
      ]
    : [
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
      {userRole !== 'user' && (
        <td className="px-6 py-4 text-sm text-foreground font-medium">
          {getMemberName(borrowing.memberId)}
        </td>
      )}
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
            className="p-2 text-green-500 hover:bg-green-50 hover:shadow-md hover:scale-125 rounded-lg transition-all duration-300 transform"
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {userRole === 'user' ? 'My Borrowings' : 'Book Borrowing'}
            </h1>
            <p className="text-muted-foreground">
              {userRole === 'user' ? 'View and manage your borrowed books' : 'Manage book loans and returns'}
            </p>
          </div>
          {(userRole === 'admin' || userRole === 'staff') && (
            <button
              onClick={() => setIsBorrowModalOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-gold-accent hover:text-dark-navy hover:shadow-lg hover:scale-105 transition-all duration-300 transform font-semibold active:scale-95"
            >
              <Plus size={20} />
              Borrow Book
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder={userRole === 'user' ? 'Search your borrowings...' : 'Search by member name or book title...'}
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
        {(userRole === 'admin' || userRole === 'staff') && (
          <BorrowingModal
            isOpen={isBorrowModalOpen}
            onClose={() => setIsBorrowModalOpen(false)}
            onSubmit={handleBorrowBook}
            members={mockMembers}
            books={mockBooks}
            isBorrowing={true}
          />
        )}
      </div>
    </AppLayout>
  )
}
