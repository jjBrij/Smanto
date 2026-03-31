// Pages/Home.jsx — Main landing page
// Assembles all homepage sections

import Hero          from '../components/Hero/Hero'
import HowItWorks   from '../components/HowItWorks/HowItWorks'
import TravelEarn   from '../components/TravelEarn/TravelEarn'
import TrustSafety  from '../components/TrustSafety/TrustSafety'
import UseCases     from '../components/UseCases/UseCases'
import CarbonEmission from '../components/CarbonEmission/CarbonEmission'
import CTA          from '../components/CTA/CTA'

function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <TravelEarn />
      <TrustSafety />
      <UseCases />
      <CarbonEmission />
      <CTA />
    </div>
  )
}
export default Home
