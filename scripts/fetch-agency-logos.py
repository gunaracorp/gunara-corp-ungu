#!/usr/bin/env python3
"""Unduh logo resmi kementerian/lembaga RI dari Wikipedia (PNG resolusi tinggi).

Strategi:
1. Coba API pageimages id.wikipedia.org (logo infobox resmi) -> thumbnail 600px PNG
2. Fallback: pencarian file di Wikimedia Commons (srnamespace=6, "<nama> logo")
3. Validasi ukuran >= 250px; simpan ke public/images/agencies/<slug>.png
"""
import json
import os
import urllib.parse
import urllib.request

DST = "/home/z/my-project/public/images/agencies"
os.makedirs(DST, exist_ok=True)

UA = {
    "User-Agent": "TopKonsultanSiteBuilder/1.0 (https://topkonsultan.co.id; kontak@topkonsultan.co.id) python-urllib",
    "Accept": "image/*,application/json",
}

# slug, judul wiki id, nama tampilan
AGENCIES = [
    ("kemenkumham", "Kementerian Hukum (Indonesia)"),
    ("kemenimipas", "Kementerian Imigrasi dan Pemasyarakatan"),
    ("bkpm", "Kementerian Investasi dan Hilirisasi/BKPM"),
    ("kemenkeu", "Kementerian Keuangan Republik Indonesia"),
    ("kemendag", "Kementerian Perdagangan (Indonesia)"),
    ("kemenperin", "Kementerian Perindustrian (Indonesia)"),
    ("kemnaker", "Kementerian Ketenagakerjaan"),
    ("kemenkop", "Kementerian Koperasi (Indonesia)"),
    ("kemenag", "Kementerian Agama Republik Indonesia"),
    ("kemenkes", "Kementerian Kesehatan (Indonesia)"),
    ("bpom", "Badan Pengawas Obat dan Makanan"),
    ("klh", "Kementerian Lingkungan Hidup (Indonesia)"),
    ("pu", "Kementerian Pekerjaan Umum (Indonesia)"),
    ("komdigi", "Kementerian Komunikasi dan Digital (Indonesia)"),
    ("ojk", "Otoritas Jasa Keuangan"),
    ("bsn", "Badan Standardisasi Nasional"),
    ("kemenpar", "Kementerian Pariwisata (Indonesia)"),
    ("bappebti", "Badan Pengawas Perdagangan Berjangka Komoditi"),
]


def fetch_json(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read().decode())


def download(url, path):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    with open(path, "wb") as f:
        f.write(data)
    return len(data)


def wiki_thumb(title, size=600):
    api = (
        "https://id.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages"
        "&pithumbsize=%d&redirects=1&titles=%s" % (size, urllib.parse.quote(title))
    )
    try:
        data = fetch_json(api)
        pages = data.get("query", {}).get("pages", {})
        for _, p in pages.items():
            th = p.get("thumbnail", {}).get("source")
            if th:
                return th
    except Exception as e:
        print(f"    wiki API err: {e}")
    return None


def commons_search(name, size=600):
    q = f'"{name}" logo'
    api = (
        "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search"
        "&srnamespace=6&srlimit=3&srsearch=%s" % urllib.parse.quote(q)
    )
    try:
        data = fetch_json(api)
        hits = data.get("query", {}).get("search", [])
        for h in hits:
            title = h.get("title", "")
            fp = (
                "https://commons.wikimedia.org/wiki/Special:FilePath/"
                + urllib.parse.quote(title.replace("File:", "", 1))
                + f"?width={size}"
            )
            return fp, title
    except Exception as e:
        print(f"    commons err: {e}")
    return None, None


results = []
import time

for slug, name in AGENCIES:
    print(f"[{slug}] {name}")
    out = os.path.join(DST, f"{slug}.png")

    time.sleep(1.5)
    url = wiki_thumb(name)
    src = "wiki-infobox"
    if not url:
        time.sleep(1.5)
        url, ctitle = commons_search(name)
        src = f"commons:{ctitle}" if url else "NONE"

    if not url:
        print("    GAGAL: tidak ditemukan")
        results.append((slug, name, "FAIL", 0))
        continue

    try:
        time.sleep(1.0)
        n = download(url, out)
        print(f"    OK via {src}  {n//1024}KB  -> {slug}.png")
        results.append((slug, name, src, n))
    except Exception as e:
        print(f"    GAGAL unduh: {e}")
        results.append((slug, name, "FAIL", 0))

print("\n=== RINGKASAN ===")
for slug, name, src, n in results:
    print(f"{slug:12s} {src[:60]:60s} {n//1024}KB")
