// Hero.jsx — Homepage Hero with Auth + Role Guards
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getToken, getUser } from '../../utils/helpers'
import TravelerCards from './TravelerCards'
import './Hero.css'

function Hero() {
  const navigate   = useNavigate()
  const token      = getToken()
  const user       = getUser()
  const isLoggedIn = !!token
  const role       = user?.role || ''

  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (msg, type = 'warning', actionLabel = null, actionPath = null) => {
    setToast({ msg, type, actionLabel, actionPath })
  }

  const handleSendPackage = (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      showToast('🔐 Please login first to send a package.', 'warning', 'Login Now', '/login')
      return
    }
    if (role === 'traveler') {
      showToast('📦 Sending packages is for Senders only. Update your role in Settings.', 'role', 'Update Role', '/settings')
      return
    }
    navigate('/post-shipment')
  }

  const handleTraveling = (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      showToast('🔐 Please login first to post a travel plan.', 'warning', 'Login Now', '/login')
      return
    }
    if (role === 'sender') {
      showToast('✈️ Posting travel plans is for Travelers only. Update your role in Settings.', 'role', 'Update Role', '/settings')
      return
    }
    navigate('/post-travel')
  }

  const handleTrackClick = (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      showToast('🔐 Please login first to track your package.', 'warning', 'Login Now', '/login')
      return
    }
    navigate('/track')
  }

  return (
    <>
      <section className="hero">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <div className="container">
          <div className="hero-inner">

            {/* ── Left: Text content ── */}
            <div className="hero-content">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Community-Powered Delivery
              </div>

              <h1 className="hero-title">
                Ship Packages<br />
                with <span className="hero-title-highlight">Trusted</span><br />
                Travelers
              </h1>

              <p className="hero-subtitle">
                Smanto connects people who need to send packages with real
                travelers heading the same way. Fast, affordable, and
                community-powered shipping — across the globe.
              </p>

              <div className="hero-actions">
                <a
                  href="/post-shipment"
                  onClick={handleSendPackage}
                  className={`btn btn-primary hero-btn-main${isLoggedIn && role === 'traveler' ? ' hero-btn-locked' : ''}`}
                >
                  📦 Send a Package
                  {isLoggedIn && role === 'traveler' && <span className="hero-lock-badge">🔒</span>}
                </a>

                <a
                  href="/post-travel"
                  onClick={handleTraveling}
                  className={`btn btn-outline-white${isLoggedIn && role === 'sender' ? ' hero-btn-locked' : ''}`}
                >
                  ✈️ I'm Traveling
                  {isLoggedIn && role === 'sender' && <span className="hero-lock-badge">🔒</span>}
                </a>
              </div>

              <a href="/track" onClick={handleTrackClick} className="hero-track-pill">
                📍 Track Your Package →
              </a>

              {/* Role hint */}
              {isLoggedIn && (role === 'sender' || role === 'traveler') && (
                <div className="hero-role-hint">
                  <span>{role === 'sender' ? '📦' : '✈️'}</span>
                  <span>
                    Registered as <strong>{role === 'sender' ? 'Sender' : 'Traveler'}</strong>.{' '}
                    <Link to="/settings" className="hero-role-hint-link">
                      Add {role === 'sender' ? 'Traveler' : 'Sender'} role →
                    </Link>
                  </span>
                </div>
              )}
            </div>

            {/* ── Right: TravelerCards only ── */}
            <div className="hero-visual">
              <TravelerCards />
            </div>

          </div>
        </div>
      </section>

      {/* ── Toast ── */}
      {toast && (
        <div className={`hero-toast hero-toast--${toast.type}`}>
          <div className="hero-toast-content">
            <p className="hero-toast-msg">{toast.msg}</p>
            <div className="hero-toast-actions">
              {toast.actionLabel && (
                <button
                  className="hero-toast-action-btn"
                  onClick={() => { navigate(toast.actionPath); setToast(null) }}
                >
                  {toast.actionLabel} →
                </button>
              )}
              <button className="hero-toast-close" onClick={() => setToast(null)}>✕</button>
            </div>
          </div>
          <div className="hero-toast-bar" />
        </div>
      )}
    </>
  )
}

export default Hero