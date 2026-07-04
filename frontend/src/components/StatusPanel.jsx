// components/StatusPanel.jsx — shows a worker's live status: verification, suspension, streak
// this data comes straight from the Worker document itself, no separate "status API" needed

import { useState, useEffect } from 'react'
import api from '../utils/axios'

function StatusPanel() {
  const [worker, setWorker] = useState(null) // starts empty — we don't have the data yet

  // useEffect runs code automatically when the component first appears on screen —
  // perfect for "go fetch data the moment this component loads"
  useEffect(() => {
    const fetchWorker = async () => {
      const userId = localStorage.getItem('userId')
      const response = await api.get(`/workers/${userId}`)
      setWorker(response.data.worker)
    }
    fetchWorker()
  }, []) // empty [] means "only run this once, when the component first loads" — not on every re-render

  // while the fetch is still happening, worker is still null — show nothing instead of crashing
  if (!worker) return <p className="text-steel">Loading status...</p>

  // work out days remaining on suspension, if suspended
  const daysLeft = worker.suspendedUntil
    ? Math.ceil((new Date(worker.suspendedUntil) - new Date()) / (1000 * 60 * 60 * 24))
    : 0

  // pick a color per verification status — green if verified, amber if pending, rust if rejected
  const statusColor = {
    Verified: 'text-teal',
    Pending: 'text-amber',
    Rejected: 'text-rust',
  }[worker.verificationStatus]

  return (
    <div className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md flex flex-col gap-3">
      <h2 className="font-display text-2xl font-semibold text-ink">Your status</h2>

      <p>
        Verification: <span className={`font-mono font-medium ${statusColor}`}>{worker.verificationStatus}</span>
      </p>

      {/* only show the suspension warning if actually suspended right now */}
      {worker.isSuspended && (
        <p className="text-rust">
          Suspended — {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
        </p>
      )}

      <p className="text-steel text-sm">
        Cancellation streak: <span className="font-mono">{worker.cancellationStreak}</span> / 3
      </p>
    </div>
  )
}

export default StatusPanel