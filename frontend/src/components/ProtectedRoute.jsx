//A "protected route" isn't a special kind of page — it's a wrapper you put AROUND a normal page. Think of it like a bouncer standing in front of a door: the bouncer doesn't care what's happening inside the room, it only checks one thing (is there a valid token?) before letting you through. If not, it redirects you elsewhere instead of showing the room at all.
// components/ProtectedRoute.jsx — the "bouncer" component
// wrap any page with this to require login before it can be seen

import { Navigate } from 'react-router-dom'

// "children" is whatever page we wrap this around — e.g. <ProtectedRoute><WorkerDashboard /></ProtectedRoute>
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')

  // no token = not logged in = bounce them to login, don't show the page at all
  if (!token) {
    return <Navigate to="/login" />
  }

  // token exists = let them through, show whatever page was wrapped
  return children
}

export default ProtectedRoute