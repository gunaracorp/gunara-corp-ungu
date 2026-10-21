import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient | null;
};

/**
 * Resilient Prisma singleton.
 * - Lokal/sandbox: SQLite (DATABASE_URL=file:...).
 * - Vercel: filesystem read-only -> query ditangkap try/catch di masing-masing
 *   API route (fallback memori). Tanpa DATABASE_URL, import module tetap aman:
 *   PrismaClient dibuat malas dan tidak melempar saat konstruksi.
 */
function createClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    console.warn("[db] DATABASE_URL tidak diset — API berjalan dengan fallback memori.");
    return null;
  }
  try {
    return new PrismaClient({ log: ["error", "warn"] });
  } catch (err) {
    console.warn("[db] PrismaClient gagal dibuat — fallback memori aktif.", err);
    return null;
  }
}

function getClient(): PrismaClient | null {
  if (globalForPrisma.prisma === undefined) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma ?? null;
}

/**
 * Proxy agar `db.contactMessage.create(...)` tetap bisa dipanggil; jika klien tidak ada, query melempar error yang ditangkap pemanggil.
 * Penting: akses properti dilakukan langsung pada instance client (bukan
 * Reflect.get dengan receiver Proxy) — delegate lazy Prisma (mis. db.contactMessage)
 * rusak bila `this`-nya Proxy dan berakhir `undefined` saat query.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    if (!client) {
      throw new Error("database_unavailable");
    }
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
