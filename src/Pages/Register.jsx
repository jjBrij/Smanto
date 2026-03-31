// Pages/Register.jsx — User Registration Page
// Fields: fullName, email, phone, password, confirmPassword, userType, governmentIdNumber, uploadIdDocument

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'
import { saveToken, saveUser } from '../utils/helpers'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'sender',
    governmentIdNumber: '',
    uploadIdDocument: null,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => {
  const { name, value, files } = e.target

  setForm((prev) => {
    const updated = {
      ...prev,
      [name]: files ? files[0] : value,
    }

    // ✅ ADD THIS: clear traveler fields if switching to sender
    if (name === 'userType' && value === 'sender') {
      updated.governmentIdNumber = ''
      updated.uploadIdDocument = null
    }

    return updated
  })
}
const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  // ── Validation ──
  if (form.password !== form.confirmPassword) {
    setError('Passwords do not match.')
    return
  }
  if (form.userType === 'traveler') {
    if (!form.governmentIdNumber.trim()) {
      setError('Government ID Number is required for Travelers.')
      return
    }
    if (!form.uploadIdDocument) {
      setError('Please upload your ID Document.')
      return
    }
  }

  setLoading(true)
  try {
    const data = await registerUser(form)

    // ✅ Role upgrade — existing user, token returned immediately
    if (data.user && data.access) {
      saveToken(data)
      saveUser(data)
      navigate('/verify-otp', { state: { email: form.email } })
      return
    }

    // ✅ New user — OTPs sent, go to verification page
    if (data.step === 'verify_otp') {
      navigate('/verify-registration', {
        state: {
          email:    form.email,
          phone:    form.phone,
          autoSent: true,
        }
      })
      return
    }

  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

return (
  <div>
    {/* Page header */}
    <div className="page-header">
      <div className="container">
        <h1>Create Your Account</h1>
        <p>Join Smanto and start sending or traveling today.</p>
      </div>
    </div>

    {/* Form section */}
    <div className="section" style={{ background: 'var(--color-cream)' }}>
      <div className="container" style={{ maxWidth: '560px' }}>
        <div className="card">

          {/* Error message */}
          {error && (
            <div style={{ background: '#fee2e2', color: 'var(--color-error)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>


            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* User Type */}
            <div className="form-group">
              <label className="form-label">I want to *</label>
              <select
                name="userType"
                className="form-select"
                value={form.userType}
                onChange={handleChange}
                required
              >
                <option value="sender">📦 Send Packages (Sender)</option>
                <option value="traveler">✈️ Carry Packages (Traveler)</option>
              </select>
            </div>
            {/* Government ID Number — required only for Traveler */}
            {form.userType === 'traveler' && (
              <div className="form-group">
                <label className="form-label">Government ID Number *</label>
                <input
                  type="text"
                  name="governmentIdNumber"
                  className="form-input"
                  placeholder="Aadhaar / Pancard Number"
                  value={form.governmentIdNumber}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Upload ID Document — required only for Traveler */}
            {form.userType === 'traveler' && (
              <div className="form-group">
                <label className="form-label">Upload ID Document *</label>
                <input
                  type="file"
                  name="uploadIdDocument"
                  className="form-input"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleChange}
                />
                <small style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem' }}>
                  JPG, PNG or PDF — max 5MB
                </small>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
            </button>

          </form>

          {/* Link to login */}
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-amber)', fontWeight: 600 }}>
              Log In
            </Link>
          </p>

        </div>
      </div>
    </div>
  </div>
)
}

export default Register
