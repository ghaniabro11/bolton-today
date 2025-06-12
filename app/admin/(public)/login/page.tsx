"use client";

import { DynamicForm, FieldConfig } from "@/components/dynamic-form";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { AdminPermission, EditorPermission } from "@/constant/permissions";
const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const setPermissions = useUserStore((state) => state.setPermissions);
  const permissions = useUserStore((state) => state.userPermissions);

  // Form fields configuration
  const loginFields: FieldConfig[] = [
    {
      name: "email",
      label: "Email",
      type: "input",
      required: true,
      placeholder: "Enter your email",
      InputType: "email",
      className: "w-full",
    },
    {
      name: "password",
      label: "Password",
      type: "input",
      required: true,
      placeholder: "Enter your password",
      InputType: "password",
      className: "w-full",
    },
  ];

  // Handle form submission
  const handleLoginSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/api/v1/user/login", data);

      if (response?.data) {
        // Set user data in store
        const user = { token: response?.data?.token, ...response?.data?.user };
        setUser(user);
        console.log(response, "vs");
        response?.data?.user?.role === "admin"
          ? setPermissions(AdminPermission)
          : setPermissions(EditorPermission);
          // Cookies.set("authAccess", response.data.token, { secure: true, sameSite: "Strict" });
          Cookies.set("user-storage", response.data.user);
        const userdata = Cookies.get("user-storage");
        const token = Cookies.get("authAccess");
        console.log(permissions, "permissions");
        console.log(userdata, "userdata");
        console.log(token, "token");

        toast.success("Login successful!");

        router.push("/admin/user"); // Redirect to home/dashboard

      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-dvh">
      <div className="w-full  max-w-md  mx-auto p-6 bg-white dark:bg-sidebar/80 rounded-lg shadow-md dark:shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-sidebar/80 dark:text-white">
          Login
        </h2>
        <DynamicForm
          fields={loginFields}
          onSubmit={handleLoginSubmit}
          parentClassName="space-y-4"
          formId="login-form"
        />
        <Button
          type="submit"
          form="login-form"
          className="w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
