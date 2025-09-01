import About from "@/components/common/portfolio/About";
import Career from "@/components/common/portfolio/Career";
import Hero from "@/components/common/portfolio/Hero";
import Services from "@/components/common/portfolio/Services";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Services />
      <Career />
    </div>
  );
}
