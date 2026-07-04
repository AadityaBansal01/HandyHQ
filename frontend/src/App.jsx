// App.jsx — TEMPORARY: swap this import to flip between viewing LoginForm and SignupForm
// (real routing comes in 2 steps — this manual swap is just to test each form separately)

// App.jsx — now acts as a SWITCHBOARD, not a page itself
// <Routes> looks at the current URL and renders whichever <Route> matches it
/* Think of your whole frontend as ONE page (index.html) that never actually reloads. React Router fakes the feeling of "different pages" by watching the URL and swapping out which component is shown — no real page reload happens, it's just JavaScript deciding what to render based on the address bar. App.jsx's job changes here: instead of directly showing a form, it becomes a switchboard — "if URL is /login, show LoginPage; if /signup, show SignupPage."*/

import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import WorkerDashboard from './pages/WorkerDashboard'     // NEW
import CustomerDashboard from './pages/CustomerDashboard' // NEW
import ProtectedRoute from './components/ProtectedRoute'  // NEW
// App.jsx — switchboard, now with PROTECTED routes added
import WorkerProfilePage from './pages/WorkerProfilePage'   // NEW
import AdminDashboard from './pages/AdminDashboard'
import AdminLoginPage from './pages/AdminLoginPage'
import LandingPage from './pages/LandingPage'



function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

       {/* wrapping the element in <ProtectedRoute> means: check for token FIRST,
          only render the real page if one exists */}
          {/* CHANGED — allowedRole tells ProtectedRoute exactly who's allowed through this specific door */}
      <Route path="/worker/dashboard" element={
       <ProtectedRoute allowedRole="worker"><WorkerDashboard /></ProtectedRoute>
      } />
    
      <Route path="/customer/dashboard" element={
        <ProtectedRoute allowedRole="customer"><CustomerDashboard /></ProtectedRoute>
      } />

<Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
      } />   {/* NEW */}

      
      
<Route path="/admin/login" element={<AdminLoginPage />} />
      
           {/* only customers should be able to view a profile and book someone */}
           <Route path="/workers/:id/view" element={
        <ProtectedRoute allowedRole="customer"><WorkerProfilePage /></ProtectedRoute>
      } />




<Route path="/" element={<LandingPage />} />
    </Routes>
  )
}

export default App