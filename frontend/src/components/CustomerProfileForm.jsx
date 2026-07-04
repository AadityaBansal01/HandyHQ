// components/CustomerProfileForm.jsx — customer edits their own name/email
// same fetch-then-edit pattern as StatusPanel, but this one also SAVES changes

import { useState, useEffect } from 'react'
import api from '../utils/axios'
import { UserCircle } from 'lucide-react'

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
      className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 max-w-md flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <UserCircle className="text-steel" size={22} />
        <h2 className="font-display text-2xl font-semibold text-ink">Your profile</h2>
      </div>

      <input type="text" placeholder="Full name" value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-steel/40 rounded-lg px-3 py-2.5 text-ink focus:outline-none focus:border-ink" />

      <input type="email" placeholder="Email (optional)" value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-steel/40 rounded-lg px-3 py-2.5 text-ink focus:outline-none focus:border-ink" />

      {message && <p className="text-sm text-teal">{message}</p>}

      <button type="submit" className="bg-amber text-white py-2.5 rounded-lg font-medium hover:bg-amber/90 transition-colors">
        Save changes
      </button>
    </form>
  )
}

export default CustomerProfileForm