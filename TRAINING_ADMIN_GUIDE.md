# 📚 Panduan Admin - Sistem Pelatihan Batik

## 🎯 Overview
Sistem pelatihan batik interaktif dengan 3 level (Dasar, Menengah, Lanjutan) yang memungkinkan pengguna belajar batik melalui teori, praktik canvas, dan kuis.

---

## 📊 Database Structure

### 1. Training Courses (`training_courses`)
```sql
- id (bigint, primary key)
- title (varchar 255)
- slug (varchar 255, unique)
- description (text)
- thumbnail (varchar 255, nullable)
- level (enum: dasar, menengah, lanjutan)
- is_published (boolean, default false)
- created_at, updated_at
```

### 2. Training Lessons (`training_lessons`)
```sql
- id (bigint, primary key)
- training_course_id (foreign key)
- title (varchar 255)
- slug (varchar 255)
- description (text, nullable)
- type (enum: theory, practice, quiz)
- content (text, nullable) - untuk theory
- video_url (varchar 255, nullable)
- canvas_data (json, nullable) - untuk practice
- order (integer)
- duration (integer) - dalam menit
- created_at, updated_at
```

### 3. Training Progress (`training_progress`)
```sql
- id (bigint, primary key)
- user_id (foreign key)
- training_course_id (foreign key)
- training_lesson_id (foreign key)
- canvas_work (json, nullable) - hasil praktik canvas
- completed (boolean, default false)
- completed_at (timestamp, nullable)
- created_at, updated_at
- unique: user_id + training_lesson_id
```

### 4. Training Certificates (`training_certificates`)
```sql
- id (bigint, primary key)
- user_id (foreign key)
- training_course_id (foreign key)
- certificate_number (varchar 255, unique) - CERT-BATIK-YYYYMMDD-RANDOM6
- issued_at (timestamp)
- created_at, updated_at
- unique: user_id + training_course_id
```

---

## 🎨 Canvas Configuration (JSON Structure)

Untuk lesson dengan `type = 'practice'`, isi `canvas_data` dengan JSON berikut:

```json
{
  "tools": ["brush", "eraser", "fill", "motif"],
  "motifs": [
    {
      "id": 1,
      "src": "/images/motifs/kawung.png",
      "name": "Kawung",
      "thumbnail": "/images/motifs/kawung-thumb.png"
    },
    {
      "id": 2,
      "src": "/images/motifs/parang.png",
      "name": "Parang",
      "thumbnail": "/images/motifs/parang-thumb.png"
    }
  ],
  "instructions": "Gambarlah motif batik kawung dengan menggunakan brush tools. Perhatikan simetri dan proporsi motif.",
  "canvas_size": {
    "width": 800,
    "height": 600
  },
  "background": "#FFFFFF",
  "grid": {
    "enabled": true,
    "size": 50,
    "color": "#CCCCCC"
  }
}
```

### Canvas Tools Available:
1. **brush** - Kuas untuk menggambar
   - Ukuran: 1-50px
   - Warna: Palet warna batik + custom
   - Opacity: 10-100%

2. **eraser** - Penghapus
   - Ukuran: 1-50px

3. **fill** - (Future feature) Paint bucket

4. **motif** - (Future feature) Drag & drop motif library

5. **grid** - Grid helper untuk simetri
   - Toggle on/off
   - Ukuran grid: 50px (default)

### Batik Color Palette:
- `#000000` - Hitam
- `#8B4513` - Coklat Tua
- `#D2691E` - Coklat
- `#BA682A` - Coklat Larasena
- `#F4A460` - Sandy Brown
- `#FFFFE0` - Kuning Muda
- `#FFFFFF` - Putih
- `#4A90E2` - Biru
- `#E74C3C` - Merah
- `#2ECC71` - Hijau

---

## 🔐 API Endpoints

### User Endpoints

#### 1. Browse Training Courses
```
GET /pelatihan
```
**Response:** Halaman dengan list semua kursus (published)

#### 2. View Course Detail
```
GET /pelatihan/{course_slug}
```
**Response:** Detail kursus + list lessons + user progress

#### 3. View Lesson
```
GET /pelatihan/{course_slug}/lesson/{lesson_slug}
```
**Response:** Lesson content (theory/practice/quiz) + canvas editor

#### 4. Save Lesson Progress
```
POST /pelatihan/{course_slug}/lesson/{lesson_slug}/progress
Body: { canvas_work: { canvas_state: "data:image/png;base64..." } }
```
**Logic:**
- Simpan progress lesson
- Mark lesson as completed
- Update course progress percentage
- Jika progress = 100%, auto-generate certificate

#### 5. View Certificates
```
GET /sertifikat
```
**Response:** List semua sertifikat user

#### 6. View Certificate Detail
```
GET /sertifikat/{certificate_id}
```
**Response:** Certificate page (public view)

#### 7. Download Certificate PDF
```
GET /sertifikat/{certificate_id}/download
```
**Response:** PDF file (Future: generate dengan mPDF/DomPDF)

---

### Admin Endpoints

#### 1. Course Management
```
GET    /admin-training                     - List all courses
GET    /admin-training/create              - Create form
POST   /admin-training                     - Store course
GET    /admin-training/{id}/edit           - Edit form
PUT    /admin-training/{id}                - Update course
DELETE /admin-training/{id}                - Delete course
POST   /admin-training/{id}/toggle-publish - Toggle publish status
```

#### 2. Lesson Management
```
GET    /admin-training/{course_id}/lessons           - List lessons
GET    /admin-training/{course_id}/lessons/create    - Create form
POST   /admin-training/{course_id}/lessons           - Store lesson
GET    /admin-training/{course_id}/lessons/{id}/edit - Edit form
PUT    /admin-training/{course_id}/lessons/{id}      - Update lesson
DELETE /admin-training/{course_id}/lessons/{id}      - Delete lesson
```

---

## 🎓 Level System

### Level Dasar (Beginner) 🌱
- **Color:** Green (`from-green-500 to-emerald-600`)
- **Materi:** Pengenalan batik, sejarah, alat dasar, motif sederhana
- **Canvas:** Latihan garis, titik, motif dasar (kawung, truntum)
- **Target:** Pemula tanpa pengalaman

### Level Menengah (Intermediate) 🔥
- **Color:** Amber (`from-amber-500 to-orange-600`)
- **Materi:** Teknik canting, pewarnaan, motif kompleks
- **Canvas:** Kombinasi motif, simetri, komposisi
- **Target:** Sudah menguasai dasar

### Level Lanjutan (Advanced) ⚡
- **Color:** Red (`from-red-500 to-rose-600`)
- **Materi:** Teknik tradisional kompleks, inovasi modern
- **Canvas:** Kreasi motif original, kombinasi advanced
- **Target:** Expert level

---

## 🏆 Progress & Certificate System

### Progress Tracking
1. User membuka lesson
2. User menyelesaikan lesson (tandai selesai / save canvas)
3. System mark `training_progress.completed = true`
4. System calculate course progress: `(completed_lessons / total_lessons) * 100`
5. Update `user_progress` di course

### Certificate Generation
**Trigger:** Ketika course progress = 100%

**Logic:**
```php
if ($course->progress_percentage == 100) {
    TrainingCertificate::firstOrCreate([
        'user_id' => $user->id,
        'training_course_id' => $course->id
    ], [
        'certificate_number' => 'CERT-BATIK-' . date('Ymd') . '-' . strtoupper(Str::random(6)),
        'issued_at' => now()
    ]);
}
```

**Certificate Number Format:**
```
CERT-BATIK-20250114-AB12CD
│    │     │        └─ Random 6 chars
│    │     └─ Date (YYYYMMDD)
│    └─ Category
└─ Prefix
```

---

## 🎨 Frontend Features

### CanvasEditor Component
**Location:** `/resources/js/Components/Training/CanvasEditor.jsx`

**Features:**
- ✅ Native HTML5 Canvas (no external library)
- ✅ Brush tool (size, color, opacity)
- ✅ Eraser tool
- ✅ Grid toggle
- ✅ Undo/Redo (history stack)
- ✅ Clear canvas
- ✅ Download as PNG
- ✅ Save to backend (base64 image)
- ✅ Load previous work
- ✅ Batik color palette
- 🚧 Fill tool (future)
- 🚧 Drag & drop motifs (future)
- 🚧 Reference image overlay (future)

### User Pages
1. **Training/Index.jsx** - Course list with filters
2. **Training/Detail.jsx** - Course detail with lessons
3. **Training/Lesson.jsx** - Interactive lesson page
4. **Training/Certificates.jsx** - Certificate collection
5. **Training/ShowCertificate.jsx** - Individual certificate view

---

## 🔧 Admin How-To Guide

### Membuat Kursus Baru

1. **Akses Admin Panel**
   ```
   POST /admin-training/create
   ```

2. **Isi Form Kursus**
   - Title: "Batik Dasar: Motif Kawung"
   - Description: "Pelajari teknik dasar membuat motif kawung..."
   - Thumbnail: Upload gambar (recommended: 800x600px)
   - Level: Pilih dasar/menengah/lanjutan
   - Published: Centang jika siap publish

3. **Save Course**

### Menambah Lesson

1. **Akses Lesson Management**
   ```
   GET /admin-training/{course_id}/lessons/create
   ```

2. **Pilih Tipe Lesson**

   **A. Theory Lesson**
   - Type: `theory`
   - Content: Rich text editor (HTML)
   - Video URL: (optional) YouTube/Vimeo embed URL
   - Duration: Estimasi menit

   **B. Practice Lesson (Canvas)**
   - Type: `practice`
   - Canvas Data: JSON config (lihat struktur di atas)
   - Instructions: Petunjuk praktik
   - Duration: Estimasi menit

   **C. Quiz Lesson**
   - Type: `quiz`
   - (Future feature)

3. **Set Order**
   - Order: 1, 2, 3, ... (urutan tampil)
   - System akan lock lesson jika previous lesson belum selesai

### Canvas Configuration Example

**Example 1: Latihan Garis Dasar**
```json
{
  "tools": ["brush", "eraser"],
  "instructions": "Latihan membuat garis lurus dan lengkung sebagai dasar motif batik",
  "canvas_size": { "width": 800, "height": 600 },
  "background": "#FFFFFF",
  "grid": { "enabled": true, "size": 50, "color": "#CCCCCC" }
}
```

**Example 2: Membuat Motif Kawung**
```json
{
  "tools": ["brush", "eraser"],
  "motifs": [
    {
      "id": 1,
      "src": "/images/motifs/kawung-reference.png",
      "name": "Referensi Kawung"
    }
  ],
  "instructions": "Gambarlah motif kawung mengikuti referensi. Perhatikan proporsi lingkaran dan jarak antar motif.",
  "canvas_size": { "width": 1000, "height": 800 },
  "background": "#FFF9E6",
  "grid": { "enabled": true, "size": 100, "color": "#E0E0E0" }
}
```

---

## 📱 UI/UX Features

### Sidebar Menu
- **Icon:** GraduationCap (Lucide React)
- **Color:** Green gradient (`from-green-500 to-emerald-600`)
- **Badge:** "New" (green, pulsing animation)
- **Route:** `/pelatihan`

### Certificate Menu
- **Icon:** Award (Lucide React)
- **Color:** Blue gradient (`from-blue-500 to-indigo-600`)
- **Route:** `/sertifikat`

### Lesson Type Indicators
- **Theory:** BookOpen icon, blue color
- **Practice:** Palette icon, brown/amber color
- **Quiz:** CheckCircle2 icon, purple color

### Progress Indicators
- Percentage bar (green gradient)
- Lock icon untuk lesson yang belum accessible
- CheckCircle icon untuk completed lesson

---

## 🚀 Future Enhancements

### Phase 1 (Current) ✅
- [x] Database structure
- [x] Backend API
- [x] Canvas editor (native HTML5)
- [x] Progress tracking
- [x] Auto-certificate generation
- [x] User interfaces

### Phase 2 (Next) 🚧
- [ ] Admin UI (CRUD courses & lessons)
- [ ] Rich text editor untuk theory content
- [ ] Image upload untuk thumbnails
- [ ] Canvas motif library (drag & drop)
- [ ] Fill/paint bucket tool
- [ ] Reference image overlay

### Phase 3 (Future) 🔮
- [ ] Quiz system dengan scoring
- [ ] Certificate PDF generation (mPDF/DomPDF)
- [ ] Certificate verification QR code
- [ ] Social sharing integration
- [ ] Leaderboard/gamification
- [ ] Video streaming integration
- [ ] Mobile app responsive canvas (touch support)
- [ ] AI-powered feedback on canvas work
- [ ] Collaborative drawing rooms

---

## 🐛 Troubleshooting

### Issue: Canvas tidak bisa save
**Solution:** Check browser console, pastikan canvas_state ter-generate dengan benar (base64 image)

### Issue: Lesson terkunci padahal sudah selesai sebelumnya
**Solution:** Check `training_progress` table, pastikan `completed = true` untuk lesson sebelumnya

### Issue: Certificate tidak auto-generate
**Solution:** Check course progress calculation, pastikan semua lessons completed

### Issue: Canvas gambar hilang setelah refresh
**Solution:** Pastikan user sudah klik "Simpan" untuk save canvas_state ke database

---

## 📞 Support

Untuk pertanyaan atau bug report, hubungi tim development Larasena.

---

**Last Updated:** 14 November 2025  
**Version:** 1.0.0  
**Author:** Larasena Development Team
