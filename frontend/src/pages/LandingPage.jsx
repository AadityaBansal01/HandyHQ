// pages/LandingPage.jsx — HandyHQ's front door
// grounded in the "job ticket" identity from our design tokens step:
// warm paper background, ink text, amber for action, teal for trust/verified signals

import { Link } from 'react-router-dom'
import {
  Wrench, Zap, Cog, Hammer, PaintBucket, HardHat,
  ShieldCheck, MapPin, ClipboardCheck, Star, ArrowRight,
} from 'lucide-react'

// each trade gets a real icon instead of a plain text pill — makes the category
// section feel like a product, not a placeholder list
const trades = [
  { name: 'Plumber', icon: Wrench },
  { name: 'Electrician', icon: Zap },
  { name: 'Mechanic', icon: Cog },
  { name: 'Carpenter', icon: Hammer },
  { name: 'Painter', icon: PaintBucket },
  { name: 'Labourer', icon: HardHat },
]

// these three map directly to real features you built — verification (Phase 5),
// geo search (Phase 2), and the booking lifecycle (Phase 4) — nothing fabricated
const features = [
  {
    icon: ShieldCheck,
    title: 'Verified before they work',
    text: 'Every worker submits ID proof and is checked by our team before appearing in search — not just a self-reported badge.',
  },
  {
    icon: MapPin,
    title: 'Actually nearby, not just listed',
    text: 'Search shows real distance from your location, sorted closest first — no scrolling through workers three cities away.',
  },
  {
    icon: ClipboardCheck,
    title: 'Track the job start to finish',
    text: 'Every booking moves through clear stages — requested, accepted, in progress, completed — so you always know where things stand.',
  },
]

const steps = [
  { n: '01', title: 'Search nearby', text: "Pick a trade and your location — see who's actually close by." },
  { n: '02', title: 'Book instantly', text: 'Send a request with the job details and a time that works.' },
  { n: '03', title: 'Job gets done', text: 'The worker accepts, shows up, and marks it complete.' },
  { n: '04', title: 'Rate the work', text: 'Leave a rating so the next customer knows what to expect.' },
]

// fictional, illustrative quotes — not attributed to any real person —
// just to show the tone/use-case of the app, common on real product landing pages
const testimonials = [
  { quote: 'Booked an electrician the same evening. Knew exactly when they were on the way.', name: 'Homeowner, Bathinda' },
  { quote: 'Getting verified took ten minutes and I started getting job requests within a day.', name: 'Electrician, Ludhiana' },
  { quote: "No back-and-forth calls — the whole booking happened right in the app.", name: 'Customer, Chandigarh' },
]

function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* NAV — sticky so it stays visible while scrolling this longer page */}
      <nav className="sticky top-0 bg-paper/95 backdrop-blur border-b border-steel/20 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-2">
            {/* simple monogram mark — a rounded square with the letter H, not a stock logo */}
            <div className="w-8 h-8 rounded-md bg-ink flex items-center justify-center">
              <span className="font-display text-paper font-semibold text-sm">H</span>
            </div>
            <span className="font-display text-lg font-semibold text-ink">HandyHQ</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-steel text-sm font-medium">How it works</a>
            <a href="#for-workers" className="text-steel text-sm font-medium">For workers</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-steel font-medium text-sm">Log in</Link>
            <Link to="/signup" className="bg-amber text-white px-4 py-2 rounded-md font-medium text-sm">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-10 items-center px-8 py-20 max-w-6xl mx-auto">
        <div className="flex flex-col gap-5">
          <span className="font-mono text-xs text-steel tracking-widest">LOCAL TRADE BOOKING</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink leading-tight">
            Verified tradespeople, booked like a work order
          </h1>
          <p className="text-steel text-lg">
            Find plumbers, electricians, and other tradespeople near you — every worker checked before they can take a job.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/signup?role=customer" className="bg-amber text-white px-6 py-3 rounded-md font-medium flex items-center gap-2">
              Find a worker <ArrowRight size={18} />
            </Link>
            <Link to="/signup?role=worker" className="border-2 border-ink text-ink px-6 py-3 rounded-md font-medium">
              I'm a tradesperson
            </Link>
          </div>
        </div>

        {/* SIGNATURE ELEMENT — job ticket card + rotated verified stamp */}
        <div className="relative flex justify-center">
          <div className="bg-white border-2 border-dashed border-steel rounded-lg p-6 w-72 font-mono text-sm shadow-sm">
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
          <div className="absolute -bottom-4 -right-2 w-24 h-24 rounded-full border-4 border-teal flex items-center justify-center rotate-[-12deg] bg-paper">
            <span className="font-mono text-xs font-medium text-teal text-center leading-tight">VERIFIED<br/>WORKER</span>
          </div>
        </div>
      </section>

      {/* TRADE CATEGORIES */}
      <section className="px-8 py-14 max-w-6xl mx-auto">
        <h2 className="font-display text-2xl font-semibold text-ink mb-8 text-center">What kind of job do you need done?</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {trades.map(({ name, icon: Icon }) => (
            <Link key={name} to="/signup?role=customer"
              className="bg-white border border-steel/30 rounded-lg p-5 flex flex-col items-center gap-2 hover:border-amber transition-colors">
              <Icon className="text-ink" size={28} strokeWidth={1.5} />
              <span className="text-ink text-sm font-medium">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES — tied to real backend capabilities, not fabricated claims */}
      <section className="bg-white border-y border-steel/20 px-8 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-3">
              <Icon className="text-teal" size={32} strokeWidth={1.5} />
              <h3 className="font-display font-semibold text-ink text-lg">{title}</h3>
              <p className="text-steel text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-8 py-16 max-w-6xl mx-auto">
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

      {/* FOR WORKERS — dedicated recruitment pitch, separate from the customer-facing hero */}
      <section id="for-workers" className="bg-ink px-8 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-amber tracking-widest">FOR TRADESPEOPLE</span>
            <h2 className="font-display text-3xl font-semibold text-white">
              Get found by customers actually near you
            </h2>
            <p className="text-paper/70">
              List your trade, your rate, and your service area. Get verified once, then receive booking requests directly — no middleman taking a cut of every job.
            </p>
            <Link to="/signup?role=worker" className="bg-amber text-white px-6 py-3 rounded-md font-medium w-fit flex items-center gap-2 mt-2">
              Register as a worker <ArrowRight size={18} />
            </Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col gap-4">
            {['Set your own rate and radius', 'Accept or decline every request', 'Get rated after every completed job'].map((line) => (
              <div key={line} className="flex items-center gap-3">
                <ShieldCheck className="text-teal shrink-0" size={20} />
                <span className="text-paper/90 text-sm">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — fictional, illustrative only */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <h2 className="font-display text-2xl font-semibold text-ink mb-8 text-center">What people are saying</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name }) => (
            <div key={name} className="bg-white border border-steel/30 rounded-lg p-6 flex flex-col gap-4">
              <div className="flex gap-1 text-amber">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
              </div>
              <p className="text-ink text-sm italic">"{quote}"</p>
              <p className="text-steel text-xs font-mono">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto bg-amber rounded-xl px-8 py-12 flex flex-col items-center text-center gap-4">
          <h2 className="font-display text-3xl font-semibold text-white">Ready to get started?</h2>
          <p className="text-white/90">Join as a customer looking for help, or a worker looking for jobs.</p>
          <div className="flex gap-3 pt-2">
            <Link to="/signup?role=customer" className="bg-white text-amber px-6 py-3 rounded-md font-medium">
              Find a worker
            </Link>
            <Link to="/signup?role=worker" className="border-2 border-white text-white px-6 py-3 rounded-md font-medium">
              I'm a tradesperson
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-steel/20 px-8 py-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-display font-semibold text-ink">HandyHQ</span>
            <p className="text-steel text-sm">Local trade work, booked properly.</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-ink text-sm font-medium">Product</span>
            <Link to="/signup?role=customer" className="text-steel text-sm">Find a worker</Link>
            <Link to="/signup?role=worker" className="text-steel text-sm">Become a worker</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-ink text-sm font-medium">Account</span>
            <Link to="/login" className="text-steel text-sm">Log in</Link>
            <Link to="/signup" className="text-steel text-sm">Sign up</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-ink text-sm font-medium">HandyHQ</span>
            <span className="text-steel text-sm">A student project — MVP build</span>
          </div>
        </div>
        <p className="text-steel text-xs font-mono text-center pt-8">© 2026 HandyHQ</p>
      </footer>
    </div>
  )
}

export default LandingPage