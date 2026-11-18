import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Frameworks from './pages/Frameworks'
import FrameworkPage from './pages/FrameworkPage'
import Research from './pages/Research'
import About from './pages/About'
import Profile from './pages/Profile'
import Lab from './pages/Lab'
import NotFound from './pages/NotFound'
import { frameworks } from './data/frameworks'

const TITLES = {
  '/': 'OpenAstra · Security research for autonomous agents',
  '/frameworks': 'Frameworks · OpenAstra',
  '/lab': 'In the lab · OpenAstra',
  '/research': 'Research · OpenAstra',
  '/about': 'About · OpenAstra',
}

function ScrollAndTitle() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView?.({ block: 'start' })
    else window.scrollTo?.(0, 0)
    if (TITLES[pathname]) document.title = TITLES[pathname]
  }, [pathname, hash])
  return null
}

export function AppRoutes() {
  return (
    <>
      <ScrollAndTitle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/frameworks" element={<Frameworks />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/research" element={<Research />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/:slug" element={<Profile />} />
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
