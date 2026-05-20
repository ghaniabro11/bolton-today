// app/(protected)/politicians/update/[id]/page.tsx
import { getPoliticianById } from "@/app/actions/politician";
import PoliticianForm from "../../components/politician-form";


export const dynamic = "force-dynamic";

const UpdatePoliticianPage = async ({
  params,
}: {
  params: Promise<{ id: string}>;
}) => {
  const { id } = await params;
  const politician = await getPoliticianById(Number(id));
  console.log(politician, "politician");

  return <PoliticianForm defaultValues={politician} isUpdate />;
};

export default UpdatePoliticianPage;
