import React from 'react';
import { Element } from 'react-scroll';

const Services = () => {
    return (
        <Element name='services' className='section'>
            <div className="bg-green-100 dark:bg-teal-950 overflow-hidden">
                <div className='mx-auto container md:flex justify-center items-center h-fit w-full relative pt-1 sm:pt-10 md:pt-24 pb-10 md:pb-20'>
                    <h1 data-aos="slide-left" className='text-white dark:text-teal-900 font-black lg:text-[150px] md:text-9xl sm:text-8xl text-6xl absolute sm:-top-6 -top-3 md:-top-7 lg:-top-8 sm:left-0 left-10'>SERVICES</h1>
                    <div className='mx-auto mt-14 lg:flex lg:w-3/4 w-4/5 lg:space-x-8 space-y-6 lg:space-y-0 items-center z-20 relative'>
                        <h1 className='lg:w-64 font-bold lg:text-6xl text-4xl lg:text-right text-center text-teal-900 dark:text-teal-300 lg:border-r-2 lg:pr-4 border-teal-900 dark:border-teal-300'  data-aos="fade-right">WHAT <br className='hidden lg:block'/>WE DO</h1>
                        <h1 className='flex-1 text-lg text-justify dark:text-teal-100' data-aos="fade-left">
                        Custom Software Development: We create tailor-made software solutions that align with your unique business requirements, ensuring seamless integration and improved efficiency.
                        <br />
                        Application Maintenance and Support: Our dedicated team provides comprehensive maintenance and support services to keep your software running smoothly, ensuring minimal disruptions and maximum productivity.
                        <br />
                        User Experience Design: We prioritize user-centric design to create intuitive and engaging software interfaces, ensuring a seamless and delightful user experience.
                        <br />
                        Technology Upgrades and Migration: We assist in upgrading your legacy systems, migrating to modern platforms, and harnessing the latest technologies for improved performance and scalability.
                        <br />
                        Partner with us to leverage our comprehensive range of software services and propel your business towards digital excellence.
                        </h1>
                    </div>
                </div>
            </div>
        </Element>
    );
}

export default Services;
