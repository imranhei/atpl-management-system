import React, { useState } from "react";
import { Outlet } from "react-router-dom";
// import Navbar from './navbar'
import EmployeeSidebar from "./sidebar";
import EmployeeHeader from "./header";

const EmployeeLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Employee sidebar */}
      <EmployeeSidebar open={openSidebar} setOpenSidebar={setOpenSidebar} />
      <div className="flex flex-1 flex-col overflow-x-auto">
        {/* Employee header */}
        <EmployeeHeader setOpenSidebar={setOpenSidebar} />
        <main className="flex-1 flex flex-col bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
