"use client";
import { Button } from "@/components/ui/button";
import { Permission } from "@/constant/permissions";
import { usePermission } from "@/hooks/usePermission";
import axiosInstance from "@/utils/axiosInstance";
import { Image } from "lucide-react";
import Link from "next/link";
import {
  notFound,
  permanentRedirect,
  redirect,
  useRouter,
} from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import DataTable, { Column } from "../../../../../components/data-table";
import { Pagination } from "../../../../../components/reuse-pagination";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../../components/ui/avatar";
import { useUserStore } from "@/stores/userStore";

// User interface
interface User {
  id: number;
  username: string;
  email: string;
  fullname: string;
  status: boolean;
  role: string;
}

// Props
interface UserTableProps {
  users: User[];
  totalItems: number;
  currentPage: number;
  limit: number;
  loading?: boolean;
  className?: string;
  searchValue?: string;
}

const MagzineTable: React.FC<UserTableProps> = ({
  users,
  totalItems,
  currentPage,
  limit,
  loading,
  className,
  searchValue = "",
}) => {
  const router = useRouter();
  const [search, setSearch] = useState(searchValue);
  const { hasPermission } = usePermission();
  const isDelete = hasPermission(Permission.DELETE_MAGAZINE);
  const isUpdate = hasPermission(Permission.UPDATE_MAGAZINE);
  const isRead = hasPermission(Permission.READ_MAGAZINE);
  const { user } = useUserStore();
  const deleteMagzine = async (id: number) => {
    if (!confirm("Are you sure you want to delete this categroy?")) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/api/v1/magzines/${id}`);
      if (res) {
        // Refresh the current page to update the table
        router.refresh();
        toast.success(res?.data?.message);
      } else {
        alert("Failed to delete user. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user. Please try again.");
    }
  };

  const columns: Column<any>[] = [
    {
      label: "Titles",
      key: "title",
      columnClassName: "text-left",
    },
    {
      label: "Slug",
      key: "slug",
      columnClassName: "text-left",
    },
    // {
    //   label: "Description",
    //   key: "description",
    //   render: (row) => (
    //     <div
    //       className="max-w-xs truncate"
    //       dangerouslySetInnerHTML={{ __html: row.description }}
    //     />
    //   ),
    //   columnClassName: "text-left",
    // },
    {
      label: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row?.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
      columnClassName: "text-center w-[120px]",
    },
    {
      label: "Meta Title",
      key: "metaTitle",
      columnClassName: "text-left",
    },
    {
      label: "Meta Description",
      key: "metaDescription",
      columnClassName: "text-left",
    },
    {
      label: "Keywords",
      key: "keywords",
      columnClassName: "text-left",
    },
    {
      label: "Image",
      key: "image",
      render: (row) => (
        <Avatar className="mx-auto  h-12 w-12">
          <AvatarImage
            src={row?.coverImage?.filePath}
            alt={row?.title}
            className="object-contain"
          />
          <AvatarFallback>
            <Image />
          </AvatarFallback>
        </Avatar>
      ),
      columnClassName: "text-center",
    },
    ...(isUpdate || isDelete
      ? [
          {
            label: "Actions",
            key: "actions",
            render: (row: any) => (
              <div className="flex gap-2 justify-center">
                {isUpdate && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/admin/magzines/update/${row?.id}`}>Edit</Link>
                  </Button>
                )}
                {isDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMagzine(row.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            ),
            columnClassName: "text-center  overflow-auto",
          },
        ]
      : []),
  ];
  // Handle search form submit
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // router.push(`?page=1&limit=${limit}&search=${encodeURIComponent(search)}`);
    router.push(`?page=1&search=${encodeURIComponent(search)}`);
  };
  console.log(user?.token, "user");

  if (!isRead && !user) {
    return notFound();
  } else {
    return (
      <div className={className}>
        <div className="flex justify-between">
          <form onSubmit={handleSearch} className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-1 border rounded w-full"
            />
            <Button className="rounded" type="submit">
              Search
            </Button>
          </form>
          <Button asChild>
            <Link href="/admin/magzines/add">Add New</Link>
          </Button>
        </div>

        {/* Table */}
        <DataTable columns={columns} data={users} loading={loading ?? false} />
        <div className="mt-3" />
        <Pagination
          totalItems={totalItems}
          currentPage={currentPage}
          limit={limit}
          search={search}
        />
      </div>
    );
  }
};

export default MagzineTable;
