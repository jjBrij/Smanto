// App.jsx — Root component
// Sets up React Router and wraps the app in Header + Footer

import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import AppRoutes from './Routes/AppRoutes'

function App() {
  return (
    // BrowserRouter enables URL-based navigation
    <BrowserRouter>
      <div className="app-layout">

        {/* Navigation bar shown on every page */}
        <Header />

        {/* Main content area — changes based on the URL */}
        <main className="app-main">
          <AppRoutes />
        </main>

        {/* Footer shown on every page */}
        <Footer />

      </div>
    </BrowserRouter>
  )
}

export default App
