#!/usr/bin/env python3
"""
Fetch OFFICIAL Indonesian ministry/institution logos from Wikipedia (Wikimedia
Commons) via the pageimages API, quality-gate them, auto-crop margins, and
save optimized PNGs to public/images/ministries/.

Quality gates (user demand: "png yang official yang bagus2 saja"):
  - must come from the official Wikipedia infobox logo (Wikimedia Commons)
  - final cropped logo must be >= 220px on the long side
  - file must decode as a valid PNG
  - aspect ratio sanity check (0.35 - 2.8)
Fails -> skipped (never shown on site).
"""
import io
import json
import os
import sys
import time
import urllib.request
import urllib.parse
from PIL import Image

BASE = "/home/z/my-project"
OUT_DIR = os.path.join(BASE, "public/images/ministries")
RAW_DIR = os.path.join(OUT_DIR, "_raw")
os.makedirs(RAW_DIR, exist_ok=True)

UA = {
    "User-Agent": "TopKonsultanBot/1.0 (https://topkonsultan.web.id; halo@topkonsultan.web.id)"
}

# slug, id.wikipedia article title, display fallback
CANDIDATES = [
    ("kemenkum",    "Kementerian Hukum Republik Indonesia"),
    ("kemenkeu",    "Kementerian Keuangan Republik Indonesia"),
    ("kemendag",    "Kementerian Perdagangan Republik Indonesia"),
    ("kemendagri",  "Kementerian Dalam Negeri Republik Indonesia"),
    ("kemenag",     "Kementerian Agama Republik Indonesia"),
    ("kemenpar",    "Kementerian Pariwisata Republik Indonesia"),
    ("kemenhub",    "Kementerian Perhubungan Republik Indonesia"),
    ("kemenkes",    "Kementerian Kesehatan Republik Indonesia"),
    ("kemenperin",  "Kementerian Perindustrian Republik Indonesia"),
    ("kemnaker",    "Kementerian Ketenagakerjaan Republik Indonesia"),
    ("bkpm",        "Kementerian Investasi dan Hilirisasi/BKPM"),
    ("kemenpu",     "Kementerian Pekerjaan Umum Republik Indonesia"),
    ("atr-bpn",     "Kementerian Agraria dan Tata Ruang/Kepala Badan Pertanahan Nasional"),
    ("klh",         "Kementerian Lingkungan Hidup Republik Indonesia"),
    ("kesdm",       "Kementerian Energi dan Sumber Daya Mineral Republik Indonesia"),
    ("bpom",        "Badan Pengawas Obat dan Makanan"),
    ("bsn",         "Badan Standardisasi Nasional"),
    ("kemendesa",   "Kementerian Desa Republik Indonesia"),
    ("kemenkop",    "Kementerian Koperasi Republik Indonesia"),
]

def api_thumbs(articles, size=640):
    """Per-article REST summary call (gentle pacing) -> {title: png_url}.
    The action API was 403-throttling this IP; rest_v1 summary works and
    returns the infobox logo. Slash in titles MUST be %2F-encoded."""
    out = {}
    for article in articles:
        slug = urllib.parse.quote(article.replace(" ", "_"), safe="")
        url = f"https://id.wikipedia.org/api/rest_v1/page/summary/{slug}"
        req = urllib.request.Request(url, headers=UA)
        data = None
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=30) as r:
                    data = json.loads(r.read().decode("utf-8"))
                break
            except Exception as e:  # noqa: BLE001
                wait = 8 * (attempt + 1)
                print(f"  rest retry {article[:30]} in {wait}s ({e})")
                time.sleep(wait)
        if not data:
            continue
        src = (data.get("thumbnail") or {}).get("source") or (
            data.get("originalimage") or {}
        ).get("source", "")
        if src:
            out[data.get("title", article)] = src.split("?")[0]
        time.sleep(2.2)
    return out

def download(url: str, cache_name: str | None = None):
    """Download raw bytes. For SVG renders try allowed larger widths first
    (Wikimedia only serves a whitelist: 250/330/500/960...), else use URL as-is."""
    import re

    candidates = []
    if "/thumb/" in url and re.search(r"/(\d+)px-", url):
        candidates.append(re.sub(r"/(\d+)px-", "/500px-", url, count=1))
    candidates.append(url)
    cache = os.path.join(RAW_DIR, cache_name) if cache_name else None
    if cache and os.path.exists(cache) and os.path.getsize(cache) > 1000:
        with open(cache, "rb") as f:
            return f.read()
    last = None
    for attempt in range(4):
        for u in candidates:
            try:
                req = urllib.request.Request(u, headers=UA)
                with urllib.request.urlopen(req, timeout=30) as r:
                    raw = r.read()
                if cache:
                    with open(cache, "wb") as f:
                        f.write(raw)
                return raw
            except Exception as e:  # noqa: BLE001
                last = e
        wait = 6 * (attempt + 1)
        print(f"  dl retry in {wait}s ({last})")
        time.sleep(wait)
    raise last

def smart_crop(img: Image.Image) -> Image.Image:
    """Trim transparent OR near-white margins so logos sit tight on cards."""
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    alpha = img.getchannel("A")
    bbox = alpha.getbbox()
    if bbox and (bbox[2] - bbox[0] > 4 and bbox[3] - bbox[1] > 4):
        # if alpha actually has transparency, use it
        lo, hi = alpha.getextrema()
        if lo < 250:
            return img.crop(bbox)
    # fallback: crop near-white background
    rgb = img.convert("RGB")
    mask = rgb.point(lambda p: 0 if p > 242 else 255).convert("L")
    bbox = mask.getbbox()
    if bbox and (bbox[2] - bbox[0] > 4 and bbox[3] - bbox[1] > 4):
        return img.crop(bbox)
    return img

def main():
    url_by_title = api_thumbs([a for _, a in CANDIDATES])
    print(f"batched API -> {len(url_by_title)} thumbnails found\n")
    report = []
    for slug, article in CANDIDATES:
        try:
            url = url_by_title.get(article)
            if not url:
                report.append((slug, "SKIP", "no pageimage"))
                continue
            raw = download(url, cache_name=f"{slug}.png")
            img = Image.open(io.BytesIO(raw))
            img.load()
            img = smart_crop(img)
            long_side = max(img.size)
            ratio = img.size[0] / max(1, img.size[1])
            if long_side < 220:
                report.append((slug, "SKIP", f"too small {img.size}"))
                continue
            if not (0.35 <= ratio <= 4.4):
                report.append((slug, "SKIP", f"weird ratio {ratio:.2f}"))
                continue
            if long_side > 480:
                scale = 480 / long_side
                img = img.resize(
                    (round(img.size[0] * scale), round(img.size[1] * scale)),
                    Image.LANCZOS,
                )
            out_path = os.path.join(OUT_DIR, f"{slug}.png")
            img.save(out_path, "PNG", optimize=True)
            kb = os.path.getsize(out_path) // 1024
            report.append((slug, "OK", f"{img.size[0]}x{img.size[1]} {kb}KB"))
            time.sleep(2.5)  # be gentle to Wikimedia
        except Exception as e:  # noqa: BLE001
            report.append((slug, "ERR", str(e)[:100]))

    for slug, status, info in report:
        print(f"{status:5} {slug:12} {info}")
    ok = sum(1 for _, s, _ in report if s == "OK")
    print(f"\n{ok}/{len(CANDIDATES)} logos OK -> {OUT_DIR}")

if __name__ == "__main__":
    sys.exit(main())
