"use client";

import { DynamicForm, FieldConfig } from "@/components/dynamic-form";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
}

interface UserFormProps {
  //   categories: Category[];
  isUpdate?: boolean;
  defaultValues?: any;
}

const UserForm: React.FC<UserFormProps> = ({
  //   categories,
  isUpdate = false,
  defaultValues = undefined,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const formArray: FieldConfig[] = [
    {
      name: "username",
      label: "Username",
      type: "input",
      required: true,
      placeholder: "Enter your username",
      InputType: "text",
      className: "w-full",
    },
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
      name: "fullname",
      label: "Full Name",
      type: "input",
      required: true,
      placeholder: "Enter your full name",
      InputType: "text",
      className: "w-full",
    },

    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      placeholder: "Select Role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      //   InputType: "text",
    },
    ...(isUpdate
      ? [
          {
            name: "currentPassword",
            label: "Current Password",
            type: "input" as const,
            required: true,
            placeholder: "Enter your current password",
            InputType: "password",
            className: "w-full",
          },
          {
            name: "newPassword",
            label: "New Password",
            type: "input" as const,
            required: true,
            placeholder: "Enter your new password",
            InputType: "password",
            className: "w-full",
          },
        ]
      : []),
    ...(!isUpdate
      ? [
          {
            name: "password",
            label: "Password",
            type: "input" as const,
            required: true,
            placeholder: "Enter your password",
            InputType: "password",
            className: "w-full",
          },
        ]
      : []),

    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      placeholder: "Select Status",
      options: [
        { label: "Active", value: "active" },
        { label: "In Active", value: "inactive" },
      ],
      //   InputType: "text",
    },
  ];

  const ActionForSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      let payload;
      isUpdate
        ? (payload = {
            username: data?.username,
            email: data?.email,
            fullname: data?.fullname,
            currentPassword: data?.currentPassword,
            newPassword: data?.newPassword,
            role: data?.role,
            status: data?.status,
          })
        : (payload = {
            username: data?.username,
            email: data?.email,
            fullname: data?.fullname,
            password: data?.password,
            role: data?.role,
            status: data?.status,
          });
      let response = null;
      isUpdate
        ? (response = await axiosInstance.put(
            `/api/v1/user/${Number(id)}`,
            payload
          ))
        : (response = await axiosInstance.post("/api/v1/user", payload));
      if (response.data) {
        toast.success(response?.data?.message || "Operation successfull");
        router.push("/admin/user"); // Redirect to category list
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto p-6">
      <div className=" rounded-lg shadow-md p-6">
        <PageHeader
          heading={`${isUpdate ? "Update" : "User Management"}`}
          description={isUpdate ? "Update existing user." : "Add New User."}
        />
        <DynamicForm
          fields={formArray}
          onSubmit={ActionForSubmit}
          defaultValues={isUpdate ? defaultValues : null}
          isUpdateMode={isUpdate}
          parentClassName="grid grid-cols-2 gap-6"
          formId="category-form"
          submitButton={
            <div className="col-span-2 flex justify-end mt-6">
              <Button
                type="submit"
                form="category-form"
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                {isLoading
                  ? isUpdate
                    ? "Updating..."
                    : "Creating..."
                  : isUpdate
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default UserForm;
