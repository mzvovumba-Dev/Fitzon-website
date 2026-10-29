import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Classes from './components/Classes'
import Trainers from './components/Trainers'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Timetable from './components/Timetable'

function getPage() {
  const route = window.location.hash.replace('#', '').split('?')[0]
  return ['login', 'dashboard', 'classes', 'timetable'].includes(route) ? route : 'home'
}

function App() {
  const [page, setPage] = useState(getPage)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fitzoneUser')) || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const updatePage = () => setPage(getPage())
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  useEffect(() => {
    if (['dashboard', 'classes', 'timetable'].includes(page) && !user) window.location.hash = 'login'
  }, [page, user])

  function handleLogin(loggedInUser) {
    setUser(loggedInUser)
    window.location.hash = 'dashboard'
  }

  function handleLogout() {
    localStorage.removeItem('fitzoneUser')
    localStorage.removeItem('fitzoneToken')
    setUser(null)
    window.location.hash = 'home'
  }

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      {page === 'login' && <Login onLogin={handleLogin} />}
      {page === 'dashboard' && user && <Dashboard user={user} />}
      {page === 'classes' && user && <Classes />}
      {page === 'timetable' && user && <Timetable />}
      {page === 'home' && (
        <main>
          <Hero />
          <About />
          <Classes />
          <Trainers />
          <Contact />
        </main>
      )}
      <Footer />
    </>
  )
}

export default App
