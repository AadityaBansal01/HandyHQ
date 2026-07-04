//properly see


// components/CustomerBookingHistory.jsx — customer's full booking history + inline rating

import { useState, useEffect } from 'react'
import api from '../utils/axios'

function CustomerBookingHistory() {
  const [bookings, setBookings] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  // small per-booking state — while typing a rating, we track the score/review
  // being drafted for ONE specific booking id, before it's actually submitted
  const [ratingDraft, setRatingDraft] = useState({}) // shape: { bookingId: { score, review } }

  const fetchBookings = async () => {
    setLoading(true)
    const response = await api.get(`/bookings/customer?page=${page}&limit=5`)
    setBookings(response.data.bookings)
    setTotalPages(response.data.totalPages)
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [page])

  // updates just ONE booking's draft rating, without touching any other booking's draft
  const updateDraft = (bookingId, field, value) => {
    setRatingDraft({
      ...ratingDraft, // keep every other booking's draft exactly as it was
      [bookingId]: { ...ratingDraft[bookingId], [field]: value },
    })
  }

  const submitRating = async (bookingId) => {
    const draft = ratingDraft[bookingId] || {}
    await api.put(`/bookings/${bookingId}/rate`, {
      score: draft.score || 5,
      review: draft.review || '',
    })
    fetchBookings() // refresh — this booking's status will now show "Rated" instead of the form
  }

  if (loading) return <p className="text-steel">Loading history...</p>

  return (
    <div className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md flex flex-col gap-4 w-full">
      <h2 className="font-display text-2xl font-semibold text-ink">Your bookings</h2>

      {bookings.length === 0 && <p className="text-steel text-sm">No bookings yet</p>}

      {bookings.map((booking) => (
        <div key={booking._id} className="border border-steel rounded-md p-3 flex flex-col gap-2">
          <p className="text-ink text-sm">{booking.problemDescription}</p>
          <span className="font-mono text-xs bg-paper text-steel px-2 py-1 rounded-full w-fit">
            {booking.status}
          </span>

          {/* only Completed bookings get a rating form — every other status shows nothing extra */}
          {booking.status === 'Completed' && (
            <div className="flex flex-col gap-2 pt-2 border-t border-steel">
              <select
                value={ratingDraft[booking._id]?.score || 5}
                onChange={(e) => updateDraft(booking._id, 'score', Number(e.target.value))}
                className="border border-steel rounded-md px-2 py-1 text-ink text-sm"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Okay</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Bad</option>
              </select>
              <input type="text" placeholder="Write a review (optional)"
                value={ratingDraft[booking._id]?.review || ''}
                onChange={(e) => updateDraft(booking._id, 'review', e.target.value)}
                className="border border-steel rounded-md px-2 py-1 text-ink text-sm" />
              <button onClick={() => submitRating(booking._id)}
                className="bg-teal text-white py-1 rounded-md text-sm font-medium">
                Submit rating
              </button>
            </div>
          )}

          {/* once already rated, just show what was given instead of a form */}
          {booking.status === 'Rated' && booking.rating && (
            <p className="text-steel text-sm font-mono">
              You rated: {booking.rating.score}/5 {booking.rating.review && `— "${booking.rating.review}"`}
            </p>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}
            className="text-amber font-medium disabled:opacity-30">
            Previous
          </button>
          <span className="text-steel text-sm font-mono">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages}
            className="text-amber font-medium disabled:opacity-30">
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default CustomerBookingHistory