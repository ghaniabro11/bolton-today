"use client";

import { DynamicForm, FieldConfig } from "@/components/dynamic-form";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const newsFormFields: FieldConfig[] = [
  {
    name: "title",
    label: "Title",
    type: "input",
    required: true,
    placeholder: "Enter news title",
    InputType: "text",
    className: "w-full",
  },
  {
    name: "slug",
    label: "Slug",
    type: "input",
    required: true,
    placeholder: "Enter article slug",
    InputType: "slug",
    className: "w-full",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Enter news description",
    className: "col-span-2",
  },
  {
    name: "categories",
    label: "Categories",
    type: "multiSelect",
    required: true,
    placeholder: "Select categories",
    options: [], // This will be populated from props
    className: "w-full",
  },
  {
    name: "authorId",
    label: "Select author",
    type: "select",
    required: true,
    placeholder: "Select author",
    options: [], // This will be populated from props
    className: "w-full",
  },
  {
    name: "publishDate",
    label: "Publish Date",
    type: "input",
    required: true,
    placeholder: "Select publish date",
    InputType: "datetime-local",
    className: "w-full",
    // Add this to format the date for the input
  },
  {
    name: "details",
    label: "Details",
    type: "joditEditor",
    required: true,
    placeholder: "Enter news details",
    className: "col-span-2",
  },
  {
    name: "activeStatus",
    label: "Active Status",
    type: "select",
    required: true,
    placeholder: "Select active status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
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
    name: "featureImage",
    label: "Feature Image",
    type: "media",
    required: true,
    placeholder: "Select feature image...",
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

interface Category {
  id: number;
  name: string;
  slug: string;
}
interface Authors {
  id: number;
  name: string;
}

interface NewsFormProps {
  categories: Category[];
  authors: Authors[];
  isUpdate?: boolean;
  defaultValues?: any;
}

const NewsForm: React.FC<NewsFormProps> = ({
  authors,
  categories,
  isUpdate = false,
  defaultValues = undefined,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  // Transform categories for the multiSelect
  const categoryOptions = categories?.map((cat) => ({
    label: cat.name,
    value: String(cat.id),
  }));
  // Transform categories for the multiSelect
  const authorOptions = authors?.map((a) => ({
    label: a.name,
    value: String(a.id),
  }));

  // Update the categories field with the options
  const formFields = newsFormFields.map((field) => {
    if (field.name === "categories") {
      return { ...field, options: categoryOptions };
    }
    if (field.name === "authorId") {
      return { ...field, options: authorOptions };
    }
    return field;
  });
  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      // Transform category IDs to include slugs
      const categoriesWithSlugs = data.categories.map((id: any) => {
        console.log(categories, "car");
        const matchedCategory = categories.find(
          (cat: any) => String(cat.id) === String(id)
        );
        console.log(matchedCategory, "matchedCategory");
        return {
          id,
          slug: matchedCategory?.slug || "",
        };
      });
      console.log(categoriesWithSlugs, "categoriesWithSlugs");
      const payload = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        details: data.details,
        categories: categoriesWithSlugs, // Array of category IDs
        authorId: data.authorId,
        publishStatus: data.publishStatus,
        featureImage: data.featureImage.id,
        publishDate: data.publishDate,
        activeStatus: data.activeStatus,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
      };

      const response = isUpdate
        ? await axiosInstance.put(`/api/v1/news/${id}`, payload)
        : await axiosInstance.post("/api/v1/news", payload);

      if (response.data) {
        toast.success(
          isUpdate ? "News updated successfully" : "News created successfully"
        );
        router.push("/admin/news/");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          `Failed to ${isUpdate ? "update" : "create"} news`
      );
    } finally {
      setIsLoading(false);
    }
  };
  // In news-form.tsx
  const transformedDefaultValues = defaultValues
    ? {
        ...defaultValues,
        categories:
          defaultValues?.categories?.map((cat: any) => String(cat.id)) || [],

        publishDate: defaultValues.publishDate
          ? new Date(defaultValues.publishDate).toISOString().slice(0, 16) // This will format to YYYY-MM-DDThh:mm
          : null,
      }
    : null;

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        heading={`${isUpdate ? "Update" : "News Management"}`}
        description={isUpdate ? "Update existing news." : "Add New News."}
      />
      <div className="mt-6">
        <DynamicForm
          fields={formFields as any}
          onSubmit={handleSubmit}
          defaultValues={isUpdate ? transformedDefaultValues : null}
          isUpdateMode={isUpdate}
          parentClassName="grid grid-cols-2 gap-6"
          formId="news-form"
        />
      </div>
      <div className="col-span-2 flex justify-end mt-6">
        <Button
          type="submit"
          form="news-form"
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
    </div>
  );
};

export default NewsForm;
