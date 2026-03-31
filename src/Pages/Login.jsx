// Pages/Login.jsx — OTP Based Login
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendLoginOTP, verifyLoginOTP } from '../services/api'
import { saveToken, saveUser } from '../utils/helpers'

function Login() {
  const navigate = useNavigate()

  const [step,       setStep]       = useState('input')
  const [identifier, setIdentifier] = useState('')
  const [identType,  setIdentType]  = useState('')
  const [digits,     setDigits]     = useState(['','','',''])
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [countdown,  setCountdown]  = useState(30)

  const refs = [useRef(), useRef(), useRef(), useRef()]

  const detectType = (value) => {
    if (/^\d+$/.test(value)) return 'phone'
    if (value.includes('@'))  return 'email'
    return ''
  }

  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value)
    setError('')
    setIdentType(detectType(e.target.value))
  }

  useEffect(() => {
    if (step !== 'otp' || countdown === 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, step])

  useEffect(() => {
    if (step === 'otp') setTimeout(() => refs[0].current?.focus(), 100)
  }, [step])

  const handleSendOTP = async () => {
    if (!identifier.trim()) { setError('Please enter your email or phone number.'); return }
    if (!identType)          { setError('Please enter a valid email or phone number.'); return }
    setLoading(true); setError('')
    try {
      await sendLoginOTP(identifier.trim())
      setStep('otp'); setCountdown(30)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace') {
      if (digits[i]) { const d = [...digits]; d[i] = ''; setDigits(d) }
      else if (i > 0) refs[i - 1].current?.focus()
    }
  }

  const handleOtpChange = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1)
    const d = [...digits]; d[i] = v; setDigits(d)
    if (v && i < 3) refs[i + 1].current?.focus()
  }

  const handleVerifyOTP = async () => {
    const code = digits.join('')
    if (code.length < 4) { setError('Please enter the complete 4-digit OTP.'); return }
    setLoading(true); setError('')
    try {
      const data = await verifyLoginOTP(identifier.trim(), code)
      saveToken(data); saveUser(data)
       const savedAction = localStorage.getItem('match_action')
      if (savedAction) {
        const { id, action } = JSON.parse(savedAction)
        localStorage.removeItem('match_action')
        navigate(`/match/${id}/${action}`)
        return
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
      setDigits(['', '', '', ''])
      setTimeout(() => refs[0].current?.focus(), 100)
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    setError(''); setDigits(['', '', '', '']); setCountdown(30)
    try { await sendLoginOTP(identifier.trim()) }
    catch (err) { setError('Failed to resend OTP.') }
  }

  const maskedTarget = identType === 'email'
    ? identifier.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : identifier.slice(0, 3) + ' ****' + identifier.slice(-3)

  return (
    <div>

      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>Welcome Back</h1>
          <p>Log in to manage your shipments and travel plans.</p>
        </div>
      </div>

      {/* Form */}
      <div className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container" style={{ maxWidth: '440px' }}>
          <div className="card">

            {/* ── STEP 1: Enter Email / Phone ── */}
            {step === 'input' && (
              <>
                <div className="text-center" style={{ marginBottom: 'var(--space-lg)' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'rgba(244,161,29,0.12)',
                    border: '2px solid rgba(244,161,29,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', margin: '0 auto var(--space-md)',
                  }}>🔐</div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Login with OTP</h2>
                  <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
                    Enter your registered email or phone number
                  </p>
                </div>

                {error && (
                  <div style={{
                    background: '#fee2e2', color: 'var(--color-error)',
                    padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                    marginBottom: 'var(--space-md)', fontSize: '0.88rem', fontWeight: 600,
                  }}>⚠️ {error}</div>
                )}

                <div className="form-group">
                  <label className="form-label">Email Address or Phone Number *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="you@email.com or 9876543210"
                      value={identifier}
                      onChange={handleIdentifierChange}
                      onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                      style={{ paddingLeft: identType ? '44px' : '16px' }}
                    />
                    {identType && (
                      <span style={{
                        position: 'absolute', left: 14, top: '50%',
                        transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none',
                      }}>
                        {identType === 'email' ? '📧' : '📱'}
                      </span>
                    )}
                  </div>
                  {identType && (
                    <small style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem' }}>
                      {identType === 'email'
                        ? '📧 OTP will be sent to your email'
                        : '📱 OTP will be sent to your phone'}
                    </small>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-sm)' }}
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? '⏳ Checking...' : '📨 Send OTP'}
                </button>

                <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: 'var(--color-amber)', fontWeight: 600 }}>
                    Register Free
                  </Link>
                </p>
              </>
            )}

            {/* ── STEP 2: Enter OTP ── */}
            {step === 'otp' && (
              <>
                <button
                  onClick={() => { setStep('input'); setError(''); setDigits(['','','','']) }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-gray-500)', fontSize: '0.9rem', fontWeight: 600,
                    padding: '0 0 var(--space-lg)', display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >← Back</button>

                <div className="text-center" style={{ marginBottom: 'var(--space-lg)' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'rgba(244,161,29,0.12)',
                    border: '2px solid rgba(244,161,29,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', margin: '0 auto var(--space-md)',
                  }}>
                    {identType === 'email' ? '📧' : '📱'}
                  </div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Enter OTP</h2>
                  <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>We sent a 4-digit code to</p>
                  <p style={{ color: 'var(--color-amber)', fontWeight: 700, fontSize: '0.95rem', marginTop: 4 }}>
                    {maskedTarget}
                  </p>
                </div>

                {error && (
                  <div style={{
                    background: '#fee2e2', color: 'var(--color-error)',
                    padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                    marginBottom: 'var(--space-md)', fontSize: '0.88rem',
                    fontWeight: 600, textAlign: 'center',
                  }}>⚠️ {error}</div>
                )}

                {/* OTP Boxes */}
                <div style={{
                  display: 'flex', gap: 'var(--space-sm)',
                  justifyContent: 'center', marginBottom: 'var(--space-lg)',
                }}>
                  {digits.map((d, i) => (
                    <input
                      key={i} ref={refs[i]}
                      maxLength={1} value={d}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKey(i, e)}
                      inputMode="numeric" disabled={loading}
                      style={{
                        width: 68, height: 68,
                        border: `2px solid ${d ? 'var(--color-amber)' : 'var(--color-gray-300)'}`,
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1.7rem', fontWeight: 800, textAlign: 'center',
                        background: d ? 'rgba(244,161,29,0.06)' : 'var(--color-white)',
                        color: 'var(--color-navy)', outline: 'none',
                        transition: 'all var(--transition)',
                        caretColor: 'var(--color-amber)',
                        boxShadow: d ? '0 0 0 3px rgba(244,161,29,0.14)' : 'none',
                      }}
                    />
                  ))}
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-gray-500)', marginBottom: 'var(--space-lg)' }}>
                  Didn't receive it?{' '}
                  {countdown > 0
                    ? <span style={{ color: 'var(--color-gray-300)' }}>Resend in {countdown}s</span>
                    : <span onClick={handleResend} style={{ color: 'var(--color-amber)', fontWeight: 700, cursor: 'pointer' }}>
                        Resend OTP
                      </span>
                  }
                </p>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleVerifyOTP}
                  disabled={loading}
                >
                  {loading ? '⏳ Verifying...' : '✅ Verify & Login'}
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Login