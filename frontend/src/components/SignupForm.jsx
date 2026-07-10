import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../utils/axios'
import { validateName, validatePhone, validatePassword } from '../utils/validators' // NEW
import { User, Lock, Phone, Wrench } from 'lucide-react'

function SignupForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') === 'worker' ? 'worker' : 'customer')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [workType, setWorkType] = useState('Plumber')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // NEW — same idea as LoginForm: one object holding an error message per field
  const [fieldErrors, setFieldErrors] = useState({ name: '', phone: '', password: '' })

  // NEW — checks all three fields, saves any error messages, returns whether the form is valid overall
  const validateForm = () => {
    const nameError = validateName(name)
    const phoneError = validatePhone(phone)
    const passwordError = validatePassword(password)

    setFieldErrors({ name: nameError, phone: phoneError, password: passwordError })

    return !nameError && !phoneError && !passwordError
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // NEW — stop here if anything's invalid, before calling the backend at all
    const isValid = validateForm()
    if (!isValid) return

    setLoading(true)

    const endpoint = role === 'worker' ? '/workers/register' : '/customers/register'

    const body = role === 'worker'
      ? { name, phone, password, workType }
      : { name, phone, password }

    try {
      const response = await api.post(endpoint, body)

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
            Create your account
          </h2>
          <p className="text-steel text-sm mt-1">Join HandyHQ in a minute</p>
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

        {/* name field */}
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={18} />
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`border rounded-lg pl-10 pr-3 py-2.5 text-ink w-full focus:outline-none ${
                fieldErrors.name ? 'border-rust' : 'border-steel/40 focus:border-ink'
              }`}
            />
          </div>
          {fieldErrors.name && <p className="text-rust text-xs mt-1">{fieldErrors.name}</p>}
        </div>

        {/* phone field */}
        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={18} />
            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`border rounded-lg pl-10 pr-3 py-2.5 text-ink w-full focus:outline-none ${
                fieldErrors.phone ? 'border-rust' : 'border-steel/40 focus:border-ink'
              }`}
            />
          </div>
          {fieldErrors.phone && <p className="text-rust text-xs mt-1">{fieldErrors.phone}</p>}
        </div>

        {/* password field */}
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

        {/* workType only shows for workers — unchanged conditional logic, no validation needed
            since it's a dropdown with a preset default, can never be "invalid" */}
        {role === 'worker' && (
          <div className="relative">
            <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={18} />
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="border border-steel/40 rounded-lg pl-10 pr-3 py-2.5 text-ink w-full focus:outline-none focus:border-ink appearance-none"
            >
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Labourer">Labourer</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Painter">Painter</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}

        {error && <p className="text-rust text-sm text-center">{error}</p>}

        <button type="submit" disabled={loading}
          className="bg-amber text-white py-2.5 rounded-lg font-medium hover:bg-amber/90 transition-colors disabled:opacity-50">
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
    </div>
  )
}

export default SignupForm