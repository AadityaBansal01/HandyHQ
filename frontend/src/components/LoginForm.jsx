// login form for both workers and customers (same fields, different role)

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import { validatePhone, validatePassword } from '../utils/validators' // NEW
import { Lock, Phone } from 'lucide-react'

function LoginForm() {
  const navigate = useNavigate()

  const [role, setRole] = useState('customer')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // NEW — one small object holding a per-field error message, separate from "error"
  // which is reserved for the BACKEND's error (wrong password, etc).
  // fieldErrors is only for catching typos BEFORE we even try calling the backend
  const [fieldErrors, setFieldErrors] = useState({ phone: '', password: '' })

  // NEW — runs all validators, updates fieldErrors, and returns true/false
  // so handleSubmit can decide whether to actually call the API or stop early
  const validateForm = () => {
    const phoneError = validatePhone(phone)
    const passwordError = validatePassword(password)

    setFieldErrors({ phone: phoneError, password: passwordError })

    // form is valid only if EVERY validator came back with an empty string
    return !phoneError && !passwordError
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // NEW — check the form BEFORE touching the network at all.
    // if anything's wrong, stop here — don't waste a request on data we already know is bad
    const isValid = validateForm()
    if (!isValid) return

    setLoading(true)

    const endpoint = role === 'worker' ? '/workers/login' : '/customers/login'

    try {
      const response = await api.post(endpoint, { phone, password })

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', role)
      localStorage.setItem('userId', role === 'worker' ? response.data.worker.id : response.data.customer.id)

      navigate(role === 'worker' ? '/worker/dashboard' : '/customer/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 w-full max-w-sm flex flex-col gap-5"
      >
        <div className="text-center pb-1">
          <div className="w-10 h-10 rounded-md bg-ink flex items-center justify-center mx-auto mb-3">
            <span className="font-display text-paper font-semibold text-sm">H</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Welcome back
          </h2>
          <p className="text-steel text-sm mt-1">Log in to continue</p>
        </div>

        <div className="flex gap-2 bg-paper rounded-lg p-1">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
              role === 'customer' ? 'bg-amber text-white' : 'text-steel'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
              role === 'worker' ? 'bg-amber text-white' : 'text-steel'
            }`}
          >
            Worker
          </button>
        </div>

        {/* phone field — now shows its own error UNDER the box, separate from backend errors */}
        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={18} />
            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              // NEW — border turns rust-red if this field has an error, normal otherwise
              className={`border rounded-lg pl-10 pr-3 py-2.5 text-ink w-full focus:outline-none ${
                fieldErrors.phone ? 'border-rust' : 'border-steel/40 focus:border-ink'
              }`}
            />
          </div>
          {/* NEW — only renders when there's actually a phone error to show */}
          {fieldErrors.phone && <p className="text-rust text-xs mt-1">{fieldErrors.phone}</p>}
        </div>

        {/* password field — same pattern as phone above */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border rounded-lg pl-10 pr-3 py-2.5 text-ink w-full focus:outline-none ${
                fieldErrors.password ? 'border-rust' : 'border-steel/40 focus:border-ink'
              }`}
            />
          </div>
          {fieldErrors.password && <p className="text-rust text-xs mt-1">{fieldErrors.password}</p>}
        </div>

        {/* this is still the BACKEND error (wrong password, etc) — unchanged from before */}
        {error && <p className="text-rust text-sm text-center">{error}</p>}

        <button type="submit" disabled={loading}
          className="bg-amber text-white py-2.5 rounded-lg font-medium hover:bg-amber/90 transition-colors disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm