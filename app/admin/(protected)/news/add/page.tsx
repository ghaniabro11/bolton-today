import { getCategories } from "@/app/actions/category";
import NewsForm from "../components/news-form";
import { getAuthors } from "@/app/actions/author";
export const dynamic = "force-dynamic";

const CategoryForm = async () => {
  const categories = await getCategories();
  const authors = await getAuthors();
  return (
    <>
      <NewsForm categories={categories ?? []} authors={authors} />
    </>
  );
};

export default CategoryForm;
