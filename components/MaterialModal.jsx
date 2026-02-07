'use client'

import { useState, useEffect } from 'react'
import { X, Lock, AlertTriangle } from 'lucide-react'

const MaterialModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    codeNumber: '',
    region: '',
    province: '',
    municipality: '',
    barangay: '',
    group: '',
    title: '',
    type: 'IKSP',
    copies: 1,
    lastUpdated: new Date().toISOString().split('T')[0],
    subject: '',
    remarks: '',
    sensitivity: 'Public',
    fpicRequired: false,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        codeNumber: '',
        region: '',
        province: '',
        municipality: '',
        barangay: '',
        group: '',
        title: '',
        type: 'IKSP',
        copies: 1,
        lastUpdated: new Date().toISOString().split('T')[0],
        subject: '',
        remarks: '',
        sensitivity: 'Public',
        fpicRequired: false,
      })
    }
    setErrors({})
  }, [isOpen, initialData])

  const regions = [
    'Region I (Ilocos)',
    'Region II (Cagayan)',
    'Region III (Central Luzon)',
    'Region IV-A (Calabarzon)',
    'Region IV-B (Mimaropa)',
    'Region V (Bicol)',
    'Region VI (Western Visayas)',
    'Region VII (Central Visayas)',
    'Region VIII (Eastern Visayas)',
    'Region IX (Zamboanga)',
    'Region X (Northern Mindanao)',
    'Region XI (Davao)',
    'Region XII (Soccsksargen)',
    'Region XIII (Caraga)',
    'NCR (National Capital Region)',
    'CAR (Cordillera)',
    'ARMM (Autonomous Region)',
  ]

  const types = ['IKSP', 'CL', 'Both']
  const sensitivities = ['Public', 'Restricted', 'Sacred']

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.codeNumber.trim()) newErrors.codeNumber = 'Code Number is required'
    if (!formData.region.trim()) newErrors.region = 'Region is required'
    if (!formData.province.trim()) newErrors.province = 'Province is required'
    if (!formData.municipality.trim()) newErrors.municipality = 'Municipality is required'
    if (!formData.barangay.trim()) newErrors.barangay = 'Barangay is required'
    if (!formData.group.trim()) newErrors.group = 'Group is required'
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.type) newErrors.type = 'Type is required'
    if (formData.copies <= 0) newErrors.copies = 'Number of copies must be greater than 0'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl-navy max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-navy-header text-white p-6 flex items-center justify-between border-b border-border">
          <div>
            <h2 className="text-2xl font-bold">
              {initialData ? 'Edit Material' : 'Add New Material'}
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              Indigenous Knowledge and Skills Portfolio / Cultural Library
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Code and Region Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Code Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="codeNumber"
                value={formData.codeNumber}
                onChange={handleChange}
                placeholder="e.g., IKSP-001"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                  errors.codeNumber ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.codeNumber && <p className="text-red-500 text-xs mt-1">{errors.codeNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                  errors.region ? 'border-red-500' : 'border-border'
                }`}
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
            </div>
          </div>

          {/* Province and Municipality Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                placeholder="e.g., Laguna"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                  errors.province ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Municipality <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                placeholder="e.g., Paete"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                  errors.municipality ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.municipality && <p className="text-red-500 text-xs mt-1">{errors.municipality}</p>}
            </div>
          </div>

          {/* Barangay and Group Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Barangay <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                placeholder="e.g., Tinanggap"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                  errors.barangay ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Indigenous Group <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="group"
                value={formData.group}
                onChange={handleChange}
                placeholder="e.g., Batak, Ibaloi, T'boli"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                  errors.group ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.group && <p className="text-red-500 text-xs mt-1">{errors.group}</p>}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Material title"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                errors.title ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Type and Copies Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                  errors.type ? 'border-red-500' : 'border-border'
                }`}
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Number of Copies <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="copies"
                value={formData.copies}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                  errors.copies ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.copies && <p className="text-red-500 text-xs mt-1">{errors.copies}</p>}
            </div>
          </div>

          {/* Last Updated and Subject Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Last Updated / Published
              </label>
              <input
                type="date"
                name="lastUpdated"
                value={formData.lastUpdated}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Traditional Arts, Medicinal Plants"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                  errors.subject ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Additional remarks or notes about the material..."
              rows="3"
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Sensitivity and FPIC Section */}
          <div className="card-soft border-accent-left space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle size={18} className="text-orange-600" />
                Sensitivity Level
              </label>
              <select
                name="sensitivity"
                value={formData.sensitivity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              >
                {sensitivities.map((sensitivity) => (
                  <option key={sensitivity} value={sensitivity}>
                    {sensitivity}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-2">
                {formData.sensitivity === 'Public'
                  ? 'This material is publicly available'
                  : formData.sensitivity === 'Restricted'
                  ? 'Access to this material requires authorization'
                  : 'This material is sacred and requires special handling'}
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <Lock size={20} className="text-red-600 flex-shrink-0" />
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  name="fpicRequired"
                  checked={formData.fpicRequired}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border focus:ring-2 focus:ring-primary cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-red-700">FPIC Required</span>
                  <p className="text-xs text-red-600 mt-0.5">
                    Free, Prior and Informed Consent needed from indigenous community
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-accent transition-smooth font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-gold-accent hover:text-dark-navy transition-smooth font-semibold"
            >
              {initialData ? 'Update Material' : 'Add Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MaterialModal
