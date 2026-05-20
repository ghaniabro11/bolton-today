// app/(protected)/contributors/update/[id]/page.tsx
import { getContributorById } from "@/app/actions/contributor";
import ContributorForm from "../../components/contributor-form";


export const dynamic = "force-dynamic";

const UpdateContributorPage = async ({
  params,
}: {
  params: Promise<{ id: string}>;
}) => {
  const { id } = await params;
  const contributor = await getContributorById(Number(id));
  console.log(contributor, "contributor");

  return <ContributorForm defaultValues={contributor} isUpdate />;
};

export default UpdateContributorPage;
