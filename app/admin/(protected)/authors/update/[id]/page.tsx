// app/(protected)/authors/update/[id]/page.tsx
import { getAuthorById } from "@/app/actions/author";
import AuthorForm from "../../components/author-form";


export const dynamic = "force-dynamic";

const UpdateAuthorPage = async ({
  params,
}: {
  params: Promise<{ id: string}>;
}) => {
  const { id } = await params;
  const author = await getAuthorById(Number(id));
  console.log(author, "authosr");

  return <AuthorForm defaultValues={author} isUpdate />;
};

export default UpdateAuthorPage;
