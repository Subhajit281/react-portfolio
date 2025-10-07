import React from 'react'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'


const App = () => {
  return (
    <div className="bg-red-600">
      <Navbar />
      <Hero />
      <Skills /> 
      <Experience />
      <Projects />
      <Education />
      <Contact />
      <Footer />

    </div>
  )
} 

export default App
