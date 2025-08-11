import { Permission } from "@/constant/permissions";
import {
  LayoutDashboard,
  FolderKanban,
  FileImage,
  Users,
  Newspaper,
  DockIcon,
} from "lucide-react";
export const navigation = [
  {
    label: "Platform",
    items: [
      {
        title: "Dashboard",
        url: "/admin/user",
        icon: LayoutDashboard, // Better semantic icon for a dashboard
        isActive: true,
        requiredPermissions: [Permission.READ_USER],
      },
      {
        title: "Category",
        url: "/admin/category",
        icon: FolderKanban, // Represents category/grouping structure
        isActive: false,
        requiredPermissions: [Permission.READ_CATEGORY],
      },

      {
        title: "Author",
        url: "/admin/authors",
        icon: Users, // More suitable for authors or users
        isActive: false,
        requiredPermissions: [Permission.READ_AUTHOR],
      },
      {
        title: "News",
        url: "/admin/news",
        icon: Newspaper, // More suitable for authors or users
        isActive: false,
        requiredPermissions: [Permission.READ_NEWS],
      },
      {
        title: "Media",
        url: "/admin/file-manager",
        icon: FileImage, // Better fit for media/file manager
        isActive: false,
        requiredPermissions: [Permission.READ_MEDIA],
      },
      {
        title: "Magzines",
        url: "/admin/magzines",
        icon: DockIcon, // Better fit for media/file manager
        isActive: false,
        requiredPermissions: [Permission.READ_MAGAZINE],
      },
    ],
  },
  // {
  //   label: "nav.management",
  //   items: [
  //     {
  //       title: "nav.users",
  //       url: "/admin/users",
  //       icon: Users2,
  //       isActive: true,
  //       requiredPermissions: [Permission.USERSMANAGEMENT],
  //     },
  //     // {
  //     //   title: "nav.user",
  //     //   url: "#",
  //     //   icon: Users2,
  //     //   requiredPermissions: [Permission.GET_ALL_USERS],
  //     //   items: [
  //     //     {
  //     //       title: "nav.users",
  //     //       url: "/admin/users",
  //     //       requiredPermissions: [PERMISSIONS.GET_ALL_USERS],
  //     //     },
  //     //     {
  //     //       title: "nav.create",
  //     //       url: "/admin/users/create",
  //     //       requiredPermissions: [PERMISSIONS.CREATE_USER],
  //     //     },
  //     //     // { title: "id", url: "/admin/users/:id" },
  //     //   ],
  //     // },
  //   ],
  // },
];
