// components/StatusPanel.jsx — shows a worker's live status: verification, suspension, streak
// this data comes straight from the Worker document itself, no separate "status API" needed
import { useState, useEffect } from 'react'
import api from '../utils/axios'
import { ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle } from 'lucide-react'

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

  // icon per status — presentation only, mirrors statusColor above
  const StatusIcon = {
    Verified: ShieldCheck,
    Pending: ShieldQuestion,
    Rejected: ShieldAlert,
  }[worker.verificationStatus]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 max-w-md flex flex-col gap-4">
      <h2 className="font-display text-2xl font-semibold text-ink">Your status</h2>

      <div className="flex items-center gap-3 bg-paper/60 rounded-xl p-4">
        <StatusIcon className={statusColor} size={28} strokeWidth={1.5} />
        <div>
          <p className="text-steel text-xs uppercase tracking-wide">Verification</p>
          <span className={`font-mono font-medium ${statusColor}`}>{worker.verificationStatus}</span>
        </div>
      </div>

      {/* only show the suspension warning if actually suspended right now */}
      {worker.isSuspended && (
        <div className="flex items-center gap-3 bg-rust/5 border border-rust/20 rounded-xl p-4">
          <AlertTriangle className="text-rust" size={22} />
          <p className="text-rust text-sm">
            Suspended — {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
          </p>
        </div>
      )}

      <p className="text-steel text-sm">
        Cancellation streak: <span className="font-mono text-ink">{worker.cancellationStreak}</span> / 3
      </p>
    </div>
  )
}

export default StatusPanel