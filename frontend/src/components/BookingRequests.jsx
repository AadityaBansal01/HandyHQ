// components/BookingRequests.jsx — worker sees incoming booking requests, can accept/reject each

// components/BookingRequests.jsx — worker sees incoming booking requests, can accept/reject each

// components/BookingRequests.jsx — only change: removed max-w-md from root div
import { useState, useEffect } from 'react'
import api from '../utils/axios'
import { Inbox, Calendar, Check, X } from 'lucide-react'

function BookingRequests() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    const response = await api.get('/bookings/worker')
    const requested = response.data.bookings.filter((b) => b.status === 'Requested')
    setBookings(requested)
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const respondTo = async (bookingId, action) => {
    await api.put(`/bookings/${bookingId}/respond`, { action })
    fetchBookings()
  }

  if (loading) return <p className="text-steel">Loading requests...</p>

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <Inbox className="text-amber" size={22} />
        <h2 className="font-display text-2xl font-semibold text-ink">Booking requests</h2>
        {bookings.length > 0 && (
          <span className="bg-amber text-white text-xs font-mono w-5 h-5 rounded-full flex items-center justify-center ml-auto">
            {bookings.length}
          </span>
        )}
      </div>

      {bookings.length === 0 && (
        <p className="text-steel text-sm">No new requests right now</p>
      )}

      {bookings.map((booking) => (
        <div key={booking._id} className="bg-paper/60 rounded-xl p-4 flex flex-col gap-2 border-l-4 border-amber">
          <p className="font-mono text-xs text-steel uppercase tracking-wide">Job #{booking._id.slice(-6)}</p>
          <p className="text-ink">{booking.problemDescription}</p>
          <p className="text-steel text-sm flex items-center gap-1.5">
            <Calendar size={14} /> {booking.scheduledDate?.slice(0, 10)} at {booking.scheduledTime}
          </p>

          <div className="flex gap-2 mt-2">
            <button onClick={() => respondTo(booking._id, 'accept')}
              className="flex-1 bg-teal text-white py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-teal/90 transition-colors">
              <Check size={15} /> Accept
            </button>
            <button onClick={() => respondTo(booking._id, 'reject')}
              className="flex-1 bg-white border border-rust text-rust py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-rust/5 transition-colors">
              <X size={15} /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BookingRequests