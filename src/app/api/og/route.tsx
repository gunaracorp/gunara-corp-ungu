import { ImageResponse } from "next/og";

/**
 * GET /api/og?title=…&kicker=…&desc=…
 * ----------------------------------------------------------------------------
 * OG image dinamis per rute — setiap halaman detail (layanan, perizinan,
 * dewan, industri, wawasan) mendapat gambar sosial dengan judulnya sendiri.
 * Dipakai lewat buildRouteMeta (src/lib/seo.ts) dengan URL absolut dari
 * metadataBase, sehingga bebas dari masalah file-convention yang membakar
 * host localhost pada build statis.
 */

export const runtime = "nodejs";
export const contentType = "image/png";

const clamp = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clamp(searchParams.get("title") ?? "Gunara Consultan", 72);
  const kicker = clamp(searchParams.get("kicker") ?? "GUNARA CORPORATION", 48);
  const desc = clamp(
    searchParams.get("desc") ??
      "Konsultan perizinan yang telah menangani 1.524 perusahaan — lokal & nasional, global & dalam negeri, daerah & pusat.",
    150,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background:
            "linear-gradient(135deg, #03301f 0%, #065f46 46%, #0f766e 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Baris atas: monogram + kicker */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "#ffffff",
              color: "#065f46",
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            GC
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5 }}>
              GUNARA CONSULTAN
            </div>
            <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: 10, color: "#99f6e4" }}>
              {kicker.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Tengah: judul halaman */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.14 }}>
            {title}
          </div>
          <div style={{ fontSize: 26, color: "#ccfbf1", lineHeight: 1.4 }}>
            {desc}
          </div>
        </div>

        {/* Bawah: domain + janji */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "2px solid rgba(255,255,255,0.25)",
            paddingTop: 24,
          }}
        >
          <div style={{ fontSize: 22, color: "#99f6e4" }}>
            1.524 Perusahaan · 36+ Jenis Izin · 46 Dewan Pakar
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, color: "#fbbf24" }}>
            +62 813-1651-6524
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
