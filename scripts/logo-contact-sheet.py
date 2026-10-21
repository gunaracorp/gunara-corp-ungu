#!/usr/bin/env python3
"""Lembar kontak logo instansi + laporan dimensi/mode untuk QC visual."""
from PIL import Image, ImageDraw
import os

DST = "/home/z/my-project/public/images/agencies"
files = sorted(f for f in os.listdir(DST) if f.endswith(".png"))

COLS, CELL_W, CELL_H, LABEL_H = 6, 220, 220, 26
rows = (len(files) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * CELL_W, rows * (CELL_H + LABEL_H)), (24, 24, 27))
draw = ImageDraw.Draw(sheet)

report = []
for i, f in enumerate(files):
    path = os.path.join(DST, f)
    try:
        im = Image.open(path)
        dims, mode = im.size, im.mode
        im.thumbnail((CELL_W - 16, CELL_H - 16))
        bg = Image.new("RGB", (CELL_W, CELL_H), (250, 250, 250))
        if im.mode == "RGBA":
            bg.paste(im, ((CELL_W - im.width) // 2, (CELL_H - im.height) // 2), im)
        else:
            bg.paste(im.convert("RGB"), ((CELL_W - im.width) // 2, (CELL_H - im.height) // 2))
        x = (i % COLS) * CELL_W
        y = (i // COLS) * (CELL_H + LABEL_H)
        sheet.paste(bg, (x, y))
        draw.text((x + 6, y + CELL_H + 4), f.replace(".png", ""), fill=(245, 245, 245))
        report.append(f"{f:22s} {dims[0]}x{dims[1]} {mode}")
    except Exception as e:
        report.append(f"{f:22s} ERROR {e}")

print("\n".join(report))
sheet.save("/home/z/my-project/scripts/logo-search/contact-sheet.png")
print("KONTAK: scripts/logo-search/contact-sheet.png")
