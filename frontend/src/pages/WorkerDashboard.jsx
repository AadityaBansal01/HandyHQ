// pages/WorkerDashboard.jsx — shows the profile form for now
// this page will grow a lot more in upcoming steps (verification status, bookings list, etc)

// pages/WorkerDashboard.jsx — shows the profile form for now
// this page will grow a lot more in upcoming steps (verification status, bookings list, etc)
// pages/WorkerDashboard.jsx — shows the profile form for now
// this page will grow a lot more in upcoming steps (verification status, bookings list, etc)

// pages/WorkerDashboard.jsx — shows the profile form for now
// this page will grow a lot more in upcoming steps (verification status, bookings list, etc)
// pages/WorkerDashboard.jsx — sidebar (identity/profile) + main column (things needing action)
// sidebar: status + photo + profile form — set once, checked occasionally
// main: requests > active jobs > history — most urgent/actionable first

import { useNavigate } from 'react-router-dom'
import StatusPanel from '../components/StatusPanel'
import PhotoUpload from '../components/PhotoUpload'
import WorkerProfileForm from '../components/WorkerProfileForm'
import BookingRequests from '../components/BookingRequests'
import ActiveJobs from '../components/ActiveJobs'
import BookingHistory from '../components/BookingHistory'
import { LogOut } from 'lucide-react'

function WorkerDashboard() {
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
            <span className="font-mono text-xs text-steel bg-paper px-2 py-1 rounded-full ml-2">WORKER</span>
          </div>
          <button onClick={handleLogout} className="text-steel text-sm flex items-center gap-1.5 hover:text-ink">
            <LogOut size={15} /> Log out
          </button>
        </header>

        {/* GRID — narrow fixed sidebar (identity), wide flexible main column (action items) */}
        <div className="max-w-6xl mx-auto p-8 grid lg:grid-cols-[340px_1fr] gap-6 items-start">

          {/* SIDEBAR — sticky so it stays visible while scrolling the longer main column */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <StatusPanel />
            <PhotoUpload />
            <WorkerProfileForm />
          </div>

          {/* MAIN COLUMN — ordered by urgency: needs a decision > in motion > archive */}
          <div className="flex flex-col gap-6 min-w-0">
            <BookingRequests />
            <ActiveJobs />
            <BookingHistory />
          </div>

        </div>
      </div>
    )
  }

  export default WorkerDashboard