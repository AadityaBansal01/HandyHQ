
// login form for both workers and customers (same fields, different role)

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'   // NEW
import api from '../utils/axios'   // NEW — our central request tool
import { User, Lock, Phone } from 'lucide-react'

function LoginForm() {

    const navigate = useNavigate()   // NEW — lets us send the user to a new URL in code
    // ...all your existing state stays exactly the same...
  // Component state: selected role + form inputs
  const [role, setRole] = useState('customer')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')


  // NEW — two more pieces of state: one to show errors, one to show a "loading" state
  // while waiting for the backend to respond (so the button can say "Logging in...")
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Runs when login form is submitted
  const handleSubmit = async (e) => {   // CHANGED — now "async" because we're waiting on a network call
    e.preventDefault()
    setError('')      // clear any old error before trying again
    setLoading(true)

    // pick the right backend route based on which role is selected
    const endpoint = role === 'worker' ? '/workers/login' : '/customers/login'

    try {
      const response = await api.post(endpoint, { phone, password })

      // backend sends back { token, worker/customer }  — save the token so future
      // requests (and future page loads) know this user is logged in
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', role) // we'll need this later to decide which dashboard to show
         // NEW — save this user's own id so the dashboard knows whose data to fetch
         localStorage.setItem('userId', role === 'worker' ? response.data.worker.id : response.data.customer.id)

            // NEW — send them to the right dashboard based on which role logged in
            navigate(role === 'worker' ? '/worker/dashboard' : '/customer/dashboard')

      console.log('Login successful:', response.data)
      // TEMPORARY — in the next phase (routing), this becomes a redirect to the dashboard
    } catch (err) {
      // backend sends { message: '...' } on failure — show that exact message to the user
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      {/* Login form container */}
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

        {/* Role toggle: only one active at a time */}
        <div className="flex gap-2 bg-paper rounded-lg p-1">
          <button
            type="button" // Prevent button from submitting form
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

        {/* Controlled phone input */}
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

        {/* Controlled password input */}
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


         {/* NEW — only shows up when there's an actual error to display */}
         {error && <p className="text-rust text-sm text-center">{error}</p>}


        {/* Submit login form */}
        <button type="submit" disabled={loading}
          className="bg-amber text-white py-2.5 rounded-lg font-medium hover:bg-amber/90 transition-colors disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm