
// Reusable login form for both workers and customers (same fields, different role)

import { useState } from 'react'

function LoginForm() {
  // Component state: selected role + form inputs
  const [role, setRole] = useState('customer')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  // Runs when login form is submitted
  const handleSubmit = (e) => {
    e.preventDefault() // Prevent page reload on form submit

    // Temporary: log entered values (later replace with API call)
    console.log('Logging in as:', role, { phone, password })
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

        {/* Submit login form */}
        <button type="submit" className="bg-amber text-white py-2 rounded-md font-medium">
          Log in
        </button>
      </form>
    </div>
  )
}

export default LoginForm

