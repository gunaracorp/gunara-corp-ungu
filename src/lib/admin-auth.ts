import { createHmac, timingSafeEqual } from "crypto";

/**
 * Sesi Panel CEO — cookie HttpOnly bertanda tangan HMAC (stateless),
 * sehingga tetap valid menembus cold-start serverless tanpa penyimpanan sesi.
 * Keamanan praktis: mengubah ADMIN_PASSWORD otomatis mematikan semua sesi lama.
 */

export const DEFAULT_ADMIN_PASSWORD = "GUNARA-CEO-2026";
const COOKIE_NAME = "top_admin";
const SESSION_MS = 8 * 60 * 60 * 1000; // 8 jam

export function adminPassword(): string {
  return (process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD).trim();
}

export function usingDefaultAdminPassword(): boolean {
  return !process.env.ADMIN_PASSWORD?.trim();
}

function sign(expiry: string): string {
  return createHmac("sha256", `${adminPassword()}::top-konsultan-panel`)
    .update(expiry)
    .digest("hex");
}

export function issueSession(): string {
  const expiry = String(Date.now() + SESSION_MS);
  return `${expiry}.${sign(expiry)}`;
}

export function sessionTokenValid(token: string | null | undefined): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expiryRaw = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expiry = Number(expiryRaw);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;
  const expected = sign(expiryRaw);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function adminPasswordMatches(provided: string): boolean {
  const a = Buffer.from(provided.trim());
  const b = Buffer.from(adminPassword());
  if (a.length !== b.length) {
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function adminCookieFrom(req: Request): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const m = new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`).exec(cookie);
  return m?.[1] ?? null;
}

export function isAdmin(req: Request): boolean {
  return sessionTokenValid(adminCookieFrom(req));
}

export function sessionCookieHeader(): string {
  return `${COOKIE_NAME}=${issueSession()}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_MS / 1000}`;
}

export function clearCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}
