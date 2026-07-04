// components/ActiveJobs.jsx — worker sees jobs they've accepted, with the right action per status

import { useState, useEffect } from 'react'
import api from '../utils/axios'

function ActiveJobs() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    const response = await api.get('/bookings/worker')
    // active = accepted OR in progress — anything the worker still needs to act on
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
    // reason is optional on the backend — sending a simple default here,
    // a proper "type your reason" box can be added later if you want
    await api.put(`/bookings/${id}/cancel-by-worker`, { reason: 'Worker cancelled' })
    fetchBookings()
  }

  if (loading) return <p className="text-steel">Loading active jobs...</p>

  return (
    <div className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md flex flex-col gap-4 w-full">
      <h2 className="font-display text-2xl font-semibold text-ink">Active jobs</h2>

      {bookings.length === 0 && (
        <p className="text-steel text-sm">No active jobs right now</p>
      )}

      {bookings.map((booking) => (
        <div key={booking._id} className="border border-steel rounded-md p-4 flex flex-col gap-2">
          <p className="font-mono text-xs text-steel">Job #{booking._id.slice(-6)}</p>
          <p className="text-ink">{booking.problemDescription}</p>
          {/* small status pill — same idea as the "VERIFIED" badge from the design tokens step */}
          <span className="font-mono text-xs bg-paper text-steel px-2 py-1 rounded-full w-fit">
            {booking.status}
          </span>

          <div className="flex gap-2 mt-2">
            {/* only ONE of these two buttons ever shows, based on current status */}
            {booking.status === 'Accepted' && (
              <button onClick={() => startJob(booking._id)}
                className="flex-1 bg-amber text-white py-2 rounded-md font-medium">
                Start job
              </button>
            )}
            {booking.status === 'InProgress' && (
              <button onClick={() => completeJob(booking._id)}
                className="flex-1 bg-teal text-white py-2 rounded-md font-medium">
                Mark complete
              </button>
            )}
            <button onClick={() => cancelJob(booking._id)}
              className="flex-1 bg-rust text-white py-2 rounded-md font-medium">
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActiveJobs