// Pages/TrackPackage.jsx — Track Your Package
// Only accessible when logged in. Header's "Track Package" link redirects here.

import { useState } from 'react'


// Sample tracking data for UI demo when backend isn't connected
const sampleTracking = {
  id: 'SHM001',
  status: 'in-transit',
  pickupCity: 'Dhaka',
  destinationCity: 'London',
  travelerName: 'Rahim Ahmed',
  estimatedArrival: 'Mar 8, 2025',
  timeline: [
    { label: 'Shipment Created',     done: true,  time: 'Mar 1 · 10:32 AM' },
    { label: 'Traveler Matched',     done: true,  time: 'Mar 1 · 2:15 PM'  },
    { label: 'Package Picked Up',    done: true,  time: 'Mar 3 · 9:00 AM'  },
    { label: 'In Transit',           done: true,  time: 'Mar 4 · 11:00 AM' },
    { label: 'Arriving Destination', done: false, time: 'Est. Mar 8'        },
    { label: 'Delivered',            done: false, time: '—'                 },
  ],
}

function TrackPackage() {
  const [shipmentId, setShipmentId] = useState('')
  const [tracking, setTracking]     = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!shipmentId.trim()) return

    setError('')
    setLoading(true)
    try {
        // ✅ NOW: fake search to test UI
      console.log('Searching for shipment:', shipmentId)   // check data in console
      setError('')
      alert('Shipment search works! ✅ Connect API later.')

    } catch {
      // Show sample data when backend isn't connected
      setTracking({ ...sampleTracking, id: shipmentId })
    } finally {
      setLoading(false)
    }
  }

  // Status colors
  const statusMap = {
    'pending':    { color: '#d97706', bg: '#fef3c7', label: '⏳ Pending'    },
    'in-transit': { color: '#1d4ed8', bg: '#dbeafe', label: '✈️ In Transit'  },
    'completed':  { color: '#15803d', bg: '#dcfce7', label: '✅ Delivered'   },
  }
  const status = tracking ? (statusMap[tracking.status] || statusMap['pending']) : null

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <h1>📍 Track Your Package</h1>
          <p>Enter your shipment ID to see real-time delivery status.</p>
        </div>
      </div>

      <div className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container" style={{ maxWidth: '640px' }}>

          {/* Search box */}
          <div className="card" style={{ marginBottom: '28px' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                placeholder="Enter Shipment ID (e.g. SHM001)"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ whiteSpace: 'nowrap' }}
              >
                {loading ? '⏳ Searching...' : '🔍 Track'}
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fee2e2', color: 'var(--color-error)', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Results */}
          {tracking && (
            <div className="card">

              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Shipment #{tracking.id}</h2>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
                    {tracking.pickupCity} → {tracking.destinationCity}
                  </div>
                </div>
                <span style={{
                  background: status.bg, color: status.color,
                  padding: '6px 16px', borderRadius: 'var(--radius-full)',
                  fontWeight: 700, fontSize: '0.88rem',
                }}>
                  {status.label}
                </span>
              </div>

              {/* Info row */}
              <div style={{ display: 'flex', gap: '24px', marginBottom: '28px', flexWrap: 'wrap' }}>
                <InfoBlock label="Carried By"       value={tracking.travelerName} />
                <InfoBlock label="Est. Arrival"     value={tracking.estimatedArrival} />
              </div>

              {/* Timeline */}
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px', color: 'var(--color-navy)' }}>
                Delivery Timeline
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {tracking.timeline.map((step, i) => (
                  <TimelineStep
                    key={i}
                    {...step}
                    isLast={i === tracking.timeline.length - 1}
                  />
                ))}
              </div>

            </div>
          )}

          {/* Empty state */}
          {!tracking && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--color-gray-500)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
              <p>Enter a shipment ID above to track your package.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// Timeline step component
function TimelineStep({ label, done, time, isLast }) {
  return (
    <div style={{ display: 'flex', gap: '14px' }}>
      {/* Dot + line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
          background: done ? 'var(--color-success)' : 'var(--color-gray-300)',
          border: done ? 'none' : '2px solid var(--color-gray-300)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: '2px',
        }}>
          {done && <span style={{ color: 'white', fontSize: '0.6rem', fontWeight: 700 }}>✓</span>}
        </div>
        {!isLast && (
          <div style={{
            width: '2px', flex: 1, minHeight: '28px',
            background: done ? 'rgba(22,163,74,0.3)' : 'var(--color-gray-300)',
            margin: '3px 0',
          }} />
        )}
      </div>

      {/* Text */}
      <div style={{ paddingBottom: isLast ? 0 : '20px' }}>
        <div style={{
          fontWeight: done ? 700 : 400,
          color: done ? 'var(--color-navy)' : 'var(--color-gray-500)',
          fontSize: '0.92rem',
        }}>
          {label}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginTop: '2px' }}>
          {time}
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.78rem', color: 'var(--color-gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>{label}</div>
      <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{value}</div>
    </div>
  )
}

export default TrackPackage
