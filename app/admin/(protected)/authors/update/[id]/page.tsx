// app/(protected)/authors/update/[id]/page.tsx
import { getAuthorById } from "@/app/actions/author";
import { notFound } from "next/navigation";
import UpdateAuthorForm from "../../components/auth-update-form";
import AuthorForm from "../../components/author-form";

interface Props {
  params: {
    id: string;
  };
}
export const dynamic = "force-dynamic";

const UpdateAuthorPage = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const { id } = await params;
  const author = await getAuthorById(id);
  console.log(author, "authosr");

  return <AuthorForm defaultValues={author} isUpdate />;
};

export default UpdateAuthorPage;
