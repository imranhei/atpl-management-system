import React, { useEffect } from 'react';
import { Element } from 'react-scroll';
import Aos from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {

    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);

    return (
        <Element name='contact' className='section'>
            <div className="bg-violet-50">
                <div className='container mx-auto flex flex-col justify-center items-center min-h-fit w-full relative pt-10 sm:pt-20 md:pt-32 pb-10 md:pb-20'>
                    <h1 data-aos="slide-left" className='text-white font-black lg:text-[150px] md:text-9xl sm:text-8xl text-6xl absolute sm:-top-6 -top-4 md:-top-7 lg:-top-8 sm:left-0 left-10'>CONTACT</h1>
                    <h1 data-aos="fade-right" className='font-bold md:text-5xl text-3xl py-8 text-teal-900 md:pb-10 z-10'>GET IN TOUCH</h1>
                    <div className='flex md:gap-10 gap-6 flex-wrap justify-center z-20 relative'>
                        <div data-aos="fade-right" className='flex flex-col items-center'>
                            <svg className='text-yellow-400' xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 512 512"><path fill="currentColor" d="M134.5 30.5v451h243v-451zm100.68 20h41.6a8 8 0 0 1 0 16h-41.6a8 8 0 1 1 0-16zm20.32 420.51a19.26 19.26 0 1 1 19.26-19.26a19.26 19.26 0 0 1-19.26 19.26zm105-44.51h-211v-343h211z"/></svg>
                            <h1 className='font-semibold text-xl text-gray-600'>Give us a call</h1>
                            <div className="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stopColor="#1FAF38"/><stop offset="100%" stopColor="#60D669"/></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stopColor="#F9F9F9"/><stop offset="100%" stopColor="#FFF"/></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004"/><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416Zm40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513l10.706-39.082Z"/><path fill="#FFF" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64"/></svg>
                                <h1>+880 1714245681</h1>
                            </div>
                        </div>
                        <div data-aos="fade-left" className='flex flex-col items-center'>
                            <svg className='text-yellow-400' xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 32 32"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"><circle cx="16" cy="11" r="4"/><path d="M24 15c-3 7-8 15-8 15s-5-8-8-15s2-13 8-13s11 6 8 13Z"/></g></svg>
                            <h1 className='font-semibold text-xl text-gray-600'>Location</h1>
                            <h1>Uttara Tower, level 5</h1>
                            <h1>Jashimuddin Avenue, Sector-3</h1>
                            <h1>Uttara, Dhaka-1230, Bangladesh</h1>
                        </div>
                        <div data-aos="fade-up" className='flex flex-col items-center'>
                            <svg className='text-yellow-400' xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 32 32"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M29 9v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9m26 0a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2m26 0l-11.862 8.212a2 2 0 0 1-2.276 0L3 9"/></svg>
                            <h1 className='font-semibold text-xl text-gray-600'>Send us an email</h1>
                            <h1>faisal@atpldhaka.com</h1>
                        </div>
                    </div>
                </div>
            </div>
        </Element>
    );
}

export default Contact;
