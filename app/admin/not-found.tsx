"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { User } from "@/constant/types";
import Cookies from "js-cookie";

const NotFound = () => {
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
      // toast.success(data.message || "Logged out successfully");

      // Redirect immediately
      window.location.href = "/admin/login";
    } catch (error: unknown) {
      console.error("Logout error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      // toast.error(`Error during logout: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-yellow-500 w-16 h-16" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => handleLogout()}>Go to Dashboard</Button>
      </div>
    </div>
  );
};

export default NotFound;
