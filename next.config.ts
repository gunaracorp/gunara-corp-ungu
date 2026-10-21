import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* Prisma harus eksternal (runtime Node murni) — jika dibundel Turbopack,
     delegate model (db.contactMessage, dst.) hilang → undefined saat query. */
  serverExternalPackages: ["@prisma/client", "@prisma/engines", "prisma"],
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
