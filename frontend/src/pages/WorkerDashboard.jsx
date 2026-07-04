// pages/WorkerDashboard.jsx — shows the profile form for now
// this page will grow a lot more in upcoming steps (verification status, bookings list, etc)

// pages/WorkerDashboard.jsx — shows the profile form for now
// this page will grow a lot more in upcoming steps (verification status, bookings list, etc)

import WorkerProfileForm from '../components/WorkerProfileForm'

function WorkerDashboard() {
  return (
    <div className="min-h-screen p-8 flex justify-center">
      <WorkerProfileForm />
    </div>
  )
}

export default WorkerDashboard