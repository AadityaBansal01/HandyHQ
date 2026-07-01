// App.jsx — the root component of our whole React app
function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      {/* font-display = Space Grotesk, used here on a heading only, as intended */}
      <h1 className="font-display text-4xl font-semibold text-ink">
        LabourConnect
      </h1>

      {/* font-body is already the default, so we don't even need to name it */}
      <p className="text-steel">Find trusted workers near you</p>

      {/* amber = primary action color — this is what a real button will look like */}
      <button className="bg-amber text-white px-6 py-2 rounded-md font-medium">
        Get started
      </button>

      {/* teal = trust signal — this is what a "verified" badge will look like */}
      <span className="bg-teal text-white text-xs px-3 py-1 rounded-full font-mono">
        VERIFIED
      </span>
    </div>
  )
}

export default App