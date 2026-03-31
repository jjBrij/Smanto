import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getToken } from '../utils/helpers'

export default function MatchAccept() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [msg,     setMsg]     = useState('Processing...')
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState(false)

  useEffect(() => {
    const token = getToken()
    console.log('🔍 Match ID from URL:', id)        // ← check id
    console.log('🔑 Token exists:', !!token) 

    // ✅ Not logged in → save intent → redirect to login
    if (!token) {
      localStorage.setItem('match_action', JSON.stringify({ id, action: 'accept' }))
      navigate('/login', { state: { redirect: `/match/${id}/accept` } })
      return
    }
    const url = `http://localhost:5173/api/match/${id}/accept/`
    console.log('📡 Calling URL:', url)  
    // ✅ Logged in → call API
    fetch(`http://localhost:5173/api/match/${id}/accept/`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setMsg(data.message || '✅ Match accepted!')
          setDone(true)
        }
      })
      .catch(() => setError('Something went wrong. Please try again.'))
  }, [id])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--color-cream)',
    }}>
      <div className="card" style={{ maxWidth: 420, width: '100%', textAlign: 'center', padding: 40 }}>

        {!error && !done && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Processing...</h2>
            <p style={{ color: 'var(--color-gray-500)' }}>Please wait while we confirm your match.</p>
          </>
        )}

        {done && (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-navy)', marginBottom: 12 }}>
              {msg}
            </h2>
            <p style={{ color: 'var(--color-gray-500)', marginBottom: 28 }}>
              Once the other party accepts, you can chat and view tracking details.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/dashboard')}>
              Go to Dashboard →
            </button>
          </>
        )}

        {error && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-error)', marginBottom: 12 }}>
              {error}
            </h2>
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </>
        )}

      </div>
    </div>
  )
}