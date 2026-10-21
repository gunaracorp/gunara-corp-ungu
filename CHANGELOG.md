# Changelog — GunaraCorp Web Platform

<div align="center">

[![Release](https://img.shields.io/badge/Current_Release-v1.4.0_·_Kronika-047857?style=for-the-badge&labelColor=052e16)](#140--kronika--2026-10-22)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0_compliant-0f766e?style=flat-square)](#-versioning-rules)
[![Format](https://img.shields.io/badge/Format-Keep_a_Changelog-166534?style=flat-square)](https://keepachangelog.com/en/1.1.0/)

</div>

All notable changes to the **GunaraCorp** web platform are documented in this file.
Every change, command batch, and fix belongs to exactly one release version — no exceptions.

> 🇮🇩 **Ringkasan Bahasa Indonesia**: setiap perubahan, perintah, dan perbaikan wajib terikat pada satu versi rilis. Versi aktif saat ini: **v1.4.0 "Kronika"** (2026-10-22). Aturan naik versi ada di [§ Versioning Rules](#-versioning-rules).

---

## ⊞ Versioning Rules

This project follows **[Semantic Versioning 2.0.0](https://semver.org/)** — format `MAJOR.MINOR.PATCH`:

| Segment | Bumped when | Examples from this project |
|---|---|---|
| **MAJOR** | Brand-identity era change, or a breaking structural change | *(reserved — none yet since v1.0.0)* |
| **MINOR** | New features, pages, sections, or integrations — backward compatible | v1.1.0 catalog, v1.2.0 console split, v1.3.0 color system, v1.4.0 governance |
| **PATCH** | Bug fixes, public-surface hygiene, documentation repairs | v1.2.1 download-gate hotfix |

**Codename policy** — every release (pre-releases included) carries a single-word codename,
Nusantara-literature flavored, chosen in release order. Codenames are identifiers, not judgments:
`Genesis → Ekspansi → Gerbang Perizinan → Kepemimpinan → Restorasi → Identitas Ungu-Biru →
Skybridge → Bright Executive → Gerbang Terpilih → Summit → Katalog Raksasa → Dunia Dua →
Gerbang Bersih → Zamrud Keberangkatan → Kronika`.

**Single source of truth** — the version lives in `src/lib/version.ts` (`APP_VERSION` + `RELEASES`)
and is mirrored to:

| Consumer | Location |
|---|---|
| npm package identity | `package.json` → `"name": "gunaracorp"`, `"version": "1.4.0"` |
| Machine-readable API | `GET /api/version` (JSON incl. full release registry) |
| Live site | Public footer chip — `GunaraCorp v1.4.0 — Kronika` |
| Human history | This file |
| Operational log | `worklog.md` §0–§1 (governance + release registry, per-entry release tags) |

**Date precision notice** — releases older than v1.4.0 carry **month-level dates** (`2026-10`)
because daily calendar history was not recorded before the version system was activated
(v1.4.0). Dates are never fabricated beyond that precision.

**Release workflow** (for every future change):

```text
1. Lakukan perubahan di kode/dokumen.
2. Pilih tipe bump: MAJOR / MINOR / PATCH (tabel di atas).
3. Naikkan versi di src/lib/version.ts (APP_VERSION + entri RELEASES baru di atas)
   DAN package.json → "version".
4. Tulis entri baru di CHANGELOG.md (format di bawah).
5. Tambahkan baris `Release: vX.Y.Z "kode"` pada entri kerja di worklog.md.
6. `bun run lint` → 0 error → verifikasi browser → rilis dianggap sah.
```

---

## [1.4.0] — Kronika — 2026-10-22

*Version-governance release: from this version on, every change carries a version.*

### Added
- **Version registry module** `src/lib/version.ts` — single source of truth: `APP_VERSION`, `VERSION_META`, full `RELEASES` history (15 releases), `formatVersion()` helper.
- **`GET /api/version`** — machine-readable release metadata (current version, codename, channel, full release registry, doc pointers). Public zone, crawler-blocked via robots.
- **Live version chip** in the public footer: `GunaraCorp v1.4.0 — Kronika` (with release-date tooltip).
- **`CHANGELOG.md`** (this file) — Keep a Changelog format, SemVer-compliant, bilingual ID summary per header.
- **`README.md` v3** — Release + SemVer badges; new "Versioning & Riwayat Rilis" / "Versioning & Release History" sections (ID + EN); API reference updated (26 → 27 endpoints); project structure updated (`CHANGELOG.md`, `src/lib/version.ts`); theme references corrected to the Zamrud emerald identity.
- **`worklog.md` restructured** — new §0 governance rules, §1 release registry table (15 versions × codename × date × task IDs), §2 entry-writing contract; every historical entry (33 tasks) tagged with its release.

### Changed
- **Package renamed**: `nextjs_tailwind_shadcn_ts` → **`gunaracorp`**; version synced `0.2.1` → **`1.4.0`** (stale scaffold version retired).
- Historical task log re-tagged: all 33 worklog entries now carry `Release: vX.Y.Z "codename"` lines.

### Governance
- Established the six-step release workflow (code → bump → changelog → worklog tag → lint → browser verify) — documented in this file and enforced going forward.

---

## [1.3.0] — Zamrud Keberangkatan — 2026-10

*Full color-system re-architecture after user feedback that the previous palette "felt off".*

### Changed
- **Brand palette replaced**: violet → **Zamrud emerald `#047857`** as primary; teal `#0f766e` secondary; gold `#b45309`/`#d97706` accents; ivory `#faf9f4` background; error `#be123c`.
- Implemented via **`@theme` token aliasing** in `globals.css` (`violet-*` → Zamrud, `indigo-*` → teal, `blue-*` → laut) — 1,100+ class usages changed appearance atomically without touching component markup.
- Raw `rgba` violet values replaced with emerald/teal across **39 files**; manifest `theme_color`, OG routes, icons, PDF headers, admin charts updated.
- Logo recolored: gate geometry kept, gems moved to emerald-teal + gold.

### Added
- **Numeric WCAG 2.2 contrast gate** `scripts/contrast-check.ts` (bun) — 28 combinations tested; 20 gatekeeping pairs pass (body ≥ 4.5:1, large ≥ 3:1); decorative-only failures documented.

### Verified
- Audit covered 1,046 `violet-*` usages + raw HEX/rgba inventory; browser screenshots (desktop + iPhone) confirmed consistent emerald rendering; 0 console errors, 0 stale HEX left.

---

## [1.2.1] — Gerbang Bersih — 2026-10

*Hotfix: the public homepage must be purely public.*

### Removed
- All internal **download entry points** from the public surface: navbar desktop icon, mobile "Unduh Source Code" button, footer "Pusat Unduhan" link.

### Fixed
- `/unduh` page itself retained and guarded — reachable by direct URL / internal users only.

### Verified
- Rendered-DOM check: `a[href="/unduh"]` count on `/` = **0**; lint 0 errors; 0 console errors.

---

## [1.2.0] — Dunia Dua — 2026-10

*The hard split: one super app, two isolated worlds.*

### Added
- **Gunara Console** — dedicated internal shell (dark zinc-950 topbar, 5-portal switcher: `admin` / `karyawan` / `client` / `member` / `vvip`, internal footer, safe-area insets) with zero public navbar/footer/preloader/WhatsApp float.
- **Zone registry** `src/lib/routes.ts` — single source of truth for public-vs-console classification, consumed by the SPA router and SSR.
- **Bookmarkable real paths** `/admin`, `/karyawan`, `/client`, `/member`, `/vvip` served via `[...slug]` with `noindex+nofollow+nocache` metadata and no public JSON-LD.
- Console i18n keys (ID/EN).

### Changed
- `robots.txt` Disallow expanded to all five console paths + `/api/`; sitemap keeps 255 URLs, 100% public.
- **README full rewrite** (bilingual ID+EN): two-worlds ASCII architecture, enforcement matrix, roles & access matrix, API reference, deploy, SEO, Lighthouse, project structure, credits.

### Fixed
- 2 pre-existing hydration mismatches (Navbar `useRoute()` SSR fallback; insight share URL using `window.location` at render) — both deterministic now.
- Visual fix: language toggle overlapping lock icons on login gates.

### Verified
- Full audit: lint 0, tsc 0, 34 SSR routes = 200, 24 public pages + 5 console portals = 0 console errors, 9 screenshots archived.

---

## [1.1.0] — Katalog Raksasa — 2026-10

### Added
- **120-service catalog** (`SERVICES_CATALOG`, 12 categories × 10) with permanent slugs, deliverables, requirements, realistic Indonesian market pricing.
- **`/layanan` index + `/layanan/<slug>` detail pages** (SSR, SEO metadata) — hundreds of new indexable URLs.
- **Best-Price Guarantee page `/harga`** — open comparison vs 5 same-category competitors (Legalitas.org, Izin Kilat, Infiniti, Kontrak Hukum, MitraIzin) + "found cheaper? we match + 5% off" guarantee, after live price research.

### Changed
- **Rebrand to GUNARA CORPORATION / GUNARA CONSULTAN** — new phone +62 813-1651-6524, leadership Senior Konsultan Tn. H. Gugun Gunara, MBA; 1,524 companies handled; previous PT TOP KONSULTAN INTERNASIONAL identity retired from public display.
- Deep SEO maximization pass (long-tail keywords, metadata enrichment) per explicit user request.

---

## [1.0.0] — Summit — 2026-10

**First stable public release.**

### Added
- **International-standard SEO package**: unique metadata per page, canonicals, OpenGraph/Twitter cards, JSON-LD (Organization, ProfessionalService, WebSite, Breadcrumb, Service, ItemList, Article, FAQPage), dynamic `sitemap.xml` (255 URLs), `robots.txt`, RSS `feed.xml`, IndexNow pings, optional GA4.
- **Lighthouse performance overhaul**: root-cause fixes verified against production build — CSS-driven hero intro, compositor-driven self-hiding preloader, 26 SPA views code-split, `content-visibility` below the fold, ±50% smaller initial JS.

### Verified
- Accessibility 100 · Best Practices 100 · SEO 100 across pages; LCP 2.3 s · CLS 0 (DevTools 4× CPU throttle).

---

## [0.9.0] — Gerbang Terpilih — 2026-10

### Added
- **Oracle AI became a VVIP-exclusive lounge** (`#/vvip`) with access-code gate — removed from the public front page per owner directive.
- **CEO admin panel** (14 tabs) and **member dashboards**.
- **6 missing international-standard pages** built after a link-vs-route audit (careers/legal/industry-class pages etc.), closing every dead end.

---

## [0.8.0] — Bright Executive — 2026-10

### Changed
- Site-wide rebrand dark → **bright executive theme**; violet-blue identity kept as accent. Public readability first.

---

## [0.7.0] — Skybridge — 2026-10

### Added
- **Vercel production deploy**: auto-deploy setup, env-based AI provider, damage-proof fallback.
- Anti-"No Production Deployment" repository hygiene (import-and-go).
- Futuristic **bilingual README (ID+EN)**.

---

## [0.6.0] — Identitas Ungu-Biru — 2026-10

### Added
- Official contact channels: WhatsApp +62 811-1116-5165, `halo@topkonsultan.web.id`, 4 office addresses (Arjamukti HQ, Andalusia, PHI Kwitang, IPHI Pusat).
- Official ministry/agency partner logos section ("Jaringan Instansi").

### Changed
- Violet-blue rebrand pass.

---

## [0.5.0] — Restorasi — 2026-10

### Added
- Repository `prabudanling/topkonsultan` cloned, installed, and **E2E-verified in sandbox** (hash router 124 views, 36-permit catalog, Oracle AI answering PMA questions in Indonesian, contact ticket persisted to SQLite).
- **Real-photo branding**: 8 uploaded assets optimized (logo 9 MB → 316 KB; total set compressed) — founder, tower, 5 accreditation/certificate photos, gold seal card.
- Accreditation gallery component ("Setiap Sertifikat Adalah Bukti.").

---

## [0.4.0] — Kepemimpinan — 2026-10

### Added
- **Gugun Gunara** (entrepreneur from Tasikmalaya, senior business consultant, former McKinsey partner) established as company leader across the site.
- First world-class README with full design.

---

## [0.3.0] — Gerbang Perizinan — 2026-10

### Added
- **Licensing catalog** `src/data/perizinan.ts` — 8 categories, 36 permits (OSS/NIB/BPOM/halal/…).
- Bilingual fields across extended data types (EN names/taglines/titles).

### Changed
- **Full premium Indonesian translation** of 8 data files + 18 page/component files; rebrand *Omniprime Global Advisory* → **PT TOP KONSULTAN INTERNASIONAL** (Jakarta 2001, 46 expert councils, 6,900 years of combined experience, 190 countries, 12,000+ engagements).

---

## [0.2.0] — Ekspansi — 2026-10

### Changed
- One-pager expanded into a **full multi-page website** — every page, detail view, and link alive (about, method, results, careers, FAQ, legal, contact, services/councils/industries/insights + detail views).

---

## [0.1.0] — Genesis — 2026-10

### Added
- Initial build **"Omniprime Global Advisory"**: dark-luxury design system (zinc-950 + gold), **46 Council of Experts** (6 categories × 150 years each), 12 services, 5-phase Oracle Protocol, case studies, testimonials, 10 global hubs, benchmarks marquee.
- **Oracle AI chat** backend (Z.AI GLM via `z-ai-web-dev-sdk`).
- Data layer `src/data/content.ts`; SEO root metadata; favicon system.

---

<div align="center">

**◈ GunaraCorp — every change, one version. ◈**

<sub>Format: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer 2.0.0](https://semver.org/) · Maintainer: Gugun Gunara & Gunara Corp engineering</sub>

</div>
