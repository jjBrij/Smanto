// Footer.jsx — uses global CSS variables from index.css
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken, getUser } from '../../utils/helpers'
import './Footer.css'

function Footer() {
  const navigate   = useNavigate()
  const token      = getToken()
  const user       = getUser()
  const isLoggedIn = !!token
  const role       = user?.role || ''

  const [toast,      setToast]      = useState(null)
  const [showScroll, setShowScroll] = useState(false)

  // Auto-close toast after 4s
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  // Show scroll-to-top after 300px
  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Helpers ──
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const showToast  = (msg, type, label, path) => setToast({ msg, type, label, path })
  const showWIP    = (e) => { e.preventDefault(); showToast(' Work in progress! This feature is coming soon.', 'wip', null, null) }

  // Navigate + scroll to top
  const goTo = (e, path) => {
    e.preventDefault()
    navigate(path)
    setTimeout(scrollTop, 100)
  }

  // Auth guard + scroll to top
  const requireLogin = (e, path, label) => {
    e.preventDefault()
    if (!isLoggedIn) {
      showToast(`🔐 Please login first to access ${label}.`, 'warning', 'Login Now', '/login')
      return
    }
    navigate(path)
    setTimeout(scrollTop, 100)
  }

  // Post Travel guard
  const handlePostTravel = (e) => {
    e.preventDefault()
    if (!isLoggedIn) { showToast('🔐 Please login first to post a travel plan.', 'warning', 'Login Now', '/login'); return }
    if (role === 'sender') { showToast('✈️ Post Travel is for Travelers only. Update your role in Settings.', 'role', 'Update Role', '/settings'); return }
    navigate('/post-travel'); setTimeout(scrollTop, 100)
  }

  // Send Package guard
  const handleSendPackage = (e) => {
    e.preventDefault()
    if (!isLoggedIn) { showToast('🔐 Please login first to send a package.', 'warning', 'Login Now', '/login'); return }
    if (role === 'traveler') { showToast('📦 Ship Now is for Senders only. Update your role in Settings.', 'role', 'Update Role', '/settings'); return }
    navigate('/post-shipment'); setTimeout(scrollTop, 100)
  }

  // My Profile guard (WIP if not logged in shows login msg, if logged in shows WIP)
  const handleMyProfile = (e) => {
    e.preventDefault()
    if (!isLoggedIn) { showToast('🔐 Please login first to access My Profile.', 'warning', 'Login Now', '/login'); return }
    showToast(' Work in progress! My Profile is coming soon.', 'wip', null, null)
  }

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">

            {/* ── Brand ── */}
            <div className="footer-brand">
              <h3 className="footer-logo">🌿 Smanto</h3>
              <p>Connecting travelers with people who need to ship packages. Save money, earn money — together we travel smarter.</p>
            </div>

            {/* ── Company ── */}
            <div className="footer-col">
              <h4>Company</h4>
              {/* Home → scroll to top */}
              <a href="/" onClick={e => goTo(e, '/')}>Home</a>
              {/* Careers → WIP */}
              <a href="#" onClick={showWIP}>Careers </a>
              {/* Post Travel — role guard */}
              <a href="/post-travel" onClick={handlePostTravel}
                className={isLoggedIn && role === 'sender' ? 'footer-locked' : ''}>
                Post Travel {isLoggedIn && role === 'sender' && '🔒'}
              </a>
              {/* Send Package — role guard */}
              <a href="/post-shipment" onClick={handleSendPackage}
                className={isLoggedIn && role === 'traveler' ? 'footer-locked' : ''}>
                Send Package {isLoggedIn && role === 'traveler' && '🔒'}
              </a>
            </div>

            {/* ── Account — changes based on login ── */}
            {!isLoggedIn ? (
              <div className="footer-col">
                <h4>Account</h4>
                <a href="/register" onClick={e => goTo(e, '/register')}>Register</a>
                <a href="/login"    onClick={e => goTo(e, '/login')}>Login</a>
                <a href="/dashboard" onClick={e => requireLogin(e, '/dashboard', 'Dashboard')}>Dashboard</a>
                {/* My Profile — login guard */}
                <a href="#" onClick={e => requireLogin(e, '/profile', 'My Profile')}>My Profile</a>
              </div>
            ) : (
              <div className="footer-col">
                <h4>My Account</h4>
                <a href="/dashboard"      onClick={e => goTo(e, '/dashboard')}>Dashboard</a>
                {/* My Profile — WIP when logged in */}
                <a href="#" onClick={handleMyProfile}>My Profile </a>
                <a href="/my-shipments"   onClick={e => goTo(e, '/my-shipments')}>My Shipments</a>
                <a href="/my-travel-plans" onClick={e => goTo(e, '/my-travel-plans')}>My Travel Plans</a>
              </div>
            )}

            {/* ── Support — all WIP ── */}
            <div className="footer-col">
              <h4>Support</h4>
              <a href="#" onClick={showWIP}>Help Center </a>
              <a href="#" onClick={showWIP}>Privacy Policy </a>
              <a href="#" onClick={showWIP}>Terms of Use </a>
              <a href="#" onClick={showWIP}>Contact Us </a>
            </div>

          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Smanto. All rights reserved.</span>
            <span>Made with ❤️ for smart travelers</span>
          </div>
        </div>
      </footer>

      {/* ── Scroll to Top ── */}
      <button
        className={`footer-scroll-top ${showScroll ? 'footer-scroll-top--visible' : ''}`}
        onClick={scrollTop}
        aria-label="Scroll to top"
      >↑</button>

      {/* ── Toast ── */}
      {toast && (
        <div className={`footer-toast footer-toast--${toast.type}`}>
          <div className="footer-toast-inner">
            <p>{toast.msg}</p>
            <div className="footer-toast-btns">
              {toast.label && (
                <button
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  onClick={() => { navigate(toast.path); setTimeout(scrollTop, 100); setToast(null) }}
                >
                  {toast.label} →
                </button>
              )}
              <button className="footer-toast-close" onClick={() => setToast(null)}>✕</button>
            </div>
          </div>
          <div className="footer-toast-bar" />
        </div>
      )}
    </>
  )
}

export default Footer