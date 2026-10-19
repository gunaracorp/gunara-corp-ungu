/**
 * Backup otomatis GUNARA — snapshot database SQLite + folder uploads
 * ke arsip .tar.gz terjadwal. Server-only (fs, child_process, Prisma).
 *
 * Kontrol via environment:
 *   BACKUP_INTERVAL_HOURS  — jeda antar backup otomatis (default 24; 0 = matikan)
 *   BACKUP_KEEP            — jumlah arsip yang dipertahankan (default 10)
 *
 * Direktori: <project>/backups/gunara-backup-YYYYMMDD-HHMMSS.tar.gz
 * Konsistensi: PRAGMA wal_checkpoint(TRUNCATE) sebelum snapshot (best-effort).
 */

import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

import { db } from "@/lib/db";
import { audit } from "@/lib/audit";

const execFileAsync = promisify(execFile);

export interface BackupInfo {
  id: string;
  size: number;
  createdAt: string;
}

export interface BackupStatus {
  enabled: boolean;
  intervalHours: number;
  keep: number;
  dir: string;
  count: number;
  lastRunAt: string | null;
  nextRunAt: string | null;
  lastError: string | null;
}

const NAMA_REGEX = /^gunara-backup-\d{8}-\d{6}\.tar\.gz$/;

function backupDir(): string {
  return path.join(process.cwd(), "backups");
}

function dbPath(): { dir: string; name: string } | null {
  const url = process.env.DATABASE_URL ?? "";
  if (!url.startsWith("file:")) return null;
  const p = url.slice("file:".length).trim();
  return { dir: path.dirname(p), name: path.basename(p) };
}

function intervalHours(): number {
  const n = Number(process.env.BACKUP_INTERVAL_HOURS ?? "24");
  return Number.isFinite(n) && n >= 0 ? n : 24;
}

function keepCount(): number {
  const n = Number(process.env.BACKUP_KEEP ?? "10");
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 10;
}

/** Buat snapshot sekarang. Return info arsip yang dihasilkan. */
export async function createBackup(pemicu: "manual" | "otomatis" = "manual"): Promise<BackupInfo> {
  const target = dbPath();
  if (!target) throw new Error("DATABASE_URL bukan SQLite file: — backup dilewati.");
  if (!existsSync(target.dir + "/" + target.name)) throw new Error("File database tidak ditemukan.");

  // Konsistenkan WAL → file utama sebelum snapshot (best-effort).
  try {
    await db.$queryRawUnsafe("PRAGMA wal_checkpoint(TRUNCATE)");
  } catch {
    /* lanjut: snapshot tetap dilakukan */
  }

  const dir = backupDir();
  mkdirSync(dir, { recursive: true });

  const now = new Date();
  const stamp = [
    String(now.getFullYear()).padStart(4, "0"),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("") + "-" + [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
  const id = `gunara-backup-${stamp}.tar.gz`;
  const out = path.join(dir, id);

  // Isi arsip: file DB (dari direktorinya) + uploads/ (dari project).
  const args: string[] = ["-czf", out, "-C", target.dir, target.name];
  const uploadsRel = path.join(process.cwd(), "uploads");
  if (existsSync(uploadsRel)) {
    args.push("-C", process.cwd(), "uploads");
  }
  await execFileAsync("tar", args, { timeout: 120_000 });

  const size = statSync(out).size;
  await audit({
    actor: pemicu === "manual" ? "CEO / Admin" : "Sistem",
    actorRole: pemicu === "manual" ? "admin" : "sistem",
    action: "backup_buat",
    target: id,
    detail: `${pemicu} · ${(size / (1024 * 1024)).toFixed(2)} MB`,
  }).catch(() => undefined);

  // Buang arsip lama di luar kuota.
  prune();

  return { id, size, createdAt: now.toISOString() };
}

function prune(): void {
  const dir = backupDir();
  if (!existsSync(dir)) return;
  const keep = keepCount();
  const files = listBackups();
  for (const f of files.slice(keep)) {
    try {
      unlinkSync(path.join(dir, f.id));
    } catch {
      /* abaikan */
    }
  }
}

/** Daftar arsip, terbaru dulu. */
export function listBackups(): BackupInfo[] {
  const dir = backupDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => NAMA_REGEX.test(f))
    .map((f) => {
      const st = statSync(path.join(dir, f));
      return { id: f, size: st.size, createdAt: st.mtime.toISOString() };
    })
    .sort((a, b) => (a.id < b.id ? 1 : -1));
}

/** Hapus arsip by id (anti path-traversal: hanya pola nama sah). */
export function deleteBackup(id: string): boolean {
  if (!NAMA_REGEX.test(id)) throw new Error("Nama arsip tidak valid.");
  const full = path.join(backupDir(), id);
  if (!existsSync(full)) throw new Error("Arsip tidak ditemukan.");
  unlinkSync(full);
  audit({ actor: "CEO / Admin", actorRole: "admin", action: "backup_hapus", target: id }).catch(() => undefined);
  return true;
}

/** Buka arsip sebagai Buffer untuk diunduh. */
export function readBackup(id: string): Buffer {
  if (!NAMA_REGEX.test(id)) throw new Error("Nama arsip tidak valid.");
  const full = path.join(backupDir(), id);
  if (!existsSync(full)) throw new Error("Arsip tidak ditemukan.");
  return readFileSync(full);
}

export function getBackupStatus(): BackupStatus {
  const ih = intervalHours();
  const st = schedulerState();
  return {
    enabled: ih > 0,
    intervalHours: ih,
    keep: keepCount(),
    dir: backupDir(),
    count: listBackups().length,
    lastRunAt: st.lastRunAt,
    nextRunAt: st.nextRunAt,
    lastError: st.lastError,
  };
}

/* ── Scheduler ──────────────────────────────────────────────────────────── */

interface SchedState {
  timer: ReturnType<typeof setInterval> | null;
  lastRunAt: string | null;
  nextRunAt: string | null;
  lastError: string | null;
}

const SCHED_KEY = Symbol.for("gunara.backup.scheduler");

function schedulerState(): SchedState {
  const g = globalThis as unknown as Record<symbol, SchedState | undefined>;
  if (!g[SCHED_KEY]) {
    g[SCHED_KEY] = { timer: null, lastRunAt: null, nextRunAt: null, lastError: null };
  }
  return g[SCHED_KEY] as SchedState;
}

async function jalankanBackupOtomatis(): Promise<void> {
  const st = schedulerState();
  try {
    const info = await createBackup("otomatis");
    st.lastRunAt = info.createdAt;
    st.lastError = null;
    console.log(`[backup] otomatis selesai: ${info.id} (${(info.size / (1024 * 1024)).toFixed(2)} MB)`);
  } catch (e) {
    st.lastError = e instanceof Error ? e.message : String(e);
    console.error("[backup] otomatis gagal:", st.lastError);
  }
  const ih = intervalHours();
  st.nextRunAt = ih > 0 ? new Date(Date.now() + ih * 3600_000).toISOString() : null;
}

/** Mulai scheduler (idempoten — aman dipanggil ulang/HMR). */
export function startBackupScheduler(): void {
  const ih = intervalHours();
  const st = schedulerState();
  if (st.timer) return; // sudah jalan
  if (ih <= 0) {
    console.log("[backup] scheduler mati (BACKUP_INTERVAL_HOURS=0)");
    return;
  }
  const ms = ih * 3600_000;
  st.timer = setInterval(() => void jalankanBackupOtomatis(), ms);
  st.nextRunAt = new Date(Date.now() + ms).toISOString();
  console.log(`[backup] scheduler aktif: setiap ${ih} jam, keep ${keepCount()} arsip`);
  // Backup pertama 60 detik setelah server siap — hindari bentrok saat startup.
  setTimeout(() => void jalankanBackupOtomatis(), 60_000);
}
