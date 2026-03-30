'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const BookModal = ({ isOpen, onClose, onSubmit, initialData, suggestCode }) => {
  const defaultForm = {
    code: '',
    resourceType: '',
    title: '',
    author: '',
    publisher: '',
    subject: '',
    datePublished: '',
    copies: 1,
    availability: 'Both',
    keywords: '',
  }

  const [formData, setFormData] = useState(initialData || defaultForm)

  // Update form when editing an existing book (initialData changes)
  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultForm, ...initialData })
    } else {
      setFormData(defaultForm)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'copies' ? parseInt(value) : value,
    }))

    // When resourceType changes for a new book, optionally request a suggested code
    if (name === 'resourceType' && !initialData && typeof suggestCode === 'function') {
      try {
        const suggested = suggestCode(value)
        if (suggested) {
          setFormData((prev) => ({ ...prev, code: suggested }))
        }
      } catch (e) {
        // ignore suggestion errors
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Do not submit any A-Z classification persisted previously — classification is derived from resourceType
    const payload = { ...formData }
    if ('classification' in payload) delete payload.classification
    onSubmit(payload)
    setFormData({
      ...defaultForm,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            {initialData ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter resource code"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Resource Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Resource Type</label>
            <select
              name="resourceType"
              value={formData.resourceType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            >
              <option value="">Select resource type</option>
              <option>Book</option>
              <option>Article</option>
              <option>Report</option>
              <option>Thesis</option>
              <option>Electronic Resources</option>
              <option>Magazine</option>
              <option>Compilation</option>
              <option>Brochure / Flyer</option>
              <option>Case Study</option>
              <option>Research Paper</option>
              <option>Newspaper</option>
              <option>Printed Powerpoint</option>
              <option>Module</option>
            </select>
          </div>

          {/* Classification is derived from Resource Type; no manual A-Z input */}

          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Publisher */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Enter publisher"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Date Published */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Date Published</label>
            <input
              type="date"
              name="datePublished"
              value={formData.datePublished}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Number of Copies */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Number of Copies</label>
            <input
              type="number"
              name="copies"
              value={formData.copies}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Availability</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option>Hardcopy</option>
              <option>Softcopy</option>
              <option>Both</option>
            </select>
          </div>

          {/* Keywords */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Keywords</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="Enter comma-separated keywords"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex gap-3 pt-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
            >
              {initialData ? 'Update' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookModal
