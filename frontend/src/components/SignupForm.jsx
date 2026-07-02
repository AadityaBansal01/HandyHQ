// components/SignupForm.jsx — signup form for BOTH workers and customers
// customer fields: name, phone, password
// worker fields: name, phone, password, PLUS workType (workers need this, customers don't)

import { useState } from 'react'

function SignupForm() {
  const [role, setRole] = useState('customer')

  // one state slot per field — same controlled-input pattern from LoginForm
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  // workType only matters for workers, but we still need a state slot for it —
  // it just won't be SENT to the backend later if role is 'customer'
  const [workType, setWorkType] = useState('Plumber')

  const handleSubmit = (e) => {
    e.preventDefault()

    // TEMPORARY — proving we're capturing the right shape of data for each role
    if (role === 'worker') {
      console.log('Signing up worker:', { name, phone, password, workType })
    } else {
      console.log('Signing up customer:', { name, phone, password })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-dashed border-steel rounded-lg p-8 w-80 flex flex-col gap-4"
      >
        <h2 className="font-display text-2xl font-semibold text-ink text-center">
          Sign up
        </h2>

        <div className="flex gap-2">
          <button
            type="button"
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

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink"
        />

        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink"
        />

        {/* CONDITIONAL RENDERING — this whole block only appears when role is 'worker'.
            When role is 'customer', React skips this entirely, like it was never written */}
        {role === 'worker' && (
          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            className="border border-steel rounded-md px-3 py-2 text-ink"
          >
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="Mechanic">Mechanic</option>
            <option value="Labourer">Labourer</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Painter">Painter</option>
            <option value="Other">Other</option>
          </select>
        )}

        <button type="submit" className="bg-amber text-white py-2 rounded-md font-medium">
          Sign up
        </button>
      </form>
    </div>
  )
}

export default SignupForm