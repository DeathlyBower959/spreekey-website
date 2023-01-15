// Packages
import { Routes, Route } from 'react-router-dom'

// Pages
import PageNotFound from './pages/PageNotFound'
import Landing from './pages/Landing'
import Gallery from './pages/Gallery'
import Commissions from './pages/Commissions'
import Store from './pages/Store'
import About from './pages/About'

// Components
import Footer from './components/Footer'
import Navbar from './components/Navbar'

// Main
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Page Not Found */}
        <Route path='*' element={<PageNotFound />} />
        {/* Landing Page */}
        <Route path='/' element={<Landing />} />
        <Route path='/gallery/:year?/:sector?' element={<Gallery />} />
        <Route path='/commissions' element={<Commissions />} />
        <Route path='/store' element={<Store />} />
        <Route path='/about' element={<About />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

