# Fitur Upload Motif

## 📋 Deskripsi
Fitur baru untuk mengupload motif batik secara terpisah dari dashboard utama. Motif yang diupload akan melalui proses verifikasi oleh admin sebelum dipublikasikan ke galeri publik.

## ✨ Fitur Utama

### 1. **Menu Upload Motif**
- Lokasi: Sidebar menu (setelah "Batik Saya")
- Icon: Upload
- Route: `/motif/upload`

### 2. **Upload Motif Baru**
**Halaman:** `/motif/upload/create`

**Form Input:**
- Nama Motif (required)
- Asal Daerah (required)
- Kategori dropdown (required):
  - Parang
  - Kawung
  - Mega Mendung
  - Truntum
  - Sekar Jagad
  - Sido Mukti
  - Batik Modern
  - Lainnya
- Filosofi & Makna (textarea, min 50 karakter, required)
- Upload Gambar (JPG/PNG, max 5MB, required)

**Validasi:**
- Resolusi minimal: 800x800px (recommended)
- Format: JPG, PNG
- Ukuran maksimal: 5MB
- Preview gambar sebelum upload
- Hapus dan upload ulang gambar

### 3. **Daftar Motif yang Diupload**
**Halaman:** `/motif/upload`

**Fitur:**
- **Stats Cards** dengan filter:
  - Total Motif
  - Pending (menunggu review)
  - Approved (disetujui)
  - Rejected (ditolak)

- **Status Badge** untuk setiap motif:
  - 🟡 Pending: Menunggu Review
  - 🟢 Approved: Disetujui
  - 🔴 Rejected: Ditolak

- **Info untuk Approved motifs:**
  - Views count (👁️)
  - Likes count (❤️)
  - Tombol "Lihat di Gallery" → redirect ke halaman public gallery

- **Info untuk Rejected motifs:**
  - Alasan penolakan dari admin

- **Actions:**
  - Delete motif (🗑️)

### 4. **Status Motif**

#### Pending
- Status default setelah upload
- Menunggu review dari admin
- Tidak muncul di galeri publik
- User bisa melihat di halaman "Upload Motif"

#### Approved
- Disetujui oleh admin
- Muncul di galeri publik
- User bisa tracking views & likes
- Link ke halaman detail di gallery

#### Rejected
- Ditolak oleh admin
- Tidak muncul di galeri publik
- User bisa melihat alasan penolakan
- User bisa hapus dan upload ulang

## 🗂️ File Structure

```
app/
├── Http/Controllers/
│   └── UploadMotifController.php
├── Models/
│   └── PublishedMotif.php (updated)

resources/js/pages/
├── Motif/
│   └── Upload/
│       ├── Index.jsx    (Daftar motif yang diupload)
│       └── Create.jsx   (Form upload motif baru)

resources/js/layouts/User/
└── Sidebar.jsx (updated - tambah menu Upload Motif)

routes/
└── web.php (updated - tambah routes upload motif)

database/migrations/
└── 2025_11_28_140614_add_category_to_published_motifs_table.php
```

## 🔄 Workflow

1. **User Upload Motif:**
   ```
   User → Upload Motif (Form) → Submit → Status: Pending
   ```

2. **Admin Review:**
   ```
   Admin → Review Motif → Approve/Reject
   ```

3. **Motif Approved:**
   ```
   Status: Approved → Muncul di Gallery → User tracking views & likes
   ```

4. **Motif Rejected:**
   ```
   Status: Rejected → User lihat alasan → Hapus & Upload ulang
   ```

## 📊 Database Schema

### Table: `published_motifs`

**Kolom Baru:**
- `category` VARCHAR(255) NULLABLE

**Kolom Existing:**
- `user_id`
- `title`
- `slug`
- `philosophy`
- `origin`
- `image_url`
- `status` (pending/approved/rejected)
- `rejection_reason`
- `views_count`
- `likes_count`
- `is_featured`
- `published_at`

## 🎯 UX Benefits

### Pemisahan Menu
- ✅ Menu "Batik Saya" untuk desain dari canvas editor
- ✅ Menu "Upload Motif" khusus untuk upload gambar motif
- ✅ Tidak menumpuk di satu menu
- ✅ Clear separation of concerns

### User Experience
- ✅ Preview gambar sebelum submit
- ✅ Validasi real-time
- ✅ Info cards dengan stats
- ✅ Filter berdasarkan status
- ✅ Alasan penolakan jelas
- ✅ Tracking performa motif (views & likes)

## 🔗 Routes

```php
// Upload Motif Routes (User)
Route::get('/motif/upload', [UploadMotifController::class, 'index'])
    ->name('motif.upload.index');
    
Route::get('/motif/upload/create', [UploadMotifController::class, 'create'])
    ->name('motif.upload.create');
    
Route::post('/motif/upload', [UploadMotifController::class, 'store'])
    ->name('motif.upload.store');
    
Route::delete('/motif/upload/{motif}', [UploadMotifController::class, 'destroy'])
    ->name('motif.upload.destroy');
```

## 🚀 Cara Menggunakan

### Untuk User:

1. **Upload Motif Baru:**
   - Klik menu "Upload Motif" di sidebar
   - Klik tombol "Upload Motif Baru"
   - Isi form lengkap
   - Upload gambar
   - Submit

2. **Cek Status Motif:**
   - Buka menu "Upload Motif"
   - Lihat stats cards
   - Filter berdasarkan status (All/Pending/Approved/Rejected)

3. **Tracking Performa:**
   - Untuk motif approved, lihat views & likes count
   - Klik "Lihat di Gallery" untuk ke halaman publik

### Untuk Admin:
- Review motif pending di Admin Dashboard
- Approve/Reject dengan alasan
- Motif approved otomatis muncul di gallery

## 📝 Notes

- Proses verifikasi biasanya 1-3 hari kerja
- Tips upload gambar berkualitas tinggi (min 800x800px)
- Format file: JPG, PNG (max 5MB)
- Filosofi minimal 50 karakter untuk kualitas konten

## 🐛 Testing Checklist

- [ ] Upload motif dengan gambar valid
- [ ] Upload motif tanpa gambar (error validation)
- [ ] Upload gambar > 5MB (error validation)
- [ ] View daftar motif dengan filter
- [ ] Delete motif
- [ ] Admin approve motif
- [ ] Admin reject motif dengan alasan
- [ ] User lihat alasan reject
- [ ] Motif approved muncul di gallery
- [ ] Tracking views & likes untuk approved motif
