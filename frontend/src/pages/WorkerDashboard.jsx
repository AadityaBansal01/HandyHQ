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
// pages/WorkerDashboard.jsx — sidebar stays short: status + photo only.
// main column carries everything else, profile form goes LAST since it's set-once info

// pages/WorkerDashboard.jsx — items-stretch makes the sidebar column match main column's
// full height; Photo card (flex-1 wrapper) grows to consume the leftover space,
// so the sidebar's white cards visually reach the same bottom edge as main column

// pages/WorkerDashboard.jsx — wider container (uses more of the actual screen width
// instead of leaving a large gray margin), left column's 2 cards split space evenly
// via flex-1 on each, no more forced height-matching hacks

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

        {/* widened from max-w-6xl to max-w-[1600px] — actually uses the screen instead of
            a narrow centered column with huge gray margins on a wide monitor */}
        <div className="max-w-[1600px] mx-auto p-8 grid lg:grid-cols-[340px_1fr] gap-6 items-start">

          {/* both cards wrapped in flex-1 so they split whatever height this column ends up
              needing EVENLY between them — no more one card stretching alone */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 flex flex-col">
              <StatusPanel />
            </div>
            <div className="flex-1 flex flex-col">
              <PhotoUpload />
            </div>
          </div>

          <div className="flex flex-col gap-6 min-w-0">
            <BookingRequests />
            <ActiveJobs />
            <BookingHistory />
            <WorkerProfileForm />
          </div>

        </div>
      </div>
    )
  }

  export default WorkerDashboard