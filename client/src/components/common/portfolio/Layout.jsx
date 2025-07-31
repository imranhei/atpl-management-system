import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="bg-white w-full overflow-hidden relative">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
