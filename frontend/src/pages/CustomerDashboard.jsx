// pages/CustomerDashboard.jsx — customer's home base; will grow with search, history, etc
// in upcoming steps
// pages/CustomerDashboard.jsx — now includes search above the profile form

// pages/CustomerDashboard.jsx — Phase 8 complete: search, profile, and history all together
// pages/CustomerDashboard.jsx — customer's home base; will grow with search, history, etc
// in upcoming steps
// pages/CustomerDashboard.jsx — now includes search above the profile form

// pages/CustomerDashboard.jsx — Phase 8 complete: search, profile, and history all together

// pages/CustomerDashboard.jsx — sidebar (profile, set-once) + main column (search + bookings, what you came here to do)

import { useNavigate } from 'react-router-dom'
import SearchWorkers from '../components/SearchWorkers'
import CustomerBookingHistory from '../components/CustomerBookingHistory'
import CustomerProfileForm from '../components/CustomerProfileForm'
import { LogOut } from 'lucide-react'

function CustomerDashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-paper">
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

      {/* GRID — narrow fixed sidebar (profile), wide flexible main column (search + history) */}
      <div className="max-w-6xl mx-auto p-8 grid lg:grid-cols-[340px_1fr] gap-6 items-start">

        {/* SIDEBAR — sticky, profile is set-once info, doesn't need to compete with search */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
          <CustomerProfileForm />
        </div>

        {/* MAIN COLUMN — search first (primary action), bookings below (what happened after) */}
        <div className="flex flex-col gap-6 min-w-0">
          <SearchWorkers />
          <CustomerBookingHistory />
        </div>

      </div>
    </div>
  )
}

export default CustomerDashboard