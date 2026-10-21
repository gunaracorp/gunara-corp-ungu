import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/seo";

/**
 * GET /opengraph-image — gambar sosial bermerek (1200×630), dirender on-demand
 * dan di-cache. Dikonsumsi lewat metadata `openGraph.images` / `twitter.images`
 * sehingga URL absolut selalu diresolusi dari metadataBase (domain produksi),
 * bukan host build — akar masalah file-convention yang dibakar localhost.
 */

export const contentType = "image/png";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #2e1065 0%, #5b21b6 46%, #1e3a8a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Baris atas: monogram + nama resmi */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "#ffffff",
              color: "#4c1d95",
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            GC
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 6 }}>
              GUNARA CONSULTAN
            </div>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: 14, color: "#c4b5fd" }}>
              CORPORATION
            </div>
          </div>
        </div>

        {/* Tengah: janji utama */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.15 }}>
            Satu Gerbang untuk Segala
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.15, color: "#fbbf24" }}>
            Izin &amp; Strategi
          </div>
          <div style={{ fontSize: 28, color: "#ddd6fe", marginTop: 6 }}>
            1.524 perusahaan ditangani — Konsultasi &amp; Perizinan Terlengkap di Dunia, sejak 2001
          </div>
        </div>

        {/* Bawah: statistik kunci + domain */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "2px solid rgba(255,255,255,0.25)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 40, fontWeight: 800 }}>1.524</div>
              <div style={{ fontSize: 20, color: "#c4b5fd" }}>Perusahaan</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 40, fontWeight: 800 }}>36+</div>
              <div style={{ fontSize: 20, color: "#c4b5fd" }}>Jenis Izin</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 40, fontWeight: 800 }}>46</div>
              <div style={{ fontSize: 20, color: "#c4b5fd" }}>Dewan Pakar</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 40, fontWeight: 800 }}>190</div>
              <div style={{ fontSize: 20, color: "#c4b5fd" }}>Negara</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 40, fontWeight: 800 }}>99,97%</div>
              <div style={{ fontSize: 20, color: "#c4b5fd" }}>Keberhasilan</div>
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "#fbbf24" }}>
            {new URL(SITE_URL).host}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
