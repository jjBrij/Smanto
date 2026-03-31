// TrustSafety.jsx — Trust & Safety Section

import './TrustSafety.css'

const trustFeatures = [
  { icon: '🪪', title: 'ID Verification',   desc: 'All users verify government ID before transacting.' },
  { icon: '🔒', title: 'Secure Payments',   desc: 'Funds held in escrow until delivery confirmed.' },
  { icon: '⭐', title: 'Rating System',     desc: 'Both senders and travelers rate each other after delivery.' },
  { icon: '🛡️', title: 'Package Insurance', desc: 'Optional insurance coverage for high-value items.' },
  { icon: '📞', title: '24/7 Support',      desc: 'Our team resolves disputes quickly and fairly.' },
  { icon: '🔍', title: 'Live Tracking',     desc: 'Real-time status updates at every stage of the journey.' },
]

function TrustSafety() {
  return (
    <section className="trust-safety">
      <div className="container">

        <div className="trust-safety-header">
          <h2>Safety You Can <span className="text-amber">Trust</span></h2>
          <p>We take safety seriously — for both senders and travelers.</p>
        </div>

        <div className="trust-grid">
          {trustFeatures.map((item, i) => (
            <div key={i} className="trust-item">
              <div className="trust-item-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default TrustSafety
