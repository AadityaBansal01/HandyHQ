// pages/WorkerDashboard.jsx — shows the profile form for now
// this page will grow a lot more in upcoming steps (verification status, bookings list, etc)

// pages/WorkerDashboard.jsx — shows the profile form for now
// this page will grow a lot more in upcoming steps (verification status, bookings list, etc)
import StatusPanel from '../components/StatusPanel'
import PhotoUpload from '../components/PhotoUpload'
import WorkerProfileForm from '../components/WorkerProfileForm'
import BookingRequests from '../components/BookingRequests'
import ActiveJobs from '../components/ActiveJobs'

function WorkerDashboard() {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center gap-6">
        <StatusPanel />
        <BookingRequests />
        <ActiveJobs />
        <WorkerProfileForm />
      </div>
    )
  }
  
  export default WorkerDashboard