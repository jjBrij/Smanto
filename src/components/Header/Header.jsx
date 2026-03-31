// Header.jsx — Navigation Bar with Auth + Role Guards
import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getToken, getUser, removeToken, removeUser } from '../../utils/helpers'
import './Header.css'

function Header() {
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [toast,        setToast]        = useState(null)
  const dropdownRef = useRef(null)
  const navigate    = useNavigate()

  const token      = getToken()
  const user       = getUser()
  const isLoggedIn = !!token
  const role       = user?.role || ''

  const closeMenu = () => setMenuOpen(false)

  // Auto-close toast after 4s
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const showToast = (msg, type = 'warning', actionLabel = null, actionPath = null) => {
    setToast({ msg, type, actionLabel, actionPath })
  }

  // ── Guards ──────────────────────────────────────
  const handlePostTravelClick = (e) => {
    e.preventDefault(); closeMenu()
    if (!isLoggedIn) {
      showToast('🔐 Please login first to post a travel plan.', 'warning', 'Login Now', '/login')
      return
    }
    if (role === 'sender') {
      showToast(
        '✈️ Post Travel is for Travelers only. Register as a Traveler to unlock this feature.',
        'role', 'Register as Traveler', '/register'
      )
      return
    }
    navigate('/post-travel')
  }

  const handleShipNowClick = (e) => {
    e.preventDefault(); closeMenu()
    if (!isLoggedIn) {
      showToast('🔐 Please login first to ship a package.', 'warning', 'Login Now', '/login')
      return
    }
    if (role === 'traveler') {
      showToast(
        '📦 Ship Now is for Senders only. Register as a Sender to unlock this feature.',
        'role', 'Register as Sender', '/register'
      )
      return
    }
    navigate('/post-shipment')
  }

  const handleDashboardClick = (e) => {
    e.preventDefault(); closeMenu()
    if (!isLoggedIn) {
      showToast('🔐 Please login first to access your dashboard.', 'warning', 'Login Now', '/login')
      return
    }
    navigate('/dashboard')
  }

  const handleTrackClick = (e) => {
    e.preventDefault(); closeMenu()
    if (!isLoggedIn) {
      showToast('🔐 Please login first to track packages.', 'warning', 'Login Now', '/login')
      return
    }
    navigate('/track')
  }

  const handleLogout = () => {
    removeToken(); removeUser()
    setDropdownOpen(false); setMenuOpen(false)
    navigate('/login')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const menuItems = [
    { icon: '📊', label: 'Dashboard',      path: '/dashboard' },
    { icon: '👤', label: 'My Profile',      path: '/profile' },
    { icon: '📦', label: 'My Shipments',    path: '/my-shipments' },
    { icon: '✈️', label: 'My Travel Plans', path: '/my-travel-plans' },
    { icon: '📍', label: 'Track Package',   path: '/track' },
    { icon: '💬', label: 'Messages',        path: '/messages' },
    { icon: '⚙️', label: 'Settings',       path: '/settings' },
  ]

  return (
    <>
      <header className="header">
        <div className="container header-inner">

          {/* Logo */}
          <Link to="/" className="header-logo" onClick={closeMenu}>
            <span className="header-logo-leaf">🌿</span>Smanto
          </Link>

          {/* Nav Links */}
          <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>

            <a href="/post-travel" onClick={handlePostTravelClick}
              className={isLoggedIn && role === 'sender' ? 'nav-locked' : ''}>
              Post Travel {isLoggedIn && role === 'sender' && <span className="nav-lock-icon">🔒</span>}
            </a>

            <a href="/post-shipment" onClick={handleShipNowClick}
              className={isLoggedIn && role === 'traveler' ? 'nav-locked' : ''}>
              Ship Now {isLoggedIn && role === 'traveler' && <span className="nav-lock-icon">🔒</span>}
            </a>

            <a href="/dashboard" onClick={handleDashboardClick}>Dashboard</a>

            <a href="/track" onClick={handleTrackClick} className="header-track-link">
              📍 Track Package
            </a>
          </nav>

          {/* Auth Actions */}
          <div className="header-actions">
            {!isLoggedIn ? (
              <>
                <Link to="/login"    className="btn btn-outline-white header-btn">Login</Link>
                <Link to="/register" className="btn btn-primary header-btn">Register</Link>
              </>
            ) : (
              <div className="profile-wrapper" ref={dropdownRef}>
                <button
                  className={`avatar-btn ${dropdownOpen ? 'active' : ''}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="avatar-initials">{getInitials(user?.full_name)}</span>
                  <span className="avatar-chevron">{dropdownOpen ? '▲' : '▼'}</span>
                </button>

                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{getInitials(user?.full_name)}</div>
                      <div className="dropdown-user-info">
                        <p className="dropdown-name">{user?.full_name || 'User'}</p>
                        <p className="dropdown-email">{user?.email}</p>
                        <span className="dropdown-role-badge">
                          {role === 'both'     ? '📦✈️ Sender & Traveler'
                           : role === 'traveler' ? '✈️ Traveler'
                           : '📦 Sender'}
                        </span>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <ul className="dropdown-menu">
                      {menuItems.map((item) => (
                        <li key={item.path}>
                          <Link to={item.path} className="dropdown-item"
                            onClick={() => { setDropdownOpen(false); closeMenu() }}>
                            <span className="dropdown-item-icon">{item.icon}</span>
                            <span>{item.label}</span>
                            <span className="dropdown-item-arrow">›</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="dropdown-divider" />
                    <button className="dropdown-logout" onClick={handleLogout}>
                      <span>🚪</span><span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className="header-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? '✕' : '☰'}
          </button>

        </div>
      </header>

      {/* ── Toast Notification ── */}
      {toast && (
        <div className={`header-toast header-toast--${toast.type}`}>
          <div className="header-toast-content">
            <p className="header-toast-msg">{toast.msg}</p>
            <div className="header-toast-actions">
              {toast.actionLabel && (
                <button className="header-toast-action-btn"
                  onClick={() => { navigate(toast.actionPath); setToast(null) }}>
                  {toast.actionLabel} →
                </button>
              )}
              <button className="header-toast-close" onClick={() => setToast(null)}>✕</button>
            </div>
          </div>
          <div className="header-toast-bar" />
        </div>
      )}
    </>
  )
}

export default Header