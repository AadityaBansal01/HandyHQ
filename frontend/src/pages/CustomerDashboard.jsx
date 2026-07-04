// pages/CustomerDashboard.jsx — customer's home base; will grow with search, history, etc
// in upcoming steps

import CustomerProfileForm from '../components/CustomerProfileForm'

function CustomerDashboard() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-6">
      <CustomerProfileForm />
    </div>
  )
}

export default CustomerDashboard