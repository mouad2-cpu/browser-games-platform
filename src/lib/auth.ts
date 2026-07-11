import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";
import type { Role } from "@prisma/client";
import { useSecureCookies } from "@/lib/cookie-secure";

const SESSION_COOKIE = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Session = {
  userId: string;
  username: string;
  role: Role;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as string,
      username: payload.username as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function setSession(user: Session): Promise<void> {
  const token = await new SignJWT({
    userId: user.userId,
    username: user.username,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: useSecureCookies(),
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(
  hash: string,
  plain: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export { SESSION_COOKIE, MAX_AGE };
