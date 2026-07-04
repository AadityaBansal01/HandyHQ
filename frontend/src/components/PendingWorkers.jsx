// components/PendingWorkers.jsx — admin's verification queue: view + approve/reject
// same list+action pattern you've now built 3 times — should feel familiar

import { useState, useEffect } from 'react'
import api from '../utils/axios'

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
    <div className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md flex flex-col gap-4 w-full">
      <h2 className="font-display text-2xl font-semibold text-ink">Pending verification</h2>

      {workers.length === 0 && <p className="text-steel text-sm">No workers waiting</p>}

      {workers.map((worker) => (
        <div key={worker._id} className="border border-steel rounded-md p-4 flex flex-col gap-2">
          <p className="font-medium text-ink">{worker.name} — {worker.workType}</p>
          <p className="text-steel text-sm font-mono">
            {worker.idDocumentType}: {worker.idDocumentNumber}
          </p>
          <p className="text-steel text-sm">{worker.phone}</p>

          <div className="flex gap-2 mt-2">
            <button onClick={() => approve(worker._id)}
              className="flex-1 bg-teal text-white py-2 rounded-md font-medium">
              Approve
            </button>
            <button onClick={() => reject(worker._id)}
              className="flex-1 bg-rust text-white py-2 rounded-md font-medium">
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PendingWorkers