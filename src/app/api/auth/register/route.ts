import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { setSession, hashPassword } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validators";
import { parseRecentGameSlugs, RECENT_GAMES_COOKIE } from "@/lib/recent-games";
import { mergeGuestProgressIntoUser } from "@/lib/user-progress";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`register:${ip}`, 3, 600_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Try again later." },
      { status: 429 }
    );
  }

  const csrfValid = await validateCsrf(request.headers.get("x-csrf-token"));
  if (!csrfValid) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { username: parsed.data.username },
        { email: parsed.data.email },
      ],
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Username or email already taken" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      username: parsed.data.username,
      email: parsed.data.email,
      passwordHash,
    },
  });

  await setSession({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  const cookieStore = await cookies();
  const recentSlugs = parseRecentGameSlugs(cookieStore.get(RECENT_GAMES_COOKIE)?.value);
  if (recentSlugs.length > 0) {
    await mergeGuestProgressIntoUser(user.id, recentSlugs);
  }

  return NextResponse.json({ ok: true, role: user.role });
}
