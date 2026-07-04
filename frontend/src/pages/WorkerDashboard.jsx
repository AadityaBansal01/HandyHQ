// pages/WorkerDashboard.jsx — shows the profile form for now
// this page will grow a lot more in upcoming steps (verification status, bookings list, etc)

// pages/WorkerDashboard.jsx — shows the profile form for now
// this page will grow a lot more in upcoming steps (verification status, bookings list, etc)
import PhotoUpload from '../components/PhotoUpload'
import WorkerProfileForm from '../components/WorkerProfileForm'


function WorkerDashboard() {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center gap-6">
        <PhotoUpload />
        <WorkerProfileForm />
      </div>
    )
  }
  
  export default WorkerDashboard