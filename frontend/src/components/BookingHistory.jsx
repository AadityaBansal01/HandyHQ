// components/BookingHistory.jsx — worker's full booking history, all statuses, paginated

import { useState, useEffect } from 'react'
import api from '../utils/axios'

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
    <div className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md flex flex-col gap-4 w-full">
      <h2 className="font-display text-2xl font-semibold text-ink">Booking history</h2>

      {bookings.length === 0 && (
        <p className="text-steel text-sm">No bookings yet</p>
      )}

      {bookings.map((booking) => (
        <div key={booking._id} className="border border-steel rounded-md p-3 flex flex-col gap-1">
          <p className="font-mono text-xs text-steel">Job #{booking._id.slice(-6)}</p>
          <p className="text-ink text-sm">{booking.problemDescription}</p>
          <span className="font-mono text-xs bg-paper text-steel px-2 py-1 rounded-full w-fit">
            {booking.status}
          </span>
        </div>
      ))}

      {/* pagination controls — only show if there's more than one page */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="text-amber font-medium disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-steel text-sm font-mono">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="text-amber font-medium disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default BookingHistory