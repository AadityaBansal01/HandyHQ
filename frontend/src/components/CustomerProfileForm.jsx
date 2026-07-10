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
      className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 flex flex-col gap-6 w-full h-full">

      {/* simple text header, no avatar — customers don't have a photo upload feature */}
      <div className="pb-6 border-b border-steel/15">
        <h2 className="font-display text-xl font-semibold text-ink">{name || 'Your profile'}</h2>
        <span className="font-mono text-xs text-steel tracking-wide">CUSTOMER ACCOUNT</span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-steel text-xs font-medium uppercase tracking-wide">Full name</label>
        <input type="text" placeholder="Full name" value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-steel/40 rounded-lg px-3 py-2.5 text-ink focus:outline-none focus:border-ink" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-steel text-xs font-medium uppercase tracking-wide">Email (optional)</label>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-steel/40 rounded-lg px-3 py-2.5 text-ink focus:outline-none focus:border-ink" />
      </div>

      {message && <p className="text-sm text-teal">{message}</p>}

      <button type="submit" className="bg-amber text-white py-2.5 rounded-lg font-medium hover:bg-amber/90 transition-colors">
        Save changes
      </button>
    </form>
  )
}

export default CustomerProfileForm