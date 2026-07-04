// pages/WorkerProfilePage.jsx — shows one worker's full profile + a booking form below it

// pages/WorkerProfilePage.jsx — shows one worker's full profile + a booking form below it

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'   // reads the ":id" piece straight out of the URL
import api from '../utils/axios'
import BookingForm from '../components/BookingForm'
import { ShieldCheck, Wallet, Star, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

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
    <div className="min-h-screen bg-paper p-8 flex flex-col items-center gap-6">
      <div className="w-full max-w-md">
        <Link to="/customer/dashboard" className="text-steel text-sm flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft size={15} /> Back to search
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 max-w-md w-full flex flex-col gap-4 relative overflow-hidden">
        {/* signature stamp motif, reused from the landing page identity */}
        {worker.verificationStatus === 'Verified' && (
          <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full border-4 border-teal flex items-center justify-center rotate-[12deg] bg-paper">
            <span className="font-mono text-[10px] font-medium text-teal text-center leading-tight">VERIFIED<br/>WORKER</span>
          </div>
        )}

        <div>
          <span className="font-mono text-xs text-steel tracking-widest">{worker.workType.toUpperCase()}</span>
          <h2 className="font-display text-3xl font-semibold text-ink">{worker.name}</h2>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-steel/15">
          <div className="flex items-center gap-1.5 text-ink">
            <Wallet className="text-amber" size={18} />
            <span className="font-medium">₹{worker.chargesAmount}</span>
            <span className="text-steel text-sm">/ {worker.chargesType.replace('per_', '')}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Star className="text-amber" size={16} fill="currentColor" strokeWidth={0} />
          <span className="text-ink text-sm font-medium">
            {worker.ratingAverage?.toFixed(1) || 'No ratings yet'}
          </span>
          <span className="text-steel text-sm">({worker.ratingCount} reviews)</span>
        </div>
      </div>

      {/* worker._id is passed down so BookingForm knows WHO to book */}
      <BookingForm workerId={worker._id} />
    </div>
  )
}

export default WorkerProfilePage