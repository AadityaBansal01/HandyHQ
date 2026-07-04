//A "protected route" isn't a special kind of page — it's a wrapper you put AROUND a normal page. Think of it like a bouncer standing in front of a door: the bouncer doesn't care what's happening inside the room, it only checks one thing (is there a valid token?) before letting you through. If not, it redirects you elsewhere instead of showing the room at all.
// components/ProtectedRoute.jsx — the "bouncer" component
// wrap any page with this to require login before it can be seen
// components/ProtectedRoute.jsx — bouncer, now checks ROLE too, not just login status
//Fix the gap from last step — a logged-in customer should NOT be able to view /worker/dashboard (and vice versa). We upgrade ProtectedRoute to also check role, not just "is there a token."

import { Navigate } from 'react-router-dom'

// "children" is whatever page we wrap this around — e.g. <ProtectedRoute><WorkerDashboard /></ProtectedRoute>
// "allowedRole" is passed in from App.jsx — e.g. "worker" for the worker dashboard route
function ProtectedRoute({ children, allowedRole }) {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
  
  // no token = not logged in = bounce them to login, don't show the page at all
  if (!token) {
    return <Navigate to="/login" />
  }

    // logged in, but WRONG role for this specific page — send them to their own
  // dashboard instead of showing them a page meant for the other role
  // CHANGED — admin has its own dashboard now too, so this needs a 3-way check
  if (role !== allowedRole) {
    const home = role === 'worker' ? '/worker/dashboard' : role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'
    return <Navigate to={home} />
  }

  // token exists AND role matches = let them through, show whatever page was wrapped
  return children
}

export default ProtectedRoute