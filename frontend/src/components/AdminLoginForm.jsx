// components/AdminLoginForm.jsx — separate from LoginForm since admin uses
// EMAIL (not phone) and hits a completely different backend route

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'

function AdminLoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await api.post('/admin/login', { email, password })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', 'admin') // no id to save — admin has no DB document, remember
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit}
        className="bg-white border-2 border-dashed border-steel rounded-lg p-8 w-80 flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold text-ink text-center">Admin login</h2>

        <input type="email" placeholder="Admin email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink" />

        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink" />

        {error && <p className="text-rust text-sm">{error}</p>}

        <button type="submit" className="bg-amber text-white py-2 rounded-md font-medium">
          Log in
        </button>
      </form>
    </div>
  )
}

export default AdminLoginForm