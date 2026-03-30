"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import GuestHeader from '@/components/GuestHeader'
import Table from '@/components/Table'
import StatusBadge from '@/components/StatusBadge'
import BookModal from '@/components/BookModal'
import MaterialInfoModal from '@/components/MaterialInfoModal'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { Plus, Search, Edit, Trash2, Grid3x3, List, BookOpen, FileUp, Check } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function BooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [userRole, setUserRole] = useState('user')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [borrowedBooks, setBorrowedBooks] = useState([])
  const [showAccountPrompt, setShowAccountPrompt] = useState(false)
  const [pendingBorrowBookId, setPendingBorrowBookId] = useState(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'user'
    const loggedIn = !!localStorage.getItem('isLoggedIn')
    setUserRole(role)
    setIsLoggedIn(loggedIn)
  }, [])

  const [selectedCategory, setSelectedCategory] = useState('')

  const classificationCategories = [
    'Monograph',
    'Article',
    'Thesis',
    'Audio',
    'Video',
    'Report',
    'IKSP/CL',
    'Unclassified',
  ];
  useEffect(() => {
    try {
      const action = searchParams?.get('action')
      const bookIdParam = searchParams?.get('bookId')
      if (action === 'borrow' && bookIdParam && isLoggedIn) {
        const id = isNaN(Number(bookIdParam)) ? bookIdParam : Number(bookIdParam)
        performBorrow(id)
        // remove query by replacing to /books
        router.replace('/books')
      }
    } catch (e) {
      // ignore
    }
  }, [searchParams, isLoggedIn, router])

  // Load books from Firestore on page load
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'books'))
        const fbBooks = snapshot.docs.map((d) => {
          const data = d.data() || {}
          return {
            id: d.id,
            code: data.code || '',
            resourceType: data.resourceType || '',
            title: data.title || '',
            author: data.author || '',
            publisher: data.publisher || '',
            subject: data.subject || '',
            datePublished: data.datePublished || '',
            copies: data.copies || 0,
            status: data.status || (data.availability === 'Hardcopy' ? 'Available' : 'Available'),
            dateAdded: data.dateAdded || '',
            availability: data.availability || 'Both',
            classification: data.classification || '',
            keywords: data.keywords || '',
          }
        })
        // Always replace local state with Firestore results (empty array allowed)
        setBooks(fbBooks)
      } catch (err) {
        console.error('Error fetching books from Firestore:', err)
      }
    }

    fetchBooks()
  }, [])

  const getClassification = (resourceType) => {
    if (!resourceType) return 'Unclassified';
    const t = String(resourceType).toLowerCase();
    if (t.includes('book') || t.includes('monograph')) return 'Monograph';
    if (t.includes('article') || t.includes('journal')) return 'Article';
    if (t.includes('thesis') || t.includes('dissertation')) return 'Thesis';
    if (t.includes('audio') || t.includes('sound') || t.includes('recording')) return 'Audio';
    if (t.includes('video') || t.includes('film') || t.includes('dvd')) return 'Video';
    if (t.includes('report')) return 'Report';
    if (t.includes('iksp') || t.includes('cl')) return 'IKSP/CL';
    return 'Unclassified';
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !filterStatus || book.status === filterStatus
    const matchesCategory = !selectedCategory || getClassification(book.resourceType) === selectedCategory

    return matchesSearch && matchesStatus && matchesCategory
  })
  

  const handleAddBook = async (formData) => {
    // If editing an existing local-only book
    if (editingBook) {
      // If editing an existing Firestore document, update it
      try {
        if (editingBook.id) {
          const bookRef = doc(db, 'books', String(editingBook.id))
          await updateDoc(bookRef, {
            ...formData,
            copies: Number(formData.copies) || 0,
          })
        }

        // Update local state
        setBooks(
          books.map((book) =>
            book.id === editingBook.id ? { ...formData, id: editingBook.id } : book
          )
        )
        setEditingBook(null)
        setIsModalOpen(false)

        // Notify user
        try {
          toast({ title: 'Book updated', description: `${formData.title || 'Book'} updated successfully.` })
        } catch (e) {
          // ignore toast errors
        }

        return
      } catch (err) {
        console.error('Error updating book in Firestore:', err)
        alert('Failed to update book. Check console for details.')
        return
      }
    }

    // Create a new document in Firestore 'books' collection
    try {
      const docRef = await addDoc(collection(db, 'books'), {
        ...formData,
        copies: Number(formData.copies) || 0,
        dateAdded: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      })

      const newBook = {
        ...formData,
        id: docRef.id,
        copies: Number(formData.copies) || 0,
        dateAdded: new Date().toISOString().split('T')[0],
      }

      setBooks([...books, newBook])
      setIsModalOpen(false)

      // Notify user
      try {
        toast({ title: 'Book added', description: `${formData.title || 'Book'} added successfully.` })
      } catch (e) {
        // ignore toast errors
      }
    } catch (err) {
      console.error('Error saving book to Firestore:', err)
      alert('Failed to save book. Check console for details.')
    }
  }

  const handleEditBook = (book) => {
    setEditingBook(book)
    setIsModalOpen(true)
  }

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return

    // Optimistically remove from UI after successful delete (or local-only)
    try {
      // capture title for toast
      const book = books.find((b) => b.id === bookId)
      const title = book?.title || 'Book'

      // If bookId looks like a Firestore doc id (string), attempt to delete from Firestore
      if (typeof bookId === 'string') {
        await deleteDoc(doc(db, 'books', String(bookId)))
      }

      // Remove from local state regardless
      setBooks(books.filter((book) => book.id !== bookId))

      // Notify user
      try {
        toast({ title: 'Book deleted', description: `${title} deleted successfully.`, variant: 'destructive' })
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('Error deleting book from Firestore:', err)
      alert('Failed to delete book. Check console for details.')
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

  const handleBorrowBook = (bookId) => {
    const logged = !!localStorage.getItem('isLoggedIn')
    if (!logged) {
      // Show a prompt asking if user has account
      setPendingBorrowBookId(bookId)
      setShowAccountPrompt(true)
      return
    }

    performBorrow(bookId)
  }

  const performBorrow = (bookId) => {
    const book = books.find(b => b.id === bookId)
    if (!book) return

    if (book.status !== 'Available') {
      alert('This book is not available for borrowing at the moment.')
      return
    }

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14) // 2 weeks borrowing period

    const borrowRecord = {
      bookId,
      bookTitle: book.title,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
    }

    setBorrowedBooks((prev) => [...prev, borrowRecord])

    // Update book status to borrowed
    setBooks((prev) => prev.map(b => b.id === bookId ? { ...b, status: 'Borrowed' } : b))

    alert(`Successfully borrowed "${book.title}". Due date: ${borrowRecord.dueDate}`)
  }

  const handlePromptSignIn = () => {
    const next = encodeURIComponent(`/books?action=borrow&bookId=${pendingBorrowBookId}`)
    router.push(`/login?mode=signin&next=${next}`)
  }

  const handlePromptSignUp = () => {
    const next = encodeURIComponent(`/books?action=borrow&bookId=${pendingBorrowBookId}`)
    router.push(`/login?mode=signup&next=${next}`)
  }

  const handlePromptCancel = () => {
    setShowAccountPrompt(false)
    setPendingBorrowBookId(null)
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
    { key: 'availability', label: 'Availability', width: '10%' },
    { key: 'status', label: 'Status', width: '10%' },
    { key: 'actions', label: 'Actions', width: '8%' },
  ]
  const renderRow = (book) => (
    <tr key={book.id} className="border-b border-border hover:bg-[hsl(205,30%,88%)] dark:hover:bg-[hsl(205,54%,20%)] transition-all duration-300 ease-in-out">
      <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{book.code}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{book.resourceType}</td>
      <td className="px-6 py-4 text-sm text-foreground font-medium cursor-pointer" onClick={() => setSelectedBook(book)}>{book.title}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{book.author}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{book.publisher}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{book.subject}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{book.datePublished}</td>
      <td className="px-6 py-4 text-sm text-foreground font-medium text-center">{book.copies}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{book.availability || 'Both'}</td>
      <td className="px-6 py-4 text-sm">
        <StatusBadge status={book.status} />
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="flex gap-2">
          {(userRole === 'admin' || userRole === 'staff') ? (
            <>
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
            </>
          ) : (
            <button
              onClick={() => handleBorrowBook(book.id)}
              disabled={book.status !== 'Available'}
              className={`p-2 rounded-lg transition-all duration-300 transform ${
                book.status === 'Available'
                  ? 'text-green-500 hover:bg-green-50 hover:shadow-md hover:scale-125'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              title={book.status === 'Available' ? 'Borrow this book' : 'Not available'}
            >
              <Check size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )

  return (
    <AppLayout>
      <GuestHeader />
      {showAccountPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handlePromptCancel} />
          <div className="relative z-60 max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Sign in to borrow</h3>
              <p className="text-sm text-muted-foreground mb-4">Do you already have an account with NCIP Library?</p>
              <div className="flex gap-2 justify-end">
                <button onClick={handlePromptCancel} className="px-3 py-2 rounded-lg bg-background border border-border">Cancel</button>
                <button onClick={handlePromptSignUp} className="px-3 py-2 rounded-lg bg-primary text-white">No — Create account</button>
                <button onClick={handlePromptSignIn} className="px-3 py-2 rounded-lg bg-secondary text-foreground">Yes — Sign in</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6">
        {/* Header with Title and Action Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Library Materials</h1>
            <p className="text-muted-foreground">{userRole === 'user' ? 'Browse and borrow books' : 'Manage library book collection'} • {filteredBooks.length} items</p>
          </div>
          {(userRole === 'admin' || userRole === 'staff') && (
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
          )}
        </div>

        {/* Info Box */}
        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Welcome!</strong> You can browse and explore all our library materials freely. To borrow a book, simply click the checkmark icon and you'll be prompted to log in.
            </p>
          </div>
        )}

        {/* Browse by Category (derived from resourceType) */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold mb-3">Browse by Category</h3>
          <div className="flex flex-wrap gap-2">
            {classificationCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                className={`px-3 py-2 rounded-md text-sm ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-background border border-border text-foreground'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          {selectedCategory && (
            <div className="mt-2 text-sm text-muted-foreground">Filtering by <strong>{selectedCategory}</strong></div>
          )}
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
                className="card-elevated group overflow-hidden flex flex-col h-full cursor-pointer"
                onClick={() => setSelectedBook(book)}
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

                  <div className="flex gap-2 mb-4 flex-wrap items-center">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 border border-gray-200">
                      {getClassification(book.resourceType)}
                    </span>
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
                    onClick={(e) => { e.stopPropagation(); handleEditBook(book) }}
                    className="flex-1 py-2 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm transition-smooth flex items-center justify-center gap-1"
                    title="Edit"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteBook(book.id) }}
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
        <MaterialInfoModal
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          book={selectedBook}
          onBorrow={handleBorrowBook}
          userRole={userRole}
        />
        {(userRole === 'admin' || userRole === 'staff') && (
          <BookModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setEditingBook(null)
            }}
            onSubmit={handleAddBook}
            initialData={editingBook}
          />
        )}
      </div>
    </AppLayout>
  )
}

