// app/(protected)/journalists/update/[id]/page.tsx
import { getJournalistById } from "@/app/actions/journalist";
import JournalistForm from "../../components/journalist-form";


export const dynamic = "force-dynamic";

const UpdateJournalistPage = async ({
  params,
}: {
  params: Promise<{ id: string}>;
}) => {
  const { id } = await params;
  const journalist = await getJournalistById(Number(id));
  console.log(journalist, "journalist");

  return <JournalistForm defaultValues={journalist} isUpdate />;
};

export default UpdateJournalistPage;
