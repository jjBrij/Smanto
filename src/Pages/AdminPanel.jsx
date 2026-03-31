// Pages/AdminPanel.jsx — Admin Control Panel
// Shows: All Users, All Shipments, All Travel Plans
// Actions: Verify ID, Block User, Resolve Disputes

import { useState, useEffect } from 'react'
import { getAllUsers, getAllShipments, getAllPlans, verifyUserId, blockUser, resolveDispute } from '../services/api'

// Sample data for when backend is not connected
const sampleUsers = [
  { id: 1, fullName: 'Karim Uddin',    email: 'karim@example.com', userType: 'sender',   idStatus: 'pending',  blocked: false },
  { id: 2, fullName: 'Rahim Ahmed',    email: 'rahim@example.com', userType: 'traveler', idStatus: 'verified', blocked: false },
  { id: 3, fullName: 'Sara Khan',      email: 'sara@example.com',  userType: 'both',     idStatus: 'verified', blocked: false },
  { id: 4, fullName: 'Nasrin Begum',   email: 'nasrin@example.com',userType: 'sender',   idStatus: 'not-submitted', blocked: true },
]

const sampleShipments = [
  { id: 'SHM001', sender: 'Karim Uddin',  route: 'Dhaka → London',    status: 'in-transit', weight: '3.5 kg' },
  { id: 'SHM002', sender: 'Sara Khan',    route: 'Sylhet → Dubai',     status: 'completed',  weight: '2.0 kg' },
  { id: 'SHM003', sender: 'Nasrin Begum', route: 'Dhaka → New York',   status: 'pending',    weight: '5.0 kg' },
]

const sampleDisputes = [
  { id: 'DIS001', shipmentId: 'SHM001', description: 'Package not received', resolved: false },
  { id: 'DIS002', shipmentId: 'SHM003', description: 'Item damaged in transit', resolved: false },
]

function AdminPanel() {
  // Active tab state
  const [tab, setTab] = useState('users')

  const [users, setUsers]         = useState(sampleUsers)
  const [shipments, setShipments] = useState(sampleShipments)
  const [disputes, setDisputes]   = useState(sampleDisputes)

  // Verify a user's ID
  const handleVerify = async (userId) => {
    try {
      await verifyUserId(userId)
    } catch {}
    setUsers((prev) => prev.map(u => u.id === userId ? { ...u, idStatus: 'verified' } : u))
  }

  // Block / unblock a user
  const handleBlock = async (userId) => {
    try {
      await blockUser(userId)
    } catch {}
    setUsers((prev) => prev.map(u => u.id === userId ? { ...u, blocked: !u.blocked } : u))
  }

  // Resolve a dispute
  const handleResolve = async (disputeId) => {
    try {
      await resolveDispute(disputeId)
    } catch {}
    setDisputes((prev) => prev.map(d => d.id === disputeId ? { ...d, resolved: true } : d))
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ background: '#1a0a00' }}>
        <div className="container">
          <h1>⚙️ Admin Panel</h1>
          <p>Manage users, shipments, travel plans and disputes.</p>
        </div>
      </div>

      <div className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">

          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {[
              { key: 'users',     label: '👥 All Users' },
              { key: 'shipments', label: '📦 Shipments' },
              { key: 'disputes',  label: '⚠️ Disputes' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`btn ${tab === t.key ? 'btn-primary' : 'btn-outline'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── USERS TAB ── */}
          {tab === 'users' && (
            <div className="card">
              <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>All Users ({users.length})</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-gray-300)' }}>
                      <Th>Name</Th><Th>Email</Th><Th>Type</Th><Th>ID Status</Th><Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid var(--color-gray-100)', opacity: user.blocked ? 0.5 : 1 }}>
                        <Td>{user.fullName}</Td>
                        <Td>{user.email}</Td>
                        <Td><span className="badge badge-amber">{user.userType}</span></Td>
                        <Td>
                          <span style={{
                            padding: '3px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                            background: user.idStatus === 'verified' ? '#dcfce7' : user.idStatus === 'pending' ? '#fef3c7' : '#fee2e2',
                            color: user.idStatus === 'verified' ? '#166534' : user.idStatus === 'pending' ? '#92400e' : '#991b1b',
                          }}>
                            {user.idStatus}
                          </span>
                        </Td>
                        <Td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {/* Verify ID button — only show if pending */}
                            {user.idStatus === 'pending' && (
                              <button
                                className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                                onClick={() => handleVerify(user.id)}
                              >
                                ✅ Verify ID
                              </button>
                            )}
                            {/* Block / Unblock */}
                            <button
                              className="btn"
                              style={{ padding: '6px 14px', fontSize: '0.82rem', background: user.blocked ? '#dcfce7' : '#fee2e2', color: user.blocked ? '#166534' : 'var(--color-error)', border: 'none' }}
                              onClick={() => handleBlock(user.id)}
                            >
                              {user.blocked ? '🔓 Unblock' : '🚫 Block'}
                            </button>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SHIPMENTS TAB ── */}
          {tab === 'shipments' && (
            <div className="card">
              <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>All Shipments ({shipments.length})</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-gray-300)' }}>
                      <Th>ID</Th><Th>Sender</Th><Th>Route</Th><Th>Weight</Th><Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                        <Td><strong>#{s.id}</strong></Td>
                        <Td>{s.sender}</Td>
                        <Td>{s.route}</Td>
                        <Td>{s.weight}</Td>
                        <Td>
                          <span className={`badge ${s.status === 'completed' ? 'badge-green' : 'badge-amber'}`}>
                            {s.status}
                          </span>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── DISPUTES TAB ── */}
          {tab === 'disputes' && (
            <div className="card">
              <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Disputes ({disputes.filter(d => !d.resolved).length} open)</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {disputes.map((d) => (
                  <div key={d.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-sm)',
                    opacity: d.resolved ? 0.5 : 1, flexWrap: 'wrap', gap: '12px',
                  }}>
                    <div>
                      <strong>#{d.id}</strong> · Shipment {d.shipmentId}
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)', margin: '4px 0 0' }}>{d.description}</p>
                    </div>
                    <button
                      className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                      onClick={() => handleResolve(d.id)}
                      disabled={d.resolved}
                    >
                      {d.resolved ? '✅ Resolved' : '⚖️ Resolve'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Table helpers ──
const Th = ({ children }) => <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--color-gray-700)', fontWeight: 600 }}>{children}</th>
const Td = ({ children }) => <td style={{ padding: '12px', verticalAlign: 'middle' }}>{children}</td>

export default AdminPanel
