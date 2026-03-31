// AppRoutes.jsx — All app routes
// /track is accessible only to logged-in users (guard in Header + page itself)

import { Routes, Route } from 'react-router-dom'

import Home from '../Pages/Home'
import Register from '../Pages/Register'
import Login from '../Pages/Login'
import Dashboard from '../Pages/Dashboard'
import PostTravel from '../Pages/PostTravel'
import PostShipment from '../Pages/PostShipment'
import Matches from '../Pages/Matches'
import ShipmentDetail from '../Pages/ShipmentDetail'
import Profile from '../Pages/Profile'
import AdminPanel from '../Pages/AdminPanel'
import TrackPackage from '../Pages/TrackPackage'
import OtpVerification from "../components/Otp/OtpVerification"
import MatchAccept from '../Pages/MatchAccept'
import MatchReject from '../Pages/MatchReject'


// ✅ Clean AppRoutes.jsx — no duplicates, correct comment syntax
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"           element={<Home />} />
      <Route path="/register"   element={<Register />} />
      <Route path="/login"      element={<Login />} />

      {/* Auth */}
      <Route path="/dashboard"      element={<Dashboard />} />
      <Route path="/post-travel"    element={<PostTravel />} />
      <Route path="/post-shipment"  element={<PostShipment />} />
      <Route path="/matches"        element={<Matches />} />
      <Route path="/shipment/:id"   element={<ShipmentDetail />} />
      <Route path="/profile"        element={<Profile />} />
      <Route path="/track"          element={<TrackPackage />} />

      {/* OTP — same component handles both flows */}
      <Route path="/verify-otp"          element={<OtpVerification />} />
      <Route path="/verify-registration" element={<OtpVerification />} />

      {/* Match Accept / Reject from email */}
      <Route path="/match/:id/accept" element={<MatchAccept />} />
      <Route path="/match/:id/reject" element={<MatchReject />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  )
}

export default AppRoutes