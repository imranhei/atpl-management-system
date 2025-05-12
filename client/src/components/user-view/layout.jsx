import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SystemSidebar from "../common/SystemSidebar";
import SystemNavbar from "../common/SystemNavbar";
import Sidebar from "../common/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const SystemLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-fit">
          {/* <Sidebar open={openSidebar} setOpenSidebar={setOpenSidebar} /> */}
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col lg:ml-64 ml-0 overflow-x-auto">
          {/* Header */}
          <div className="flex-none">
            <SystemNavbar setOpenSidebar={setOpenSidebar} />
          </div>

          {/* Main Body */}
          <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">
            <SidebarTrigger className="absolute top-3.5 left-4 lg:hidden" />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SystemLayout;
