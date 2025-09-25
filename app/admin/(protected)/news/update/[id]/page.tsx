import { getCategories } from "@/app/actions/category";
import { getNewsById } from "@/app/actions/new";
import NewsForm from "../../components/news-form";
import { getAuthors } from "@/app/actions/author";
export const dynamic = "force-dynamic";
export default async function UpdatePage({
  params,
}: {
  params: Promise<{ id: string}>;
}) {
  const { id } = await params;
  const categories = await getCategories();
  const news = await getNewsById(Number(id));
  const authors = await getAuthors();

  console.log(news, "news");

  return (
    <NewsForm
      authors={authors}
      categories={categories}
      isUpdate={true}
      defaultValues={news}
    />
  );
}
