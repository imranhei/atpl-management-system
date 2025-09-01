import { Button } from "@/components/ui/button";
import { ChevronsRight } from "lucide-react";
import bg from "../../../assets/hero.webp";

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="space-y-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Unleashing the potential of technology to fuel your success story
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto">
            Strategic back office for Ampec Technologies and Total Electrical
            Connections Pty Ltd, providing comprehensive engineering and
            technical support services from our operations center in Uttara,
            Dhaka-1230, Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Our Services
            </Button>
            <Button
              variant="outline"
              className="text-primary hover:bg-background/80"
              size="lg"
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn More <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
