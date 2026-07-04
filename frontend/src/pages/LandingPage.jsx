// pages/LandingPage.jsx — the actual front door of the app
// signature visual: a "job ticket" mockup + rotated verified stamp,
// reusing the exact design tokens from our theme setup step

import { Link } from 'react-router-dom'

function LandingPage() {
  const trades = ['Plumber', 'Electrician', 'Mechanic', 'Carpenter', 'Painter', 'Labourer']

  const steps = [
    { n: '01', title: 'Search nearby', text: 'Pick a trade and your location — see who\'s actually close by.' },
    { n: '02', title: 'Book instantly', text: 'Send a request with the job details and a time that works.' },
    { n: '03', title: 'Job gets done', text: 'The worker accepts, shows up, and marks it complete.' },
    { n: '04', title: 'Rate the work', text: 'Leave a rating so the next customer knows what to expect.' },
  ]

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-steel/20">
        <span className="font-display text-xl font-semibold text-ink">LabourConnect</span>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-steel font-medium">Log in</Link>
          <Link to="/signup" className="bg-amber text-white px-4 py-2 rounded-md font-medium">
            Sign up
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-10 items-center px-8 py-16 max-w-6xl mx-auto">
        <div className="flex flex-col gap-5">
          <span className="font-mono text-xs text-steel tracking-widest">LOCAL TRADE BOOKING</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink leading-tight">
            Verified tradespeople, booked like a work order
          </h1>
          <p className="text-steel text-lg">
            Find plumbers, electricians, and other tradespeople near you — every worker checked before they can take a job.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/signup?role=customer" className="bg-amber text-white px-6 py-3 rounded-md font-medium">
              Find a worker
            </Link>
            <Link to="/signup?role=worker" className="border-2 border-ink text-ink px-6 py-3 rounded-md font-medium">
              I'm a tradesperson
            </Link>
          </div>
        </div>

        {/* SIGNATURE ELEMENT — the "job ticket" card with a rotated verified stamp */}
        <div className="relative flex justify-center">
          <div className="bg-white border-2 border-dashed border-steel rounded-lg p-6 w-72 font-mono text-sm">
            <p className="text-steel text-xs mb-3">JOB TICKET</p>
            <div className="flex justify-between border-b border-steel/30 pb-2 mb-2">
              <span className="text-steel">No.</span><span className="text-ink">HQ-2291</span>
            </div>
            <div className="flex justify-between border-b border-steel/30 pb-2 mb-2">
              <span className="text-steel">Trade</span><span className="text-ink">Electrician</span>
            </div>
            <div className="flex justify-between">
              <span className="text-steel">Status</span><span className="text-teal">Completed</span>
            </div>
          </div>
          {/* rotated stamp — the recurring trust motif from the design tokens step */}
          <div className="absolute -bottom-4 -right-2 w-24 h-24 rounded-full border-4 border-teal flex items-center justify-center rotate-[-12deg] bg-paper">
            <span className="font-mono text-xs font-medium text-teal text-center leading-tight">VERIFIED<br/>WORKER</span>
          </div>
        </div>
      </section>

      {/* TRADE CATEGORIES */}
      <section className="px-8 py-10 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {trades.map((trade) => (
            <span key={trade} className="bg-white border border-steel/30 text-steel px-4 py-2 rounded-full text-sm">
              {trade}
            </span>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — real sequence, matches the actual booking lifecycle */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <h2 className="font-display text-2xl font-semibold text-ink mb-8 text-center">How it works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.n} className="flex flex-col gap-2">
              <span className="font-mono text-amber text-sm">{step.n}</span>
              <h3 className="font-display font-semibold text-ink">{step.title}</h3>
              <p className="text-steel text-sm">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-steel/20 px-8 py-6 text-center">
        <p className="text-steel text-sm">LabourConnect — built for real trade work, not just tech demos.</p>
      </footer>
    </div>
  )
}

export default LandingPage