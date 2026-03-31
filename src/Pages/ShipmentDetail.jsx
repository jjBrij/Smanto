// Pages/ShipmentDetail.jsx — Shipment Details Page (/shipment/:id)
// Shows: Shipment ID, Sender Name, Traveler Name, Status, Payment Status, Chat Button, Complete Delivery Button

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'


// Sample data to show when backend is not connected
const sampleShipment = {
  id: 'SHM001',
  senderName: 'Karim Uddin',
  travelerName: 'Rahim Ahmed',
  pickupCity: 'Delhi',
  destinationCity: 'Pune',
  packageType: 'Electronics',
  packageWeight: '3.5 kg',
  offeredPrice: '1299 Rupess',
  status: 'in-transit',
  paymentStatus: 'paid',
  pickupDate: '2025-03-05',
  receiverName: 'Sugandh ',
  receiverPhone: '+91 7461014220',
}

function ShipmentDetail() {
  const { id } = useParams()            // get the :id from URL
  const navigate = useNavigate()

  const [shipment, setShipment] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [completed, setCompleted] = useState(false)

  // Load shipment data on mount
  useEffect(() => {
    async function load() {
      try {
        //* const data = await getShipmentById(id) --- IGNORE ---
       
      } catch {
        // If API fails, use sample data so page still looks good
        setShipment({ ...sampleShipment, id })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // Mark delivery as complete
  const handleComplete = () => {
    setCompleted(true)
    setShipment((prev) => ({ ...prev, status: 'completed' }))
  }

  if (loading) return <div className="flex-center" style={{ height: '60vh' }}>⏳ Loading...</div>
  if (!shipment) return <div className="flex-center" style={{ height: '60vh' }}>Shipment not found.</div>

  // Color for status badge
  const statusColors = {
    'pending':    { bg: '#fef3c7', color: '#92400e' },
    'in-transit': { bg: '#dbeafe', color: '#1e40af' },
    'completed':  { bg: '#dcfce7', color: '#166534' },
  }
  const statusStyle = statusColors[shipment.status] || statusColors['pending']

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Shipment #{shipment.id}</h1>
          <p>Track and manage this delivery.</p>
        </div>
      </div>

      <div className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container" style={{ maxWidth: '720px' }}>

          {/* Status banner */}
          <div style={{
            ...statusStyle, padding: '14px 20px', borderRadius: 'var(--radius-md)',
            marginBottom: '24px', fontWeight: 600, fontSize: '0.95rem',
          }}>
            📦 Status: {shipment.status.toUpperCase()}
          </div>

          {/* Details card */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Shipment Details</h2>

            <DetailRow label="Shipment ID"    value={`#${shipment.id}`} />
            <DetailRow label="Sender"         value={shipment.senderName} />
            <DetailRow label="Traveler"       value={shipment.travelerName} />
            <DetailRow label="Route"          value={`${shipment.pickupCity} → ${shipment.destinationCity}`} />
            <DetailRow label="Package Type"   value={shipment.packageType} />
            <DetailRow label="Weight"         value={shipment.packageWeight} />
            <DetailRow label="Offered Price"  value={shipment.offeredPrice} />
            <DetailRow label="Pickup Date"    value={shipment.pickupDate} />
            <DetailRow
              label="Payment Status"
              value={
                <span style={{
                  background: shipment.paymentStatus === 'paid' ? '#dcfce7' : '#fee2e2',
                  color: shipment.paymentStatus === 'paid' ? 'var(--color-success)' : 'var(--color-error)',
                  padding: '3px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600,
                }}>
                  {shipment.paymentStatus?.toUpperCase()}
                </span>
              }
            />
          </div>

          {/* Receiver info card */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Receiver</h2>
            <DetailRow label="Name"  value={shipment.receiverName} />
            <DetailRow label="Phone" value={shipment.receiverPhone} />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>

            {/* Chat with traveler/sender */}
            <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
              💬 Chat
            </button>

            {/* Mark delivery as complete */}
            <button
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleComplete}
              disabled={completed || shipment.status === 'completed'}
            >
              {completed || shipment.status === 'completed' ? '✅ Delivery Completed' : '✔ Complete Delivery'}
            </button>

          </div>

        </div>
      </div>
    </div>
  )
}

// ── Helper: label + value row ──
function DetailRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0', borderBottom: '1px solid var(--color-gray-100)',
      flexWrap: 'wrap', gap: '8px',
    }}>
      <span style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  )
}

export default ShipmentDetail
