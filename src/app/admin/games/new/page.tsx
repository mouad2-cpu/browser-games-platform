import { prisma } from "@/lib/db";
import { GameForm } from "@/components/admin/game-form";

export default async function NewGamePage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, slug: true, icon: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Add New Game</h1>
      <GameForm categories={categories} />
    </div>
  );
}
