"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import Table from '@/components/Table'
import StatusBadge from '@/components/StatusBadge'
import BookModal from '@/components/BookModal'
import { mockBooks } from '@/lib/mockData'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'

export default function BooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState(mockBooks)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') 
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !filterStatus || book.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleAddBook = (formData) => {
    if (editingBook) {
      setBooks(
        books.map((book) =>
          book.id === editingBook.id ? { ...formData, id: editingBook.id } : book
        )
      )
      setEditingBook(null)
    } else {
      const newBook = {
        ...formData,
        id: Math.max(...books.map((b) => b.id), 0) + 1,
        dateAdded: new Date().toISOString().split('T')[0],
      }
      setBooks([...books, newBook])
    }
    setIsModalOpen(false)
  }

  const handleEditBook = (book) => {
    setEditingBook(book)
    setIsModalOpen(true)
  }

  const handleDeleteBook = (bookId) => {
    if (confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter((book) => book.id !== bookId))
    }
  }

  const columns = [
    { key: 'code', label: 'CODE', width: '12%' },
    { key: 'resourceType', label: 'Resource Type', width: '10%' },
    { key: 'title', label: 'Title', width: '18%' },
    { key: 'author', label: 'Author', width: '12%' },
    { key: 'publisher', label: 'Publisher', width: '12%' },
    { key: 'subject', label: 'Subject', width: '12%' },
    { key: 'datePublished', label: 'Date Published', width: '10%' },
    { key: 'copies', label: 'Number of Copies', width: '8%' },
    { key: 'status', label: 'Availability', width: '10%' },
    { key: 'actions', label: 'Actions', width: '8%' },
  ]

  const renderRow = (book) => (
    <>
      <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{book.code}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{book.resourceType}</td>
      <td className="px-6 py-4 text-sm text-foreground font-medium">{book.title}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{book.author}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{book.publisher}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{book.subject}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{book.datePublished}</td>
      <td className="px-6 py-4 text-sm text-foreground font-medium text-center">{book.copies}</td>
      <td className="px-6 py-4 text-sm">
        <StatusBadge status={book.status} />
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="flex gap-2">
          <button
            onClick={() => handleEditBook(book)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit book"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteBook(book.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete book"
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Library Materials</h1>
            <p className="text-muted-foreground">Manage library book collection</p>
          </div>
          <button
            onClick={() => {
              setEditingBook(null)
              setIsModalOpen(true)
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-secondary transition-colors font-semibold"
          >
            <Plus size={20} />
            Add Book
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by title, author, code, or publisher..."
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
            <option value="Available">Available</option>
            <option value="Borrowed">Borrowed</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>

        {/* Books Table */}
        <Table columns={columns} data={filteredBooks} renderRow={renderRow} />

        {/* Book Modal */}
        <BookModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingBook(null)
          }}
          onSubmit={handleAddBook}
          initialData={editingBook}
        />
      </div>
    </AppLayout>
  )
}
