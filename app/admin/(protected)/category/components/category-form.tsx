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

interface CategoryProps {
  categories: Category[];
  isUpdate?: boolean;
  defaultValues?: any;
}

const CategoryForm: React.FC<CategoryProps> = ({
  categories,
  isUpdate = false,
  defaultValues = undefined,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const formArray: FieldConfig[] = [
    {
      name: "name",
      label: "Name",
      type: "input",
      required: true,
      placeholder: "Enter category name",
      InputType: "text",
      className: "col-span-1",
    },
    {
      name: "slug",
      label: "Slug",
      type: "input",
      required: true,
      placeholder: "Enter category slug",
      InputType: "slug",
      className: "col-span-1",
    },
    {
      name: "description",
      label: "Description",
      type: "joditEditor",
      required: true,
      placeholder: "Enter category description",
      className: "col-span-2",
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
      className: "col-span-1",
    },
    {
      name: "parentCategoryId",
      label: "Select Category",
      type: "select",
      required: true,
      placeholder: "Select Category",
      options: categories?.map((category: any) => ({
        label: category?.name,
        value: category?.id,
      })),
      className: "col-span-1",
    },
    {
      name: "image",
      label: "Image",
      type: "media",
      required: true,
      placeholder: "Select an image...",
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
        name: data?.name,
        slug: data?.slug,
        metaTitle: data?.metaTitle,
        metaDescription: data?.metaDescription,
        keywords: data?.keywords,
        parentCategoryId: data?.parentCategoryId
          ? Number(data?.parentCategoryId)
          : null,
        status: data?.status,
        image: data?.image?.id,
        description: data?.description,
      };

      let response = null;
      isUpdate
        ? (response = await axiosInstance.put(
            `/api/v1/category/${Number(id)}`,
            payload
          ))
        : (response = await axiosInstance.post("/api/v1/category", payload));
      if (response.data) {
        toast.success(response?.data?.message || "Operation successfull");
        router.push("/admin/category"); // Redirect to category list
      }
      console.log(payload, "payload");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className=" rounded-lg shadow-md p-6">
        <PageHeader
          heading={`${isUpdate ? "Update" : "Category Management"}`}
          description={
            isUpdate ? "Update existing category." : "Add New Category."
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

export default CategoryForm;
