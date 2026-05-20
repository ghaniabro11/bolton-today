// app/(protected)/politicians/components/UpdatePoliticianForm.tsx
"use client";

import { DynamicForm, FieldConfig } from "@/components/dynamic-form";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PoliticianUpdateFormProps {
  politician: any; // You can replace this with a proper politician type
}

const politicianFormFields: FieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "input",
    required: true,
    placeholder: "Enter politician name",
    InputType: "text",
    className: "w-full",
  },
  {
    name: "slug",
    label: "Slug",
    type: "input",
    required: true,
    placeholder: "Enter politician slug",
    InputType: "slug",
    className: "w-full",
  },
  {
    name: "position",
    label: "Position",
    type: "input",
    required: false,
    placeholder: "Enter politician position",
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
    placeholder: "Enter politician description",
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

const UpdatePoliticianForm = ({ politician }: PoliticianUpdateFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  // Handle form submission
  const handleUpdate = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.put(`/api/v1/politicians/${id}`, data);
      if (response.data) {
        toast.success("Politician updated successfully");
        router.push("/politicians");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-dvh">
      <PageHeader
        heading="Politician Management"
        description="Update an existing politician."
      />
      <DynamicForm
        fields={politicianFormFields}
        onSubmit={handleUpdate}
        parentClassName="space-y-4"
        isUpdateMode
        defaultValues={politician}
        formId="politician-form"
      />
      <Button
        type="submit"
        form="politician-form"
        className="mt-4"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Politician"}
      </Button>
    </div>
  );
};

export default UpdatePoliticianForm;