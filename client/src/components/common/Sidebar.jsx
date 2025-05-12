import { SIDEBAR_MENU } from "@/components/config";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const AppSidebar = () => {
  const { role, user } = useSelector((state) => state.auth);
  const location = useLocation();

  const menuItems = SIDEBAR_MENU[role] || [];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="text-lg font-semibold">User Panel</SidebarHeader>
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
                              <SidebarMenuSubItem
                                key={subItem.id}
                                asChild
                                active={isSubActive.toString()}
                              >
                                <Link
                                  to={`/${role}${subItem.path}`}
                                  className="flex items-center gap-2"
                                >
                                  <SubIcon size={16} />
                                  {subItem.label}
                                </Link>
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
                  <SidebarMenuItem key={item.id} active={isActive.toString()}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={`/${role}${item.path}`}
                        className="flex items-center gap-2"
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
    </Sidebar>
  );
};

export default AppSidebar;
