//flagship feature's UI
//v imp review again properly


// components/SearchWorkers.jsx — customer searches nearby workers
// this is the frontend half of the geo search API you built in Phase 2

import { useState } from 'react'
import api from '../utils/axios'
import { useNavigate } from 'react-router-dom'   // NEW

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
    <div className="bg-white border-2 border-dashed border-steel rounded-lg p-8 max-w-md flex flex-col gap-4 w-full">
      <h2 className="font-display text-2xl font-semibold text-ink">Find a worker</h2>

      <select value={workType} onChange={(e) => setWorkType(e.target.value)}
        className="border border-steel rounded-md px-3 py-2 text-ink">
        <option value="Plumber">Plumber</option>
        <option value="Electrician">Electrician</option>
        <option value="Mechanic">Mechanic</option>
        <option value="Labourer">Labourer</option>
        <option value="Carpenter">Carpenter</option>
        <option value="Painter">Painter</option>
        <option value="Other">Other</option>
      </select>

      <div className="flex gap-2">
        <input type="number" placeholder="Longitude" value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink flex-1" />
        <input type="number" placeholder="Latitude" value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="border border-steel rounded-md px-3 py-2 text-ink flex-1" />
      </div>
      <button type="button" onClick={useMyLocation} className="text-teal text-sm text-left">
        Use my current location
      </button>

      <div>
        <label className="text-steel text-sm">Radius: {radiusKm} km</label>
        <input type="range" min="1" max="50" value={radiusKm}
          onChange={(e) => setRadiusKm(e.target.value)}
          className="w-full" />
      </div>

      <label className="flex items-center gap-2 text-steel text-sm">
        <input type="checkbox" checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)} />
        Verified workers only
      </label>

      <input type="number" placeholder="Minimum rating (optional)" value={minRating}
        onChange={(e) => setMinRating(e.target.value)}
        className="border border-steel rounded-md px-3 py-2 text-ink" />

      {error && <p className="text-rust text-sm">{error}</p>}

      <button onClick={() => runSearch(1)} className="bg-amber text-white py-2 rounded-md font-medium">
        Search
      </button>

      {/* RESULTS — only show this section once a search has actually run */}
      {searched && (
        <div className="flex flex-col gap-3 pt-4 border-t border-steel">
          {results.length === 0 && <p className="text-steel text-sm">No workers found nearby</p>}

          {results.map((worker) => (
           <div key={worker._id} onClick={() => navigate(`/workers/${worker._id}/view`)}
           className="border border-steel rounded-md p-3 flex flex-col gap-1 cursor-pointer hover:border-amber">
              <div className="flex justify-between items-center">
                <p className="font-display font-medium text-ink">{worker.name}</p>
                {worker.verificationStatus === 'Verified' && (
                  <span className="font-mono text-xs bg-teal text-white px-2 py-1 rounded-full">VERIFIED</span>
                )}
              </div>
              <p className="text-steel text-sm">{worker.workType} · ₹{worker.chargesAmount} {worker.chargesType}</p>
              <p className="text-steel text-xs font-mono">
                {(worker.distanceMeters / 1000).toFixed(1)} km away
              </p>
            </div>
          ))}

          {results.length > 0 && (
            <div className="flex justify-between items-center pt-2">
              <button onClick={() => runSearch(page - 1)} disabled={page === 1}
                className="text-amber font-medium disabled:opacity-30">
                Previous
              </button>
              <span className="text-steel text-sm font-mono">Page {page}</span>
              <button onClick={() => runSearch(page + 1)} disabled={page === totalPages}
                className="text-amber font-medium disabled:opacity-30">
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchWorkers