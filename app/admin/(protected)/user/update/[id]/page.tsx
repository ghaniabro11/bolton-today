// Remove "use client" from this file and create a new client component
import { getUserById } from "@/app/actions/user";
import UserForm from "../../components/user-form";
// This becomes a server component
export default async function UserUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(Number(id));
  // console.log(user, "user");

  return <UserForm defaultValues={user} isUpdate />;
}
