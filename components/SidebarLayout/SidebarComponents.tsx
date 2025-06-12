"use client";
import { User } from "@/constant/types";
import { useUserStore } from "@/stores/userStore";
import Cookies from "js-cookie";
import { ChevronUp, User2, UserCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import Loader from "../client-components/Loader";

export const SidebarHead = () => {
  return (
    <div className="flex justify-center items-center w-full py-2">
      <Link href={"/"}>
        <UserCircleIcon size={30} />
      </Link>
    </div>
  );
};

export function NavMain({
  items,
}: {
  items: {
    label: string;
    items: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      requiredPermissions?: string[];
      items?: {
        title: string;
        url: string;
        requiredPermissions?: string[];
      }[];
    }[];
  }[];
}) {
  return (
    <>
      {items?.map((group) => (
        <SidebarGroup key={group?.label}>
          <SidebarGroupLabel>
            <div>{group?.label}</div>
          </SidebarGroupLabel>
          <SidebarMenu>
            {group?.items?.map((item) =>
              item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item?.title}
                  asChild
                  defaultOpen={item?.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item?.title}>
                        {item?.icon && <item.icon />}
                        <span>
                          <p>{item?.title ?? ""}</p>
                        </span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item?.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem?.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem?.url}>
                                <span>{subItem?.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item?.title}>
                  <Link href={item?.url}>
                    <SidebarMenuButton tooltip={item?.title}>
                      {item?.icon && <item.icon />}
                      <span>{item?.title ?? ""}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
export const SidebarFooterMenu = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user) as User | null;
  const clearUser = useUserStore((state) => state.clearUser);
  const clearPermission = useUserStore((state) => state.setPermissions);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      // Call logout API
      const res = await fetch("/api/v1/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      const data = await res.json();

      // Clear all client-side data
      clearUser();
      clearPermission([]);

      // Remove cookies with explicit path
      Cookies.remove("authAccess", { path: "/" });
      Cookies.remove("user-storage", { path: "/" });

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      toast.success(data.message || "Logged out successfully");

      // Redirect immediately
      window.location.href = "/admin/login";
    } catch (error: unknown) {
      console.error("Logout error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error during logout: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) return <Loader />;
  return (
    <>
      {/* <Spinner isLoading={isLoading} /> */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-nowrap">
                  <User2 /> {user?.fullname ?? ""}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {/* <DropdownMenuItem></DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem> */}
                <DropdownMenuItem onClick={handleLogout}>
                  Sign out
                </DropdownMenuItem>
                {/* <DropdownMenuItem></DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
};
