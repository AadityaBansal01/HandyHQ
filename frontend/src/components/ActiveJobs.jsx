// components/ActiveJobs.jsx — worker sees jobs they've accepted, with the right action per status

// components/ActiveJobs.jsx — worker sees jobs they've accepted, with the right action per status

// components/ActiveJobs.jsx — only change: removed max-w-md from root div
import { useState, useEffect } from 'react'
import api from '../utils/axios'
import { Hammer, Play, CheckCircle2, XCircle } from 'lucide-react'

const statusStyles = {
  Accepted: 'bg-amber/10 text-amber',
  InProgress: 'bg-teal/10 text-teal',
}

function ActiveJobs() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    const response = await api.get('/bookings/worker')
    const active = response.data.bookings.filter(
      (b) => b.status === 'Accepted' || b.status === 'InProgress'
    )
    setBookings(active)
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const startJob = async (id) => {
    await api.put(`/bookings/${id}/start`)
    fetchBookings()
  }

  const completeJob = async (id) => {
    await api.put(`/bookings/${id}/complete`)
    fetchBookings()
  }

  const cancelJob = async (id) => {
    await api.put(`/bookings/${id}/cancel-by-worker`, { reason: 'Worker cancelled' })
    fetchBookings()
  }

  if (loading) return <p className="text-steel">Loading active jobs...</p>

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <Hammer className="text-amber" size={22} />
        <h2 className="font-display text-2xl font-semibold text-ink">Active jobs</h2>
      </div>

      {bookings.length === 0 && (
        <p className="text-steel text-sm">No active jobs right now</p>
      )}

      {bookings.map((booking) => (
        <div key={booking._id}
          className={`bg-paper/60 rounded-xl p-4 flex flex-col gap-2 border-l-4 ${booking.status === 'InProgress' ? 'border-teal' : 'border-amber'}`}>
          <p className="font-mono text-xs text-steel uppercase tracking-wide">Job #{booking._id.slice(-6)}</p>
          <p className="text-ink">{booking.problemDescription}</p>
          <span className={`font-mono text-xs px-2.5 py-1 rounded-full w-fit ${statusStyles[booking.status]}`}>
            {booking.status}
          </span>

          <div className="flex gap-2 mt-2">
            {booking.status === 'Accepted' && (
              <button onClick={() => startJob(booking._id)}
                className="flex-1 bg-amber text-white py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-amber/90 transition-colors">
                <Play size={15} /> Start job
              </button>
            )}
            {booking.status === 'InProgress' && (
              <button onClick={() => completeJob(booking._id)}
                className="flex-1 bg-teal text-white py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-teal/90 transition-colors">
                <CheckCircle2 size={15} /> Mark complete
              </button>
            )}
            <button onClick={() => cancelJob(booking._id)}
              className="flex-1 bg-white border border-rust text-rust py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-rust/5 transition-colors">
              <XCircle size={15} /> Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActiveJobs