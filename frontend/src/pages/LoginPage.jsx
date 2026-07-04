// pages/LoginPage.jsx — the actual "/login" page
// right now this is thin — it just shows the form component we already built.
// pages are the "URL destinations", components (like LoginForm) are reusable pieces

import LoginForm from '../components/LoginForm'

function LoginPage() {
  return <LoginForm />
}

export default LoginPage