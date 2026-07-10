//properly see


// components/CustomerBookingHistory.jsx — customer's full booking history + inline rating

import { useState, useEffect } from 'react'
import api from '../utils/axios'
import { Star, ClipboardList } from 'lucide-react'

const statusStyles = {
  Requested: 'bg-amber/10 text-amber',
  Accepted: 'bg-amber/10 text-amber',
  InProgress: 'bg-teal/10 text-teal',
  Completed: 'bg-steel/10 text-steel',
  Rated: 'bg-steel/10 text-steel',
  Cancelled: 'bg-rust/10 text-rust',
}

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
    <div className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <ClipboardList className="text-steel" size={22} />
        <h2 className="font-display text-2xl font-semibold text-ink">Your bookings</h2>
      </div>

      {bookings.length === 0 && <p className="text-steel text-sm">No bookings yet</p>}

      {bookings.map((booking) => (
        <div key={booking._id} className="bg-paper/60 rounded-xl p-4 flex flex-col gap-2">
          <p className="text-ink text-sm">{booking.problemDescription}</p>
          <span className={`font-mono text-xs px-2.5 py-1 rounded-full w-fit ${statusStyles[booking.status]}`}>
            {booking.status}
          </span>

          {/* only Completed bookings get a rating form — every other status shows nothing extra */}
          {booking.status === 'Completed' && (
            <div className="flex flex-col gap-2 pt-3 border-t border-steel/15">
              <select
                value={ratingDraft[booking._id]?.score || 5}
                onChange={(e) => updateDraft(booking._id, 'score', Number(e.target.value))}
                className="border border-steel/40 rounded-lg px-2.5 py-2 text-ink text-sm focus:outline-none focus:border-ink"
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
                className="border border-steel/40 rounded-lg px-2.5 py-2 text-ink text-sm focus:outline-none focus:border-ink" />
              <button onClick={() => submitRating(booking._id)}
                className="bg-teal text-white py-2 rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center justify-center gap-1.5">
                <Star size={14} /> Submit rating
              </button>
            </div>
          )}

          {/* once already rated, just show what was given instead of a form */}
          {booking.status === 'Rated' && booking.rating && (
            <div className="flex items-center gap-2 pt-2 border-t border-steel/15">
              <div className="flex text-amber">
                {[...Array(booking.rating.score)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-steel text-sm font-mono">
                {booking.rating.review && `"${booking.rating.review}"`}
              </p>
            </div>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2 border-t border-steel/15">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}
            className="text-ink font-medium disabled:opacity-30">
            Previous
          </button>
          <span className="text-steel text-sm font-mono">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages}
            className="text-ink font-medium disabled:opacity-30">
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default CustomerBookingHistory