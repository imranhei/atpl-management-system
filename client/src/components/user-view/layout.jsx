import { Outlet } from "react-router-dom";
import SystemNavbar from "../common/SystemNavbar";
import Sidebar from "../common/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const SystemLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-fit">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col lg:ml-64 ml-0 overflow-x-auto">
          {/* Header */}
          <div className="flex-none shadow-md z-30">
            <SystemNavbar />
          </div>

          {/* Main Body */}
          <main className="flex-1 overflow-y-auto bg-background">
            <SidebarTrigger className="absolute top-3.5 left-4 lg:hidden z-40" />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SystemLayout;
