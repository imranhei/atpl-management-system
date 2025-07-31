import React from 'react'
import Hero from '@/components/common/portfolio/Hero';
import About from '@/components/common/portfolio/About';
import Services from '@/components/common/portfolio/Services';
import Contact from '@/components/common/portfolio/Contact';

const Home = () => {
  return (
    <div className="bg-white w-full overflow-hidden relative">
      <section id="hero"><Hero /></section>
      <section id="about"><About /></section>
      <section id="services"><Services /></section>
      <section id="contact"><Contact /></section>
    </div>
  )
}

export default Home;
