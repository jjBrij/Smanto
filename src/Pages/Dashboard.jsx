// Pages/Dashboard.jsx — User Dashboard
// Shows summary of user's shipments and travel plans.

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


function Dashboard() {
  const [shipments, setShipments] = useState([])
  const [travelPlans, setTravelPlans] = useState([])
  const [loading, setLoading] = useState(true)

  // Load data when page opens
  useEffect(() => {
    async function loadData() {
      try {
       //* const [s, t] = await Promise.all([getUserShipments(), getTravelPlans()])
       // setShipments(s)
       // setTravelPlans(t) 
      } catch (err) {
        console.error('Could not load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, []) // empty array = run once on mount

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '60vh' }}>
        <p>⏳ Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>My Dashboard</h1>
          <p>Manage your shipments and travel plans.</p>
        </div>
      </div>

      <div className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">

          {/* Quick action buttons */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <Link to="/post-shipment" className="btn btn-primary">
              📦 Create New Shipment
            </Link>
            <Link to="/post-travel" className="btn btn-outline">
              ✈️ Post Travel Plan
            </Link>
            <Link to="/matches" className="btn btn-outline">
              🔍 Find Matches
            </Link>
          </div>

          {/* Stats cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            <StatCard icon="📦" label="Total Shipments" value={shipments.length} />
            <StatCard icon="✈️" label="Travel Plans"    value={travelPlans.length} />
            <StatCard icon="✅" label="Completed"       value={shipments.filter(s => s.status === 'completed').length} />
            <StatCard icon="⏳" label="In Progress"     value={shipments.filter(s => s.status === 'in-progress').length} />
          </div>

          {/* Shipments table */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>My Shipments</h2>

            {shipments.length === 0 ? (
              <EmptyState
                msg="No shipments yet."
                linkTo="/post-shipment"
                linkLabel="Create your first shipment →"
              />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-gray-300)', textAlign: 'left' }}>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Route</th>
                      <th style={thStyle}>Weight</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                        <td style={tdStyle}>#{s.id}</td>
                        <td style={tdStyle}>{s.pickupCity} → {s.destinationCity}</td>
                        <td style={tdStyle}>{s.packageWeight} kg</td>
                        <td style={tdStyle}>
                          <span className={`badge ${s.status === 'completed' ? 'badge-green' : 'badge-amber'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <Link to={`/shipment/${s.id}`} style={{ color: 'var(--color-amber)', fontWeight: 600 }}>
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Travel plans */}
          <div className="card">
            <h2 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>My Travel Plans</h2>

            {travelPlans.length === 0 ? (
              <EmptyState
                msg="No travel plans posted."
                linkTo="/post-travel"
                linkLabel="Post your first travel plan →"
              />
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {travelPlans.map((plan) => (
                  <div key={plan.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>{plan.fromCity}</strong> → <strong>{plan.toCity}</strong></span>
                    <span style={{ color: 'var(--color-gray-500)' }}>{plan.travelDate} · {plan.availableWeight} kg</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// ── Small helper components ──

function StatCard({ icon, label, value }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-navy)' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>{label}</div>
    </div>
  )
}

function EmptyState({ msg, linkTo, linkLabel }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-gray-500)' }}>
      <p style={{ marginBottom: '12px' }}>{msg}</p>
      <Link to={linkTo} style={{ color: 'var(--color-amber)', fontWeight: 600 }}>{linkLabel}</Link>
    </div>
  )
}

// Table cell styles
const thStyle = { padding: '10px 12px', color: 'var(--color-gray-700)', fontWeight: 600 }
const tdStyle = { padding: '12px', verticalAlign: 'middle' }

export default Dashboard
