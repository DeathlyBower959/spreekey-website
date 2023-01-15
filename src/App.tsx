import { Routes, Route, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

// Pages
import Landing from './pages/Landing'
// import PageNotFound from './pages/PageNotFound'

function App() {
  const location = useLocation()

  return (
    <>
      <Navbar isLanding={location.pathname === '/'} />
      <Routes>
        {/* Page Not Found */}
        {/* <Route path='*' element={<PageNotFound />} /> */}
        {/* Landing Page */}
        <Route path='/' element={<Landing />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

