#!/usr/bin/env python3
"""Refetch logo yang salah: cari kandidat di Commons, tampilkan daftar, unduh terbaik."""
import json
import os
import time
import urllib.parse
import urllib.request

DST = "/home/z/my-project/public/images/agencies"
UA = {
    "User-Agent": "TopKonsultanSiteBuilder/1.0 (https://topkonsultan.co.id; kontak@topkonsultan.co.id) python-urllib",
}

# slug -> daftar query kandidat (dicoba berurutan)
RETRY = {
    "kemenkumham": [
        "Logo Kementerian Hukum Republik Indonesia",
        "Logo Kementerian Hukum dan HAM",
        "Ministry of Law Indonesia logo",
    ],
    "ojk": [
        "Otoritas Jasa Keuangan logo svg",
        "OJK logo",
    ],
    "kemenpar": [
        "Logo Kementerian Pariwisata 2024",
        "Kementerian Pariwisata Republik Indonesia logo",
    ],
    "pu": [
        "Logo Kementerian Pekerjaan Umum 2024",
        "Logo Kementerian Pekerjaan Umum dan Penataan Ruang",
        "Kementerian Pekerjaan Umum dan Perumahan logo",
    ],
}


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


BAD_EXT = (".pdf", ".djvu")
for slug, queries in RETRY.items():
    print(f"\n=== [{slug}] ===")
    found = False
    for q in queries:
        time.sleep(1.5)
        api = (
            "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search"
            "&srnamespace=6&srlimit=6&srsearch=%s" % urllib.parse.quote(q)
        )
        try:
            data = fetch_json(api)
        except Exception as e:
            print(f"  query err: {e}")
            continue
        hits = data.get("query", {}).get("search", [])
        print(f"  q='{q}' -> {[h['title'] for h in hits]}")
        for h in hits:
            title = h.get("title", "")
            low = title.lower()
            if any(low.endswith(ext) for ext in BAD_EXT):
                continue
            if "flag" in low or "seal of the coordinating" in low:
                continue
            fp = (
                "https://commons.wikimedia.org/wiki/Special:FilePath/"
                + urllib.parse.quote(title.replace("File:", "", 1))
                + "?width=800"
            )
            out = os.path.join(DST, f"{slug}.png")
            try:
                time.sleep(1.0)
                n = download(fp, out)
                print(f"  PILIH: {title} ({n//1024}KB)")
                found = True
                break
            except Exception as e:
                print(f"  gagal unduh {title}: {e}")
        if found:
            break
    if not found:
        print("  TIDAK ADA KANDIDAT LAYAK -> file lama dihapus")
        p = os.path.join(DST, f"{slug}.png")
        if os.path.exists(p):
            os.remove(p)

print("\nSelesai.")
