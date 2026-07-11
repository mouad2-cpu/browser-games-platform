import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { useSecureCookies } from "@/lib/cookie-secure";

const CSRF_COOKIE = "csrf";

export async function generateCsrfToken(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: useSecureCookies(),
    sameSite: "lax",
    maxAge: 60 * 60,
    path: "/",
  });
  return token;
}

export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE)?.value ?? null;
}

export async function validateCsrf(headerToken: string | null): Promise<boolean> {
  if (!headerToken) return false;
  const cookieToken = await getCsrfToken();
  return cookieToken !== null && cookieToken === headerToken;
}

export { CSRF_COOKIE };
