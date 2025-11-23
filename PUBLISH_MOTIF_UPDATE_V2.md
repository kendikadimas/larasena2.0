# 📝 Update Fitur Publish Motif - Integrasi dengan Dashboard

## 🔄 Perubahan dari Versi Sebelumnya

### **Sebelumnya:**
- Menu terpisah "Komunitas" di sidebar
- Halaman upload terpisah `/motif/publish/create`
- Halaman dashboard terpisah `/motif/publish`
- Galeri motif terpisah `/galeri-motif`

### **Sekarang (Update):**
- ✅ **Publish langsung dari Dashboard "Batik Saya"**
- ✅ **Motif yang terpublish tampil di halaman "Motif" (existing)**
- ✅ **Tombol Publish di setiap design card**
- ✅ **Modal Publish dengan preview, title, dan philosophy**
- ❌ Menu sidebar "Komunitas" **dihapus**
- ❌ Halaman upload standalone **dihapus**

---

## ✨ Fitur Baru

### 1. **Tombol Publish di Dashboard**
**Location:** `resources/js/pages/User/Dashboard.jsx`

**Features:**
- Tombol Upload icon pada setiap design card (hover action)
- Modal publish dengan:
  - Preview image design
  - Input nama motif (pre-filled dari design title)
  - Textarea filosofi (max 1000 chars)
  - Info box proses review
  - Submit button dengan loading state
- Auto-convert design image ke blob untuk upload
- Submit ke endpoint `/motif/publish` (POST)

**User Flow:**
1. User buka Dashboard "Batik Saya"
2. Hover pada design card
3. Klik tombol Upload (amber/yellow button)
4. Modal publish muncul dengan preview
5. Isi/edit nama motif dan filosofi
6. Klik "Submit untuk Review"
7. Loading state → Success alert → Modal close

---

### 2. **Integrasi Motif Published di Halaman Motif**
**Location:** `app/Http/Controllers/MotifController.php`

**Changes:**
- Controller `index()` method sekarang merge:
  - Global motifs (admin upload)
  - Published motifs (user-generated, approved only)
- Published motifs ditandai dengan `is_published: true`
- Include data: user, likes_count, views_count, featured
- Manual pagination untuk gabungan kedua collections

**Frontend Update:** `resources/js/pages/User/Motif.jsx`
- Card motif published menampilkan:
  - Profile photo publisher
  - Nama publisher
  - Likes & views count
  - Link "Lihat Detail →" ke detail page
  - Featured star badge (jika featured)
- Category badge "Komunitas" untuk published motifs

---

## 🗂️ File Changes

### Modified Files

#### 1. `resources/js/layouts/User/Sidebar.jsx`
**Changes:**
- ❌ Removed menu group "Komunitas" (galeri-motif section)
- ✅ Updated `expandedGroups` state (remove 'galeri-motif')

#### 2. `resources/js/pages/User/Dashboard.jsx`
**Changes:**
- ✅ Added `Upload` icon import
- ✅ Added state: `showPublishModal`, `selectedDesign`, `publishData`, `publishLoading`
- ✅ Added function: `handlePublishClick()`, `handlePublishSubmit()`
- ✅ Added Upload button in card actions (4 buttons: Edit, Publish, Download, Delete)
- ✅ Added Publish Modal component at end

**New Code:**
```jsx
const handlePublishSubmit = () => {
  // Validation
  // Convert image to blob
  // FormData with title, philosophy, design_id, image
  // POST to /motif/publish
};
```

#### 3. `app/Http/Controllers/MotifController.php`
**Changes:**
- ✅ Updated `index()` method
- ✅ Get global motifs + published motifs
- ✅ Merge collections
- ✅ Manual pagination
- ✅ Map published motifs dengan format konsisten

**New Logic:**
```php
$globalMotifs = Motif::where('is_active', true)->whereNull('user_id')->get();
$publishedMotifs = PublishedMotif::approved()->with('user')->latest('published_at')->get()->map(...);
$allMotifs = $globalMotifs->concat($publishedMotifs);
// Paginate manually
```

#### 4. `resources/js/pages/User/Motif.jsx`
**Changes:**
- ✅ Added icons: `Heart`, `Eye`, `User`, `Star`
- ✅ Updated card template untuk support published motifs
- ✅ Added publisher info section (conditional render)
- ✅ Added featured star badge
- ✅ Added link to detail page

**New Section:**
```jsx
{motif.is_published && motif.user && (
  <div className="pt-3 border-t">
    {/* Publisher profile photo & name */}
    {/* Likes & views count */}
    {/* Link to detail */}
  </div>
)}
```

#### 5. `routes/web.php`
**Changes:**
- ❌ Removed: `Route::get('/motif/publish')` (index)
- ❌ Removed: `Route::get('/motif/publish/create')` (create form)
- ✅ Simplified to:
  - `POST /motif/publish` → store
  - `DELETE /motif/publish/{motif}` → destroy
- ✅ Updated gallery route names:
  - `motif.gallery` → `published-motifs.gallery`
  - `motif.show` → `published-motifs.show`

---

## 🎨 UI/UX Improvements

### Dashboard Card Actions (Hover)
**Before:** Edit, Download, Delete (3 buttons)
**After:** Edit, Publish, Download, Delete (4 buttons)

**Button Colors:**
- Edit: Blue
- **Publish: Amber/Yellow (NEW)**
- Download: Orange
- Delete: Red

### Publish Modal Design
- Gradient header: Amber 500 → Amber 600
- Preview image: Aspect-video, object-contain
- Info box: Amber theme dengan icon
- Disabled button saat fields kosong
- Loading state: "Mengirim..."

### Motif Card Enhancement
**For Published Motifs:**
- Border-top divider
- Mini profile section
- Icon-based stats (heart, eye)
- Amber-colored "Lihat Detail" link
- Featured star badge (top-right)

---

## 🔌 API Endpoints

### User Endpoints

**Submit Motif for Review**
```
POST /motif/publish
Auth: Required (General role)
Body: FormData
  - title: string (max 255)
  - philosophy: string (max 1000)
  - design_id: integer
  - image: file (converted from design)
Response: Redirect back with success message
```

**Delete Published Motif**
```
DELETE /motif/publish/{motif}
Auth: Required (owner only)
Response: Redirect back
```

**Toggle Like**
```
POST /motif/{motif}/like
Auth: Required
Response: JSON { liked, likes_count }
```

### Public Endpoints

**Gallery (unchanged)**
```
GET /galeri-motif
Response: Inertia render with approved motifs
```

**Detail View (unchanged)**
```
GET /galeri-motif/{slug}
Response: Inertia render with motif + related
```

### Admin Endpoints (unchanged)
```
GET /admin-published-motifs
PUT /admin-published-motifs/{motif}/approve
PUT /admin-published-motifs/{motif}/reject
PUT /admin-published-motifs/{motif}/toggle-featured
DELETE /admin-published-motifs/{motif}
```

---

## 📊 Data Flow

### Publish Flow
```
User Dashboard
  ↓ Click Upload on design card
Modal Opens (with design preview)
  ↓ Fill title & philosophy
Submit Button
  ↓ POST /motif/publish (FormData)
Controller Store Method
  ↓ Validate & save to published_motifs
  ↓ Status: pending
  ↓ Upload image to storage/published-motifs
Success Alert
  ↓ Modal closes
Admin Review (separate admin panel)
  ↓ Approve → status: approved, published_at: now
Motif appears in:
  - /motif (Motif page) ✅
  - /galeri-motif (Public gallery) ✅
```

### Display Flow
```
User visits /motif
  ↓
Controller: MotifController@index
  ↓
Fetch global motifs (admin)
  +
Fetch published motifs (approved only)
  ↓
Merge collections
  ↓
Manual pagination
  ↓
Render to Motif.jsx
  ↓
Display cards:
  - Global motifs: Simple card
  - Published motifs: Card with publisher info
```

---

## 🧪 Testing Checklist

### Dashboard Publish Feature
- [ ] Tombol Upload muncul pada hover design card
- [ ] Modal publish terbuka dengan preview correct
- [ ] Title pre-filled dari design title
- [ ] Philosophy textarea max 1000 chars dengan counter
- [ ] Submit disabled jika fields kosong
- [ ] Loading state saat submit
- [ ] Success alert setelah submit
- [ ] Modal close otomatis setelah success
- [ ] Image conversion dari canvas/URL ke blob works

### Motif Page Integration
- [ ] Global motifs tetap tampil
- [ ] Published motifs (approved) tampil
- [ ] Published motifs memiliki section publisher
- [ ] Profile photo tampil (atau fallback User icon)
- [ ] Likes & views count tampil
- [ ] Featured badge tampil di motif featured
- [ ] Link "Lihat Detail" mengarah ke `/galeri-motif/{slug}`
- [ ] Pagination works untuk gabungan motifs

### Admin Review (existing, no changes)
- [ ] Admin dapat approve motif pending
- [ ] Admin dapat reject dengan reason
- [ ] Badge awarded on approval
- [ ] Approved motif langsung tampil di /motif

---

## 🚀 Deployment Notes

### Migration
✅ **No new migrations needed** - menggunakan table existing

### Route Changes
⚠️ **Update route names:**
- Old: `motif.gallery` → New: `published-motifs.gallery`
- Old: `motif.show` → New: `published-motifs.show`
- **Action:** Update semua reference ke route ini di frontend

### Controller Updates
✅ `MotifController@index` - Modified logic
✅ `PublishedMotifController` - No changes needed

### Frontend Updates
✅ `Dashboard.jsx` - Major update
✅ `Motif.jsx` - UI enhancement
✅ `Sidebar.jsx` - Menu removal

---

## 📋 Removed Files (Optional Cleanup)

Jika ingin cleanup file yang tidak terpakai:
- ❌ `resources/js/pages/Motif/Published/Create.jsx` (standalone form)
- ❌ `resources/js/pages/Motif/Published/Index.jsx` (standalone dashboard)

**Note:** File `Gallery.jsx` dan `Show.jsx` tetap digunakan untuk public gallery.

---

## 💡 Future Enhancements

### Priority 1
- [ ] Add filter "Komunitas" di dropdown category Motif page
- [ ] View published motifs milik user di Profile page
- [ ] Notification badge saat motif approved/rejected

### Priority 2
- [ ] Bulk publish multiple designs
- [ ] Edit published motif (pending only)
- [ ] Preview modal sebelum publish (editor integration)

### Priority 3
- [ ] Auto-suggest title dari AI berdasarkan design
- [ ] Auto-generate philosophy template
- [ ] Save as draft before publish

---

## 🎯 Summary

**What Changed:**
1. ✅ Publish terintegrasi di Dashboard (modal)
2. ✅ Published motifs tampil di halaman Motif existing
3. ❌ Removed standalone publish pages
4. ❌ Removed sidebar menu "Komunitas"

**Benefits:**
- ✅ Lebih streamlined UX
- ✅ Satu tempat untuk manage designs
- ✅ Published motifs langsung visible di gallery motif
- ✅ Konsisten dengan flow existing

**User Experience:**
```
Buat Design → Dashboard → Publish → Review Admin → Tampil di Motif & Galeri
```

---

**Version:** 2.0.0 (Updated)
**Date:** 2025-11-22
**Status:** ✅ Ready for Testing
