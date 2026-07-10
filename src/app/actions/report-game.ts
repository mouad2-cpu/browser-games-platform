"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { reportSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";

export async function reportGame(
  formData: FormData
): Promise<{ ok?: true; error?: string }> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const limit = rateLimit(`report:${ip}`, 5, 60_000);
  if (!limit.allowed) {
    return { error: "Too many reports. Please try again later." };
  }

  const raw = {
    gameId: formData.get("gameId"),
    issueType: formData.get("issueType") as string,
    email: (formData.get("email") as string) || undefined,
    message: formData.get("message") as string,
  };

  const parsed = reportSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const game = await prisma.game.findUnique({
    where: { id: parsed.data.gameId },
  });
  if (!game) {
    return { error: "Game not found" };
  }

  await prisma.gameReport.create({
    data: {
      gameId: parsed.data.gameId,
      issueType: parsed.data.issueType,
      email: parsed.data.email || null,
      message: parsed.data.message,
    },
  });

  return { ok: true };
}
