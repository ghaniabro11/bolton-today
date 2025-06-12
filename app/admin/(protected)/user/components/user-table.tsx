"use client";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import DataTable, { Column } from "../../../../../components/data-table";
import { Pagination } from "../../../../../components/reuse-pagination";
import { Permission } from "@/constant/permissions";
import { usePermission } from "@/hooks/usePermission";
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

const UserTable: React.FC<UserTableProps> = ({
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
  const isRead = hasPermission(Permission.READ_USER);
  const { user } = useUserStore();

  const isUserDelete = hasPermission(Permission.DELETE_USER);
  const isUserUpdate = hasPermission(Permission.UPDATE_USER);
  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/api/v1/user/${id}`);
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

  // Columns
  const columns: Column<User>[] = [
    {
      label: "Username",
      key: "username",
      columnClassName: "text-left",
    },
    {
      label: "Email",
      key: "email",
      columnClassName: "text-left",
    },
    {
      label: "Full Name",
      key: "fullname",
      columnClassName: "text-left",
    },
    {
      label: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded ${
            row.status
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status ? "Active" : "Inactive"}
        </span>
      ),
      columnClassName: "text-center w-[120px]",
    },
    {
      label: "Role",
      key: "role",
      columnClassName: "text-center capitalize",
    },
    ...(isUserUpdate || isUserDelete
      ? [
          {
            label: "Actions",
            key: "actions",
            render: (row: any) => (
              <div className="flex gap-2 justify-center">
                {isUserUpdate && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/admin/user/update/${row?.id}`}>Edit</Link>
                  </Button>
                )}
                {isUserDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteUser(row.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            ),
            columnClassName: "text-center",
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

  console.log(user,isRead)
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
            <Link href="/admin/user/add">Add New</Link>
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

export default UserTable;
