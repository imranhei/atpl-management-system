import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import EmployeeSidebar from "../common/SystemSidebar";
import EmployeeNavbar from "./employeeNavbar";

const EmployeeLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-fit">
        <EmployeeSidebar open={openSidebar} setOpenSidebar={setOpenSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-64 ml-0 overflow-x-auto">
        {/* Header */}
        <div className="flex-none">
          <EmployeeNavbar setOpenSidebar={setOpenSidebar} />
        </div>

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
