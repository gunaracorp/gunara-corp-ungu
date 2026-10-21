/**
 * Instrumentasi Next.js — jalan sekali saat server proses naik.
 * Di sini scheduler backup otomatis dinyalakan (hanya runtime nodejs).
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startBackupScheduler } = await import("@/lib/backup");
    startBackupScheduler();
  }
}
