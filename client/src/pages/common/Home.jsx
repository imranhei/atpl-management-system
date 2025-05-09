import React from 'react'
import Navbar from '@/components/common/portfolio/Navbar';
import Hero from '@/components/common/portfolio/Hero';
import About from '@/components/common/portfolio/About';
import Services from '@/components/common/portfolio/Services';
import Career from '@/components/common/portfolio/Career';
import Contact from '@/components/common/portfolio/Contact';

const Home = () => {
  return (
    <div className='bg-white w-full overflow-hidden relative'>
      <Navbar />
      <Hero />
      <About />
      <Services />
      {/* <Career /> */}
      <Contact />
    </div>
  )
}

export default Home;
