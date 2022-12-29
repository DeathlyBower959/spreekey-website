import { Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

// Pages
import Landing from './pages/Landing'
import PageNotFound from './pages/PageNotFound'
import About from './pages/About'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Page Not Found */}
        <Route path='*' element={<PageNotFound />} />
        {/* Landing Page */}
        <Route path='/' element={<Landing />} />
        <Route path='/about' element={<About />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

