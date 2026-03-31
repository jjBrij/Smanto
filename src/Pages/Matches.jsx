// Pages/Matches.jsx — Show Matched Travelers
// Displays: travelerName, rating, travelDate, availableWeight, priceSuggestion, Accept Button, View Profile Button

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


// Sample data to display when backend is not connected
const sampleMatches = [
  { id: 1, travelerName: 'Rahim Ahmed',    rating: 4.8, travelDate: '2025-03-05', availableWeight: 8,  priceSuggestion: '$45', route: 'Dhaka → London' },
  { id: 2, travelerName: 'Sara Khan',      rating: 4.5, travelDate: '2025-03-08', availableWeight: 5,  priceSuggestion: '$30', route: 'Dhaka → Dubai' },
  { id: 3, travelerName: 'Kabir Hossain',  rating: 5.0, travelDate: '2025-03-12', availableWeight: 12, priceSuggestion: '$60', route: 'Chittagong → New York' },
  { id: 4, travelerName: 'Nasrin Begum',   rating: 4.2, travelDate: '2025-03-15', availableWeight: 6,  priceSuggestion: '$38', route: 'Sylhet → Toronto' },
]

function Matches() {
  const [matches, setMatches]     = useState(sampleMatches) // use sample data by default
  const [loading, setLoading]     = useState(false)
  const [accepted, setAccepted]   = useState({})            // track which matches are accepted

  // Accept a match
  const handleAccept = async (matchId) => {
    try {
        // ✅ NOW: fake accept to test UI
    } catch (err) {
      // If not connected to backend, just mark as accepted locally
      setAccepted((prev) => ({ ...prev, [matchId]: true }))
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Matching Travelers</h1>
          <p>These travelers are heading to your package's destination.</p>
        </div>
      </div>

      <div className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">

          {/* Filter row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <select className="form-select" style={{ maxWidth: '200px' }}>
              <option>All Routes</option>
              <option>Dhaka → London</option>
              <option>Dhaka → Dubai</option>
            </select>
            <select className="form-select" style={{ maxWidth: '200px' }}>
              <option>Sort by Rating</option>
              <option>Sort by Date</option>
              <option>Sort by Price</option>
            </select>
          </div>

          {loading && <p>⏳ Loading matches...</p>}

          {/* Traveler cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                isAccepted={accepted[match.id]}
                onAccept={() => handleAccept(match.id)}
              />
            ))}
          </div>

          {matches.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-gray-500)' }}>
              <p style={{ fontSize: '1.2rem' }}>No matches found yet.</p>
              <p>Try posting a shipment first.</p>
              <Link to="/post-shipment" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Post a Shipment
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── MatchCard Component ──
function MatchCard({ match, isAccepted, onAccept }) {
  return (
    <div className="card" style={{ border: isAccepted ? '2px solid var(--color-success)' : '1px solid transparent' }}>

      {/* Traveler info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        {/* Avatar circle */}
        <div style={{
          width: '50px', height: '50px', borderRadius: '50%',
          background: 'var(--color-navy)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, flexShrink: 0,
        }}>
          {match.travelerName.charAt(0)}
        </div>
        <div>
          <strong style={{ fontSize: '1.05rem' }}>{match.travelerName}</strong>
          <div className="stars">{renderStars(match.rating)}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{match.rating} / 5.0</div>
        </div>
      </div>

      {/* Route & details */}
      <div style={{ background: 'var(--color-gray-100)', borderRadius: 'var(--radius-sm)', padding: '12px', marginBottom: '16px', fontSize: '0.9rem' }}>
        <div style={{ marginBottom: '6px' }}>✈️ <strong>{match.route}</strong></div>
        <div style={{ marginBottom: '6px' }}>📅 {formatDate(match.travelDate)}</div>
        <div style={{ marginBottom: '6px' }}>⚖️ {match.availableWeight} kg available</div>
        <div>💰 Suggested price: <strong style={{ color: 'var(--color-amber-dark)' }}>{match.priceSuggestion}</strong></div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>

        {/* Accept button */}
        <button
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={onAccept}
          disabled={isAccepted}
        >
          {isAccepted ? '✅ Accepted' : '✔ Accept'}
        </button>

        {/* View profile button */}
        <Link
          to="/profile"
          className="btn btn-outline"
          style={{ flex: 1, justifyContent: 'center' }}
        >
          👤 Profile
        </Link>

      </div>
    </div>
  )
}

export default Matches
