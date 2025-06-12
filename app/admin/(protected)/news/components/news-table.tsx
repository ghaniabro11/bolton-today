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
import { FileText } from "lucide-react";

// News interface
interface News {
  id: number;
  title: string;
  slug: string;
  description: string;
  publishStatus: string;
  publishDate: string;
  image: {
    filePath: string;
    title: string;
  };
}

// Props
interface NewsTableProps {
  news: News[];
  totalItems: number;
  currentPage: number;
  limit: number;
  loading?: boolean;
  className?: string;
  searchValue?: string;
}

const NewsTable: React.FC<NewsTableProps> = ({
  news,
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

  const isNewsUpdate = hasPermission(Permission.UPDATE_NEWS);
  const isNewsDelete = hasPermission(Permission.DELETE_NEWS);

  const deleteNews = async (id: number) => {
    if (!confirm("Are you sure you want to delete this news?")) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/api/v1/news/${id}`);
      if (res) {
        router.refresh();
        toast.success(res?.data?.message);
      } else {
        toast.error("Failed to delete news. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error(
        "An error occurred while deleting the news. Please try again."
      );
    }
  };

  // Columns
  const columns: Column<News>[] = [
    {
      label: "Title",
      key: "title",
      columnClassName: "text-left",
    },
    {
      label: "Slug",
      key: "slug",
      columnClassName: "text-left",
    },
    {
      label: "Publish Date",
      key: "publishDate",
      render: (row) => {
        const date = new Date(row.publishDate);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
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
      key: "featureImage",
      render: (row) => (
        <Avatar className="mx-auto h-12 w-12">
          <AvatarImage
            src={row?.image?.filePath}
            className="object-cover"
            loading="eager"
            alt={row?.image?.title}
          />
          <AvatarFallback>
            <FileText />
          </AvatarFallback>
        </Avatar>
      ),
      columnClassName: "text-center",
    },
    ...(isNewsUpdate || isNewsDelete
      ? [
          {
            label: "Actions",
            key: "actions",
            render: (row: any) => (
              <div className="flex gap-2 justify-center">
                {isNewsUpdate && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/admin/news/update/${row?.id}`}>Edit</Link>
                  </Button>
                )}
                {isNewsDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteNews(row.id)}
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
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-1 border rounded w-full"
          />
          <Button className="rounded" type="submit">
            Search
          </Button>
        </form>
        <Button asChild>
          <Link href="/admin/news/add">Add New</Link>
        </Button>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={news} loading={loading ?? false} />
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

export default NewsTable;
