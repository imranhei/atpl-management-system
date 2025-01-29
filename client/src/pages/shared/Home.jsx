import React from 'react'
import Navbar from '@/components/common/Navbar';
import Hero from '@/components/common/Hero';
import About from '@/components/common/About';
import Services from '@/components/common/Services';
import Career from '@/components/common/Career';
import Contact from '@/components/common/Contact';

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
