// pages/AdminDashboard.jsx — minimal on purpose, per your spec: verification only
// pages/AdminDashboard.jsx — minimal on purpose, per your spec: verification only
import { useNavigate } from 'react-router-dom'   // NEW — logout needs this
import PendingWorkers from '../components/PendingWorkers'
import { LogOut, ShieldCheck } from 'lucide-react'

function AdminDashboard() {
  const navigate = useNavigate()   // NEW

  // NEW — minimal logout: clear saved session, send back to admin login
  const handleLogout = () => {
    localStorage.clear()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* NEW — header bar, not present before */}
      <header className="bg-ink px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-amber" size={20} />
          <span className="font-display text-lg font-semibold text-white">HandyHQ Admin</span>
        </div>
        <button onClick={handleLogout} className="text-white/70 text-sm flex items-center gap-1.5 hover:text-white">
          <LogOut size={15} /> Log out
        </button>
      </header>

      <div className="max-w-2xl mx-auto p-8 flex flex-col items-center gap-6">
        <PendingWorkers />
      </div>
    </div>
  )
}

export default AdminDashboard