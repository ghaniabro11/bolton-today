"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-[70dvh] flex items-center justify-center  p-4">
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
        <Button onClick={() => router.push("/")}>Go to Homepage</Button>
      </div>
    </div>
  );
};

export default NotFound;
