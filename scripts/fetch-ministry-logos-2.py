#!/usr/bin/env python3
"""Round 2: fetch missing ministry logos via Commons search + Special:FilePath."""
import io
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from PIL import Image

BASE = "/home/z/my-project"
OUT_DIR = os.path.join(BASE, "public/images/ministries")
RAW_DIR = os.path.join(OUT_DIR, "_raw")
os.makedirs(RAW_DIR, exist_ok=True)

UA = {
    "User-Agent": "TopKonsultanBot/1.0 (https://topkonsultan.web.id; halo@topkonsultan.web.id)"
}

# slug -> list of commons search queries (best effort first)
QUERIES = {
    "kesdm": [
        "Logo Kementerian Energi dan Sumber Daya Mineral.svg",
        "Kementerian ESDM logo",
    ],
    "kemenpu": [
        "Logo Kementerian Pekerjaan Umum.svg",
        "Kementerian Pekerjaan Umum Republik Indonesia logo",
        "Departemen Pekerjaan Umum logo",
    ],
    "bkpm": [
        "Kementerian Investasi dan Hilirisasi BKPM logo",
        "BKPM logo",
    ],
    "atr-bpn": [
        "Kementerian Agraria dan Kepala Badan Pertanahan Nasional",
        "Logo Kementerian Agraria dan Tata Ruang",
        "Kementerian ATR BPN logo",
    ],
    "klh": [
        "Kementerian Lingkungan Hidup logo 2024",
        "Kementerian Lingkungan Hidup logo",
    ],
    "bsn": [
        "Logo Badan Standardisasi Nasional",
        "Badan Standardisasi Nasional Indonesia logo",
    ],
    "kemendesa": [
        "Kementerian Desa dan Pembangunan Daerah Tertinggal logo",
        "Kementerian Desa PDT logo",
    ],
    "kemenkop": [
        "Kementerian Koperasi logo 2024",
        "Kementerian Koperasi logo",
    ],
}

def api_call(url):
    req = urllib.request.Request(url, headers=UA)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:  # noqa: BLE001
            wait = 8 * (attempt + 1)
            print(f"  api retry in {wait}s ({e})")
            time.sleep(wait)
    return None

def find_file(query: str):
    """Return the best Commons file title for a query, or None."""
    q = urllib.parse.quote(query)
    url = (
        "https://commons.wikimedia.org/w/api.php?action=query&list=search"
        f"&srsearch={q}&srnamespace=6&srlimit=10&format=json"
    )
    data = api_call(url)
    if not data:
        return None
    hits = data.get("query", {}).get("search", [])
    best = None
    for h in hits:
        title = h.get("title", "")
        low = title.lower()
        if not (low.endswith(".svg") or low.endswith(".png")):
            continue
        if "logo" not in low and "kementerian" not in low and "badan" not in low:
            continue
        # prefer svg over png, prefer 2024 branding, prefer titles without "map"/"chart"
        score = 0
        if low.endswith(".svg"):
            score += 3
        if "2024" in low or "2025" in low:
            score += 2
        if "logo" in low:
            score += 2
        if any(b in low for b in ("map", "chart", "diagram", "photo", "gedung", "kantor pusat", "graha", "direktorat", "jenderal", "olahraga", "pelatihan", "balai", "unit layanan")):
            score -= 8
        if "ditjen" in low:
            score -= 8
        if best is None or score > best[0]:
            best = (score, title)
    return best[1] if best else None

def download_special(filename: str):
    """Download via Special:FilePath?width=500 (rendered PNG for SVG)."""
    base = filename.split(":", 1)[1]
    base = urllib.parse.quote(base, safe="")
    candidates = [
        f"https://commons.wikimedia.org/wiki/Special:FilePath/{base}?width=500",
        f"https://commons.wikimedia.org/wiki/Special:FilePath/{base}",
    ]
    last = None
    for attempt in range(3):
        for u in candidates:
            try:
                req = urllib.request.Request(u, headers=UA)
                with urllib.request.urlopen(req, timeout=30) as r:
                    raw = r.read()
                if len(raw) > 500:
                    return raw
            except Exception as e:  # noqa: BLE001
                last = e
        time.sleep(6 * (attempt + 1))
    raise last

def smart_crop(img):
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    alpha = img.getchannel("A")
    bbox = alpha.getbbox()
    if bbox and (bbox[2] - bbox[0] > 4 and bbox[3] - bbox[1] > 4):
        lo, hi = alpha.getextrema()
        if lo < 250:
            return img.crop(bbox)
    rgb = img.convert("RGB")
    mask = rgb.point(lambda p: 0 if p > 242 else 255).convert("L")
    bbox = mask.getbbox()
    if bbox and (bbox[2] - bbox[0] > 4 and bbox[3] - bbox[1] > 4):
        return img.crop(bbox)
    return img

def main():
    only = sys.argv[1].split(",") if len(sys.argv) > 1 else list(QUERIES)
    for slug in only:
        if not os.path.exists(os.path.join(OUT_DIR, f"{slug}.png")):
            pass
        else:
            print(f"SKIP {slug} (exists)")
            continue
        chosen = None
        for q in QUERIES[slug]:
            chosen = find_file(q)
            if chosen:
                print(f"{slug}: found {chosen}")
                break
            time.sleep(2)
        if not chosen:
            print(f"{slug}: NO FILE FOUND")
            continue
        try:
            raw = download_special(chosen)
            img = Image.open(io.BytesIO(raw))
            img.load()
            img = smart_crop(img)
            long_side = max(img.size)
            ratio = img.size[0] / max(1, img.size[1])
            if long_side < 200 or not (0.35 <= ratio <= 5.2):
                print(f"{slug}: REJECT {img.size}")
                continue
            if long_side > 480:
                scale = 480 / long_side
                img = img.resize((round(img.size[0] * scale), round(img.size[1] * scale)), Image.LANCZOS)
            out_path = os.path.join(OUT_DIR, f"{slug}.png")
            img.save(out_path, "PNG", optimize=True)
            print(f"OK   {slug} {img.size[0]}x{img.size[1]} {os.path.getsize(out_path)//1024}KB")
            time.sleep(2.2)
        except Exception as e:  # noqa: BLE001
            print(f"{slug}: ERR {str(e)[:120]}")

if __name__ == "__main__":
    main()
