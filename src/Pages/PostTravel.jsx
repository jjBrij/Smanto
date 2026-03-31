// Pages/PostTravel.jsx — Post a Travel Plan
// Fields: fromCity, toCity, travelDate, availableWeight, travelMode, additionalNotes

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postTravelPlan } from '../services/api'
import { saveToken } from '../utils/helpers'

function PostTravel() {
  const navigate = useNavigate()

  // All form fields
  const [form, setForm] = useState({
    fromCity: '',
    toCity: '',
    travelDate: '',
    availableWeight: '',
    travelMode: 'flight',
    additionalNotes: '',
  })

  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Update any field on change
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await postTravelPlan(form)
      setSuccess('Travel plan posted! ✅')
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
          <h1>Post Your Travel Plan</h1>
          <p>Tell senders where you're going so they can match with you.</p>
        </div>
      </div>

      <div className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container" style={{ maxWidth: '580px' }}>
          <div className="card">

            {/* Success message */}
            {success && (
              <div style={{ background: '#dcfce7', color: 'var(--color-success)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                ✅ Travel plan posted! Redirecting to dashboard...
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ background: '#fee2e2', color: 'var(--color-error)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* From City */}
              <div className="form-group">
                <label className="form-label">From City *</label>
                <input
                  type="text"
                  name="fromCity"
                  className="form-input"
                  placeholder="e.g. Dhaka"
                  value={form.fromCity}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* To City */}
              <div className="form-group">
                <label className="form-label">To City *</label>
                <input
                  type="text"
                  name="toCity"
                  className="form-input"
                  placeholder="e.g. London"
                  value={form.toCity}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Travel Date */}
              <div className="form-group">
                <label className="form-label">Travel Date *</label>
                <input
                  type="date"
                  name="travelDate"
                  className="form-input"
                  value={form.travelDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Available Weight */}
              <div className="form-group">
                <label className="form-label">Available Weight (kg) *</label>
                <input
                  type="number"
                  name="availableWeight"
                  className="form-input"
                  placeholder="e.g. 10"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={form.availableWeight}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Travel Mode */}
              <div className="form-group">
                <label className="form-label">Travel Mode *</label>
                <select
                  name="travelMode"
                  className="form-select"
                  value={form.travelMode}
                  onChange={handleChange}
                  required
                >
                  <option value="flight">✈️ Flight</option>
                  <option value="train">🚆 Train</option>
                  <option value="bus">🚌 Bus</option>
                  <option value="car">🚗 Car</option>
                  <option value="ship">🚢 Ship</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  className="form-input"
                  placeholder="Any restrictions? Fragile items only? Let senders know..."
                  value={form.additionalNotes}
                  onChange={handleChange}
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? '⏳ Posting...' : '✈️ Post Travel Plan'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostTravel
