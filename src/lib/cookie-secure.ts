/** True when the public site URL is HTTPS (enables Secure cookies). */
export function useSecureCookies(): boolean {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (siteUrl.startsWith("https://")) return true;
  if (siteUrl.startsWith("http://")) return false;
  // Fallback: only force Secure when explicitly opted in.
  return process.env.COOKIE_SECURE === "true";
}
