import { ImageResponse } from "next/og";

/** Apple touch icon 180×180 — monogram GC di atas gradasi ungu-biru. */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2e1065 0%, #5b21b6 50%, #1e3a8a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: 2 }}>GC</div>
          <div style={{ width: 72, height: 4, background: "#fbbf24", borderRadius: 2 }} />
        </div>
      </div>
    ),
    size,
  );
}
