import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Frameworks from './pages/Frameworks'
import FrameworkPage from './pages/FrameworkPage'
import Research from './pages/Research'
import Patents from './pages/Patents'
import About from './pages/About'
import NotFound from './pages/NotFound'
import { frameworks } from './data/frameworks'

const TITLES = {
  '/': 'OpenAstra · Security research for autonomous agents',
  '/frameworks': 'Frameworks · OpenAstra',
  '/research': 'Research · OpenAstra',
  '/patents': 'Patents · OpenAstra',
  '/about': 'About · OpenAstra',
}

function ScrollAndTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo?.(0, 0)
    if (TITLES[pathname]) document.title = TITLES[pathname]
  }, [pathname])
  return null
}

export function AppRoutes() {
  return (
    <>
      <ScrollAndTitle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/frameworks" element={<Frameworks />} />
        <Route path="/research" element={<Research />} />
        <Route path="/patents" element={<Patents />} />
        <Route path="/about" element={<About />} />
        {frameworks.map((f) => (
          <Route key={f.slug} path={`/${f.slug}`} element={<FrameworkPage slug={f.slug} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
