
// Reusable login form for both workers and customers (same fields, different role)

import { useState } from 'react'
import api from '../utils/axios'   // NEW — our central request tool

function LoginForm() {
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
    <div className="min-h-screen flex items-center justify-center">
      {/* Login form container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-dashed border-steel rounded-lg p-8 w-80 flex flex-col gap-4"
      >
        <h2 className="font-display text-2xl font-semibold text-ink text-center">
          Log in
        </h2>

        {/* Role toggle: only one active at a time */}
        <div className="flex gap-2">
          <button
            type="button" // Prevent button from submitting form
            onClick={() => setRole('customer')}
            className={`flex-1 py-2 rounded-md font-medium ${
              role === 'customer' ? 'bg-amber text-white' : 'bg-paper text-steel'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`flex-1 py-2 rounded-md font-medium ${
              role === 'worker' ? 'bg-amber text-white' : 'bg-paper text-steel'
            }`}
          >
            Worker
          </button>
        </div>

        {/* Controlled phone input */}
        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink"
        />

        {/* Controlled password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink"
        />


         {/* NEW — only shows up when there's an actual error to display */}
         {error && <p className="text-rust text-sm">{error}</p>}


        {/* Submit login form */}
        <button type="submit" className="bg-amber text-white py-2 rounded-md font-medium">
          Log in
        </button>
      </form>
    </div>
  )
}

export default LoginForm

