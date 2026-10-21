"use client";

/**
 * Preloader CSS-murni — overlay intro yang menyembunyikan dirinya sendiri.
 *
 * Mengapa bukan framer-motion + setInterval seperti sebelumnya?
 * Chrome mengabaikan elemen LCP yang tertutup overlay opaque, sehingga LCP
 * menunggu preloader pergi. Dengan interval JS, kepergian itu tergantung
 * main-thread (di-throttle CPU saat load) — LCP terhambat ±2.5 dtk.
 * Kini progress bar & exit digerakkan CSS keyframe di compositor thread:
 * overlay pasti hilang ±1.15 dtk tanpa peduli seberapa sibuk JS.
 * JS hanya bertugas melepas simpul dari DOM setelahnya (kebersihan DOM).
 */

import { useEffect, useLayoutEffect, useState } from "react";
import { LogoMark } from "./logo";

const SEEN_KEY = "gunara_preloader_seen";

export default function Preloader() {
  const [gone, setGone] = useState(false);

  // Kunjungan kedua dst. dalam satu sesi: lewati total — sebelum paint.
  // Harus sinkron di useLayoutEffect (bukan initializer useState): SSR tidak
  // punya sessionStorage, sehingga pembacaan di initializer akan memicu
  // hydration mismatch.
  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(SEEN_KEY);
      if (!seen) sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage non-aktif — preloader tetap tampil normal */
    }
    if (seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- skip pre-paint, lihat komentar di atas
      setGone(true);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setGone(true), 2400);
    return () => window.clearTimeout(id);
  }, []);

  if (gone) return null;

  return (
    <div
      className="preloader-veil fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-white"
      aria-hidden="true"
    >
      <div className="preloader-mark">
        <LogoMark className="h-20 w-20 drop-shadow-[0_0_30px_rgba(13,148,136,0.45)]" />
      </div>

      <p className="intro-fade-up font-display text-lg font-bold tracking-[0.4em] text-slate-900">
        GUNARA CONSULTAN
      </p>

      <div className="flex w-60 flex-col items-center gap-3">
        <div className="h-px w-full overflow-hidden bg-slate-100">
          <div className="preloader-bar h-full bg-gradient-to-r from-violet-300 via-indigo-500 to-indigo-600" />
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-[0.42em] text-slate-400">
        Menghadirkan 46 Dewan Pakar
      </p>
    </div>
  );
}
