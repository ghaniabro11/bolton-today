"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { usePermissionBasedNavigation } from "@/hooks/usePermissionBasedNavigation";

import { NavMain, SidebarFooterMenu, SidebarHead } from "./SidebarComponents";
import ThemeSwitch from "./ThemeSwitcher";

function AppSidebar() {
  const navigation = usePermissionBasedNavigation();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarHead />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <NavMain items={navigation} />
        </SidebarGroup>
      </SidebarContent>

      <div className="flex justify-evenly p-2">
        <ThemeSwitch />
      </div>

      <SidebarFooterMenu />
    </Sidebar>
  );
}
export default AppSidebar;
