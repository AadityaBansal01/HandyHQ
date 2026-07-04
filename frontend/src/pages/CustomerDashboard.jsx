// pages/CustomerDashboard.jsx — customer's home base; will grow with search, history, etc
// in upcoming steps
// pages/CustomerDashboard.jsx — now includes search above the profile form

// pages/CustomerDashboard.jsx — Phase 8 complete: search, profile, and history all together

import SearchWorkers from '../components/SearchWorkers'
import CustomerBookingHistory from '../components/CustomerBookingHistory'
import CustomerProfileForm from '../components/CustomerProfileForm'

function CustomerDashboard() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-6">
      <SearchWorkers />
      <CustomerBookingHistory />
      <CustomerProfileForm />
    </div>
  )
}

export default CustomerDashboard