import { revalidatePath } from "next/cache";

export function revalidateGameCategoryPaths(slug: string, gameId: number, categoryId?: number) {
  revalidatePath("/");
  revalidatePath("/admin/games");
  revalidatePath(`/admin/games/${gameId}`);
  revalidatePath(`/game/${slug}`);
  revalidatePath("/admin/categories");
  if (categoryId) revalidatePath(`/admin/categories/${categoryId}`);
}
