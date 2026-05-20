"use client";

import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import DataTable, { Column } from "@/components/data-table";
import { Pagination } from "@/components/reuse-pagination";
import { Permission } from "@/constant/permissions";
import { usePermission } from "@/hooks/usePermission";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2 } from "lucide-react";

// Politician interface
interface Politician {
  id: number;
  name: string;
  slug: string;
  position: string;
  publishStatus: string;
  description: string;
  image: {
    filePath: string;
    title: string;
  };
}

// Props
interface PoliticianTableProps {
  politicians: Politician[];
  totalItems: number;
  currentPage: number;
  limit: number;
  loading?: boolean;
  className?: string;
  searchValue?: string;
}

const PoliticianTable: React.FC<PoliticianTableProps> = ({
  politicians,
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

  const isPoliticianUpdate = hasPermission(Permission.UPDATE_AUTHOR);
  const isPoliticianDelete = hasPermission(Permission.DELETE_AUTHOR);

  const deletePolitician = async (id: number) => {
    if (!confirm("Are you sure you want to delete this politician?")) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/api/v1/politicians/${id}`);
      if (res) {
        router.refresh();
        toast.success(res?.data?.message);
      } else {
        toast.error("Failed to delete politician. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting politician:", error);
      toast.error(
        "An error occurred while deleting the politician. Please try again."
      );
    }
  };

  // Columns
  const columns: Column<Politician>[] = [
    {
      label: "Name",
      key: "name",
      columnClassName: "text-left",
    },
    {
      label: "Slug",
      key: "slug",
      columnClassName: "text-left",
    },
    {
      label: "Position",
      key: "position",
      columnClassName: "text-left",
    },
    {
      label: "Status",
      key: "publishStatus",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded ${
            row.publishStatus === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row?.publishStatus?.charAt(0).toUpperCase() +
            row?.publishStatus?.slice(1)}
        </span>
      ),
      columnClassName: "text-center w-[120px]",
    },
    {
      label: "Image",
      key: "image",
      render: (row) => (
        <Avatar className="mx-auto h-12 w-12">
          <AvatarImage
            src={row?.image?.filePath}
            alt={row?.image?.title ?? "image"}
            className="object-cover"
          />
          <AvatarFallback>
            <User2 />
          </AvatarFallback>
        </Avatar>
      ),
      columnClassName: "text-center",
    },
    ...(isPoliticianUpdate || isPoliticianDelete
      ? [
          {
            label: "Actions",
            key: "actions",
            render: (row: any) => (
              <div className="flex gap-2 justify-center">
                {isPoliticianUpdate && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/admin/politicians/update/${row?.id}`}>Edit</Link>
                  </Button>
                )}
                {isPoliticianDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePolitician(row.id)}
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
    router.push(`?page=1&search=${encodeURIComponent(search)}`);
  };

  return (
    <div className={className}>
      <div className="flex justify-between">
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search by name or position"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-1 border rounded w-full"
          />
          <Button className="rounded" type="submit">
            Search
          </Button>
        </form>
        <Button asChild>
          <Link href="/admin/politicians/add">Add New</Link>
        </Button>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={politicians} loading={loading ?? false} />
      <div className="mt-3" />
      <Pagination
        totalItems={totalItems}
        currentPage={currentPage}
        limit={limit}
        search={search}
      />
    </div>
  );
};

export default PoliticianTable;
