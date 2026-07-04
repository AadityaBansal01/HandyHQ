// components/PendingWorkers.jsx — admin's verification queue: view + approve/reject
// same list+action pattern you've now built 3 times — should feel familiar
import { useState, useEffect } from 'react'
import api from '../utils/axios'
import { ShieldQuestion, IdCard, Phone, Check, X } from 'lucide-react'

function PendingWorkers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPending = async () => {
    const response = await api.get('/admin/pending-workers')
    setWorkers(response.data.workers)
    setLoading(false)
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const approve = async (id) => {
    await api.put(`/admin/workers/${id}/approve`)
    fetchPending() // approved worker disappears from this list, same refresh pattern as before
  }

  const reject = async (id) => {
    await api.put(`/admin/workers/${id}/reject`)
    fetchPending()
  }

  if (loading) return <p className="text-steel">Loading queue...</p>

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 max-w-md flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <ShieldQuestion className="text-amber" size={22} />
        <h2 className="font-display text-2xl font-semibold text-ink">Pending verification</h2>
        {workers.length > 0 && (
          <span className="bg-amber text-white text-xs font-mono w-5 h-5 rounded-full flex items-center justify-center ml-auto">
            {workers.length}
          </span>
        )}
      </div>

      {workers.length === 0 && <p className="text-steel text-sm">No workers waiting</p>}

      {workers.map((worker) => (
        <div key={worker._id} className="bg-paper/60 rounded-xl p-4 flex flex-col gap-2 border-l-4 border-amber">
          <p className="font-medium text-ink">{worker.name} — {worker.workType}</p>
          <p className="text-steel text-sm font-mono flex items-center gap-1.5">
            <IdCard size={14} /> {worker.idDocumentType}: {worker.idDocumentNumber}
          </p>
          <p className="text-steel text-sm flex items-center gap-1.5">
            <Phone size={14} /> {worker.phone}
          </p>

          <div className="flex gap-2 mt-2">
            <button onClick={() => approve(worker._id)}
              className="flex-1 bg-teal text-white py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-teal/90 transition-colors">
              <Check size={15} /> Approve
            </button>
            <button onClick={() => reject(worker._id)}
              className="flex-1 bg-white border border-rust text-rust py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-rust/5 transition-colors">
              <X size={15} /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PendingWorkers