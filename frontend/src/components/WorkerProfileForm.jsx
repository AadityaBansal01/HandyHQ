/*Simple way to think about it:
State = anything React needs to "remember" that can change while the page is open.
For phone, ask: "Does this value change while the user interacts with the page, and does my code need to know the current value to do something with it later?"

Yes, it changes → user types a new character every keystroke
Yes, I need to know it later → when they click "Log in", I need to send phone to the backend

If both answers are yes → it needs to be state.
The dumb-but-correct mental test: if you removed useState and just used a plain variable let phone = '', what breaks?

Typing wouldn't show up on screen — plain variables don't trigger React to redraw the page. useState is the only way to say "hey React, something changed, please re-render."
Even if it somehow did show on screen, the moment you clicked "Log in", your handleSubmit function would have no way to know what got typed — because nothing saved it anywhere.

Compare to something that ISN'T state: your form's <h2>Log in</h2> heading text. It never changes while the page is open → no state needed, just hardcoded JSX.
One more angle — "why phone specifically, why not just read the input directly when they click submit?"
In plain JavaScript (no React) you'd normally grab the value at submit time with something like document.getElementById('phone').value. React deliberately avoids letting you reach into the DOM like that (it's considered messy/unpredictable). Instead React's rule is: state is the single source of truth, the input just displays it. So phone state isn't just "for submit time" — it's the only place the current typed value lives, ever, at any moment.
So the pattern for every form field going forward is the same 3-part combo:

const [x, setX] = useState('') — a memory slot
value={x} on the input — box always shows what's in that memory slot
onChange={(e) => setX(e.target.value)} — every keystroke updates that memory slot

Once this clicks for one field, it's identical for every field in every form for the rest of the project — phone, password, name, workType, whatever.
Say "start next step" when this feels solid and you want to move to the Signup form.*/                









// components/WorkerProfileForm.jsx — lets a logged-in worker fill in the details
// that make them findable in search: charges, location, radius, ID info

// ==========================================================
// WorkerProfileForm.jsx
// ----------------------------------------------------------
// WHAT THIS FILE DOES:
// 1. One state variable per field worker can fill in
// 2. On submit, sends everything in ONE request to PUT /workers/profile
// 3. Shows a success or error message below the form
// Backend route this talks to: updateWorkerProfile (built in Phase 2)
// ==========================================================

// components/WorkerProfileForm.jsx — lets a logged-in worker fill in the details
// that make them findable in search: charges, location, radius, ID info

import { useState } from 'react'
import api from '../utils/axios'

function WorkerProfileForm() {
  const [chargesType, setChargesType] = useState('per_hour')
  const [chargesAmount, setChargesAmount] = useState('')
  const [serviceRadiusKm, setServiceRadiusKm] = useState('')
  const [longitude, setLongitude] = useState('')
  const [latitude, setLatitude] = useState('')
  const [idDocumentType, setIdDocumentType] = useState('Aadhar')
  const [idDocumentNumber, setIdDocumentNumber] = useState('')

  const [message, setMessage] = useState('')   // shows either success or error text
  const [loading, setLoading] = useState(false)

  // lets the worker auto-fill lng/lat using their phone/browser's GPS instead of typing it
  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {// Send updated worker profile details to the backend API
      const response = await api.put('/workers/profile', {
        chargesType,
        chargesAmount,
        serviceRadiusKm,
        longitude,
        latitude,
        idDocumentType,
        idDocumentNumber,
      })

      setMessage('Profile updated successfully')
      console.log('Updated worker:', response.data.worker)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md flex flex-col gap-4"
    >
      <h2 className="font-display text-2xl font-semibold text-ink">Complete your profile</h2>

      <div className="flex gap-2">
        <select value={chargesType} onChange={(e) => setChargesType(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink flex-1">
          <option value="per_hour">Per hour</option>
          <option value="per_day">Per day</option>
          <option value="per_repair">Per repair</option>
        </select>
        <input type="number" placeholder="Amount (₹)" value={chargesAmount}
          onChange={(e) => setChargesAmount(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink flex-1" />
      </div>

      <input type="number" placeholder="Service radius (km)" value={serviceRadiusKm}
        onChange={(e) => setServiceRadiusKm(e.target.value)}
        className="border border-steel rounded-md px-3 py-2 text-ink" />

      {/* location row — two number boxes plus a shortcut button */}
      <div className="flex gap-2">
        <input type="number" placeholder="Longitude" value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink flex-1" />
        <input type="number" placeholder="Latitude" value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink flex-1" />
      </div>
      <button type="button" onClick={useMyLocation} className="text-teal text-sm text-left">
        Use my current location
      </button>

      <div className="flex gap-2">
        <select value={idDocumentType} onChange={(e) => setIdDocumentType(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink flex-1">
          <option value="Aadhar">Aadhar</option>
          <option value="VoterID">Voter ID</option>
          <option value="DrivingLicense">Driving License</option>
          <option value="Passport">Passport</option>
        </select>
        <input type="text" placeholder="ID number" value={idDocumentNumber}
          onChange={(e) => setIdDocumentNumber(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink flex-1" />
      </div>

      {message && <p className="text-sm text-teal">{message}</p>}

      <button type="submit" disabled={loading}
        className="bg-amber text-white py-2 rounded-md font-medium disabled:opacity-50">
        {loading ? 'Saving...' : 'Save profile'}
      </button>
    </form>
  )
}

export default WorkerProfileForm