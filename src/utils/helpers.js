// utils/helpers.js

// ── Token & Auth ──────────────────────────────────────
export function saveToken(data) {
  localStorage.setItem('smanto_token',         data.access)
  localStorage.setItem('smanto_refresh_token', data.refresh)
  localStorage.setItem('smanto_user',          JSON.stringify(data.user))
}

export function getToken() {
  return localStorage.getItem('smanto_token')
}

export function removeToken() {
  localStorage.removeItem('smanto_token')
  localStorage.removeItem('smanto_refresh_token')
  localStorage.removeItem('smanto_user')
  localStorage.removeItem('user_email')
  localStorage.removeItem('user_phone')
}

export function isLoggedIn() {
  return !!getToken()
}

// ── User ─────────────────────────────────────────────
export function saveUser(data) {
  localStorage.setItem('user_email', data.user.email)
  localStorage.setItem('user_phone', data.user.phone_number)
}

export function getUser() {
  const user = localStorage.getItem('smanto_user')
  return user ? JSON.parse(user) : null
}

export function getCurrentUser() {
  const user = localStorage.getItem('smanto_user')
  return user ? JSON.parse(user) : null
}

export function removeUser() {
  localStorage.removeItem('smanto_user')
  localStorage.removeItem('user_email')
  localStorage.removeItem('user_phone')
}

// ── Formatters ────────────────────────────────────────
export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function renderStars(rating) {
  const filled = '★'.repeat(Math.round(rating))
  const empty  = '☆'.repeat(5 - Math.round(rating))
  return filled + empty
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncate(text, maxLength = 80) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}