//let the worker pick an image from their device and upload it — wiring to the Cloudinary upload API from Phase 2. This is your first frontend file upload, which works a bit differently from normal form fields.
//Normal inputs (text, number) send plain data as JSON. A file can't travel as JSON — it needs a special format called FormData, which is like an envelope built specifically for carrying files over the network. Your backend's Multer middleware (Phase 2) is built to expect exactly this format, under a field named photo — so the frontend and backend have to agree on that name.





// Worker profile photo upload component

import { useState } from 'react'
import api from '../utils/axios'

function PhotoUpload() {
  // Component state
  const [file, setFile] = useState(null)           // Selected image file
  const [previewUrl, setPreviewUrl] = useState('') // Uploaded photo URL
  const [message, setMessage] = useState('')       // Success/error message
  const [loading, setLoading] = useState(false)    // Upload status

  // Store the selected file
  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  // Upload the selected photo to the backend
  const handleUpload = async () => {
    // Don't continue if no file is selected
    if (!file) {
      setMessage('Pick a photo first')
      return
    }

    setLoading(true)
    setMessage('')

    // Create form data and attach the photo
    const formData = new FormData()
    formData.append('photo', file)

    try {
      // Call PUT /api/workers/profile-photo
      const response = await api.put('/workers/profile-photo', formData, {
        // Tell the backend this request contains a file
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // Save the uploaded photo URL
      setPreviewUrl(response.data.profilePhoto)
      setMessage('Photo uploaded successfully')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed. Try again.')
    } finally {
      // Reset loading state
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md flex flex-col gap-4">
      <h2 className="font-display text-2xl font-semibold text-ink">Profile photo</h2>

      {/* Show uploaded profile photo */}
      {previewUrl && (
        <img src={previewUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
      )}

      {/* Image file picker */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-sm text-ink"
      />

      {/* Display status message */}
      {message && <p className="text-sm text-teal">{message}</p>}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-amber text-white py-2 rounded-md font-medium disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload photo'}
      </button>
    </div>
  )
}

export default PhotoUpload