import { SIDEBAR_MENU } from "@/components/config";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import avatar from "/avatar.png";
import { AvatarImage } from "../ui/avatar";

const AppSidebar = () => {
  const { role, user, profile } = useSelector((state) => state.auth);
  const { setOpenMobile, isMobile } = useSidebar();
  const location = useLocation();

  const BASE = "https://djangoattendance.atpldhaka.com";

  const imgPath = profile?.profile_img;
  const hasImg = imgPath && imgPath !== "null" && imgPath !== "/null";

  const menuItems = SIDEBAR_MENU[role] || [];

  const handleClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="text-lg font-semibold">
            User Panel
          </SidebarHeader>
          {/* <SidebarGroupLabel>User Panel</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.includes(item.path);

                // If the item has submenu
                if (item.submenu) {
                  return (
                    <Collapsible key={item.id} className="group/collapsible">
                      <SidebarMenuItem active={isActive.toString()}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Icon size={18} />
                              {item.label}
                            </span>
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </SidebarMenuItem>

                      <CollapsibleContent className="pl-6">
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = location.pathname.includes(
                              subItem.path
                            );

                            return (
                              <SidebarMenuSubItem key={subItem.id}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                >
                                  <Link
                                    to={`/${role}${subItem.path}`}
                                    className="flex items-center gap-2 w-full"
                                    onClick={handleClick}
                                  >
                                    <SubIcon size={16} />
                                    {subItem.label}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                // Fallback for normal items
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild data-active={isActive}>
                      <Link
                        to={`/${role}${item.path}`}
                        className="flex items-center gap-2"
                        onClick={handleClick}
                      >
                        <Icon size={18} />
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Avatar className="focus:outline-none focus-visible:outline-none focus-visible:ring-0 h-8 w-8 border-white rounded-full">
                <AvatarImage
                  src={hasImg ? new URL(imgPath, BASE).href : undefined}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
                <AvatarFallback>
                  <img src={avatar} alt="" />
                </AvatarFallback>
              </Avatar>
              {`${(user?.first_name + " " + user?.last_name)
                .split(" ")
                .slice(0, 2)
                .join(" ")}`}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
