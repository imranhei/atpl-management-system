import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import logo from "/atpldhaka.png";
import Aos from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const handleSetActive = (section) => {
    setActive(section);
  };

  return (
    <div
      data-aos="fade-down"
      className="fixed w-full z-50 text-white bg-black h-14 bg-opacity-80 flex items-center justify-center"
    >
      <div className="flex justify-center items-center">
        <div
          onClick={() => setOpen(!open)}
          className="absolute right-10 z-50 cursor-pointer md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </div>
        <Link
          to="hero"
          spy={true}
          smooth={true}
          offset={0}
          duration={500}
          onSetActive={handleSetActive}
          className="cursor-pointer absolute left-10 z-50"
        >
          <img
            data-aos="fade-right"
            data-aos-delay="1000"
            className="h-8"
            src={logo}
            alt="logo"
          />
        </Link>
        <div
          className={`z-40 text-center md:space-x-5 md:p-0 px-20 md:w-auto w-full py-3 md:static absolute flex flex-col md:flex-row md:bg-transparent bg-black bg-opacity-80 transition-all duration-1000 right-0 ${
            open ? "top-14" : "-top-40"
          }`}
        >
          <Link
            to="hero"
            spy={true}
            smooth={true}
            offset={0}
            duration={500}
            // activeClass='text-yellow-300'
            onSetActive={handleSetActive}
            className={`cursor-pointer w-flex md:w-fit md:border-b-2 ${
              active === "hero"
                ? "text-amber-300 border-amber-300"
                : "border-transparent"
            }`}
          >
            Home
          </Link>
          <Link
            to="about"
            spy={true}
            smooth={true}
            offset={-56}
            duration={500}
            // activeClass='text-yellow-300'
            onSetActive={handleSetActive}
            className={`cursor-pointer w-flex md:w-fit md:border-b-2 ${
              active === "about"
                ? "text-amber-300 border-amber-300"
                : "border-transparent"
            }`}
          >
            About Us
          </Link>
          <Link
            to="services"
            spy={true}
            smooth={true}
            offset={-56}
            duration={500}
            // activeClass='text-yellow-300'
            onSetActive={handleSetActive}
            className={`cursor-pointer w-flex md:w-fit md:border-b-2 ${
              active === "services"
                ? "text-amber-300 border-amber-300"
                : "border-transparent"
            }`}
          >
            Services
          </Link>
          {/* <Link
            to="career"
            spy={true}
            smooth={true}
            offset={-56}
            duration={500}
            // activeClass='text-yellow-300'
            onSetActive={handleSetActive}
            className={`cursor-pointer w-flex md:w-fit md:border-b-2 ${
              active === "career"
                ? "text-yellow-300 border-yellow-300"
                : "border-transparent"
            }`}
          >
            Careers
          </Link> */}
          <Link
            to="contact"
            spy={true}
            smooth={true}
            offset={-56}
            duration={500}
            // activeClass='text-yellow-300'
            onSetActive={handleSetActive}
            className={`cursor-pointer w-flex md:w-fit md:border-b-2 ${
              active === "contact"
                ? "text-amber-300 border-amber-300"
                : "border-transparent"
            }`}
          >
            Contact
          </Link>
        </div>
        <button
          onClick={() => navigate("auth/login")}
          className="absolute md:right-10 right-20 hover:text-amber-300 z-50"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Navbar;
