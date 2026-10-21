import type { MetadataRoute } from "next";
import { SITE_LEGAL } from "@/lib/seo";

/** PWA manifest — bonus kualitas Lighthouse & installability. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_LEGAL,
    short_name: "Gunara Consultan",
    description:
      "Satu gerbang konsultasi & perizinan terlengkap di dunia — 46 Dewan Pakar, 36+ jenis izin, 190 negara.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#faf9f4",
    theme_color: "#047857",
    lang: "id",
    orientation: "portrait-primary",
    categories: ["business", "legal", "finance"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
