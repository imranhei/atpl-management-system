import career_banner from "@/assets/career_banner.png";
import Footer from "@/components/common/portfolio/Footer";
import Navbar from "@/components/common/portfolio/Navbar";

const Career = () => {
  return (
    <div>
      <Navbar />
      <div className="w-full mt-14 relative">
        <img src={career_banner} alt="" className="brightness-75" />
        <div className="absolute top-0 left-0 flex flex-col justify-center items-center w-full h-full space-y-6">
          <div className="rounded-full px-6 py-2 bg-amber-400 text-lg font-semibold text-white">Career</div>
          <h1 className="text-4xl font-bold text-white mt-2">We Are Hiring!</h1>
          <p className="max-w-2xl text-center text-white">
            We offer exciting opportunities in a collaborative atmosphere and
            environment. Our global team is here to support you. We provide
            advancement and challenging career paths to ensure your success at
            ATPL Dhaka
          </p>
        </div>
      </div>

      <div className="w-full py-10 min-h-80 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-center">Currently We Are Not Hiring</h1>
      </div>
      <Footer />
    </div>
  );
};

export default Career;
