// App.jsx — TEMPORARY: swap this import to flip between viewing LoginForm and SignupForm
// (real routing comes in 2 steps — this manual swap is just to test each form separately)

i// App.jsx — now acts as a SWITCHBOARD, not a page itself
// <Routes> looks at the current URL and renders whichever <Route> matches it

import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* if someone visits "/" (the root, no path), send them to /login instead —
          "/" itself isn't a real page in our app */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App