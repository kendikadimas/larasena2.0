# SEO Implementation untuk Galeri Motif Larasena

## Overview
Implementasi dynamic Open Graph (OG) dan Twitter Card meta tags untuk setiap halaman detail motif batik, memastikan thumbnail gambar motif muncul saat di-share di social media (WhatsApp, Facebook, Twitter/X, Discord, Telegram, dll).

## Masalah yang Diselesaikan

### ❌ Sebelumnya
- Meta tags di-render oleh React (client-side)
- Social media crawlers tidak menjalankan JavaScript
- Meta tags tidak terbaca oleh WhatsApp, Facebook, Twitter, dll
- Share motif hanya menunjukkan thumbnail default website, bukan gambar motif

### ✅ Sekarang
- Meta tags di-render oleh Blade (server-side)
- Social media crawlers membaca meta tags langsung dari HTML
- Setiap halaman detail motif memiliki metadata unik
- Saat share, muncul thumbnail gambar motif beserta judul dan deskripsi

## Implementasi Teknis

### 1. **PublishedMotifController** (`app/Http/Controllers/PublishedMotifController.php`)

#### Untuk halaman detail motif (`show` method)
```php
// Prepare SEO meta data
$metaTitle = "{$motif->title} — Larasena";
$metaDescription = substr($motif->philosophy, 0, 160) ?: "Pelajari filosofi dan makna motif batik {$motif->title} dari {$motif->origin} di Larasena.";
$metaImage = $motif->image_url;
$metaUrl = route('published-motifs.show', $motif->slug);

// Share meta data to Blade view for server-side rendering
view()->share('pageMeta', [
    'title' => $metaTitle,
    'description' => $metaDescription,
    'image' => $metaImage,
    'url' => $metaUrl,
    'type' => 'article',
]);

return Inertia::render('Motif/Published/Show', [
    // ... props
    'meta' => [
        'title' => $metaTitle,
        'description' => $metaDescription,
        'image' => $metaImage,
        'url' => $metaUrl,
        'type' => 'article',
    ]
]);
```

#### Untuk halaman galeri motif (`gallery` method)
```php
view()->share('pageMeta', [
    'title' => 'Galeri Motif Batik — Larasena',
    'description' => 'Jelajahi koleksi motif batik nusantara dengan filosofi mendalam. Temukan inspirasi desain batik dari berbagai daerah dan makna budayanya.',
    'image' => asset('images/larasena-icon.svg'),
    'url' => route('published-motifs.gallery'),
    'type' => 'website',
]);
```

### 2. **Blade Template** (`resources/views/app.blade.php`)

Menambahkan conditional rendering untuk dynamic meta tags:

```blade
@if(isset($pageMeta))
    {{-- Dynamic Meta Tags for Individual Pages (SEO-friendly for social media crawlers) --}}
    <title inertia>{{ $pageMeta['title'] }}</title>
    
    <meta name="title" content="{{ $pageMeta['title'] }}">
    <meta name="description" content="{{ $pageMeta['description'] }}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="{{ $pageMeta['type'] ?? 'website' }}">
    <meta property="og:url" content="{{ $pageMeta['url'] }}">
    <meta property="og:title" content="{{ $pageMeta['title'] }}">
    <meta property="og:description" content="{{ $pageMeta['description'] }}">
    <meta property="og:image" content="{{ $pageMeta['image'] }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $pageMeta['title'] }}">
    <meta name="twitter:description" content="{{ $pageMeta['description'] }}">
    <meta name="twitter:image" content="{{ $pageMeta['image'] }}">
@else
    {{-- Default Meta Tags (Homepage & Other Pages) --}}
    <!-- Default tags... -->
@endif
```

### 3. **React Component** (`resources/js/pages/Motif/Published/Show.jsx`)

Update component untuk receive dan use `meta` props:

```jsx
export default function Show({ motif, relatedMotifs, user, meta }) {
    // Use meta data from props
    const shareUrl = meta?.url || window.location.href;
    const shareText = meta?.description || `...`;
    
    return (
        <div>
            <Head>
                <title>{meta?.title || `${motif.title} - Larasena`}</title>
                <meta name="title" content={meta?.title || `${motif.title} — Larasena`} />
                <meta name="description" content={meta?.description || shareText} />
                {/* ... other meta tags using meta props */}
            </Head>
            {/* Rest of component */}
        </div>
    );
}
```

## Spesifikasi Meta Tags

### Open Graph (untuk Facebook, WhatsApp)
```html
<meta property="og:type" content="article">
<meta property="og:url" content="https://larasena.id/galeri-motif/parang-rusak">
<meta property="og:title" content="Parang Rusak — Larasena">
<meta property="og:description" content="Pelajari filosofi dan makna motif batik Parang Rusak dari Solo.">
<meta property="og:image" content="https://larasena.id/storage/published-motifs/parang-rusak.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

### Twitter Card (untuk Twitter/X)
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://larasena.id/galeri-motif/parang-rusak">
<meta name="twitter:title" content="Parang Rusak — Larasena">
<meta name="twitter:description" content="Pelajari filosofi dan makna motif batik Parang Rusak dari Solo.">
<meta name="twitter:image" content="https://larasena.id/storage/published-motifs/parang-rusak.jpg">
```

## Spesifikasi Gambar OG (Thumbnail)

- **Ukuran ideal:** 1200 x 630 px
- **Aspect ratio:** 1.91:1
- **Format:** JPG/PNG (JPG lebih ringan)
- **Size:** < 5MB
- **URL:** Public (bukan localhost)
- **Contoh:** `https://larasena.id/storage/published-motifs/parang-rusak.jpg`

## Testing & Verification

### 1. Facebook Debugger
- URL: https://developers.facebook.com/tools/debug/
- Langkah:
  1. Paste URL galeri motif (contoh: https://larasena.id/galeri-motif/parang-rusak)
  2. Lihat apakah thumbnail gambar motif muncul
  3. Verify title, description, dan image yang ditampilkan sudah benar
  4. Klik "Scrape Again" untuk force refresh cache

### 2. Twitter Card Validator
- URL: https://cards-dev.twitter.com/validator
- Langkah:
  1. Paste URL galeri motif
  2. Verify bahwa card menampilkan gambar motif, title, dan description
  3. Pastikan card type adalah "summary_large_image"

### 3. Curl / Command Line Test
```bash
curl -I https://larasena.id/galeri-motif/parang-rusak
# Cek response headers, pastikan meta tags ada

curl https://larasena.id/galeri-motif/parang-rusak | grep -i "og:image"
# Verify OG image meta tag
```

### 4. WhatsApp Preview
- Kirim link ke WhatsApp
- Pastikan thumbnail gambar motif muncul, bukan gambar default website

## Performance Considerations

### Caching
- Social media crawlers me-cache meta tags
- Jika update meta tags, perlu force crawlers untuk re-scrape
- Facebook: Gunakan Facebook Debugger "Scrape Again"
- Twitter: Meta tags di-cache, mungkin butuh beberapa jam

### Image Optimization
- Pastikan image_url di database sudah correct
- Image harus public accessible (ada di /storage/public/...)
- Consider menggunakan CDN atau image optimization service untuk performa lebih baik

### SEO Hints
- Gunakan unique title dan description untuk setiap motif
- Pastikan deskripsi <= 160 characters untuk tampil optimal di social media
- Gunakan keywords yang relevan di title dan description
- Pastikan canonical URL sudah correct

## Routes yang Sudah Diimplementasikan

1. **Detail Motif**
   - Route: `GET /galeri-motif/{slug}`
   - Name: `published-motifs.show`
   - Controller: `PublishedMotifController@show`

2. **Gallery**
   - Route: `GET /galeri-motif`
   - Name: `published-motifs.gallery`
   - Controller: `PublishedMotifController@gallery`

## File-File yang Dimodifikasi

1. ✅ `app/Http/Controllers/PublishedMotifController.php` - Add meta data sharing
2. ✅ `resources/views/app.blade.php` - Dynamic meta tags rendering
3. ✅ `resources/js/pages/Motif/Published/Show.jsx` - Accept meta props
4. ✅ `resources/js/pages/Motif/Published/Gallery.jsx` - (optional, sudah inherit dari app.blade.php)

## Next Steps (Opsional)

1. **Image Optimization Service**
   - Implementasi automatic thumbnail generation saat upload motif
   - Resize image ke 1200x630 untuk OG image
   - Optimize image size untuk faster loading

2. **Sitemap & Robots.txt**
   - Pastikan sitemap sudah include semua halaman detail motif
   - Robots.txt allow crawling untuk /galeri-motif

3. **Schema.org Structured Data**
   - Add JSON-LD untuk Creative Work atau Article schema
   - Ini membantu search engines memahami content lebih baik

4. **Mobile Responsiveness**
   - Pastikan gallery dan detail motif sudah fully responsive
   - Test di berbagai mobile devices

## Troubleshooting

### Meta tags tidak muncul saat di-share
- Check apakah image_url di database sudah correct dan accessible
- Verify URL sudah public (bukan localhost)
- Gunakan Facebook Debugger untuk debug
- Clear cache browser

### Gambar tidak muncul di social media
- Verify image format (JPG/PNG)
- Check image ukuran dan aspect ratio
- Ensure image accessible dari URL public
- Try upload image baru dengan ukuran yang correct

### Title/Description tidak benar
- Check apakah view()->share() di-call sebelum Inertia::render()
- Verify pageMeta structure di Blade template
- Check pagination handling untuk gallery

---

**Dibuat:** 2026-05-02
**Status:** ✅ Implemented & Ready for Testing
