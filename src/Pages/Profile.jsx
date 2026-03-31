
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, removeToken, removeUser } from '../utils/helpers'
function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)    // toggle edit mode
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    async function load() {
      try {
      } catch {
        setProfile(sampleProfile)
        setForm(sampleProfile)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      setProfile(form)
      setEditing(false)
    } catch {
      setProfile(form)  // update locally even if backend fails
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }
  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }
  if (loading) return <div className="flex-center" style={{ height: '60vh' }}>⏳ Loading profile...</div>
  const idStatusStyle = {
    'verified': { bg: '#dcfce7', color: '#166534', label: '✅ Verified' },
    'pending': { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending Review' },
    'not-submitted': { bg: '#fee2e2', color: '#991b1b', label: '❌ Not Submitted' },
  }
  const idBadge = idStatusStyle[profile.governmentIdStatus] || idStatusStyle['not-submitted']
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>My Profile</h1>
          <p>View and manage your account details.</p>
        </div>
      </div>
      <div className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container" style={{ maxWidth: '640px' }}>

          {/* Profile card */}
          <div className="card" style={{ marginBottom: '24px' }}>

            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'var(--color-navy)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700,
              }}>
                {profile.fullName.charAt(0)}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{profile.fullName}</h2>
                <div className="stars">{renderStars(profile.rating)}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
                  {profile.rating} / 5.0 · {profile.completedDeliveries} deliveries
                </div>
              </div>
            </div>

            {/* ID status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>Government ID:</span>
              <span style={{
                background: idBadge.bg, color: idBadge.color,
                padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600,
              }}>
                {idBadge.label}
              </span>
            </div>

            {/* Edit mode toggle */}
            {!editing ? (
              <>
                {/* View mode */}
                <div>
                  <DetailRow label="Full Name" value={profile.fullName} />
                  <DetailRow label="Email" value={profile.email} />
                  <DetailRow label="Phone" value={profile.phone} />
                  <DetailRow label="Account Type" value={profile.userType} />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '14px', marginTop: '28px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-outline"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => setEditing(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                  <button
                    className="btn"
                    style={{ flex: 1, justifyContent: 'center', background: '#fee2e2', color: 'var(--color-error)', border: 'none' }}
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              /* Edit mode form */
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="fullName" className="form-input" value={form.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-input" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>
                    {saving ? '⏳ Saving...' : '💾 Save Changes'}
                  </button>
                  <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
      <span style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  )
}

export default Profile
