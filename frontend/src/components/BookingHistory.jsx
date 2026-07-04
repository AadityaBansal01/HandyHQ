// components/BookingHistory.jsx — worker's full booking history, all statuses, paginated

// components/BookingHistory.jsx — worker's full booking history, all statuses, paginated

import { useState, useEffect } from 'react'
import api from '../utils/axios'
import { History, ChevronLeft, ChevronRight } from 'lucide-react'

// NEW — presentation-only status color mapping, doesn't affect any logic, just styling
const statusStyles = {
  Requested: 'bg-amber/10 text-amber',
  Accepted: 'bg-amber/10 text-amber',
  InProgress: 'bg-teal/10 text-teal',
  Completed: 'bg-steel/10 text-steel',
  Rated: 'bg-steel/10 text-steel',
  Cancelled: 'bg-rust/10 text-rust',
}

function BookingHistory() {
  const [bookings, setBookings] = useState([])
  const [page, setPage] = useState(1)         // which page we're currently viewing
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    setLoading(true)
    const response = await api.get(`/bookings/worker?page=${page}&limit=5`)
    setBookings(response.data.bookings)
    setTotalPages(response.data.totalPages)
    setLoading(false)
  }

  // NOTICE the [page] here — unlike earlier components' empty [], this means
  // "re-run this fetch every time 'page' changes," not just once on load.
  // that's exactly what we need: clicking Next/Previous changes page -> triggers a re-fetch
  useEffect(() => {
    fetchBookings()
  }, [page])

  if (loading) return <p className="text-steel">Loading history...</p>

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 max-w-md flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <History className="text-steel" size={22} />
        <h2 className="font-display text-2xl font-semibold text-ink">Booking history</h2>
      </div>

      {bookings.length === 0 && (
        <p className="text-steel text-sm">No bookings yet</p>
      )}

      {bookings.map((booking) => (
        <div key={booking._id} className="bg-paper/60 rounded-xl p-3.5 flex flex-col gap-1.5">
          <p className="font-mono text-xs text-steel uppercase tracking-wide">Job #{booking._id.slice(-6)}</p>
          <p className="text-ink text-sm">{booking.problemDescription}</p>
          <span className={`font-mono text-xs px-2.5 py-1 rounded-full w-fit ${statusStyles[booking.status]}`}>
            {booking.status}
          </span>
        </div>
      ))}

      {/* pagination controls — only show if there's more than one page */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2 border-t border-steel/15">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="text-ink font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-steel text-sm font-mono">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="text-ink font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default BookingHistory