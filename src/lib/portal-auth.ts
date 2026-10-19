import { createHmac, timingSafeEqual } from "crypto";

/**
 * Sesi Portal (Karyawan & Client) — cookie HttpOnly bertanda tangan HMAC
 * (stateless), pola yang sama dengan Panel CEO (lib/admin-auth.ts).
 *
 * Token: `${expiry}.${role}.${subjectId}.${mac}`
 * - Kunci HMAC diturunkan dari ADMIN_PASSWORD → mengganti kata sandi CEO
 *   otomatis mematikan semua sesi portal lama.
 * - role: "karyawan" | "client"
 */

export const PORTAL_COOKIE = "top_portal";
const SESSION_MS = 8 * 60 * 60 * 1000; // 8 jam

export type PortalRole = "karyawan" | "client";

export interface PortalSession {
  role: PortalRole;
  subjectId: string;
  expiry: number;
}

function portalKey(): string {
  return `${(process.env.ADMIN_PASSWORD ?? "GUNARA-CEO-2026").trim()}::portal-gunara`;
}

function sign(payload: string): string {
  return createHmac("sha256", portalKey()).update(payload).digest("hex");
}

export function issuePortalSession(role: PortalRole, subjectId: string): string {
  const expiry = String(Date.now() + SESSION_MS);
  const payload = `${expiry}.${role}.${subjectId}`;
  return `${payload}.${sign(payload)}`;
}

export function portalSessionFrom(token: string | null | undefined): PortalSession | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [expiryRaw, role, subjectId, mac] = parts;
  const expiry = Number(expiryRaw);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return null;
  if (role !== "karyawan" && role !== "client") return null;
  if (!subjectId) return null;
  const expected = sign(`${expiryRaw}.${role}.${subjectId}`);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    timingSafeEqual(b, b);
    return null;
  }
  if (!timingSafeEqual(a, b)) return null;
  return { role: role as PortalRole, subjectId, expiry };
}

export function portalCookieFrom(req: Request): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const m = new RegExp(`(?:^|;\\s*)${PORTAL_COOKIE}=([^;]+)`).exec(cookie);
  return m?.[1] ?? null;
}

export function portalSession(req: Request): PortalSession | null {
  return portalSessionFrom(portalCookieFrom(req));
}

export function isRole(req: Request, role: PortalRole): boolean {
  return portalSession(req)?.role === role;
}

export function portalCookieHeader(role: PortalRole, subjectId: string): string {
  return `${PORTAL_COOKIE}=${issuePortalSession(role, subjectId)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_MS / 1000}`;
}

export function clearPortalCookieHeader(): string {
  return `${PORTAL_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}
