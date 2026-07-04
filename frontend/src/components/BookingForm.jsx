//properly see


// components/BookingForm.jsx — customer books the worker whose id is passed in as a prop

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'

// "workerId" is a PROP here — data passed IN from the parent component (WorkerProfilePage),
// not state this component owns itself
function BookingForm({ workerId }) {
  const navigate = useNavigate()
  const [problemDescription, setProblemDescription] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.post('/bookings', { workerId, problemDescription, scheduledDate, scheduledTime })
      setSuccess(true)
      // after a short pause, send them to their booking history so they can see it listed
      setTimeout(() => navigate('/customer/dashboard'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  if (success) return <p className="text-teal">Booking request sent — redirecting...</p>

  return (
    <form onSubmit={handleSubmit}
      className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md w-full flex flex-col gap-4">
      <h2 className="font-display text-2xl font-semibold text-ink">Book this worker</h2>

      <textarea placeholder="Describe the problem" value={problemDescription}
        onChange={(e) => setProblemDescription(e.target.value)}
        className="border border-steel rounded-md px-3 py-2 text-ink" rows={3} />

      <input type="date" value={scheduledDate}
        onChange={(e) => setScheduledDate(e.target.value)}
        className="border border-steel rounded-md px-3 py-2 text-ink" />

      <input type="time" value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
        className="border border-steel rounded-md px-3 py-2 text-ink" />

      {error && <p className="text-rust text-sm">{error}</p>}

      <button type="submit" className="bg-amber text-white py-2 rounded-md font-medium">
        Send booking request
      </button>
    </form>
  )
}

export default BookingForm