import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="bg-white w-full overflow-hidden relative">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
