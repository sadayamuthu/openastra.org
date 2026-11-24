import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useParams } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Frameworks from './pages/Frameworks'
import FrameworkPage from './pages/FrameworkPage'
import Research from './pages/Research'
import About from './pages/About'
import Profile from './pages/Profile'
import Lab from './pages/Lab'
import LabProjectPage from './pages/LabProjectPage'
import Events from './pages/Events'
import EventPage from './pages/EventPage'
import NotFound from './pages/NotFound'
import { frameworks } from './data/frameworks'

const TITLES = {
  '/': 'OpenAstra · Security research for autonomous agents',
  '/frameworks': 'Frameworks · OpenAstra',
  '/lab': 'In the lab · OpenAstra',
  '/research': 'Research · OpenAstra',
  '/about': 'About · OpenAstra',
  '/events': 'Events · OpenAstra',
}

function ScrollAndTitle() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView?.({ block: 'start' })
    else window.scrollTo?.(0, 0)
    const path = pathname.replace(/\/+$/, '') || '/'
    if (TITLES[path]) document.title = TITLES[path]
  }, [pathname, hash])
  return null
}

function LabProjectRoute() {
  const { slug } = useParams()
  return <LabProjectPage slug={slug} />
}

export function AppRoutes() {
  return (
    <>
      <ScrollAndTitle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/frameworks" element={<Frameworks />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/lab/:slug" element={<LabProjectRoute />} />
        <Route path="/research" element={<Research />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/:slug" element={<Profile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventPage />} />
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
