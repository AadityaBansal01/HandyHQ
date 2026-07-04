// components/SignupForm.jsx — signup form for BOTH workers and customers
// customer fields: name, phone, password
// worker fields: name, phone, password, PLUS workType (workers need this, customers don't)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'   // NEW
import api from '../utils/axios'   // NEW
import { useSearchParams } from 'react-router-dom'
import { User, Lock, Phone, Wrench } from 'lucide-react'

function SignupForm() {
    const navigate = useNavigate()   // NEW
  // ...all your existing state stays exactly the same...
  const [searchParams] = useSearchParams()
// if the URL was /signup?role=worker (from the landing page), start with Worker already selected
const [role, setRole] = useState(searchParams.get('role') === 'worker' ? 'worker' : 'customer')

  // one state slot per field — same controlled-input pattern from LoginForm
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  // workType only matters for workers, but we still need a state slot for it —
  // it just won't be SENT to the backend later if role is 'customer'
  const [workType, setWorkType] = useState('Plumber')


  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)  


  const handleSubmit = async (e) => {
      e.preventDefault()
    setError('')
    setLoading(true)

    const endpoint = role === 'worker' ? '/workers/register' : '/customers/register'

    // build the right body shape per role — customer doesn't need workType at all,
    // sending it wouldn't break anything (backend just ignores extra fields), but
    // keeping it clean means the request only ever contains what's actually relevant
    const body = role === 'worker'
      ? { name, phone, password, workType }
      : { name, phone, password }

    try {
      const response = await api.post(endpoint, body)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', role)
       // NEW
       localStorage.setItem('userId', role === 'worker' ? response.data.worker.id : response.data.customer.id)

      navigate(role === 'worker' ? '/worker/dashboard' : '/customer/dashboard')

      console.log('Signup successful:', response.data)
      // TEMPORARY — becomes a redirect to the dashboard once routing exists
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

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={18} />
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-steel/40 rounded-lg pl-10 pr-3 py-2.5 text-ink w-full focus:outline-none focus:border-ink"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={18} />
          <input
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-steel/40 rounded-lg pl-10 pr-3 py-2.5 text-ink w-full focus:outline-none focus:border-ink"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={18} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-steel/40 rounded-lg pl-10 pr-3 py-2.5 text-ink w-full focus:outline-none focus:border-ink"
          />
        </div>

        {/* CONDITIONAL RENDERING — this whole block only appears when role is 'worker'.
            When role is 'customer', React skips this entirely, like it was never written */}
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