// CTA.jsx — Bottom Call-to-Action Section

import { Link } from 'react-router-dom'
import './CTA.css'

function CTA() {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-eyebrow">🚀 Join Smanto Today</div>
        <h2>Ready to Ship or Earn?</h2>
        <p>
          Thousands of travelers and senders trust Smanto every day.
          Fast, affordable, and planet-conscious international delivery.
        </p>
        <div className="cta-actions">
          <Link to="/register" className="btn cta-btn-dark">
            Create Free Account
          </Link>
          <Link to="/post-shipment" className="btn cta-btn-outline">
            📦 Send a Package
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTA
