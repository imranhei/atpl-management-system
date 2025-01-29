import React, { useEffect } from 'react';
import { Element } from 'react-scroll';
import bg from '../../assets/hero_banner.jpg';
import Aos from "aos";
import "aos/dist/aos.css";

const Hero = () => {
  
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <Element name='hero' className='section'>
      <div className='min-h-screen h-fit w-full relative overflow-hidden'>
        <div className="h-full w-full opacity-75 bg-black z-10 absolute top-0 left-0"></div>
        <img src={bg} alt='background' className='h-full w-full object-cover blur-sm absolute top-0 left-0' />
        <div className="min-h-screen w-full z-20 relative flex justify-center items-center pt-16 pb-10">
          <div className=' h-full mx-auto text-white lg:w-3/4 w-4/5 space-y-6'>
            <h1 className="md:text-5xl text-3xl font-bold text-yellow-400" data-aos="fade-down">Unleashing the potential of technology to fuel your success story.</h1>
            <h1 className='md:text-xl text-justify' data-aos="fade-up">At <span className='text-yellow-400 font-semibold'>ATPL Dhaka</span>, we are dedicated to providing top-notch engineering services and solutions tailored to meet your specific needs. With our team of experienced professionals and cutting-edge technology, we strive to deliver exceptional results that drive your business forward.</h1>
          </div>
        </div>
      </div>
    </Element>
  );
}

export default Hero;
