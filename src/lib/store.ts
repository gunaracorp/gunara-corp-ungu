import { db } from "@/lib/db";

/**
 * Shared in-memory store — cadangan bila database tidak tersedia
 * (mis. filesystem serverless Vercel). Dipakai bersama oleh semua API
 * (contact, newsletter, admin, member, vvip) supaya data tetap konsisten
 * dalam satu instance server. Lokal (SQLite) semuanya persisten.
 */

export interface MemContact {
  id: string;
  refCode: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  role: string | null;
  type: string;
  challenge: string;
  status: string;
  createdAt: string;
}

export interface MemSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface MemMember {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  tier: string;
  code: string;
  status: string;
  notes: string | null;
  validUntil: string | null;
  lastAccessAt: string | null;
  createdAt: string;
}

export interface MemLog {
  id: string;
  memberId: string | null;
  name: string | null;
  codeMasked: string;
  action: string;
  detail: string | null;
  createdAt: string;
}

export interface MemEmployee {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  position: string;
  department: string;
  code: string;
  status: string;
  notes: string | null;
  lastAccessAt: string | null;
  createdAt: string;
}

export interface MemClient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  industry: string | null;
  code: string;
  status: string;
  notes: string | null;
  lastAccessAt: string | null;
  createdAt: string;
}

export interface MemProject {
  id: string;
  refCode: string;
  title: string;
  description: string;
  clientId: string | null;
  clientName: string;
  employeeId: string | null;
  status: string;
  priority: string;
  progress: number;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MemProjectUpdate {
  id: string;
  projectId: string;
  author: string;
  authorRole: string;
  message: string;
  createdAt: string;
}

export interface MemAnnouncement {
  id: string;
  title: string;
  body: string;
  audience: string;
  createdAt: string;
}

export const mem = {
  contacts: [] as MemContact[],
  subscribers: [] as MemSubscriber[],
  members: [] as MemMember[],
  logs: [] as MemLog[],
  employees: [] as MemEmployee[],
  clients: [] as MemClient[],
  projects: [] as MemProject[],
  projectUpdates: [] as MemProjectUpdate[],
  announcements: [] as MemAnnouncement[],
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // tanpa I,O,0,1 agar tidak tertukar

export const TIERS = ["VVIP", "GOLD", "PLATINUM"] as const;

export function tierPrefix(tier: string): string {
  if (tier === "GOLD") return "GOLD";
  if (tier === "PLATINUM") return "PLAT";
  return "VVIP";
}

/** Kode personal member, contoh: GUNARA-VVIP-7K2M-Q4XR */
export function generateMemberCode(tier: string): string {
  const pick = (n: number) =>
    Array.from({ length: n }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
  return `GUNARA-${tierPrefix(tier)}-${pick(4)}-${pick(4)}`;
}

/** Kode login karyawan, contoh: GUNARA-EMP-7K2M-Q4XR */
export function generateEmployeeCode(): string {
  const pick = (n: number) =>
    Array.from({ length: n }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
  return `GUNARA-EMP-${pick(4)}-${pick(4)}`;
}

/** Kode login client, contoh: GUNARA-CLI-7K2M-Q4XR */
export function generateClientCode(): string {
  const pick = (n: number) =>
    Array.from({ length: n }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
  return `GUNARA-CLI-${pick(4)}-${pick(4)}`;
}

/** Kode referensi proyek, contoh: PRJ-7K2M-Q4XR */
export function generateProjectRef(): string {
  const pick = (n: number) =>
    Array.from({ length: n }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
  return `PRJ-${pick(4)}-${pick(4)}`;
}

export async function generateUniqueCode(tier: string): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const candidate = generateMemberCode(tier);
    let taken = mem.members.some((m) => m.code === candidate);
    if (!taken) {
      try {
        taken = !!(await db.vvipMember.findUnique({ where: { code: candidate } }));
      } catch {
        /* tanpa DB — memori saja */
      }
    }
    if (!taken) return candidate;
  }
  // Praktis mustahil sampai sini; fallback angka waktu.
  return `GUNARA-${tierPrefix(tier)}-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

export function maskCode(code: string): string {
  const clean = code.trim().toUpperCase();
  if (clean.length <= 8) return `${clean.slice(0, 3)}••••`;
  return `${clean.slice(0, 8)}••••`;
}

/** Catat log akses — DB dulu, gagal → memori. */
export async function logAccess(entry: {
  memberId?: string | null;
  name?: string | null;
  codeMasked: string;
  action: "login" | "denied";
  detail?: string | null;
}): Promise<void> {
  const local: MemLog = {
    id: `log-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    memberId: entry.memberId ?? null,
    name: entry.name ?? null,
    codeMasked: entry.codeMasked,
    action: entry.action,
    detail: entry.detail ?? null,
    createdAt: new Date().toISOString(),
  };
  try {
    await db.vvipAccessLog.create({
      data: {
        memberId: entry.memberId ?? null,
        name: entry.name ?? null,
        codeMasked: entry.codeMasked,
        action: entry.action,
        detail: entry.detail ?? null,
      },
    });
  } catch {
    mem.logs.unshift(local);
    if (mem.logs.length > 300) mem.logs.pop();
  }
}

/** Cari member aktif berdasarkan kode personal. */
export async function findMemberByCode(rawCode: string): Promise<MemMember | null> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return null;
  try {
    const m = await db.vvipMember.findUnique({ where: { code } });
    if (m) {
      return {
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        company: m.company,
        tier: m.tier,
        code: m.code,
        status: m.status,
        notes: m.notes,
        validUntil: m.validUntil ? m.validUntil.toISOString() : null,
        lastAccessAt: m.lastAccessAt ? m.lastAccessAt.toISOString() : null,
        createdAt: m.createdAt.toISOString(),
      };
    }
  } catch {
    /* DB tidak tersedia → coba memori */
  }
  return mem.members.find((m) => m.code === code) ?? null;
}

/** Apakah keanggotaan masih berlaku (aktif + belum lewat masa berlaku). */
export function membershipActive(m: MemMember): boolean {
  if (m.status !== "active") return false;
  if (m.validUntil && new Date(m.validUntil).getTime() < Date.now()) return false;
  return true;
}

export function memberPublic(m: MemMember): {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  tier: string;
  status: string;
  validUntil: string | null;
  lastAccessAt: string | null;
} {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    company: m.company,
    tier: m.tier,
    status: m.status,
    validUntil: m.validUntil,
    lastAccessAt: m.lastAccessAt,
  };
}
