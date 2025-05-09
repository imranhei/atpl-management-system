import React, { useEffect } from 'react';
import { Element } from 'react-scroll';
import Aos from 'aos';
import 'aos/dist/aos.css';

const Career = () => {

    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);

    return (
        <Element name='career' className='section'>
            <div className='container mx-auto flex flex-col justify-center h-fit w-full relative pt-10 sm:pt-20 md:pt-32 pb-10 overflow-hidden'>
                <div className='lg:w-3/4 w-4/5 mx-auto space-y-6 z-20'>
                    <h1 data-aos="slide-left" className='text-green-100 dark:text-gray-800 font-black lg:text-[150px] md:text-9xl sm:text-8xl text-6xl absolute sm:-top-6 -top-4 md:-top-7 lg:-top-8 sm:left-0 left-10'>CAREERS</h1>
                    <h1 data-aos="fade-right" className='font-bold md:text-5xl text-3xl text-center text-teal-900 dark:text-teal-300'>CURRENT OPENINGS</h1>
                    <h1 data-aos="fade-left" className='text-justify mx-auto dark:text-gray-200'>Join our team in the exciting fields of <span className='text-teal-900 dark:text-teal-300 font-semibold'><span className='text-teal-900 dark:text-teal-300 font-semibold'>Electrical and Electronics Engineering (EEE)</span>, Computer Science and Engineering (CSE) and </span>, <span className='text-teal-900 dark:text-teal-300 font-semibold'>Mechanical Engineering (ME)</span>. We value both your academic background and skillset as we seek passionate individuals who are confident in their abilities. If you believe in your capabilities and are eager to contribute, we invite you to submit your CV through below email address. Take this opportunity to showcase your professionalism and seize the chance to be part of our dynamic team.</h1>
                    {/* {false && (
                        <div className='md:w-3/4 w-4/5 space-y-2'>
                            <div className='sm:flex hidden font-semibold text-center text-rose-400'>
                                <h1 className='flex-1'>Job Title</h1>
                                <h1 className='w-1/5'>Location</h1>
                                <h1 className='w-1/5'>Department</h1>
                                <h1 className='w-1/5'>Job Type</h1>
                            </div>
                            <div className='sm:flex sm:text-center'>
                                <h1 className='sm:flex-1 font-bold sm:font-normal'>IoT Solutions Engineer</h1>
                                <h1 className='sm:w-1/5 sm:text-black text-gray-500'>Uttara</h1>
                                <h1 className='sm:w-1/5 sm:text-black text-gray-500'>Engineering</h1>
                                <h1 className='sm:w-1/5 sm:text-black text-gray-500'>Full-time</h1>
                            </div>
                            {jobs && (
                                <>
                                    <h1 className='font-semibold pt-4'>Job Description:</h1>
                                    <p>We are seeking talented and experienced Electrical Engineers to join our team. The successful 
                                    candidate will be responsible for IoT projects that meet our clients' needs and expectations. This 
                                    position requires someone with a keen eye for design and excellent communication skills.</p>
                                    <h1 className='font-semibold pt-4'>Responsibilities:</h1>
                                    <ul className='list-disc list-inside'>
                                        <li>Design, develop, and test electrical systems and components using Raspberry Pi and Python.</li>
                                        <li>Collaborate with cross-functional teams to integrate electrical systems into overall product designs.</li>
                                        <li>Conduct feasibility studies, analyze data, and provide technical recommendations for system improvements.</li>
                                        <li>Troubleshoot and debug electrical systems and resolve any performance issues.</li>
                                        <li>Ensure compliance with safety regulations and industry standards.</li>
                                        <li>Create and maintain technical documentation, including schematics, diagrams, and user manuals</li>
                                        <li>Stay updated with the latest advancements in Raspberry Pi and Python technologies and propose innovative ideas.</li>
                                    </ul>
                                    <h1 className='font-semibold pt-4'>Requirements:</h1>
                                    <ul className='list-disc list-inside'>
                                        <li>Bachelor's degree in Electrical Engineering or CSE.</li>
                                        <li>Proven experience in developing electrical systems using Raspberry Pi and Python.</li>
                                        <li>Strong knowledge of electrical engineering principles, circuit design, and PCB layout</li>
                                        <li>Proficiency in Python programming and experience with libraries commonly used with the Raspberry Pi.</li>
                                        <li>Familiarity with embedded systems and microcontrollers.</li>
                                        <li>Excellent problem-solving skills and attention to detail.</li>
                                        <li>Ability to work both independently and collaboratively in a team environment.</li>
                                        <li>Strong communication skills and the ability to present technical information effectively.</li>
                                    </ul>
                                </>
                            )}
                            <p onClick={() => setJobs(!jobs)} className='text-center cursor-pointer bg-rose-400 text-white font-bold py-1 text-lg rounded-sm'>{jobs ? '-' : '+'}</p>
                        </div>
                    )} */}
                    <h1 className='font-bold'>Requirments:</h1>
                    <ul className='list-disc list-inside text-left'>
                        <li><span className='font-semibold'>Communication skills:</span> Excellent written and verbal communication skills to collaborate effectively with team members and stakeholders.</li>
                        <li><span className='font-semibold'>Educational background:</span> A bachelor's or master's degree in Electrical and Electronics Engineering, Computer Science, or a related field.</li>
                        <li><span className='font-semibold'>Continuous learning:</span> A willingness to stay updated with the latest technologies, programming languages, and industry trends.</li>
                        <li><span className='font-semibold'>Flexibility:</span> Willingness to adapt to changing requirements, technologies, and project needs.</li>
                        <li><span className='font-semibold'>Long-time service commitment:</span> We are seeking candidates who are committed to a long-term career with our company.</li>
                    </ul>
                    <h1 className='font-bold'>Benifits</h1>
                    <ul className='list-disc list-inside'>
                        <li><span className='font-semibold'>Excellent career growth opportunity:</span> Highlight the potential for career advancement, and professional development opportunities</li>
                    </ul>
                    <div className='text-center'>
                        <a href='mailto:hr@atpldhaka.com' className='text-teal-900 text-xl cursor-pointer'>hr@atpldhaka.com</a>
                    </div>
                    <h1 className='md:w-3/4 w-4/5'>Attach your CV to the email. Please rename the CV in the following format: <br />
                        Name_University_CGPA (e.g. _BUET_3.85.pdf)</h1>
                </div>
            </div>
        </Element>
    );
}

export default Career;
