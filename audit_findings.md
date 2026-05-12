# Larasena 2.0 — Deep Audit Report
### Temuan di Luar Sprint Plan Awal

---

## 🔴 CRITICAL — Harus Difix Sebelum Sprint Lain

---

### 1. Slug Random String Masih Ada di `UploadMotifController`

**File:** [UploadMotifController.php](file:///c:/List%20Project/larasena2.0/app/Http/Controllers/UploadMotifController.php#L85)

```php
// ❌ MASALAH — Hardcoded random string
'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
```

**Root cause:** `UploadMotifController::store()` meng-override slug generation yang sudah benar di `PublishedMotif::boot()`. Karena slug di-set secara manual dengan `Str::random(6)`, model `boot()` tidak pernah dijalankan untuk menghasilkan slug bersih.

**Fix:**
```php
// ✅ SOLUSI — Hapus baris 'slug' dari create(), biarkan model boot() yang handle
$motif = PublishedMotif::create([
    'user_id'    => Auth::id(),
    'title'      => $validated['title'],
    // 'slug' => ... ← HAPUS BARIS INI
    'origin'     => $validated['origin'],
    // ...
]);
```

**Impact:** Semua URL motif yang diupload via `/upload` masih punya suffix random. Ini langsung merusak SEO.

---

### 2. `Design::publishedMotif()` — Relasi Tidak Valid (Silent Fail)

**File:** [Design.php](file:///c:/List%20Project/larasena2.0/app/Models/Design.php#L42)

```php
// ❌ RELASI INVALID — Eloquent tidak support JSON path di hasOne
public function publishedMotif()
{
    return $this->hasOne(PublishedMotif::class, 'design_data->design_id');
}
```

Eloquent `hasOne` tidak mendukung JSON path sebagai foreign key. Method ini akan selalu return `null` secara diam-diam tanpa error. Bukan hanya tidak berguna — ini bisa menyebabkan `null pointer` bug di masa depan jika ada code yang `->publishedMotif->status`.

**Fix:**
```php
// ✅ SOLUSI — Hapus relasi palsu ini, gunakan query langsung
// Di DesignController::getPublishStatus() sudah ada implementasi yang benar
// Tambahkan scope di PublishedMotif sebagai gantinya:
public function scopeForDesign($query, $designId)
{
    return $query->where('user_id', Auth::id())
                 ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(design_data, '$.design_id')) = ?", [$designId]);
}
```

---

### 3. `EnsureSubscriptionIsActive` — Middleware Tidak Benar-benar Enforce

**File:** [EnsureSubscriptionIsActive.php](file:///c:/List%20Project/larasena2.0/app/Http/Middleware/EnsureSubscriptionIsActive.php#L66)

```php
// ❌ Middleware tidak block akses! Hanya update status lalu lanjut
if ($subscription->status !== 'payment_required') {
    $subscription->update(['status' => 'payment_required']);
}

return $next($request); // ← SELALU lolos!
```

Middleware ini **tidak pernah memblokir akses**. Ia hanya menandai status `payment_required` di database tapi tetap memberikan akses ke semua route. Artinya sistem billing saat ini tidak enforce apapun — user bisa terus pakai platform meskipun trial habis.

**Fix (tergantung business decision):**
```php
// ✅ OPSI A — Redirect ke billing page (enforce payment)
return redirect()->route('billing.required')
    ->with('warning', 'Trial kamu telah berakhir. Silakan berlangganan untuk melanjutkan.');

// ✅ OPSI B — Graceful degradation (batasi fitur, bukan block total)
// Inject flag ke request, handle di frontend
$request->merge(['subscription_expired' => true]);
return $next($request);
```

> [!CAUTION]
> **Ini bug bisnis kritis.** Jika monetisasi menjadi fokus V2, middleware ini harus diperbaiki. Saat ini 100% user bisa pakai platform gratis selamanya.

---

### 4. `DesignController::getPublishStatus()` — Query N+1 di Dashboard

**File:** [DesignController.php](file:///c:/List%20Project/larasena2.0/app/Http/Controllers/DesignController.php#L289-L304)

```php
// ❌ N+1 QUERY — Untuk setiap design, ada 1 query ke published_motifs
private function getPublishStatus($design)
{
    $filename = basename($design->image_url); // Juga fragile - bergantung pada basename

    $motif = PublishedMotif::where('user_id', $design->user_id)
        ->where(function ($query) use ($filename, $design) {
            $query->where('image_path', 'LIKE', '%' . $filename) // LIKE query tanpa index
                ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(design_data, '$.design_id')) = ?", [$design->id]);
        })->first();
    // ...
}
```

Jika user punya 20 desain → 20 query tambahan ke `published_motifs`. Query `LIKE '%filename'` juga tidak bisa pakai index (leading wildcard).

**Fix:**
```php
// ✅ SOLUSI — Load semua published motifs user sekaligus, lalu match di PHP
public function index()
{
    $designs = Design::where('user_id', Auth::id())->latest('updated_at')->get();

    // Load semua motif user sekali saja
    $publishedMotifs = PublishedMotif::where('user_id', Auth::id())
        ->select('id', 'status', 'design_data', 'image_path')
        ->get();

    $designs = $designs->map(function ($design) use ($publishedMotifs) {
        $design->published_status = $this->matchPublishStatus($design, $publishedMotifs);
        // ...
    });
}
```

---

## 🟠 HIGH — Perbaiki di Sprint 1-2

---

### 5. Dua Model Punya `getImageUrlAttribute()` yang Berbeda — DRY Violation

**Files:** [Design.php](file:///c:/List%20Project/larasena2.0/app/Models/Design.php) (80 baris patch) + [PublishedMotif.php](file:///c:/List%20Project/larasena2.0/app/Models/PublishedMotif.php) (60 baris patch)

Logika normalisasi URL ada di **dua tempat berbeda** dengan implementasi yang **tidak konsisten**. `Design.php` menangani kasus `localhost:8000` dan `larasena.id`; `PublishedMotif.php` tidak. Ini technical debt yang akan terus berkembang setiap kali ada path format baru.

**Fix — Buat satu trait:**
```php
// ✅ app/Traits/NormalizesStorageUrl.php — SINGLE SOURCE OF TRUTH
trait NormalizesStorageUrl
{
    protected function normalizeStorageUrl(?string $value): ?string
    {
        if (!$value) return null;
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            // Convert any localhost/127.0.0.1 → production domain via asset()
            if (preg_match('/\/storage\/(.+)$/', $value, $m)) {
                return asset('/storage/' . $m[1]);
            }
            return $value;
        }
        // Extract the clean relative path
        $cleaned = preg_replace('/^(storage\/)+/', '', $value);
        $cleaned = ltrim($cleaned, '/');
        return asset('/storage/' . $cleaned);
    }
}

// Lalu di Design.php dan PublishedMotif.php:
use NormalizesStorageUrl;

public function getImageUrlAttribute($value)
{
    return $this->normalizeStorageUrl($value ?: $this->attributes['image_path'] ?? null);
}
```

---

### 6. `AdminDashboardController` — Metric `total_motifs` Misleading

**File:** [AdminDashboardController.php](file:///c:/List%20Project/larasena2.0/app/Http/Controllers/Admin/AdminDashboardController.php#L22)

```php
'total_motifs' => Motif::count(), // ← Ini canvas elements, bukan gallery!
```

Dashboard admin menampilkan "Total Motif" tapi itu hitungan **canvas elements** (aset editor), bukan **published gallery** milik user. Ini misleading bagi admin yang ingin tahu seberapa aktif komunitas.

**Fix:**
```php
'total_canvas_elements'  => Motif::count(),
'total_gallery_published'=> PublishedMotif::approved()->count(),
'pending_moderation'     => PublishedMotif::pending()->count(), // Tambahkan ini!
```

---

### 7. `User::getProfilePhotoUrlAttribute()` — Path Sanitasi Tidak Konsisten

**File:** [User.php](file:///c:/List%20Project/larasena2.0/app/Models/User.php#L165)

```php
// ❌ Rentan menghasilkan double 'storage/'
return asset('storage/' . str_replace('storage/', '', $this->profile_photo));
```

Jika `profile_photo` = `storage/profiles/abc.jpg`, hasilnya `asset('storage/profiles/abc.jpg')` → benar.  
Tapi jika `profile_photo` = `profiles/abc.jpg`, `str_replace` tidak menghapus apapun, hasilnya tetap benar.  
Tapi jika `profile_photo` = `/storage/profiles/abc.jpg`, `str_replace('storage/', '', ...)` menghapus `storage/` dan sisanya `/profiles/abc.jpg`, lalu `asset('storage//profiles/abc.jpg')` → **double slash / broken URL**.

**Fix:**
```php
return asset('/storage/' . ltrim(
    str_replace(['storage/', '/storage/'], '', $this->profile_photo), '/'
));
// Atau lebih baik, gunakan trait NormalizesStorageUrl yang sama
```

---

### 8. Sitemap Tidak Di-Cache — Regenerasi Setiap Request

**File:** [SitemapController.php](file:///c:/List%20Project/larasena2.0/app/Http/Controllers/SitemapController.php)

Sitemap melakukan `PublishedMotif::approved()->orderBy('updated_at', 'desc')->get()` — full table scan **setiap kali** Google crawler mengaksesnya. Saat konten sudah ratusan, ini akan lambat.

**Fix:**
```php
public function index()
{
    $xml = Cache::remember('sitemap_xml', now()->addHours(6), function () {
        $motifs = PublishedMotif::approved()
            ->select('slug', 'updated_at', 'image_url', 'title', 'origin') // Pilih kolom yang perlu saja
            ->orderBy('updated_at', 'desc')
            ->get();
        // ... build XML ...
        return $xml;
    });

    return response($xml, 200)->header('Content-Type', 'application/xml; charset=UTF-8');
}

// Invalidate cache saat motif baru di-approve:
// Di PublishedMotif::approve() → Cache::forget('sitemap_xml');
```

---

## 🟡 MEDIUM — Masuk Sprint 3-4

---

### 9. `AdminMotifController` — `image_url` Disimpan Sebagai Full URL di Database

**File:** [AdminMotifController.php](file:///c:/List%20Project/larasena2.0/app/Http/Controllers/Admin/AdminMotifController.php#L87)

```php
Motif::create([
    'file_path' => $path,        // ✅ Relatif — benar
    'image_url' => $publicUrl,   // ❌ Full URL disimpan ke DB — ini akar masalah!
    'preview_image_path' => $publicUrl, // ❌ Sama
]);
```

Inilah **root cause** semua URL mess yang ada. Full URL disimpan ke database (`https://larasena.id/storage/...` atau `http://localhost:8000/storage/...`). Ketika environment berubah (local → production), URL menjadi invalid dan membutuhkan 60+ baris patch untuk dibersihkan.

**Fix sebenarnya:**
```php
// ✅ SELALU simpan relatif path ke DB, biarkan accessor yang konversi ke URL
Motif::create([
    'file_path' => $path,   // 'motifs/admin/filename.svg'
    'image_url' => $path,   // SAMA — simpan path relatif
]);
// Accessor getImageUrlAttribute() sudah handle konversi ke full URL
```

---

### 10. `DesignController::saveBase64Image()` — Tidak Ada Validasi Size/Format

**File:** [DesignController.php](file:///c:/List%20Project/larasena2.0/app/Http/Controllers/DesignController.php#L261-L273)

```php
private function saveBase64Image($base64, $folder)
{
    if (!$base64) return null;
    $data = substr($base64, strpos($base64, ',') + 1);
    $decoded = base64_decode($data);  // ← Tidak cek ukuran
    // ...
    Storage::disk('public')->put($filename, $decoded); // ← Bisa upload file apapun
}
```

Tidak ada validasi: ukuran file, apakah itu benar-benar gambar, atau apakah format base64-nya valid. User bisa upload file sangat besar atau bahkan non-image content.

**Fix:**
```php
private function saveBase64Image($base64, $folder): ?string
{
    if (!$base64) return null;

    // Validate base64 header
    if (!preg_match('/^data:image\/(jpeg|jpg|png|gif|webp);base64,/', $base64)) {
        throw new \InvalidArgumentException('Format gambar tidak valid.');
    }

    $data    = substr($base64, strpos($base64, ',') + 1);
    $decoded = base64_decode($data, strict: true);

    if ($decoded === false) throw new \InvalidArgumentException('Base64 tidak valid.');

    // Limit 5MB
    if (strlen($decoded) > 5 * 1024 * 1024) {
        throw new \InvalidArgumentException('Ukuran gambar melebihi 5MB.');
    }

    $filename = $folder . '/' . Auth::id() . '_' . time() . '.jpg';
    Storage::disk('public')->put($filename, $decoded);
    return $filename;
}
```

---

### 11. Sidebar — Dua Duplikasi Menu Definition

**File:** [Sidebar.jsx](file:///c:/List%20Project/larasena2.0/resources/js/layouts/User/Sidebar.jsx)

Menu items didefinisikan **dua kali**: `menuGroups` (untuk desktop sidebar) dan `mainBottomNavItems` + `otherMenuItems` (untuk mobile). Jika ada perubahan menu, harus update di 3 tempat berbeda. Ini sudah menyebabkan inkonsistensi: `mainBottomNavItems` punya 'Produksi' tapi tidak ada di `menuGroups` main.

**Fix:**
```jsx
// ✅ Single source of truth
const NAV_CONFIG = [
  { name: 'Nyanting', href: '/dashboard', icon: NyantingIcon, mobileVisible: true, group: 'main' },
  { name: 'Sanggar',  href: '/upload',    icon: SanggarIcon,  mobileVisible: true, group: 'main' },
  // ...
];

// Derive semua list dari NAV_CONFIG
const mobileBottomItems  = NAV_CONFIG.filter(i => i.mobileVisible);
const desktopSidebarItems = NAV_CONFIG; // semua
```

---

### 12. `PublishedMotifController::gallery()` — Load Semua Record Tanpa Pagination

**File:** [PublishedMotifController.php](file:///c:/List%20Project/larasena2.0/app/Http/Controllers/PublishedMotifController.php#L259)

```php
$motifs = $query->get()->map(function ($motif) { ... }); // ← get() tanpa limit
```

Saat gallery sudah punya 500+ motif, ini akan load semua ke memory, kirim semua ke frontend via Inertia, dan browser harus render semua sekaligus. Ini akan sangat lambat.

**Fix:**
```php
// ✅ Untuk infinite scroll, gunakan cursor pagination
$motifs = $query->cursorPaginate(24); // atau simplePaginate(24)

// Di frontend, tambahkan IntersectionObserver untuk load lebih
```

---

### 13. Gallery Filter Kategori — Masih Hardcoded di Frontend

**File:** [Gallery.jsx](file:///c:/List%20Project/larasena2.0/resources/js/pages/Motif/Published/Gallery.jsx#L52-L57)

```jsx
// ❌ Hardcoded — tidak sinkron dengan data di database
const categories = [
    { id: 'all',          name: 'Semua Motif' },
    { id: 'parang',       name: 'Parang' },
    { id: 'kawung',       name: 'Kawung' },
    { id: 'mega_mendung', name: 'Mega Mendung' },
];
```

Dan filter ini tidak benar-benar query ke backend — hanya client-side filter berdasarkan `motif.title.toLowerCase().includes(activeCategory)`. Ini rentan dan tidak scalable.

**Fix:**
```php
// Controller: Kirim kategori dari DB
return Inertia::render('Motif/Published/Gallery', [
    'motifs'     => $motifs,  // sudah dipaginate
    'categories' => \App\Models\MotifCategory::orderBy('name')->get(['id', 'name', 'slug']),
    'filters'    => ['sort' => $sort, 'category' => $request->category],
]);
```

```jsx
// Frontend: Terima dari props
export default function Gallery({ motifs, categories, filters }) {
    // Filter via router ke backend, bukan client-side
    const handleCategory = (slug) => router.get(route('published-motifs.gallery'), { category: slug });
}
```

---

### 14. `UploadMotifController` vs `PublishedMotifController` — Duplikasi Logika

Ada **dua controller** yang melakukan hal sama (upload & manage `published_motifs`):

| Controller | Route | Fungsi |
|---|---|---|
| `UploadMotifController` | `/upload` | Upload motif, list motif user, delete |
| `PublishedMotifController` | `/motif/publish` | Submit motif, view gallery, like, show |

Keduanya beroperasi pada model yang sama (`PublishedMotif`) dengan logika yang hampir identik. Ini menyebabkan ketidakkonsistenan: `UploadMotifController::store()` hardcode random slug (bug #1), sementara `PublishedMotifController::store()` tidak.

**Fix:** Merge ke satu controller `GalleryController` dengan method yang terdefinisi jelas.

---

### 15. `Subscription.php` — Line Endings CRLF vs LF Campur

**Files:** [Subscription.php](file:///c:/List%20Project/larasena2.0/app/Models/Subscription.php), [BillingController.php](file:///c:/List%20Project/larasena2.0/app/Http/Controllers/BillingController.php), [EnsureSubscriptionIsActive.php](file:///c:/List%20Project/larasena2.0/app/Http/Middleware/EnsureSubscriptionIsActive.php)

File billing menggunakan **Windows CRLF** (`\r\n`) sementara file lain menggunakan Unix LF (`\n`). Ini menyebabkan masalah saat deploy ke Linux server dan bisa menyebabkan diff yang besar di git.

**Fix:**
```bash
# Di .gitattributes (sudah ada file ini):
*.php text=auto eol=lf
# Lalu normalize semua file:
git add --renormalize .
```

---

## 🟢 ENHANCEMENT — Nice-to-Have

---

### 16. Tidak Ada Rate Limiting pada Endpoint Kritis

Route berikut tidak punya rate limiting:
- `POST /motif/{motif}/like` — bisa di-spam untuk manipulasi like count
- `POST /designs/ai` / `POST /api/batik-generator` — bisa memicu API calls yang mahal secara berulang
- `POST /billing/invoice` — bisa trigger banyak Xendit invoice creation

**Fix:**
```php
// Di routes/web.php
Route::post('/motif/{motif}/like', [...])
    ->middleware('throttle:30,1'); // max 30 likes per menit

Route::post('/api/batik-generator', [...])
    ->middleware('throttle:10,1'); // max 10 AI generations per menit
```

---

### 17. `AdminDashboardController` — `total_revenue` dari Production, Bukan Subscription

```php
'total_revenue' => Production::where('payment_status', 'paid')->sum('total_price'),
```

Revenue yang ditampilkan di admin dashboard adalah revenue dari **order produksi konveksi**, bukan dari **subscription Larasena**. Seharusnya ada dua metric terpisah:

```php
'production_revenue'    => Production::where('payment_status', 'paid')->sum('total_price'),
'subscription_revenue'  => Subscription::where('status', 'active')->sum('monthly_amount'),
'mrr'                   => Subscription::where('status', 'active')
                            ->where('subscription_ends_at', '>', now())
                            ->sum('monthly_amount'), // Monthly Recurring Revenue
```

---

### 18. Tidak Ada `withCount` — Banyak `likes_count` Disimpan Denormalisasi

Saat ini `likes_count` dan `views_count` disimpan langsung di tabel `published_motifs` dan di-increment/decrement manual. Ini bisa menyebabkan race condition (dua user like secara bersamaan bisa menghasilkan count yang salah).

**Fix (untuk scale):**
```php
// Gunakan withCount() untuk count real-time, atau
// Gunakan atomic increment yang sudah ada tapi tambahkan database transaction:

DB::transaction(function () use ($motif, $user) {
    $like = MotifLike::firstOrCreate([...]);
    $motif->increment('likes_count'); // Atomic di level DB
});

// Untuk high-traffic: Pindahkan ke Redis counter + periodic sync ke DB
```

---

## Ringkasan Prioritas Tambahan

| # | Temuan | Severity | Sprint |
|---|---|---|---|
| 1 | Random slug di UploadMotifController | 🔴 Critical | Sprint 1 |
| 2 | Relasi `publishedMotif()` tidak valid di Design | 🔴 Critical | Sprint 1 |
| 3 | Middleware billing tidak enforce apapun | 🔴 Critical | Sprint 1 |
| 4 | N+1 query di dashboard | 🟠 High | Sprint 1 |
| 5 | DRY violation — buat `NormalizesStorageUrl` trait | 🟠 High | Sprint 1 |
| 6 | Admin dashboard metric misleading | 🟠 High | Sprint 2 |
| 7 | `getProfilePhotoUrlAttribute` path bug | 🟠 High | Sprint 1 |
| 8 | Sitemap tidak di-cache | 🟠 High | Sprint 2 |
| 9 | Full URL disimpan di DB (root cause storage bug) | 🟠 High | Sprint 1 |
| 10 | Base64 upload tanpa validasi | 🟡 Medium | Sprint 2 |
| 11 | Duplikasi menu definition di Sidebar | 🟡 Medium | Sprint 3 |
| 12 | Gallery tidak paginated | 🟡 Medium | Sprint 2 |
| 13 | Filter kategori hardcoded & client-side | 🟡 Medium | Sprint 2 |
| 14 | Duplikasi controller (Upload vs Published) | 🟡 Medium | Sprint 2 |
| 15 | CRLF line ending campur | 🟡 Medium | Sprint 1 |
| 16 | Tidak ada rate limiting | 🟢 Enhancement | Sprint 4 |
| 17 | Admin revenue metric tidak lengkap | 🟢 Enhancement | Sprint 4 |
| 18 | Race condition likes counter | 🟢 Enhancement | Sprint 4 |
