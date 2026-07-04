// pages/WorkerProfilePage.jsx — shows one worker's full profile + a booking form below it

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'   // reads the ":id" piece straight out of the URL
import api from '../utils/axios'
import BookingForm from '../components/BookingForm'

function WorkerProfilePage() {
  const { id } = useParams() // matches the ":id" in the route path we'll add in App.jsx below
  const [worker, setWorker] = useState(null)

  useEffect(() => {
    const fetchWorker = async () => {
      const response = await api.get(`/workers/${id}`)
      setWorker(response.data.worker)
    }
    fetchWorker()
  }, [id]) // re-fetch if the id in the URL ever changes (e.g. clicking a different worker)

  if (!worker) return <p className="text-steel p-8">Loading profile...</p>

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-6">
      <div className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md w-full flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-2xl font-semibold text-ink">{worker.name}</h2>
          {worker.verificationStatus === 'Verified' && (
            <span className="font-mono text-xs bg-teal text-white px-2 py-1 rounded-full">VERIFIED</span>
          )}
        </div>
        <p className="text-steel">{worker.workType}</p>
        <p className="text-ink">₹{worker.chargesAmount} {worker.chargesType}</p>
        <p className="text-steel text-sm">
          Rating: {worker.ratingAverage?.toFixed(1) || 'No ratings yet'} ({worker.ratingCount} reviews)
        </p>
      </div>

      {/* worker._id is passed down so BookingForm knows WHO to book */}
      <BookingForm workerId={worker._id} />
    </div>
  )
}

export default WorkerProfilePage