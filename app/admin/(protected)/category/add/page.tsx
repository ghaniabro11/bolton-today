import { getCategories } from "@/app/actions/category";
import AddCategory from "@/app/admin/(protected)/category/components/category-form";
import React from "react";
export const dynamic = "force-dynamic";

const CategoryForm = async () => {
  const categories = await getCategories();
  console.log(categories, "categories");
  return (
    <>
      <AddCategory categories={categories ?? []} />
    </>
  );
};

export default CategoryForm;
