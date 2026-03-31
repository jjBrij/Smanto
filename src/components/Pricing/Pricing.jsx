// Pricing.jsx — Pricing Plans Section

import { Link } from 'react-router-dom'
import './Pricing.css'

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    desc: 'Get started with no cost',
    features: ['Post 2 shipments/month', 'Basic matching', 'Email support', 'Traveler ratings'],
    featured: false,
  },
  {
    name: 'Standard',
    price: '$9',
    period: '/mo',
    desc: 'For regular senders',
    features: ['Unlimited shipments', 'Priority matching', 'Live tracking', 'Chat support', 'Dispute protection'],
    featured: true,
  },
  {
    name: 'Business',
    price: '$29',
    period: '/mo',
    desc: 'For power users & businesses',
    features: ['Everything in Standard', 'API access', 'Dedicated manager', 'Bulk shipments', 'Analytics dashboard'],
    featured: false,
  },
]

function Pricing() {
  return (
    <section className="pricing">
      <div className="container">

        <div className="pricing-header">
          <h2>Simple <span style={{ color: 'var(--color-amber)' }}>Pricing</span></h2>
          <p>Affordable plans for every sender's needs.</p>
        </div>

        <div className="pricing-cards">
          {plans.map((plan, i) => (
            <div key={i} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
              {plan.featured && <div className="pricing-featured-badge">Most Popular</div>}

              <div className="pricing-plan-name">{plan.name}</div>
              <div className="pricing-price">
                {plan.price}
                {plan.period && <span>{plan.period}</span>}
              </div>
              <div className="pricing-desc">{plan.desc}</div>

              <ul className="pricing-features">
                {plan.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline-white'}`}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Pricing
