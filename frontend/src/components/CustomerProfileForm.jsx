// components/CustomerProfileForm.jsx — customer edits their own name/email
// same fetch-then-edit pattern as StatusPanel, but this one also SAVES changes

import { useState, useEffect } from 'react'
import api from '../utils/axios'

function CustomerProfileForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // on load, fetch the customer's OWN profile and fill the form with their current values
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await api.get('/customers/profile')
      setName(response.data.customer.name)
      setEmail(response.data.customer.email || '') // email is optional, might be empty
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.put('/customers/profile', { name, email })
      setMessage('Profile updated')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong')
    }
  }

  if (loading) return <p className="text-steel">Loading profile...</p>

  return (
    <form onSubmit={handleSubmit}
      className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md flex flex-col gap-4 w-full">
      <h2 className="font-display text-2xl font-semibold text-ink">Your profile</h2>

      <input type="text" placeholder="Full name" value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-steel rounded-md px-3 py-2 text-ink" />

      <input type="email" placeholder="Email (optional)" value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-steel rounded-md px-3 py-2 text-ink" />

      {message && <p className="text-sm text-teal">{message}</p>}

      <button type="submit" className="bg-amber text-white py-2 rounded-md font-medium">
        Save changes
      </button>
    </form>
  )
}

export default CustomerProfileForm