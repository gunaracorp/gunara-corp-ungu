#!/usr/bin/env python3
"""Migrasi tema gelap -> tema CERAH (Bright Executive, violet-biru).
Mapping terurut: yang paling spesifik (dengan suffix opacity) diganti dulu.
"""
import re
from pathlib import Path

ROOT = Path("/home/z/my-project/src")

# (lama, baru) — diterapkan berurutan per file
REPLACEMENTS = [
    # ===== KASUS KHUSUS (harus sebelum umum) =====
    ('active ? "bg-zinc-950/20 text-zinc-950" : "bg-zinc-800 text-zinc-500"',
     'active ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"'),
    ('bg-[radial-gradient(circle_at_32%_28%,rgba(167,139,250,0.14),rgba(9,9,11,0.25)_62%)]',
     'bg-[radial-gradient(circle_at_32%_28%,rgba(167,139,250,0.35),rgba(255,255,255,0.6)_62%)]'),

    # ===== TEKS ABU (gelap -> terang) =====
    ("text-zinc-50", "text-slate-900"),
    ("text-zinc-100", "text-slate-900"),
    ("text-zinc-200", "text-slate-700"),
    ("text-zinc-300", "text-slate-600"),
    ("text-zinc-400", "text-slate-500"),
    ("text-zinc-500", "text-slate-500"),
    ("text-zinc-600", "text-slate-400"),
    ("text-zinc-700", "text-slate-400"),
    ("text-zinc-950", "text-white"),  # tombol/ikon di atas bg berwarna

    # ===== LATAR =====
    ("bg-zinc-950/95", "bg-white/95"),
    ("bg-zinc-950/70", "bg-white/70"),
    ("bg-zinc-950/40", "bg-white/50"),
    ("bg-zinc-950", "bg-white"),
    ("bg-zinc-900/70", "bg-slate-50"),
    ("bg-zinc-900/40", "bg-white"),
    ("bg-zinc-900", "bg-white"),
    ("bg-zinc-800/90", "bg-slate-100"),
    ("bg-zinc-800", "bg-slate-100"),

    # ===== BORDER =====
    ("border-zinc-800/80", "border-slate-200"),
    ("border-zinc-900/70", "border-slate-200"),
    ("border-zinc-800", "border-slate-200"),
    ("border-zinc-700", "border-slate-300"),
    ("divide-zinc-800", "divide-slate-200"),
    ("divide-zinc-900", "divide-slate-200"),

    # ===== AKSEN VIOLET - TEKS (kontras di latar terang) =====
    ("text-violet-400/90", "text-violet-600"),
    ("text-violet-300/90", "text-violet-700"),
    ("text-violet-300/80", "text-violet-700"),
    ("text-violet-400/70", "text-violet-500"),
    ("text-violet-400/80", "text-violet-500"),
    ("text-violet-300", "text-violet-600"),
    ("text-violet-400", "text-violet-600"),
    ("text-violet-200", "text-violet-700"),
    ("text-violet-100", "text-violet-800"),

    # ===== AKSEN VIOLET - BORDER =====
    ("border-violet-400/60", "border-violet-500/70"),
    ("border-violet-400/50", "border-violet-500/60"),
    ("border-violet-400/40", "border-violet-500/50"),
    ("border-violet-400/30", "border-violet-300"),
    ("border-violet-400/25", "border-violet-300"),
    ("border-violet-400/20", "border-violet-200"),
    ("border-violet-400/15", "border-violet-200"),
    ("border-violet-400/10", "border-violet-200"),
    ("border-violet-400", "border-violet-500"),
    ("border-violet-300/50", "border-violet-300"),

    # ===== AKSEN VIOLET - LATAR =====
    ("bg-violet-400/90", "bg-violet-600"),
    ("bg-violet-400/20", "bg-violet-100"),
    ("bg-violet-400/15", "bg-violet-100"),
    ("bg-violet-400/10", "bg-violet-50"),
    ("bg-violet-400/5", "bg-violet-50/60"),
    ("bg-violet-400", "bg-violet-600"),
    ("bg-violet-500", "bg-violet-600"),
    ("bg-violet-300", "bg-violet-500"),
    ("bg-violet-200", "bg-violet-500"),

    # ===== GRADIEN =====
    ("from-violet-400/15", "from-violet-100"),
    ("from-violet-400/10", "from-violet-50"),
    ("from-violet-400", "from-violet-600"),
    ("via-violet-400/70", "via-violet-500/80"),
    ("via-violet-400", "via-violet-500"),
    ("via-indigo-400", "via-indigo-500"),
    ("to-blue-500", "to-blue-600"),
    ("to-blue-400", "to-blue-600"),
    ("to-indigo-600/10", "to-indigo-100"),
    ("to-indigo-500/10", "to-indigo-100"),
    ("from-indigo-400", "from-indigo-500"),
    ("from-blue-400", "from-blue-500"),
    ("to-violet-400", "to-violet-600"),

    # ===== WARNA LAIN =====
    ("text-emerald-300", "text-emerald-600"),
    ("text-emerald-400", "text-emerald-600"),
    ("bg-emerald-400/10", "bg-emerald-50"),
    ("bg-emerald-400/20", "bg-emerald-100"),
    ("bg-emerald-400/50", "bg-emerald-200"),
    ("bg-emerald-400", "bg-emerald-500"),
    ("border-emerald-400/70", "border-emerald-500/60"),
    ("border-emerald-400/40", "border-emerald-300"),
    ("border-emerald-400/30", "border-emerald-200"),
    ("text-rose-300", "text-rose-600"),
    ("bg-rose-400/10", "bg-rose-50"),
    ("border-rose-400/30", "border-rose-200"),
    ("text-red-300", "text-red-600"),
    ("text-red-50", "text-red-700"),
    ("border-red-500/30", "border-red-300"),
    ("bg-red-500/10", "bg-red-50"),
    ("bg-indigo-300/10", "bg-indigo-50"),

    # ===== BAYANGAN CUSTOM: glow violet ditendang agar lembut di latar terang =====
    ("rgba(139,92,246,0.7)", "rgba(139,92,246,0.42)"),
    ("rgba(139,92,246,0.5)", "rgba(139,92,246,0.32)"),
    ("rgba(139,92,246,0.4)", "rgba(139,92,246,0.28)"),
    ("rgba(139,92,246,0.35)", "rgba(139,92,246,0.22)"),
    ("rgba(139,92,246,0.3)", "rgba(139,92,246,0.2)"),
    ("rgba(139,92,246,0.85)", "rgba(139,92,246,0.5)"),
    ("rgba(139,92,246,0.55)", "rgba(139,92,246,0.35)"),
    ("rgba(167,139,250,0.9)", "rgba(124,58,237,0.55)"),
    ("rgba(167,139,250,1)", "rgba(124,58,237,0.6)"),
    ("rgba(167,139,250,0.14)", "rgba(124,58,237,0.16)"),
    ("rgba(167,139,250,0.12)", "rgba(124,58,237,0.14)"),
]

changed = 0
for path in sorted(ROOT.rglob("*.ts*")):
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8")
        changed += 1
        print(f"  ok  {path.relative_to(ROOT.parent)}")

print(f"\n{changed} file diubah")
