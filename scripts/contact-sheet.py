#!/usr/bin/env python3
"""Build a labeled contact sheet of all ministry logos for visual QA."""
import os
from PIL import Image, ImageDraw

OUT_DIR = "/home/z/my-project/public/images/ministries"
files = sorted(
    f for f in os.listdir(OUT_DIR) if f.endswith(".png") and not f.startswith("_")
)
COLS = 5
CELL_W, CELL_H = 280, 200
rows = (len(files) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * CELL_W, rows * CELL_H), (24, 24, 27))
draw = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    img = Image.open(os.path.join(OUT_DIR, f)).convert("RGBA")
    img.thumbnail((CELL_W - 40, CELL_H - 60))
    x = (i % COLS) * CELL_W
    y = (i // COLS) * CELL_H
    cell = Image.new("RGBA", (CELL_W, CELL_H), (255, 255, 255, 255))
    cell.paste(img, ((CELL_W - img.width) // 2, (CELL_H - img.height) // 2 - 10), img)
    sheet.paste(cell.convert("RGB"), (x, y))
    draw.rectangle([x, y, x + CELL_W - 1, y + CELL_H - 1], outline=(63, 63, 70))
    draw.text((x + 10, y + CELL_H - 26), f[:-4], fill=(212, 212, 216))
sheet.save("/home/z/my-project/scripts/ministries-contact-sheet.png")
print(f"{len(files)} logos:", ", ".join(f[:-4] for f in files))
