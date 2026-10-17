import { NextResponse, type NextRequest } from "next/server";

/**
 * GET /favicon.ico — banyak browser masih meminta path legacy ini.
 * Alihkan ke ikon SVG resmi agar tidak menumpuk 404 di log & Search Console.
 */
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/icon.svg", request.url), 308);
}
