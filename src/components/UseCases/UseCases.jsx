// UseCases.jsx — Real-world use cases section

import './UseCases.css'

const useCases = [
  { icon: '👔', title: 'Send Gifts to Family Abroad',  desc: 'Send a birthday gift or Eid clothes to relatives living overseas — quickly and affordably.' },
  { icon: '💊', title: 'Urgent Medicine Delivery',     desc: 'Need medicine that is only available abroad? Find a traveler heading there today.' },
  { icon: '📱', title: 'Electronics from Overseas',    desc: 'Get the latest gadgets brought back without sky-high import fees.' },
  { icon: '🎓', title: 'Student Documents',            desc: 'Send important university documents internationally in time.' },
  { icon: '👟', title: 'Fashion & Branded Goods',      desc: 'Source specific fashion items or branded goods unavailable locally.' },
  { icon: '🧴', title: 'Cosmetics & Personal Care',    desc: 'Skincare or beauty products not sold in your country shipped safely.' },
]

function UseCases() {
  return (
    <section className="use-cases">
      <div className="container">

        <div className="use-cases-header">
          <h2>What People <span className="text-amber">Ship</span></h2>
          <p>Real scenarios where Smanto makes a difference every day.</p>
        </div>

        <div className="use-cases-list">
          {useCases.map((item, i) => (
            <div key={i} className="use-case-card">
              <div className="use-case-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default UseCases
