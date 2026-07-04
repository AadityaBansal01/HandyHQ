// pages/CustomerDashboard.jsx — customer's home base; will grow with search, history, etc
// in upcoming steps
// pages/CustomerDashboard.jsx — now includes search above the profile form

import SearchWorkers from '../components/SearchWorkers'
import CustomerProfileForm from '../components/CustomerProfileForm'

function CustomerDashboard() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-6">
      <SearchWorkers />
      <CustomerProfileForm />
    </div>
  )
}

export default CustomerDashboard