// main.jsx — the very first file that runs, it mounts React onto the actual HTML page
// BrowserRouter has to wrap the WHOLE app, at the very top, so that EVERY component
// inside it is allowed to know/use the current URL

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   // NEW
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>   {/* NEW — wraps App so routing works anywhere inside it */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)