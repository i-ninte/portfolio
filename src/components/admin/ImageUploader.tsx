'use client'

import { useRef, useState } from 'react'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Image',
  placeholder = 'https://example.com/image.jpg',
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Allowed: JPEG, PNG, GIF, WebP')
      return
    }

    // Validate file size (max 4.5MB)
    const maxSize = 4.5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 4.5MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to upload image')
        return
      }

      const data = await res.json()
      onChange(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          dragOver
            ? 'border-accent bg-accent/10'
            : 'border-dark-border hover:border-gray-600'
        }`}
      >
        {value ? (
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden max-h-48 mx-auto">
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-sm text-accent hover:underline disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Replace'}
              </button>
              <span className="text-gray-600">|</span>
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-sm text-red-400 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-gray-500">
              <i className="fas fa-cloud-upload-alt text-3xl mb-2" />
              <p className="text-sm">
                {uploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  'Drag & drop an image here, or'
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-outline text-sm disabled:opacity-50"
            >
              <i className="fas fa-upload mr-2" />
              Choose File
            </button>
            <p className="text-xs text-gray-600">
              Max 4.5MB. Supports JPEG, PNG, GIF, WebP
            </p>
          </div>
        )}
      </div>

      {/* URL input alternative */}
      <div className="mt-3">
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-dark text-sm pr-20"
            placeholder={placeholder}
          />
          {value && !value.startsWith('blob:') && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm"
            >
              <i className="fas fa-times" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1">Or paste an image URL directly</p>
      </div>
    </div>
  )
}
