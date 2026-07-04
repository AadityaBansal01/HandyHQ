//flagship feature's UI
//v imp review again properly


// components/SearchWorkers.jsx — customer searches nearby workers
// this is the frontend half of the geo search API you built in Phase 2
import { useState } from 'react'
import api from '../utils/axios'
import { useNavigate } from 'react-router-dom'   // NEW
import { Search, MapPin, Navigation, Star, SlidersHorizontal, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'

function SearchWorkers() {
  const [workType, setWorkType] = useState('Plumber')
  const [radiusKm, setRadiusKm] = useState(10)
  const [longitude, setLongitude] = useState('')
  const [latitude, setLatitude] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [minRating, setMinRating] = useState('')

  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searched, setSearched] = useState(false) // tracks "has a search ever run" for the empty state
  const [error, setError] = useState('')
  const navigate = useNavigate()   // NEW — lets us jump to a worker's profile page on click

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
    })
  }

  // runs the actual search — used both by the Search button AND by page changes
  const runSearch = async (pageToFetch = 1) => {
    setError('')

    if (!workType || !longitude || !latitude || !radiusKm) {
      setError('Work type and location are required')
      return
    }

    // build the query string piece by piece — only add optional filters if actually set
    let url = `/workers/search?workType=${workType}&longitude=${longitude}&latitude=${latitude}&radiusKm=${radiusKm}&page=${pageToFetch}&limit=5`
    if (verifiedOnly) url += `&verifiedOnly=true`
    if (minRating) url += `&minRating=${minRating}`

    const response = await api.get(url)
    setResults(response.data.results)
    setPage(pageToFetch)
    // this API doesn't return totalPages (Phase 2 didn't add a count query for search) —
    // so we simply enable "Next" whenever a full page came back, disable it otherwise
    setTotalPages(response.data.results.length === 5 ? pageToFetch + 1 : pageToFetch)
    setSearched(true)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-steel/15 p-8 max-w-2xl flex flex-col gap-5 w-full">
      <div className="flex items-center gap-2">
        <Search className="text-amber" size={22} />
        <h2 className="font-display text-2xl font-semibold text-ink">Find a worker</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <select value={workType} onChange={(e) => setWorkType(e.target.value)}
          className="border border-steel/40 rounded-lg px-3 py-2.5 text-ink focus:outline-none focus:border-ink">
          <option value="Plumber">Plumber</option>
          <option value="Electrician">Electrician</option>
          <option value="Mechanic">Mechanic</option>
          <option value="Labourer">Labourer</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Painter">Painter</option>
          <option value="Other">Other</option>
        </select>

        <input type="number" placeholder="Minimum rating (optional)" value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="border border-steel/40 rounded-lg px-3 py-2.5 text-ink focus:outline-none focus:border-ink" />
      </div>

      <div className="bg-paper/60 rounded-xl p-4 flex flex-col gap-3">
        <span className="text-steel text-xs font-medium uppercase tracking-wide flex items-center gap-1.5">
          <MapPin size={13} /> Location
        </span>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Longitude" value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="border border-steel/40 rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-ink bg-white" />
          <input type="number" placeholder="Latitude" value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="border border-steel/40 rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-ink bg-white" />
        </div>
        <button type="button" onClick={useMyLocation}
          className="text-teal text-sm text-left flex items-center gap-1.5 hover:underline w-fit">
          <Navigation size={14} /> Use my current location
        </button>

        <div className="pt-1">
          <label className="text-steel text-sm flex items-center gap-1.5">
            <SlidersHorizontal size={13} /> Radius: <span className="text-ink font-medium">{radiusKm} km</span>
          </label>
          <input type="range" min="1" max="50" value={radiusKm}
            onChange={(e) => setRadiusKm(e.target.value)}
            className="w-full accent-amber mt-1" />
        </div>

        <label className="flex items-center gap-2 text-steel text-sm">
          <input type="checkbox" checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="accent-teal w-4 h-4" />
          Verified workers only
        </label>
      </div>

      {error && <p className="text-rust text-sm">{error}</p>}

      <button onClick={() => runSearch(1)}
        className="bg-amber text-white py-2.5 rounded-lg font-medium hover:bg-amber/90 transition-colors flex items-center justify-center gap-2">
        <Search size={16} /> Search
      </button>

      {/* RESULTS — only show this section once a search has actually run */}
      {searched && (
        <div className="flex flex-col gap-3 pt-4 border-t border-steel/15">
          {results.length === 0 && <p className="text-steel text-sm">No workers found nearby</p>}

          {results.map((worker) => (
           <div key={worker._id} onClick={() => navigate(`/workers/${worker._id}/view`)}
           className="bg-paper/60 rounded-xl p-4 flex flex-col gap-1 cursor-pointer hover:bg-paper transition-colors border border-transparent hover:border-amber/40">
              <div className="flex justify-between items-center">
                <p className="font-display font-medium text-ink">{worker.name}</p>
                {worker.verificationStatus === 'Verified' && (
                  <span className="font-mono text-xs bg-teal text-white px-2 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={11} /> VERIFIED
                  </span>
                )}
              </div>
              <p className="text-steel text-sm">{worker.workType} · ₹{worker.chargesAmount} {worker.chargesType}</p>
              <p className="text-steel text-xs font-mono flex items-center gap-1">
                <MapPin size={11} /> {(worker.distanceMeters / 1000).toFixed(1)} km away
              </p>
            </div>
          ))}

          {results.length > 0 && (
            <div className="flex justify-between items-center pt-2">
              <button onClick={() => runSearch(page - 1)} disabled={page === 1}
                className="text-ink font-medium disabled:opacity-30 flex items-center gap-1">
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="text-steel text-sm font-mono">Page {page}</span>
              <button onClick={() => runSearch(page + 1)} disabled={page === totalPages}
                className="text-ink font-medium disabled:opacity-30 flex items-center gap-1">
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchWorkers