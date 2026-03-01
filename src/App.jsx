import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ControlGate from './pages/ControlGate'
import NCSB from './pages/NCSB'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/controlgate" element={<ControlGate />} />
            <Route path="/ncsb" element={<NCSB />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
