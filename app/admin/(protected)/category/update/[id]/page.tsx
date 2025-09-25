import { getCategories, getCategoryById } from "@/app/actions/category";
import CategoryForm from "../../components/category-form";
export const dynamic = "force-dynamic";

export default async function UserUpdatePage({
  params,
}: {
  params: Promise<{ id: string}>;
}) {
  const { id } = await params;
  const categories = await getCategories();
  const category = await getCategoryById(Number(id));
  console.log(category, "category");

  return (
    <CategoryForm
      categories={categories}
      isUpdate={true}
      defaultValues={category}
    />
  );
}
