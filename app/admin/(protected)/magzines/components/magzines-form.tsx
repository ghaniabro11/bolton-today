"use client";

import { DynamicForm, FieldConfig } from "@/components/dynamic-form";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";


interface CategoryProps {
  isUpdate?: boolean;
  defaultValues?: any;
}

const MagzinesForm: React.FC<CategoryProps> = ({

  isUpdate = false,
  defaultValues = undefined,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const formArray: FieldConfig[] = [
    {
      label: "Title",
      name: "title",
      type: "input",
      InputType: "text",
      placeholder: "Enter title",
      required: true, // optional field
    },
    {
      label: "Slug",
      name: "slug",
      type: "input",
      InputType: "slug",
      placeholder: "Enter slug (e.g. example-slug)",
      required: true, // optional field
    },
    {
      label: "Description",
      name: "description",
      type: "joditEditor",
      placeholder: "Enter description",
      required: true, // optional field
      className: "col-span-2",
    },
    {
      label: "Cover Image URL",
      name: "coverImage",
      type: "media",
      placeholder: "Enter cover image URL",
      required: true, // optional field
      className: "col-span-1",
    },
    {
      label: "PDF File URL",
      name: "pdfFile",
      type: "media",
      placeholder: "Enter PDF file URL",
      required: true, // optional field
      className: "col-span-1",
    },
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
      className: "col-span-2",
    },
    {
      name: "metaTitle",
      label: "Meta Title",
      type: "input",
      required: true,
      placeholder: "Enter category Meta Title",
      InputType: "text",
      className: "col-span-1",
    },
    {
      name: "keywords",
      label: "Keywords",
      type: "input",
      required: true,
      placeholder: "Enter keywords",
      InputType: "comma",
      className: "col-span-1",
    },
    {
      name: "metaDescription",
      label: "Meta Description",
      type: "textarea",
      required: true,
      placeholder: "Enter meta description",
      className: "col-span-2",
    },
  ];

  const ActionForSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const payload = {
        ...(isUpdate ? { id: Number(id) } : null),
        title: data?.title,
        slug: data?.slug,
        metaTitle: data?.metaTitle,
        metaDescription: data?.metaDescription,
        keywords: data?.keywords,
        status: data?.status,
        pdfFile: data?.pdfFile?.id,
        coverImage: data?.coverImage?.id,
        description: data?.description,
      };

      let response = null;
      isUpdate
        ? (response = await axiosInstance.put(
            `/api/v1/magzines/${Number(id)}`,
            payload
          ))
        : (response = await axiosInstance.post("/api/v1/magzines", payload));
      if (response.data) {
        toast.success(response?.data?.message || "Operation successfull");
        router.push("/admin/magzines"); // Redirect to category list
      }
      console.log(payload, "payload");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className=" rounded-lg shadow-md p-6">
        <PageHeader
          heading={`${isUpdate ? "Update" : "Magzines Management"}`}
          description={
            isUpdate ? "Update existing magzine." : "Add New Magzine."
          }
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

export default MagzinesForm;
