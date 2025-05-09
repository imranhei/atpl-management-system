import React, { useEffect } from 'react';
import { Element } from 'react-scroll';
import Aos from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <Element name='about' className='section'>
      <div className='container flex justify-center items-center mx-auto h-fit w-full relative pt-14 sm:pt-20 md:pt-36 pb-10 md:pb-20'>
        <h1 data-aos="slide-left" className='text-gray-100 dark:text-gray-800 font-black lg:text-[150px] md:9xl sm:text-8xl text-6xl absolute lg:-top-8 sm:-top-5 -top-3 sm:left-0 left-10'>ABOUT US</h1>
        <div className='md:flex lg:w-3/4 w-4/5 md:space-x-8 space-y-6 md:space-y-0 items-center relative z-20'>
            <h1 className='md:w-64 font-bold md:text-6xl text-4xl md:text-right text-center text-teal-900 dark:text-teal-300 md:border-r-2 md:pr-4 border-teal-900 dark:border-teal-300' data-aos="fade-right">WHO <br className='hidden md:block'/>WE ARE</h1>
            <h1 className='flex-1 text-lg text-justify dark:text-teal-100' data-aos="fade-left">
                Our software services are designed to optimize your operations, streamline your processes, and enhance overall efficiency. Whether you need custom software development, application integration, cloud solutions, or software maintenance and support, we have the expertise to deliver robust and reliable solutions.
                <br />
                We understand the importance of staying ahead in today's competitive landscape. That's why our team stays updated with the latest industry trends and best practices to ensure we provide you with innovative and future-proof solutions.
            </h1>

        </div>
      </div>
    </Element>
  );
}

export default About;
