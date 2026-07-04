// pages/AdminDashboard.jsx — minimal on purpose, per your spec: verification only
import PendingWorkers from '../components/PendingWorkers'

function AdminDashboard() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-6">
      <PendingWorkers />
    </div>
  )
}

export default AdminDashboard