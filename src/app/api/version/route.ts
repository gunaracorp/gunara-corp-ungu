import { NextResponse } from "next/server";
import { APP_VERSION, RELEASES, VERSION_META } from "@/lib/version";

/**
 * GET /api/version — metadata rilis machine-readable.
 * Zona: publik (tanpa sesi), tetapi diblokir dari crawler via robots.txt (Disallow /api/).
 * Konsumen: CI/CD health-check, badge dinamis, diagnostik, dokumentasi.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: VERSION_META.service,
    version: APP_VERSION,
    codename: VERSION_META.codename,
    codenameMeaning: VERSION_META.codenameMeaning,
    releasedAt: VERSION_META.releasedAt,
    channel: VERSION_META.channel,
    semverSpec: VERSION_META.semver,
    owner: VERSION_META.owner,
    releases: RELEASES,
    changelog: "/CHANGELOG.md",
    docs: "/README.md",
  });
}
