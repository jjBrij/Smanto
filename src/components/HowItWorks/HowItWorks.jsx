// HowItWorks.jsx — Animated step-by-step explainer
// Toggle between "I Want to Send" and "I'm Traveling"
// Each step reveals with a staggered animation + timing badge

import { useState, useEffect, useRef } from 'react'
import './HowItWorks.css'

// ── Step data ──────────────────────────────────────────────
const senderSteps = [
  {
    num: '01', icon: '📋',
    title: 'Post Your Shipment',
    desc: 'Enter package details, pickup city, destination, and your offered price.',
    timing: '~2 minutes',
  },
  {
    num: '02', icon: '🔍',
    title: 'Get Matched',
    desc: 'We instantly find verified travelers heading to your package\'s destination.',
    timing: 'Within hours',
  },
  {
    num: '03', icon: '💳',
    title: 'Pay Securely',
    desc: 'Payment is held in escrow — only released after confirmed delivery.',
    timing: 'Instant hold',
  },
  {
    num: '04', icon: '✅',
    title: 'Package Delivered',
    desc: 'Track live status updates and confirm receipt to release payment.',
    timing: '1–7 days',
  },
]

const travelerSteps = [
  {
    num: '01', icon: '✈️',
    title: 'Post Your Travel',
    desc: 'Enter your route, travel date, and how much weight you can carry.',
    timing: '~2 minutes',
  },
  {
    num: '02', icon: '🤝',
    title: 'Accept Shipments',
    desc: 'Browse matching shipment requests from verified senders on your route.',
    timing: 'Your choice',
  },
  {
    num: '03', icon: '📦',
    title: 'Pick Up Package',
    desc: 'Meet the sender to collect the package before your departure.',
    timing: 'Before trip',
  },
  {
    num: '04', icon: '💰',
    title: 'Get Paid',
    desc: 'Deliver and confirm — payment lands in your account same day.',
    timing: 'Same day',
  },
]

// ── Component ──────────────────────────────────────────────
function HowItWorks() {
  const [activeTab, setActiveTab] = useState('sender')
  const [animKey, setAnimKey] = useState(0)    // force re-mount on tab change

  const steps = activeTab === 'sender' ? senderSteps : travelerSteps

  // Re-trigger animations when tab switches
  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    setAnimKey((k) => k + 1)   // new key = fresh animation
  }

  return (
    <section className="how-it-works">
      <div className="container">

        {/* Heading */}
        <div className="how-header">
          <div className="how-header-eyebrow">Simple Process</div>
          <h2>How It <span className="text-amber">Works</span></h2>
          <p>Four steps to start sending packages or earning money while you travel.</p>
        </div>

        {/* Toggle tabs */}
        <div className="how-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'sender'}
            className={`how-tab ${activeTab === 'sender' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('sender')}
          >
            📦 I Want to Send
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'traveler'}
            className={`how-tab ${activeTab === 'traveler' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('traveler')}
          >
            ✈️ I'm Traveling
          </button>
        </div>

        {/* Animated steps — key forces remount to replay animations */}
        <div className="how-steps" key={animKey}>
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="how-step"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Circle with step number */}
              <div className="how-step-number">{step.num}</div>

              {/* Icon */}
              <div className="how-step-icon">{step.icon}</div>

              {/* Text */}
              <h3>{step.title}</h3>
              <p>{step.desc}</p>

              {/* Timing badge */}
              <div className="how-step-timing">
                ⏱ {step.timing}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default HowItWorks
