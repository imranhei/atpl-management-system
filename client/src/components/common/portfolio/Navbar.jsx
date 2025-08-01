import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "/atpldhaka.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  // Scroll to section if hash exists (on home page)
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  const handleClick = (section) => {
    setActive(section);
    setOpen(false);

    if (location.pathname !== "/") {
      navigate("/", { replace: true });

      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      data-aos="fade-down"
      className="fixed w-full z-50 text-white bg-black h-14 bg-opacity-80 flex items-center justify-center"
    >
      <div className="flex justify-center items-center w-full">
        {/* Hamburger menu */}
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

        {/* Logo */}
        <div
          onClick={() => handleClick("hero")}
          className="cursor-pointer absolute left-10 z-50"
        >
          <img
            data-aos="fade-right"
            data-aos-delay="1000"
            className="h-8"
            src={logo}
            alt="logo"
          />
        </div>

        {/* Nav Links */}
        <div
          className={`z-40 text-center md:space-x-5 md:p-0 px-20 md:w-auto w-full py-3 md:static absolute flex flex-col md:flex-row md:bg-transparent bg-black bg-opacity-80 transition-all duration-700 right-0 ${
            open ? "top-14" : "-top-40"
          }`}
        >
          {["hero", "about", "services", "contact"].map((section) => (
            <span
              key={section}
              onClick={() => handleClick(section)}
              className={`cursor-pointer w-full md:w-fit md:border-b-2 ${
                active === section
                  ? "text-amber-300 border-amber-300"
                  : "border-transparent"
              }`}
            >
              {section === "hero"
                ? "Home"
                : section.charAt(0).toUpperCase() +
                  section.slice(1).replace("-", " ")}
            </span>
          ))}

          {/* Career page route */}
          <span
            onClick={() => {
              setActive("career");
              setOpen(false);
              navigate("/career");
            }}
            className={`cursor-pointer w-full md:w-fit md:border-b-2 ${
              active === "career"
                ? "text-yellow-300 border-yellow-300"
                : "border-transparent"
            }`}
          >
            Career
          </span>
        </div>

        {/* Login */}
        <Link
          to="/auth/login"
          state={{ from: location.pathname }} // Add this
          className="absolute md:right-10 right-20 hover:text-amber-300 z-50"
          replace
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
