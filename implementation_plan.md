# Larasena V2 — Master Refactor & Growth Blueprint

Platform transformation dari project mindset → **Scalable Startup Mindset**.

## Background

Berdasarkan audit kode yang dilakukan, kondisi saat ini:

| Komponen | Status |
|---|---|
| `motifs` table | Canvas elements (admin upload, dipakai di editor) |
| `published_motifs` table | Gallery karya user (sistem moderasi sudah ada) |
| `PublishedMotifController` | Sudah handle gallery + SEO, tapi slug masih angka-acak |
| `MotifController` | Mixing canvas elements dengan published gallery |
| URL gallery | `/galeri-motif/{slug}` — slug sudah clean (numerik counter, bukan random) |
| Storage | Ada banyak patch workaround di `getImageUrlAttribute` — tanda technical debt |

---

## Open Questions

> [!IMPORTANT]
> **Konfirmasi Arsitektur Database**
> Model `motifs` (canvas elements) dan `published_motifs` (gallery) **sudah terpisah di database**. Yang perlu diperbaiki adalah:
> 1. Rename `motifs` → semantik jadi `canvas_elements` (atau keep `motifs` + rename kolom)?
> 2. Tambah field baru di `canvas_elements`: `type` (vector/ornament/shape/border), `is_premium`, `slug`
> 3. Tambah field baru di `published_motifs`: `category_id`, `downloads_count`, `description` (alias ke `philosophy`?)
>
> **Rekomendasiku**: Keep tabel lama, tambah migration baru untuk kolom baru. Tidak perlu rename tabel (breaking change). Setuju?

> [!WARNING]
> **Slug System**
> Slug saat ini sudah clean (tanpa random string), tapi masih bisa duplicate dengan counter (`batik-parang`, `batik-parang-1`). Blueprint minta URL tanpa counter. Solusi: unique slug via smart disambiguation (`batik-parang-kawung`, `batik-parang-modern`).

> [!NOTE]
> **Training Feature**
> Blueprint tidak menyebut fitur Training. Akan dipertahankan as-is (feature-flagged).

---

## Proposed Changes

Eksekusi dibagi dalam **4 Sprint**:

---

### 🔴 Sprint 1 — Critical Fixes (Technical Debt)

#### [MODIFY] [PublishedMotif.php](file:///c:/List%20Project/larasena2.0/app/Models/PublishedMotif.php)
- Bersihkan `getImageUrlAttribute()` — ganti 60+ baris patch dengan satu baris `Storage::url($this->image_path)`
- Tambah helper method `getDownloadUrl()` dan `getCategoryLabel()`
- Fix slug generation: gunakan kata-kata dari judul, bukan angka acak

#### [NEW] Migration: `add_fields_to_motifs_for_canvas_elements`
- Tambah kolom: `type` (enum: vector/ornament/shape/border/texture/icon/pattern_piece), `is_premium` (boolean), `slug` (string unique nullable), `thumbnail` (string nullable)
- Kolom existing tetap aman (no breaking changes)

#### [NEW] Migration: `add_fields_to_published_motifs_for_gallery_v2`
- Tambah kolom: `downloads_count` (int default 0), `category_id` (FK nullable), `tags` (json nullable)

#### [NEW] Migration: `create_canvas_categories_table`
- Tabel kategori bersama untuk canvas elements dan gallery

#### Fix Storage Link
- Saat deploy: `php artisan storage:link`
- Semua path baru konsisten: `Storage::url($path)` — tidak ada hardcode

---

### 🟠 Sprint 2 — Architecture & Backend

#### [NEW] `app/Models/CanvasCategory.php`
- Model untuk kategori (Parang, Kawung, Mega Mendung, Modern, Geometric)

#### [MODIFY] `app/Models/Motif.php`
- Rename semantically di kode (alias `CanvasElement`)
- Tambah: `scopePremium()`, `scopeByType()`, `getFileUrlAttribute()`
- Tambah relationship: `belongsTo(CanvasCategory::class)`

#### [MODIFY] `app/Http/Controllers/MotifController.php`
- Pisahkan endpoint editor: hanya return `canvas_elements` (bukan mix gallery)
- Hapus merge `published_motifs` ke `motifs` di `index()` (yang sekarang bikin UX bingung)

#### [NEW] `app/Http/Controllers/Admin/AdminCanvasElementController.php`
- CRUD untuk admin manage canvas elements
- Upload SVG/PNG → validate → store di `storage/canvas-elements/`
- Set premium/free, type, kategori, aktif/nonaktif

#### [MODIFY] `app/Http/Controllers/PublishedMotifController.php`
- `gallery()`: Tambah filter by `category`, `sort=trending` (views 7 hari), `sort=most_liked`, pagination (24 per page)
- `show()`: Fix slug duplicate handling, tambah download counter
- Tambah method `download()` untuk export/download karya

#### [MODIFY] `routes/web.php`
- Tambah route admin canvas elements: `/admin-canvas-elements`
- Tambah route gallery filter: `/galeri-motif?category=parang&sort=trending`
- Rename URL untuk konsistensi: sudah bagus, pertahankan

---

### 🟡 Sprint 3 — Frontend & UX

#### [MODIFY] `resources/js/pages/LandingPage.jsx`
Hero Section baru:
- Headline: **"Desain Motif Batik Digital dengan Mudah"**
- Subheadline: *"Buat, ekspresikan, dan bagikan karya batikmu ke komunitas kreator Indonesia."*
- Dual CTA: `Mulai Mendesain` + `Lihat Galeri`
- Social proof: Counter user, motif published, likes total
- Real gallery preview (4 motif featured)

#### [MODIFY] `resources/js/pages/Motif/Published/Gallery.jsx`
Gallery Page baru:
- Tab sorting: **Terbaru | Trending | Terpopuler | Featured**
- Category pills dinamis dari database (bukan hardcode)
- Creator card di setiap motif card (foto, nama, badge)
- Infinite scroll (IntersectionObserver)
- Download button (kalau user login)
- Related motifs di halaman detail

#### [MODIFY] `resources/js/pages/Editor/DesignEditor.jsx`
Canvas Editor enhancement:
- Sidebar asset: Search element, filter by kategori, filter by type
- Badge "PREMIUM" pada asset premium
- Recently used (localStorage)
- Autosave indicator

#### [NEW] `resources/js/pages/User/Bantuan.jsx` (Redesign)
Help Center baru:
- Sidebar navigasi kategori
- Search bantuan
- Tutorial step-by-step dengan screenshot
- Bahasa natural (bukan AI slop)

#### [NEW] Admin: Canvas Elements Manager
- `resources/js/pages/Admin/CanvasElements/Index.jsx`
- `resources/js/pages/Admin/CanvasElements/Create.jsx`
- Upload SVG/PNG, set type/category/premium

---

### 🟢 Sprint 4 — Growth & Monetization

#### SEO Improvements
- Canonical tag sudah ada → verifikasi implementasi di semua page
- Sitemap.xml: Tambah `published_motifs` entries dengan `lastmod`, `changefreq`
- OG Image dinamis: Sudah diimplementasi, verifikasi WhatsApp preview
- Schema markup: Sudah ada `CreativeWork` schema — tambah `BreadcrumbList`

#### [NEW] Subscription — Premium Plan Upgrade
- Free Plan vs Premium Plan UI (`resources/js/pages/Billing/`)
- Trigger upgrade saat user coba download HD / pakai premium asset
- Pricing: Rp29.000/bulan, Rp199.000/tahun

#### [NEW] Database Seeders (Production-Ready)
- `CanvasCategorySeeder` — 7 kategori: Parang, Kawung, Mega Mendung, Truntum, Modern, Geometric, Kontemporer
- `CanvasElementsSeeder` — 30 asset batik SVG: Parang line, Kawung icon, Floral, Border klasik, dll
- `GallerySeeder` — 20 karya demo: Batik Urban Blue, Parang Gold Modern, dll

---

## Verification Plan

### Sprint 1 (Technical Fixes)
- [ ] `php artisan storage:link` — verify semua image load tanpa 404
- [ ] Cek semua `image_url` di published_motifs → clean path tanpa double slash
- [ ] Test URL `/galeri-motif/batik-parang-modern` → tidak ada random suffix

### Sprint 2 (Backend)
- [ ] `php artisan migrate` — no errors
- [ ] `php artisan db:seed --class=CanvasCategorySeeder`
- [ ] Admin dapat upload canvas element → muncul di editor
- [ ] Gallery dapat filter by category + sort

### Sprint 3 (Frontend)
- [ ] Landing page: hero visible, CTA clickable, stats real
- [ ] Gallery: infinite scroll bekerja, filter dinamis
- [ ] Editor: search element, badge premium visible
- [ ] Help page: sidebar navigation bekerja

### Sprint 4 (Growth)
- [ ] WhatsApp share → thumbnail motif muncul (bukan default homepage)
- [ ] Sitemap.xml: includes all published motifs
- [ ] Premium CTA muncul saat user coba download HD

---

## Priority Eksekusi (Rekomendasiku)

```
Week 1: Sprint 1 (Critical fixes) + Sprint 2 (Backend arch)
Week 2: Sprint 3 (Frontend/UX) — Landing + Gallery + Editor
Week 3: Sprint 4 (Seeders + SEO audit + Billing CTA)
Week 4: Testing + Deploy + Growth content
```

> [!TIP]
> **Quick Win Pertama**: Fix `getImageUrlAttribute()` dulu. Ini paling visible impactnya — semua gambar yang 404 langsung fix.

