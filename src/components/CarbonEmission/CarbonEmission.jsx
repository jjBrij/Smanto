// CarbonEmission.jsx — Carbon Emission Control section
// Replaces the old Simple Pricing section.
// Smanto's commitment to reducing the carbon footprint of international shipping.

import { useState, useEffect, useRef } from 'react'
import './CarbonEmission.css'

// ── Data ──────────────────────────────────────────────────
const missionStats = [
  { value: '2.1T', label: 'CO₂ Saved\nThis Year' },
  { value: '8K+',  label: 'Deliveries\nVia Travelers' },
  { value: '68%',  label: 'Less Carbon vs\nAir Freight' },
  { value: '100%', label: 'Emissions\nOffset Partner' },
]

const progressItems = [
  { label: 'Traveler-carried packages vs Air Freight',         pct: 68, delay: '0s' },
  { label: 'Deliveries matched without extra transport',       pct: 82, delay: '0.2s' },
  { label: 'Users who prefer eco-conscious shipping',          pct: 91, delay: '0.4s' },
]

const pledges = [
  {
    icon: '🌱',
    title: 'No Dedicated Freight',
    desc: 'We never charter flights or trucks. Every package travels with a human already going there.',
  },
  {
    icon: '♻️',
    title: '1 Tree Per Delivery',
    desc: 'For every completed delivery, we plant one tree through our reforestation partners.',
  },
  {
    icon: '🌍',
    title: 'Carbon Offset Guarantee',
    desc: 'Any residual emissions are fully offset through certified carbon credit programs.',
  },
  {
    icon: '📊',
    title: 'Full Transparency',
    desc: 'We publish our carbon report quarterly — you can see exactly where we stand.',
  },
]

// ── Animated CO2 counter hook ────────────────────────────
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0)
  const startRef = useRef(null)
  const rafRef   = useRef(null)

  useEffect(() => {
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts
      const elapsed  = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return count
}

// ── Component ─────────────────────────────────────────────
function CarbonEmission() {
  const co2Count = useCountUp(2140, 2200)   // animates 0 → 2140 kg

  return (
    <section className="carbon">
      <div className="container carbon-inner">

        {/* Top heading */}
        <div className="carbon-eyebrow">
          <div className="carbon-eyebrow-tag">
            🌿 Our Commitment
          </div>
          <h2>
            Carbon Emission<br />
            <span>Control</span>
          </h2>
          <p>
            Traditional air freight is one of the most carbon-intensive ways to move goods.
            Smanto is different — we use existing travel to deliver packages,
            turning empty luggage space into a green logistics network.
          </p>
        </div>

        {/* Two-column body */}
        <div className="carbon-layout">

          {/* Left: stats + progress bars */}
          <div className="carbon-mission">
            <h3>Our Impact So Far</h3>

            {/* Stat grid */}
            <div className="carbon-stats">
              {missionStats.map((s, i) => (
                <div key={i} className="carbon-stat">
                  <div className="carbon-stat-value">{s.value}</div>
                  <div className="carbon-stat-label" style={{ whiteSpace: 'pre-line' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bars */}
            <div className="carbon-progress-list">
              {progressItems.map((item, i) => (
                <div key={i} className="carbon-progress-item">
                  <div className="carbon-progress-header">
                    <span className="carbon-progress-label">{item.label}</span>
                    <span className="carbon-progress-pct">{item.pct}%</span>
                  </div>
                  <div className="carbon-progress-track">
                    <div
                      className="carbon-progress-fill"
                      style={{ width: `${item.pct}%`, animationDelay: item.delay }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: pledges + live counter */}
          <div className="carbon-pledges">
            <h3>Our Green Pledges</h3>

            <div className="carbon-pledge-list">
              {pledges.map((p, i) => (
                <div key={i} className="carbon-pledge">
                  <div className="carbon-pledge-icon">{p.icon}</div>
                  <div>
                    <h4>{p.title}</h4>
                    <p>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live CO2 counter */}
            <div className="carbon-counter">
              <div className="carbon-counter-label">CO₂ Saved This Month</div>
              <div className="carbon-counter-number">{co2Count.toLocaleString()}</div>
              <div className="carbon-counter-unit">kilograms of CO₂ equivalent</div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default CarbonEmission
