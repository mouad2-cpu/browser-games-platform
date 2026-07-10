import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditGameRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/admin/games/${id}`);
}
