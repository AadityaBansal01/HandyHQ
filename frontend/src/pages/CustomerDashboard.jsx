// pages/CustomerDashboard.jsx — customer's home base; will grow with search, history, etc
// in upcoming steps
// pages/CustomerDashboard.jsx — now includes search above the profile form

// pages/CustomerDashboard.jsx — Phase 8 complete: search, profile, and history all together
// pages/CustomerDashboard.jsx — customer's home base; will grow with search, history, etc
// in upcoming steps
// pages/CustomerDashboard.jsx — now includes search above the profile form

// pages/CustomerDashboard.jsx — Phase 8 complete: search, profile, and history all together

import { useNavigate } from 'react-router-dom'   // NEW — logout needs this
import SearchWorkers from '../components/SearchWorkers'
import CustomerBookingHistory from '../components/CustomerBookingHistory'
import CustomerProfileForm from '../components/CustomerProfileForm'
import { LogOut } from 'lucide-react'

function CustomerDashboard() {
  const navigate = useNavigate()   // NEW

  // NEW — minimal logout: clear saved session, send back to login
  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* NEW — header bar, not present before */}
      <header className="bg-white border-b border-steel/15 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-ink flex items-center justify-center">
            <span className="font-display text-paper font-semibold text-sm">H</span>
          </div>
          <span className="font-display text-lg font-semibold text-ink">HandyHQ</span>
          <span className="font-mono text-xs text-steel bg-paper px-2 py-1 rounded-full ml-2">CUSTOMER</span>
        </div>
        <button onClick={handleLogout} className="text-steel text-sm flex items-center gap-1.5 hover:text-ink">
          <LogOut size={15} /> Log out
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-8 flex flex-col gap-6">
        <SearchWorkers />
        <div className="grid md:grid-cols-2 gap-6">
          <CustomerBookingHistory />
          <CustomerProfileForm />
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard