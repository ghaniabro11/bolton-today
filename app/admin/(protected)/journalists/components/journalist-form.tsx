"use client";

import { DynamicForm, FieldConfig } from "@/components/dynamic-form";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
export const dynamic = "force-dynamic";

interface Category {
  id: number;
  name: string;
}

interface CategoryProps {
  categories?: Category[];
  isUpdate?: boolean;
  defaultValues?: any;
}

const JournalistForm: React.FC<CategoryProps> = ({
  categories,
  isUpdate = false,
  defaultValues = undefined,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const journalistFormFields: FieldConfig[] = [
    {
      name: "name",
      label: "Name",
      type: "input",
      required: true,
      placeholder: "Enter journalist name",
      InputType: "text",
      className: "w-full",
    },
    {
      name: "slug",
      label: "Slug",
      type: "input",
      required: true,
      placeholder: "Enter journalist slug",
      InputType: "slug",
      className: "w-full",
    },
    {
      name: "position",
      label: "Position",
      type: "input",
      required: false,
      placeholder: "Enter journalist position",
      InputType: "text",
      className: "w-full",
    },
    {
      name: "publishStatus",
      label: "Publish Status",
      type: "select",
      required: true,
      placeholder: "Select publish status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      className: "w-full",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: false,
      placeholder: "Enter journalist description",
      className: "col-span-2",
    },
    {
      name: "facebookLink",
      label: "Facebook Link",
      type: "input",
      required: false,
      placeholder: "Enter Facebook profile link",
      InputType: "url",
      className: "w-full",
    },
    {
      name: "instagramLink",
      label: "Instagram Link",
      type: "input",
      required: false,
      placeholder: "Enter Instagram profile link",
      InputType: "url",
      className: "w-full",
    },
    {
      name: "twitterLink",
      label: "Twitter Link",
      type: "input",
      required: false,
      placeholder: "Enter Twitter profile link",
      InputType: "url",
      className: "w-full",
    },
    {
      name: "muckrackLink",
      label: "MuckRack Link",
      type: "input",
      required: false,
      placeholder: "Enter MuckRack profile link",
      InputType: "url",
      className: "w-full",
    },
    {
      name: "personalPortfolio",
      label: "Personal Portfolio",
      type: "input",
      required: false,
      placeholder: "Enter personal portfolio link",
      InputType: "url",
      className: "w-full",
    },
    {
      name: "linkedin",
      label: "LinkedIn",
      type: "input",
      required: false,
      placeholder: "Enter LinkedIn profile link",
      InputType: "url",
      className: "w-full",
    },
    {
      name: "image",
      label: "Profile Image",
      type: "media",
      required: true,
      placeholder: "Select profile image...",
      className: "w-full col-span-full",
    },
    {
      name: "metaTitle",
      label: "Meta Title",
      type: "input",
      required: false,
      placeholder: "Enter meta title",
      InputType: "text",
      className: "w-full",
    },
    {
      name: "metaDescription",
      label: "Meta Description",
      type: "input",
      required: false,
      placeholder: "Enter meta description",
      InputType: "text",
      className: "w-full",
    },
    {
      name: "keywords",
      label: "Keywords",
      type: "input",
      required: false,
      placeholder: "Enter keywords (comma-separated)",
      InputType: "comma",
      className: "w-full",
    },
  ];

  const ActionForSubmit = async (data: any) => {
    console.log(data, "data");
    try {
      setIsLoading(true);
      const payload = {
        ...(isUpdate ? { id: Number(id) } : null),

        name: data.name,
        slug: data.slug,
        position: data.position,
        description: data.description,
        facebookLink: data.facebookLink,
        instagramLink: data.instagramLink,
        twitterLink: data.twitterLink,
        muckrackLink: data.muckrackLink,
        personalPortfolio: data.personalPortfolio,
        linkedin: data.linkedin,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        publishStatus: data.publishStatus,
        image: data.image?.id,
      };

      let response = null;
      isUpdate
        ? (response = await axiosInstance.put(
            `/api/v1/journalists/${Number(id)}`,
            payload
          ))
        : (response = await axiosInstance.post("/api/v1/journalists", payload));
      if (response.data) {
        toast.success(response?.data?.message || "Operation successfull");
        router.push("/admin/journalists"); // Redirect to category list
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
    <div className="container mx-auto p-6">
      <div className=" rounded-lg shadow-md p-6">
        <PageHeader
          heading={`${isUpdate ? "Update" : "Category Management"}`}
          description={
            isUpdate ? "Update existing category." : "Add New Category."
          }
        />
        <DynamicForm
          fields={journalistFormFields}
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

export default JournalistForm;
