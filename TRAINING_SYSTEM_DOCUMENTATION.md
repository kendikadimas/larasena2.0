# 🎨 SISTEM PELATIHAN BATIK DIGITAL - DOKUMENTASI LENGKAP

## 📋 Overview

Sistem pelatihan batik interaktif dengan fitur canvas digital untuk belajar membuat batik dari tingkat dasar hingga lanjutan. Sistem ini dilengkapi dengan tracking progress, sertifikat digital, dan tools interaktif seperti brush dan drag-drop motif.

---

## 🗄️ Database Structure

### 1. **training_courses** - Tabel Course Pelatihan
```sql
- id (PK)
- title (varchar) - Judul course
- description (text) - Deskripsi lengkap
- level (enum: dasar, menengah, lanjutan)
- thumbnail (varchar) - Gambar thumbnail
- duration_minutes (int) - Durasi estimasi
- total_lessons (int) - Total lesson dalam course
- is_published (boolean) - Status publikasi
- order (int) - Urutan tampilan
- timestamps
```

### 2. **training_lessons** - Tabel Materi/Lesson
```sql
- id (PK)
- course_id (FK → training_courses)
- title (varchar) - Judul lesson
- description (text) - Deskripsi lesson
- content (text) - Konten teks/instruksi
- video_url (varchar) - URL video tutorial
- type (enum: theory, practice, quiz)
- canvas_data (json) - Data untuk canvas exercise
  {
    "tools": ["brush", "eraser", "fill"],
    "motifs": ["/images/motif1.png", "/images/motif2.png"],
    "instructions": "Gambarlah motif kawung...",
    "canvas_size": {"width": 800, "height": 600},
    "background": "#FFFFFF"
  }
- order (int) - Urutan lesson
- is_published (boolean)
- timestamps
```

### 3. **training_progress** - Tabel Progress User
```sql
- id (PK)
- user_id (FK → users)
- course_id (FK → training_courses)
- lesson_id (FK → training_lessons, nullable)
- completed_lessons (int) - Jumlah lesson selesai
- total_lessons (int) - Total lesson di course
- progress_percentage (decimal 5,2) - Persentase progress
- canvas_work (json) - Hasil kerja canvas user
- is_completed (boolean) - Status course selesai
- started_at (timestamp)
- completed_at (timestamp)
- timestamps
- UNIQUE(user_id, course_id, lesson_id)
```

### 4. **training_certificates** - Tabel Sertifikat
```sql
- id (PK)
- user_id (FK → users)
- course_id (FK → training_courses)
- certificate_number (varchar, unique) - Nomor sertifikat
- certificate_file (varchar) - Path file PDF
- issued_at (timestamp) - Tanggal terbit
- timestamps
- UNIQUE(user_id, course_id)
```

---

## 🎯 Fitur Utama

### A. **Untuk Admin**

#### 1. Course Management (`/admin-training`)
- ✅ Create, Read, Update, Delete courses
- ✅ Set level: Dasar, Menengah, Lanjutan
- ✅ Upload thumbnail
- ✅ Set durasi estimasi
- ✅ Toggle publish/unpublish
- ✅ Reorder courses

#### 2. Lesson Management (`/admin-training/{course}/lessons`)
- ✅ Create, Read, Update, Delete lessons
- ✅ Set lesson type: Theory, Practice, Quiz
- ✅ Upload video tutorial
- ✅ Configure canvas data:
  - Available tools (brush, eraser, fill, etc.)
  - Draggable motifs
  - Instructions
  - Canvas settings
- ✅ Reorder lessons
- ✅ Toggle publish/unpublish

### B. **Untuk User**

#### 1. Training List (`/pelatihan`)
- ✅ Browse semua course yang published
- ✅ Filter by level (dasar, menengah, lanjutan)
- ✅ View progress untuk course yang sudah dimulai
- ✅ Stats: total courses, my courses, completed courses

#### 2. Course Detail (`/pelatihan/{course}`)
- ✅ Deskripsi lengkap course
- ✅ List semua lessons
- ✅ Progress bar
- ✅ Start/Continue learning button
- ✅ Certificate download (jika sudah selesai)

#### 3. Interactive Lesson (`/pelatihan/{course}/lesson/{lesson}`)
**Theory Lessons:**
- 📖 Text content
- 🎥 Video tutorial
- ▶️ Next/Previous navigation

**Practice Lessons:**
- 🎨 Canvas digital untuk menggambar
- 🖌️ Brush tools dengan size & opacity
- 🗑️ Eraser tool
- 🎨 Fill/Paint bucket
- 🖼️ Drag & drop motif batik
- ↩️ Undo/Redo
- 💾 Auto-save progress
- 📸 Save canvas work

**Quiz Lessons:**
- ❓ Multiple choice questions
- ✅ Instant feedback
- 📊 Score tracking

#### 4. Certificates (`/sertifikat`)
- 📜 View all earned certificates
- 🖨️ Download PDF certificates
- 🔗 Shareable certificate link

---

## 🎨 Canvas Feature Details

### Canvas Tools Available:

```javascript
const canvasTools = {
  // Drawing Tools
  brush: {
    sizes: [2, 5, 10, 15, 20, 30],
    colors: ['#000000', '#8B4513', '#D2691E', '#F4A460', '#FFFFE0'],
    opacity: [0.1, 0.3, 0.5, 0.7, 1.0]
  },
  
  // Eraser
  eraser: {
    sizes: [10, 20, 30, 50]
  },
  
  // Fill Tool
  fill: {
    colors: ['#000000', '#8B4513', '#D2691E', '#FFFFFF']
  },
  
  // Drag & Drop Motifs
  motifs: [
    { id: 1, src: '/motifs/kawung.png', name: 'Kawung' },
    { id: 2, src: '/motifs/parang.png', name: 'Parang' },
    { id: 3, src: '/motifs/mega-mendung.png', name: 'Mega Mendung' }
  ],
  
  // Canvas Actions
  actions: ['undo', 'redo', 'clear', 'save', 'download']
};
```

### Canvas Data Structure (JSON):

```json
{
  "tools": ["brush", "eraser", "fill", "motif"],
  "motifs": [
    {
      "id": 1,
      "src": "/images/motif/kawung.png",
      "name": "Kawung",
      "thumbnail": "/images/motif/kawung-thumb.png"
    }
  ],
  "instructions": "Gambarlah motif kawung dengan menggunakan brush tool. Anda juga bisa drag motif dari panel kanan.",
  "canvas_size": {
    "width": 800,
    "height": 600
  },
  "background": "#FFFFFF",
  "grid": {
    "enabled": true,
    "size": 50,
    "color": "#CCCCCC"
  },
  "reference_image": "/images/reference/kawung-example.png"
}
```

---

## 🔄 Progress System

### 1. Start Course
```php
// Automatically created when user opens first lesson
TrainingProgress::create([
    'user_id' => Auth::id(),
    'course_id' => $course->id,
    'total_lessons' => $course->total_lessons,
    'started_at' => now()
]);
```

### 2. Complete Lesson
```php
// POST /pelatihan/{course}/lesson/{lesson}/progress
{
    "canvas_work": { /* saved canvas state */ },
    "is_completed": true
}
```

### 3. Calculate Progress
```php
$progress_percentage = ($completed_lessons / $total_lessons) * 100;

if ($progress_percentage >= 100) {
    // Generate certificate
    $this->generateCertificate($course);
}
```

---

## 📜 Certificate System

### 1. Auto-generate on Course Completion
```php
$certificate = TrainingCertificate::create([
    'user_id' => Auth::id(),
    'course_id' => $course->id,
    'certificate_number' => 'CERT-BATIK-20251114-ABC123',
    'issued_at' => now()
]);
```

### 2. Certificate Number Format
```
CERT-BATIK-[YYYYMMDD]-[RANDOM6]
Example: CERT-BATIK-20251114-A3F2B9
```

### 3. Certificate Content
- Certificate Number
- User Name
- Course Title & Level
- Issue Date
- Digital Signature/Stamp
- QR Code for verification

---

## 📁 File Structure

```
app/
├── Models/
│   ├── TrainingCourse.php
│   ├── TrainingLesson.php
│   ├── TrainingProgress.php
│   └── TrainingCertificate.php
├── Http/Controllers/
│   ├── TrainingController.php
│   ├── TrainingLessonController.php
│   ├── TrainingCertificateController.php
│   └── Admin/
│       ├── AdminTrainingController.php
│       └── AdminTrainingLessonController.php

database/migrations/
├── 2025_11_14_000001_create_training_courses_table.php
├── 2025_11_14_000002_create_training_lessons_table.php
├── 2025_11_14_000003_create_training_progress_table.php
└── 2025_11_14_000004_create_training_certificates_table.php

resources/js/pages/
├── Admin/Training/
│   ├── Index.jsx           (Course management)
│   └── Lessons.jsx         (Lesson management)
└── User/Training/
    ├── Index.jsx           (Course list)
    ├── Detail.jsx          (Course detail)
    ├── Lesson.jsx          (Interactive lesson)
    ├── Certificates.jsx    (Certificate list)
    └── CertificateView.jsx (Certificate display)

resources/js/components/Training/
├── CanvasEditor.jsx        (Main canvas component)
├── BrushTool.jsx
├── EraserTool.jsx
├── FillTool.jsx
├── MotifPanel.jsx
└── ProgressBar.jsx
```

---

## 🚀 API Endpoints

### User Endpoints:
```
GET    /pelatihan                              - List all courses
GET    /pelatihan/{course}                     - Course detail
GET    /pelatihan/{course}/lesson/{lesson}     - Lesson view
POST   /pelatihan/{course}/lesson/{lesson}/progress - Save progress

GET    /sertifikat                             - List certificates
GET    /sertifikat/{certificate}               - View certificate
GET    /sertifikat/{certificate}/download      - Download PDF
```

### Admin Endpoints:
```
GET    /admin-training                         - List courses
POST   /admin-training                         - Create course
PUT    /admin-training/{course}                - Update course
DELETE /admin-training/{course}                - Delete course
PUT    /admin-training/{course}/toggle-publish - Toggle publish

GET    /admin-training/{course}/lessons        - List lessons
POST   /admin-training/{course}/lessons        - Create lesson
PUT    /admin-training/lessons/{lesson}        - Update lesson
DELETE /admin-training/lessons/{lesson}        - Delete lesson
PUT    /admin-training/lessons/{lesson}/toggle-publish
```

---

## 🎨 Level System

### Dasar (Basic)
- 🟢 Color: Green (#10B981)
- Focus: Pengenalan batik, tools dasar, pola sederhana
- Duration: 30-60 minutes per lesson
- Tools: Brush, eraser, basic colors

### Menengah (Intermediate)
- 🟡 Color: Amber (#F59E0B)
- Focus: Teknik menengah, kombinasi motif, pewarnaan kompleks
- Duration: 60-90 minutes per lesson
- Tools: All tools + gradient, layer, motif drag-drop

### Lanjutan (Advanced)
- 🔴 Color: Red (#EF4444)
- Focus: Desain kompleks, inovasi, teknik profesional
- Duration: 90-120 minutes per lesson
- Tools: Full toolset + advanced features

---

## 💾 Data Storage

### 1. Thumbnails
```
storage/app/public/training/thumbnails/
```

### 2. Canvas Work (JSON in database)
```json
{
  "canvas_state": "base64_image_data",
  "actions": [...],
  "used_motifs": [1, 3, 5],
  "time_spent": 1830
}
```

### 3. Certificates
```
storage/app/public/certificates/
```

---

## ✅ Next Steps - Frontend Implementation

Saya akan membuat:
1. ✅ Admin pages untuk manage courses & lessons
2. ✅ User pages untuk browse & learn
3. ✅ Interactive canvas component dengan all tools
4. ✅ Certificate design & PDF generation
5. ✅ Progress tracking UI

Lanjutkan ke frontend? 🚀
