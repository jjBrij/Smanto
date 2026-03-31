// Pages/PostShipment.jsx — Create a Shipment Request
// Fields: pickupCity, destinationCity, pickupDate, packageType, packageWeight,
//         packageDescription, offeredPrice, isUrgent, receiverName, receiverPhone

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createShipment } from '../services/api'
import { saveToken } from '../utils/helpers'

function PostShipment() {
  const navigate = useNavigate()

  // All form fields
  const [form, setForm] = useState({
    pickupCity: '',
    destinationCity: '',
    pickupDate: '',
    packageType: 'electronics',
    packageWeight: '',
    packageDescription: '',
    offeredPrice: '',
    isUrgent: false,
    receiverName: '',
    receiverPhone: '',
  })

  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Handle regular fields and checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
         await createShipment(form)           
        setSuccess('Shipment created! ✅')
        setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Create a Shipment</h1>
          <p>Describe your package and find a traveler to carry it.</p>
        </div>
      </div>

      <div className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container" style={{ maxWidth: '620px' }}>
          <div className="card">

            {/* Success */}
            {success && (
              <div style={{ background: '#dcfce7', color: 'var(--color-success)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                ✅ Shipment created! Finding matches for you...
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ background: '#fee2e2', color: 'var(--color-error)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* ── Route Details ── */}
              <h3 style={{ marginBottom: '16px', fontSize: '1.05rem', color: 'var(--color-navy)' }}>📍 Package Route</h3>

              {/* Pickup City */}
              <div className="form-group">
                <label className="form-label">Pickup City *</label>
                <input
                  type="text" name="pickupCity" className="form-input"
                  placeholder="e.g. Delhi" value={form.pickupCity}
                  onChange={handleChange} required
                />
              </div>

              {/* Destination City */}
              <div className="form-group">
                <label className="form-label">Destination City *</label>
                <input
                  type="text" name="destinationCity" className="form-input"
                  placeholder="e.g. Pune" value={form.destinationCity}
                  onChange={handleChange} required
                />
              </div>

              {/* Pickup Date */}
              <div className="form-group">
                <label className="form-label">Pickup Date *</label>
                <input
                  type="date" name="pickupDate" className="form-input"
                  value={form.pickupDate} onChange={handleChange} required
                />
              </div>

              {/* ── Package Info ── */}
              <h3 style={{ margin: '24px 0 16px', fontSize: '1.05rem', color: 'var(--color-navy)' }}>📦 Package Details</h3>

              {/* Package Type */}
              <div className="form-group">
                <label className="form-label">Package Type *</label>
                <select name="packageType" className="form-select" value={form.packageType} onChange={handleChange}>
                  <option value="electronics">📱 Electronics</option>
                  <option value="clothing">👕 Clothing / Fashion</option>
                  <option value="medicine">💊 Medicine</option>
                  <option value="documents">📄 Documents</option>
                  <option value="food">🍱 Food (Non-perishable)</option>
                  <option value="cosmetics">🧴 Cosmetics</option>
                  <option value="gifts">🎁 Gifts</option>
                  <option value="other">📦 Other</option>
                </select>
              </div>

              {/* Package Weight */}
              <div className="form-group">
                <label className="form-label">Package Weight (kg) *</label>
                <input
                  type="number" name="packageWeight" className="form-input"
                  placeholder="e.g. 2.5" min="0.1" max="50" step="0.1"
                  value={form.packageWeight} onChange={handleChange} required
                />
              </div>

              {/* Package Description */}
              <div className="form-group">
                <label className="form-label">Package Description *</label>
                <textarea
                  name="packageDescription" className="form-input"
                  placeholder="Describe what's inside the package..."
                  value={form.packageDescription} onChange={handleChange}
                  rows={3} style={{ resize: 'vertical' }} required
                />
              </div>

              {/* Offered Price */}
              <div className="form-group">
                <label className="form-label">Offered Price (Rupess) *</label>
                <input
                  type="number" name="offeredPrice" className="form-input"
                  placeholder="e.g. 30" min="1" step="1"
                  value={form.offeredPrice} onChange={handleChange} required
                />
              </div>

              {/* Is Urgent checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <input
                  type="checkbox" name="isUrgent" id="isUrgent"
                  checked={form.isUrgent} onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isUrgent" style={{ cursor: 'pointer', fontWeight: 500 }}>
                  🚨 Mark as Urgent (higher priority matching)
                </label>
              </div>

              {/* ── Receiver Info ── */}
              <h3 style={{ margin: '24px 0 16px', fontSize: '1.05rem', color: 'var(--color-navy)' }}>👤 Receiver Details</h3>

              {/* Receiver Name */}
              <div className="form-group">
                <label className="form-label">Receiver's Full Name *</label>
                <input
                  type="text" name="receiverName" className="form-input"
                  placeholder="Who will receive the package?"
                  value={form.receiverName} onChange={handleChange} required
                />
              </div>

              {/* Receiver Phone */}
              <div className="form-group">
                <label className="form-label">Receiver's Phone Number *</label>
                <input
                  type="tel" name="receiverPhone" className="form-input"
                  placeholder="+91 7461014220"
                  value={form.receiverPhone} onChange={handleChange} required
                />
              </div>

              {/* Submit */}
              <button
                type="submit" className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                disabled={loading}
              >
                {loading ? '⏳ Creating...' : '📦 Create Shipment'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostShipment
