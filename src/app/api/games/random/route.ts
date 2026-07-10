import { NextResponse } from "next/server";
import { getRandomGameSlug } from "@/lib/games";

export async function GET() {
  const slug = await getRandomGameSlug();
  if (!slug) {
    return NextResponse.json({ error: "No games available." }, { status: 404 });
  }
  return NextResponse.json({ slug });
}
