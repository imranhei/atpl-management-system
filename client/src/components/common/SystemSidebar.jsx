import { Fragment, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useSelector } from "react-redux";
import { Label } from "@radix-ui/react-dropdown-menu";
import { SIDEBAR_MENU } from "@/components/config";

function MenuItem({ role, setOpenSidebar }) {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const menuItems = SIDEBAR_MENU[role] || [];

  const handleMenuClick = (itemId) => {
    setOpenMenu(openMenu === itemId ? null : itemId);
  };

  return (
    <div className="mt-8 flex flex-col gap-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className="flex flex-col">
            <div
              className={`flex justify-between items-center rounded-md ${
                location.pathname.includes(item.path) ? "bg-gray-100" : ""
              }`}
            >
              <Link
                to={`/${role}${item.path}`}
                onClick={() => {
                  setOpenSidebar && setOpenSidebar(false);
                }}
                className={`flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 font-semibold text-gray-500 hover:text-black cursor-pointer hover:bg-gray-100`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
              {item.submenu && (
                <div
                  className={`${
                    openMenu === item.id ? "rotate-180" : ""
                  } p-1 rounded transition-all duration-300 cursor-pointer`}
                  size={20}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering Link
                    handleMenuClick(item.id);
                    // if (setOpenSidebar) setOpenSidebar(false);
                  }}
                >
                  <ChevronDown className="text-muted-foreground" />
                </div>
              )}
            </div>

            {item.submenu && openMenu === item.id && (
              <div
                className={`expandable ${
                  openMenu === item.id ? "show" : ""
                } ml-2 mt-2 flex flex-col gap-2`}
              >
                {item.submenu && openMenu === item.id && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {item.submenu.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <Link
                          to={`/${role}${subItem.path}`}
                          key={subItem.id}
                          className={`flex items-center gap-2 font-semibold rounded-md px-3 py-2 text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-gray-100 ${
                            location.pathname.includes(subItem.path)
                              ? "bg-gray-100 text-gray-800"
                              : ""
                          }`}
                          onClick={() => {
                            setOpenSidebar && setOpenSidebar(false);
                          }}
                        >
                          <SubIcon size={20} />
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const Sidebar = ({ open, setOpenSidebar }) => {
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state.auth);
  console.log("user", user);

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpenSidebar}>
        <SheetContent side="left" aria-describedby="sidebar">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2">
                <SlidersHorizontal size={24} />
                <span className="text-xl font-extrabold">User Panel</span>
              </SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <MenuItem role={role} setOpenSidebar={setOpenSidebar} />
            <Label className="absolute bottom-6 left-6">{user?.first_name} {user?.last_name}</Label>
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden h-screen w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate(`/${role}/dashboard`)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <SlidersHorizontal size={24} />
          <h1 className="text-2xl font-bold">User Panel</h1>
        </div>
        <MenuItem role={role} />
        <Label className="absolute bottom-6 left-6">{user?.first_name} {user?.last_name}</Label>
      </aside>
    </Fragment>
  );
};

export default Sidebar;
