#!/usr/bin/env python3
"""Optimasi aset branding upload -> public/images TOP Konsultan."""
from PIL import Image
import os

SRC = "/home/z/my-project/upload"
DST = "/home/z/my-project/public/images"
os.makedirs(DST, exist_ok=True)

# (file sumber, nama keluaran, lebar maks, kualitas, mode)
JOBS = [
    ("MASTER LOGO TOP KONSULTAN GOLD TRANSPARANT PNG.png",
     "logo-pusat-perizinan.png", 800, None, "RGBA"),
    ("gugun-gunara-boss-darling-2023 (1).png",
     "founder-gugun-gunara.jpg", 900, 88, "RGB"),
    ("top-konsultan-gunara.png",
     "menara-top.jpg", 1344, 85, "RGB"),
    ("AKREDITASI KANWIL JAWA TIMUR PT ASHANTY PERDANA PRATIWI.jpg",
     "akreditasi-kanwil-jatim.jpg", 1400, 82, "RGB"),
    ("PENYERAHAN SERTIFIKAT BIRO PERJALANAN WISATA PT ASHANTY PERDANA PRATIWI TOP KONSULTAN.jpg",
     "penyerahan-bpw-ashanty.jpg", 1400, 82, "RGB"),
    ("PENYERAHAN SERTIFIKAT PPIU TOP KONSULTAN NUSANTARA DENGAN PT ASHANTY PERDANA PRATIWI.jpg",
     "penyerahan-ppiu-ashanty.jpg", 1400, 82, "RGB"),
    ("AKREDITASI PPIU PT ASHANTY PERDANA PRATIWI TOP KONSULTAN.jpg",
     "akreditasi-ppiu-ashanty.jpg", 1400, 82, "RGB"),
    ("AKREDITASI PPIU PT RIFF RELIGI TRAVELINDO TOP KONSULTAN NUSANTARA.jpg",
     "akreditasi-ppiu-riff.jpg", 1400, 82, "RGB"),
]

for src_name, out_name, max_w, quality, mode in JOBS:
    src_path = os.path.join(SRC, src_name)
    out_path = os.path.join(DST, out_name)
    im = Image.open(src_path)

    if im.mode != mode:
        im = im.convert(mode)

    if im.width > max_w:
        ratio = max_w / im.width
        im = im.resize((max_w, round(im.height * ratio)), Image.LANCZOS)

    if out_name.endswith(".png"):
        im.save(out_path, "PNG", optimize=True)
    else:
        im.save(out_path, "JPEG", quality=quality, optimize=True, progressive=True)

    kb = os.path.getsize(out_path) // 1024
    print(f"OK {out_name}  {im.width}x{im.height}  {kb}KB")

print("=== SELESAI ===")
