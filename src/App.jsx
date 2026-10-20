import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Classes from './components/Classes'
import Trainers from './components/Trainers'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <About />
        <Classes />
        <Trainers />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default App