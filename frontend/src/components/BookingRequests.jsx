// components/BookingRequests.jsx — worker sees incoming booking requests, can accept/reject each

import { useState, useEffect } from 'react'
import api from '../utils/axios'

function BookingRequests() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // pulled into its own function so we can call it again after accept/reject —
  // that's how the list "refreshes" without a full page reload
  const fetchBookings = async () => {
    const response = await api.get('/bookings/worker')
    // backend sends ALL statuses — we only want ones still waiting on this worker's decision
    const requested = response.data.bookings.filter((b) => b.status === 'Requested')
    setBookings(requested)
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // one function handles BOTH accept and reject — action is either "accept" or "reject"
  const respondTo = async (bookingId, action) => {
    await api.put(`/bookings/${bookingId}/respond`, { action })
    fetchBookings() // refresh the list — the one we just responded to should disappear from it
  }

  if (loading) return <p className="text-steel">Loading requests...</p>

  return (
    <div className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md flex flex-col gap-4 w-full">
      <h2 className="font-display text-2xl font-semibold text-ink">Booking requests</h2>

      {/* empty state — if there's nothing to show, say so clearly instead of a blank box */}
      {bookings.length === 0 && (
        <p className="text-steel text-sm">No new requests right now</p>
      )}

      {/* .map turns each booking object into one JSX block on screen — one per item in the array */}
      {bookings.map((booking) => (
        <div key={booking._id} className="border border-steel rounded-md p-4 flex flex-col gap-2">
          <p className="font-mono text-xs text-steel">Job #{booking._id.slice(-6)}</p>
          <p className="text-ink">{booking.problemDescription}</p>
          <p className="text-steel text-sm">
            {booking.scheduledDate?.slice(0, 10)} at {booking.scheduledTime}
          </p>

          <div className="flex gap-2 mt-2">
            <button onClick={() => respondTo(booking._id, 'accept')}
              className="flex-1 bg-teal text-white py-2 rounded-md font-medium">
              Accept
            </button>
            <button onClick={() => respondTo(booking._id, 'reject')}
              className="flex-1 bg-rust text-white py-2 rounded-md font-medium">
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BookingRequests