import { getMagzineById } from "@/app/actions/magazine";
import MagzinesForm from "../../components/magzines-form";

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ id: string}>;
}) {
  const { id } = await params;
  const magazine = await getMagzineById(Number(id));
  console.log(magazine, "magazine");

  return <MagzinesForm isUpdate={true} defaultValues={magazine} />;
}
