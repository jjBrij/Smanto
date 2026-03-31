import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getToken } from '../utils/helpers'

export default function MatchReject() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [msg,    setMsg]   = useState('Processing...')
  const [error,  setError] = useState('')
  const [done,   setDone]  = useState(false)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      localStorage.setItem('match_action', JSON.stringify({ id, action: 'reject' }))
      navigate('/login', { state: { redirect: `/match/${id}/reject` } })
      return
    }

    fetch(`http://localhost:5173/api/match/${id}/reject/`, {
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
          setMsg(data.message || '❌ Match rejected.')
          setDone(true)
        }
      })
      .catch(() => setError('Something went wrong.'))
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
            <p style={{ color: 'var(--color-gray-500)' }}>Please wait...</p>
          </>
        )}

        {done && (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-navy)', marginBottom: 12 }}>
              {msg}
            </h2>
            <p style={{ color: 'var(--color-gray-500)', marginBottom: 28 }}>
              We will automatically search for another match for this shipment.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/dashboard')}>
              Go to Dashboard →
            </button>
          </>
        )}

        {error && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
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