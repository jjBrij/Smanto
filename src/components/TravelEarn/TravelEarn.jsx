// TravelEarn.jsx — "Earn Money While You Travel" — no Sample Earnings card

import { Link } from 'react-router-dom'
import './TravelEarn.css'

const perks = [
  { icon: '💰', title: 'Earn Extra Income',     desc: 'Offset your flight costs by carrying packages on trips you\'re already taking.' },
  { icon: '🛡️', title: 'Verified Senders Only',  desc: 'Every sender is ID-verified and rated before they can request a match.' },
  { icon: '⚡', title: 'Post in 2 Minutes',      desc: 'Enter your route, travel date, and available weight — done.' },
  { icon: '📱', title: 'Live Chat & Tracking',   desc: 'Coordinate directly with senders in-app, with full delivery tracking.' },
]

function TravelEarn() {
  return (
    <section className="travel-earn">
      <div className="container">

        <div className="travel-earn-inner">

          {/* Eyebrow */}
          <div className="travel-earn-eyebrow">For Travelers</div>

          {/* Headline */}
          <h2 className="travel-earn-title">
            Turn Your Trip<br />Into <span>Income</span>
          </h2>

          <p className="travel-earn-sub">
            You're already traveling — your empty luggage space has value.
            Carry packages for senders and get paid for the trip you were
            already going to take. It's that simple.
          </p>

          {/* 2x2 perks grid */}
          <div className="travel-earn-perks">
            {perks.map((p, i) => (
              <div key={i} className="earn-perk">
                <div className="earn-perk-icon">{p.icon}</div>
                <div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/post-travel" className="btn btn-primary travel-earn-cta">
            ✈️ Post My Travel Plan
          </Link>

        </div>

      </div>
    </section>
  )
}

export default TravelEarn
