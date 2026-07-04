//properly see


// components/BookingForm.jsx — customer books the worker whose id is passed in as a prop

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import { ClipboardList, Calendar, Clock, CheckCircle2, Send } from 'lucide-react'

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

  if (success) return (
    <div className="bg-white rounded-2xl shadow-sm border border-teal/30 p-8 max-w-md w-full flex flex-col items-center gap-3 text-center">
      <CheckCircle2 className="text-teal" size={40} strokeWidth={1.5} />
      <p className="text-teal font-medium">Booking request sent — redirecting...</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 max-w-md w-full flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-1">
        <ClipboardList className="text-amber" size={22} />
        <h2 className="font-display text-2xl font-semibold text-ink">Book this worker</h2>
      </div>

      <textarea placeholder="Describe the problem" value={problemDescription}
        onChange={(e) => setProblemDescription(e.target.value)}
        className="border border-steel/40 rounded-lg px-3 py-2.5 text-ink focus:outline-none focus:border-ink resize-none" rows={3} />

      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={16} />
          <input type="date" value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="border border-steel/40 rounded-lg pl-9 pr-3 py-2.5 text-ink text-sm w-full focus:outline-none focus:border-ink" />
        </div>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={16} />
          <input type="time" value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="border border-steel/40 rounded-lg pl-9 pr-3 py-2.5 text-ink text-sm w-full focus:outline-none focus:border-ink" />
        </div>
      </div>

      {error && <p className="text-rust text-sm">{error}</p>}

      <button type="submit" className="bg-amber text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-amber/90 transition-colors">
        Send booking request <Send size={16} />
      </button>
    </form>
  )
}

export default BookingForm