"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import Table from '@/components/Table'
import StatusBadge from '@/components/StatusBadge'
import BookModal from '@/components/BookModal'
import { mockBooks } from '@/lib/mockData'
import { Plus, Search, Edit, Trash2, Grid3x3, List, BookOpen, FileUp } from 'lucide-react'

export default function BooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState(mockBooks)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'

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

  const handleImportCSV = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = String(event.target?.result || '')
        const lines = text.split('\n')
        const headers = lines[0].split(',')
        
        const newBooks = lines.slice(1)
          .filter(line => line.trim())
          .map((line) => {
            const values = line.split(',')
            return {
              id: Math.max(...books.map((b) => b.id), 0) + 1,
              code: values[0]?.trim() || '',
              resourceType: values[1]?.trim() || '',
              title: values[2]?.trim() || '',
              author: values[3]?.trim() || '',
              publisher: values[4]?.trim() || '',
              subject: values[5]?.trim() || '',
              datePublished: values[6]?.trim() || '',
              copies: parseInt(values[7]) || 0,
              status: values[8]?.trim() || 'Available',
              dateAdded: new Date().toISOString().split('T')[0],
            }
          })
        
        setBooks([...books, ...newBooks])
        alert(`Successfully imported ${newBooks.length} books from CSV`)
      } catch (error) {
        alert('Error importing CSV: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
    reader.readAsText(file)
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
            className="p-2 text-blue-500 hover:bg-blue-50 hover:shadow-md hover:scale-125 rounded-lg transition-all duration-300 transform"
            title="Edit book"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteBook(book.id)}
            className="p-2 text-red-500 hover:bg-red-50 hover:shadow-md hover:scale-125 rounded-lg transition-all duration-300 transform"
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
      <div className="space-y-6">
        {/* Header with Title and Action Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Library Materials</h1>
            <p className="text-muted-foreground">Manage library book collection • {filteredBooks.length} items</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                setEditingBook(null)
                setIsModalOpen(true)
              }}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-gold-accent hover:text-dark-navy hover:shadow-lg hover:scale-105 transition-all duration-300 transform font-semibold active:scale-95"
            >
              <Plus size={20} />
              Add Book
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
        </div>

        {/* Search and Filter Bar */}
        <div className="card-soft">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search by title, author, code, or publisher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Reserved">Reserved</option>
              </select>
              
              {/* View Toggle */}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2.5 rounded-lg transition-smooth ${
                    viewMode === 'table'
                      ? 'bg-primary text-white'
                      : 'bg-background border border-border text-foreground hover:bg-accent'
                  }`}
                  title="Table view"
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-smooth ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'bg-background border border-border text-foreground hover:bg-accent'
                  }`}
                  title="Grid view"
                >
                  <Grid3x3 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'table' ? (
          <Table columns={columns} data={filteredBooks} renderRow={renderRow} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="card-elevated group overflow-hidden flex flex-col h-full"
              >
                {/* Book Cover Placeholder */}
                <div className="w-full h-40 bg-gradient-to-br from-primary to-accent-blue rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen size={48} className="text-white opacity-50" />
                </div>

                {/* Book Info */}
                <div className="flex-1 flex flex-col">
                  <p className="text-xs font-mono text-muted-foreground mb-2">{book.code}</p>
                  <h3 className="font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{book.author}</p>

                  <div className="flex gap-2 mb-4 flex-wrap">
                    <StatusBadge status={book.status} />
                    <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {book.copies} copies
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4">{book.publisher}</p>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <button
                    onClick={() => handleEditBook(book)}
                    className="flex-1 py-2 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm transition-smooth flex items-center justify-center gap-1"
                    title="Edit"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="flex-1 py-2 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-smooth flex items-center justify-center gap-1"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No books found matching your criteria</p>
          </div>
        )}

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
