import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ControlGate from './pages/ControlGate'
import OCBC from './pages/OCBC'
import OpenGPL from './pages/OpenGPL'
import AnySQL from './pages/AnySQL'
import ExposureGate from './pages/ExposureGate'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/controlgate" element={<ControlGate />} />
            <Route path="/ocbc" element={<OCBC />} />
            <Route path="/opengpl" element={<OpenGPL />} />
            <Route path="/anysql" element={<AnySQL />} />
            <Route path="/exposuregate" element={<ExposureGate />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
