'use client'

import { X } from 'lucide-react'
import { classify } from '@/lib/resourceTypes'

export default function MaterialInfoModal({ isOpen, onClose, book, onBorrow, userRole }) {
  if (!isOpen || !book) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-60 bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{book.title}</h2>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {book.coverUrl && (
              <img src={book.coverUrl} alt={`${book.title} cover`} className="w-full max-h-72 object-contain rounded mb-4" />
            )}
            <p className="text-sm text-muted-foreground mb-2"><strong>Code:</strong> {book.code}</p>
            <p className="text-sm text-muted-foreground mb-2"><strong>Resource Type:</strong> {book.resourceType}</p>
                <p className="text-sm text-muted-foreground mb-2"><strong>Classification:</strong> {classify(book.resourceType)}</p>
            <p className="text-sm text-muted-foreground mb-2"><strong>Publisher:</strong> {book.publisher}</p>
            <p className="text-sm text-muted-foreground mb-2"><strong>Subject:</strong> {book.subject}</p>
            <p className="text-sm text-muted-foreground mb-2"><strong>Date Published:</strong> {book.datePublished}</p>
            <p className="text-sm text-muted-foreground mb-2"><strong>Availability:</strong> {book.availability || 'Both'}</p>
            <p className="text-sm text-muted-foreground mb-2"><strong>Copies:</strong> {book.copies ?? '-'}</p>
            <p className="text-sm text-muted-foreground mb-2"><strong>Status:</strong> {book.status}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2"><strong>Keywords:</strong> {book.keywords || '-'}</p>
            <p className="text-sm text-muted-foreground mb-4"><strong>Description:</strong> {book.description || 'No description available.'}</p>

            <div className="mt-4 flex gap-2">
              {userRole === 'admin' || userRole === 'staff' ? (
                <button onClick={onClose} className="px-4 py-2 rounded-lg bg-background border border-border">Close</button>
              ) : (
                <>
                  <button onClick={onClose} className="px-4 py-2 rounded-lg bg-background border border-border">Close</button>
                  <button
                    onClick={() => { onBorrow && onBorrow(book.id); onClose && onClose(); }}
                    disabled={book.status !== 'Available'}
                    className={`px-4 py-2 rounded-lg ${book.status === 'Available' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}
                  >
                    {book.status === 'Available' ? 'Borrow' : 'Not available'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
