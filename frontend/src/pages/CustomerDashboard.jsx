// pages/CustomerDashboard.jsx — customer's home base; will grow with search, history, etc
// in upcoming steps
// pages/CustomerDashboard.jsx — now includes search above the profile form

// pages/CustomerDashboard.jsx — Phase 8 complete: search, profile, and history all together
// pages/CustomerDashboard.jsx — customer's home base; will grow with search, history, etc
// in upcoming steps
// pages/CustomerDashboard.jsx — now includes search above the profile form

// pages/CustomerDashboard.jsx — Phase 8 complete: search, profile, and history all together

// pages/CustomerDashboard.jsx — sidebar (profile, set-once) + main column (search + bookings, what you came here to do)

// pages/CustomerDashboard.jsx — search gets full width (it's the primary action),
// profile + history sit side by side below since they're closer in natural height
// pages/CustomerDashboard.jsx — profile pinned in a sticky sidebar (it's short, set-once info),
// search + bookings stacked in main column, scrolling independently past the sidebar

// pages/CustomerDashboard.jsx — profile sits naturally at the top of its column (no sticky,
// so it doesn't leave a dead empty gap while floating above a taller main column)

// pages/CustomerDashboard.jsx — profile sits naturally at the top of its column (no sticky,
// so it doesn't leave a dead empty gap while floating above a taller main column)

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

      <div className="max-w-6xl mx-auto p-8 grid lg:grid-cols-[320px_1fr] gap-6">

        {/* sidebar — h-full lets it stretch to match the row height set by the taller right side */}
        <div className="h-full">
          <CustomerProfileForm />
        </div>

        <div className="flex flex-col gap-6 min-w-0">
          <SearchWorkers />
          <CustomerBookingHistory />
        </div>

      </div>
    </div>
  )
}

export default CustomerDashboard