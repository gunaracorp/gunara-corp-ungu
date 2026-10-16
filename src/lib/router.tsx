"use client";

/**
 * TOP Hash Router
 * ----------------------------------------------------------------------------
 * - Routes are hash paths starting with "/", e.g. "#/councils/quantum-strategy"
 * - Works on ANY static host (shared hosting friendly) — no server rewrites
 * - Bare anchors ("#benchmarks") stay native in-page scrolls
 * - Supports query params: "#/councils?filter=Technology%20%26%20AI"
 * - SEO deep-link: URL path nyata ("/faq", "/perizinan/pendirian-pt") juga
 *   dikenali — SSR merender konten yang benar untuk Google, lalu SPA
 *   melanjutkan navigasi hash tanpa reload.
 */

import { useCallback, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

export interface RouteInfo {
  /** Normalized path, always starts with "/", no query. "/" for home & anchors. */
  path: string;
  /** Path segments, e.g. "/councils/quantum-strategy" → ["councils", "quantum-strategy"] */
  segments: string[];
  /** Parsed query params from the hash */
  query: URLSearchParams;
  /** Full raw target (path + query) or null when the hash is a bare anchor */
  target: string | null;
}

function readHash(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash.replace(/^#/, "");
}

export function parseHash(raw: string): RouteInfo {
  const empty: URLSearchParams = new URLSearchParams();
  if (!raw) return { path: "/", segments: [], query: empty, target: null };
  if (!raw.startsWith("/")) return { path: "/", segments: [], query: empty, target: null };
  const [pathPart, queryPart] = raw.split("?");
  const segments = pathPart.split("/").filter(Boolean).map(decodeURIComponent);
  return {
    path: pathPart,
    segments,
    query: queryPart ? new URLSearchParams(queryPart) : empty,
    target: raw,
  };
}

/** URL path nyata → RouteInfo (query sengaja diabaikan: filter tetap jalur hash). */
export function parsePathname(pathname: string): RouteInfo {
  const segments = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  return {
    path: pathname,
    segments,
    query: new URLSearchParams(),
    target: pathname,
  };
}

/** Reactive route state driven by hashchange (hydration-safe) */
function subscribeRoute(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
const getRouteSnapshot = () => (typeof window === "undefined" ? "" : readHash());
const getServerRouteSnapshot = () => "";

/**
 * Reactive route state driven by hashchange (hydration-safe).
 *
 * Prioritas: 1) hash "#/…"  2) `fallbackPath` (SSR deep-link dari
 * app/[...slug]/page.tsx — membuat server & client render sama persis)
 * 3) window.location.pathname (ekor URL nyata)  4) beranda.
 * Bare anchor ("#benchmarks") TIDAK mengganti halaman — hanya scroll.
 */
export function useRoute(fallbackPath?: string): RouteInfo {
  const raw = useSyncExternalStore(subscribeRoute, getRouteSnapshot, getServerRouteSnapshot);
  return useMemo(() => {
    if (raw && raw.startsWith("/")) return parseHash(raw);
    if (fallbackPath) return parseHash(fallbackPath);
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p && p !== "/") return parsePathname(p);
    }
    return parseHash("");
  }, [raw, fallbackPath]);
}

/** Programmatic navigation */
export function navigate(to: string) {
  const target = to.startsWith("/") ? to : `/${to}`;
  if (readHash() === target) return;
  window.location.hash = target;
}

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  title?: string;
  onClick?: () => void;
}

/**
 * Universal link. Internal routes render "#/…"; http/mailto/tel pass through
 * (with target=_blank for external web links). Every link is a real <a> —
 * middle-click, right-click and long-press all behave natively.
 */
export function Link({ to, children, className, ariaLabel, title, onClick }: LinkProps) {
  const isHttp = to.startsWith("http://") || to.startsWith("https://");
  if (isHttp) {
    return (
      <a
        href={to}
        className={className}
        aria-label={ariaLabel}
        title={title}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  const href = to.startsWith("/") ? `#${to}` : to;
  return (
    <a href={href} className={className} aria-label={ariaLabel} title={title} onClick={onClick}>
      {children}
    </a>
  );
}

/** Smooth-scrolls to top on route change (call once in the app shell) */
export function useScrollTopOnRoute(path: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [path]);
}

/** Sets the document title per route */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

/** Returns a memoized callback that keeps focus accessible after route change */
export function useFocusMain() {
  return useCallback(() => {
    requestAnimationFrame(() => {
      const main = document.getElementById("main");
      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
    });
  }, []);
}
