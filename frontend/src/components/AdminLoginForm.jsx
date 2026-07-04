// components/AdminLoginForm.jsx — separate from LoginForm since admin uses
// EMAIL (not phone) and hits a completely different backend route

// components/AdminLoginForm.jsx — separate from LoginForm since admin uses
// EMAIL (not phone) and hits a completely different backend route

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import { ShieldCheck, Mail, Lock } from 'lucide-react'

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
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <form onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 pb-2">
          <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center">
            <ShieldCheck className="text-amber" size={22} />
          </div>
          <div className="text-center">
            <span className="font-mono text-xs text-steel tracking-widest">RESTRICTED ACCESS</span>
            <h2 className="font-display text-2xl font-semibold text-ink">Admin login</h2>
          </div>
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={18} />
          <input type="email" placeholder="Admin email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-steel/40 rounded-lg pl-10 pr-3 py-2.5 text-ink w-full focus:outline-none focus:border-ink" />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={18} />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-steel/40 rounded-lg pl-10 pr-3 py-2.5 text-ink w-full focus:outline-none focus:border-ink" />
        </div>

        {error && <p className="text-rust text-sm text-center">{error}</p>}

        <button type="submit" className="bg-ink text-white py-2.5 rounded-lg font-medium hover:bg-ink/90 transition-colors">
          Log in
        </button>
      </form>
    </div>
  )
}

export default AdminLoginForm