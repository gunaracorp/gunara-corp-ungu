import { ImageResponse } from "next/og";

/** Apple touch icon 180×180 — monogram GC di atas gradasi zamrud-laut. */

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
          background: "linear-gradient(135deg, #03301f 0%, #065f46 50%, #0f766e 100%)",
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
