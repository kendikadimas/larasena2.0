# 📝 Dokumentasi Fitur Publish Motif

## 🎯 Overview
Fitur User-Generated Motif Publishing dengan sistem moderasi admin. User dapat submit motif batik original mereka untuk ditampilkan di galeri publik setelah disetujui admin.

---

## ✅ Fitur yang Sudah Dibuat

### 1. **Database Schema**
**4 Migration Files:**
- ✅ `add_profile_photo_to_users_table.php` - Foto profil user sebagai publisher
- ✅ `create_published_motifs_table.php` - Table utama motif published
- ✅ `create_motif_likes_table.php` - System like dengan unique constraint
- ✅ `create_user_badges_table.php` - Gamification badges

**Status Migration:** ✅ Berhasil dijalankan

---

### 2. **Models & Relationships**

#### PublishedMotif Model
```php
Location: app/Models/PublishedMotif.php
```
**Features:**
- ✅ Auto-generate unique slug
- ✅ Method: `approve()`, `reject($reason)`, `incrementViews()`, `isLikedBy($user)`
- ✅ Scopes: `approved()`, `pending()`, `rejected()`, `featured()`, `published()`
- ✅ Accessor: `getImageUrlAttribute()`
- ✅ Relationships: User, MotifLikes

#### User Model Extensions
```php
Location: app/Models/User.php
```
**Added:**
- ✅ `profile_photo` field
- ✅ `awardBadge()` method
- ✅ Relationships: `publishedMotifs()`, `badges()`, `motifLikes()`
- ✅ `getProfilePhotoUrlAttribute()`

#### MotifLike & UserBadge Models
- ✅ Pivot model untuk likes
- ✅ Badge tracking model

---

### 3. **Backend Controllers**

#### PublishedMotifController (User)
```php
Location: app/Http/Controllers/PublishedMotifController.php
```
**Routes & Methods:**
- ✅ `GET /motif/publish` → index() - List motif user
- ✅ `GET /motif/publish/create` → create() - Form submit
- ✅ `POST /motif/publish` → store() - Submit motif dengan image upload
- ✅ `GET /galeri-motif/{slug}` → show() - Detail view
- ✅ `POST /motif/{motif}/like` → toggleLike() - Like/unlike
- ✅ `GET /galeri-motif` → gallery() - Public gallery dengan sort
- ✅ `DELETE /motif/publish/{motif}` → destroy() - Delete motif

**Features:**
- ✅ Image upload ke `storage/published-motifs`
- ✅ View count increment
- ✅ Like toggle dengan user check
- ✅ Sort: latest / popular
- ✅ Related motifs (4 random)

#### AdminPublishedMotifController
```php
Location: app/Http/Controllers/Admin/AdminPublishedMotifController.php
```
**Routes & Methods:**
- ✅ `GET /admin-published-motifs` → index() - List all dengan filter
- ✅ `PUT /admin-published-motifs/{motif}/approve` → approve() - Approve + award badge
- ✅ `PUT /admin-published-motifs/{motif}/reject` → reject() - Reject dengan reason
- ✅ `PUT /admin-published-motifs/{motif}/toggle-featured` → toggleFeatured()
- ✅ `DELETE /admin-published-motifs/{motif}` → destroy()

**Features:**
- ✅ Filter: pending/approved/rejected
- ✅ Stats counter per status
- ✅ Automatic badge award on approval
- ✅ Storage cleanup on delete

---

### 4. **Routes Configuration**

#### Public Routes
```php
Route::get('/galeri-motif', [PublishedMotifController::class, 'gallery'])
    ->name('published-motifs.gallery');

Route::get('/galeri-motif/{slug}', [PublishedMotifController::class, 'show'])
    ->name('published-motifs.show');
```

#### User Routes (Auth + General role)
```php
Route::prefix('motif/publish')->middleware(['auth', 'role:General'])->group(function() {
    Route::get('/', [PublishedMotifController::class, 'index'])
        ->name('motif.published.index');
    Route::get('/create', [PublishedMotifController::class, 'create'])
        ->name('published-motifs.create');
    Route::post('/', [PublishedMotifController::class, 'store'])
        ->name('published-motifs.store');
    Route::delete('/{motif}', [PublishedMotifController::class, 'destroy'])
        ->name('published-motifs.destroy');
});

Route::post('/motif/{motif}/like', [PublishedMotifController::class, 'toggleLike'])
    ->middleware('auth')
    ->name('published-motifs.like');
```

#### Admin Routes (Auth + Admin role)
```php
Route::prefix('admin-published-motifs')->middleware(['auth', 'role:Admin'])->group(function() {
    Route::get('/', [AdminPublishedMotifController::class, 'index'])
        ->name('admin.published-motifs.index');
    Route::put('/{motif}/approve', [AdminPublishedMotifController::class, 'approve'])
        ->name('admin.published-motifs.approve');
    Route::put('/{motif}/reject', [AdminPublishedMotifController::class, 'reject'])
        ->name('admin.published-motifs.reject');
    Route::put('/{motif}/toggle-featured', [AdminPublishedMotifController::class, 'toggleFeatured'])
        ->name('admin.published-motifs.toggle-featured');
    Route::delete('/{motif}', [AdminPublishedMotifController::class, 'destroy'])
        ->name('admin.published-motifs.destroy');
});
```

---

### 5. **Frontend Components**

#### User Submit Form
```jsx
Location: resources/js/pages/Motif/Published/Create.jsx
```
**Features:**
- ✅ Image upload dengan preview (max 5MB)
- ✅ Title input dengan icon
- ✅ Philosophy textarea (max 1000 chars dengan counter)
- ✅ Info card: proses review
- ✅ Tips approval guidelines
- ✅ Validation errors display
- ✅ Modern amber/orange gradient theme

#### User Dashboard
```jsx
Location: resources/js/pages/Motif/Published/Index.jsx
```
**Features:**
- ✅ Stats cards: Total, Pending, Approved, Rejected
- ✅ Filter tabs by status
- ✅ Grid layout motif cards dengan image
- ✅ Status badges (color-coded)
- ✅ Featured badge untuk special motifs
- ✅ Likes & views counter
- ✅ Rejection reason display
- ✅ Delete button dengan confirmation
- ✅ Empty state dengan CTA

#### Admin Moderation Interface
```jsx
Location: resources/js/pages/Admin/PublishedMotifs/Index.jsx
```
**Features:**
- ✅ Stats cards clickable untuk filter
- ✅ Search box (nama motif / user)
- ✅ Table view dengan preview image
- ✅ User info: nama, email, profile photo
- ✅ Filosofi motif (truncated)
- ✅ Stats: likes & views count
- ✅ Tanggal submit & published
- ✅ Approve/Reject buttons untuk pending
- ✅ Reject modal dengan textarea reason
- ✅ Feature/Unfeature toggle untuk approved
- ✅ Delete button
- ✅ Color-coded status

#### Public Gallery
```jsx
Location: resources/js/pages/Motif/Published/Gallery.jsx
```
**Features:**
- ✅ Header gradient banner
- ✅ Search bar (nama motif / pembuat)
- ✅ Sort buttons: Terbaru / Terpopuler
- ✅ Grid layout 3 kolom responsive
- ✅ Image hover scale animation
- ✅ Featured star badge
- ✅ Publisher info dengan profile photo
- ✅ Stats: views & likes
- ✅ Like button (auth required)
- ✅ CTA untuk upload motif
- ✅ Login redirect untuk guest

#### Detail View
```jsx
Location: resources/js/pages/Motif/Published/Show.jsx
```
**Features:**
- ✅ Large image display (sticky on scroll)
- ✅ Stats box: views & likes
- ✅ Like button with state
- ✅ Publisher card dengan badges
- ✅ Full philosophy text
- ✅ Share buttons:
  - Facebook
  - Twitter
  - WhatsApp
  - Copy link dengan feedback
- ✅ Related motifs (4 cards)
- ✅ Back to gallery link
- ✅ Responsive 2-column layout

---

### 6. **Navigation Updates**

#### Sidebar (User)
```jsx
Location: resources/js/layouts/User/Sidebar.jsx
```
**Added Menu Group: "Komunitas"**
- ✅ Galeri Motif → `/galeri-motif`
- ✅ Publish Motif → `/motif/publish`
- ✅ Amber color theme
- ✅ Upload icon untuk publish
- ✅ ShoppingBag icon untuk gallery

---

## 🎨 Design System

### Color Palette
- **Primary:** `#BA682A` (Brown Batik)
- **Secondary:** `#D2691E` (Orange)
- **Accent:** `#F4A460` (Sandy Brown)
- **Amber:** `amber-500` hingga `amber-600`
- **Status Colors:**
  - Pending: Yellow (`yellow-500`)
  - Approved: Green (`green-500`)
  - Rejected: Red (`red-500`)

### Component Patterns
- **Cards:** Rounded-2xl dengan shadow-lg
- **Buttons:** Rounded-xl font-semibold
- **Hover:** `-translate-y-1` animation
- **Images:** Aspect-square dengan object-cover
- **Icons:** Lucide React 5x5 atau 4x4

---

## 🔐 Authorization & Security

### Middleware
- **Public Gallery:** Accessible tanpa auth
- **User Submit:** `auth` + `role:General`
- **Like Feature:** `auth` (any role)
- **Admin Panel:** `auth` + `role:Admin`

### Validation
- **Title:** Required, max 255 chars
- **Philosophy:** Required, max 1000 chars
- **Image:** Required, file, image, max 5MB (5120 KB)
- **Rejection Reason:** Required when reject, max 500 chars

### Storage
- **Path:** `storage/app/public/published-motifs/`
- **Accessible via:** `Storage::url()` → `/storage/published-motifs/`
- **Cleanup:** Auto-delete on motif destruction

---

## 🎖️ Badge System

### Badge Types
```php
// Auto-awarded on approve
- 'first-publish' → "🎉 First Publish"
- '3-approvals' → "⭐ 3 Approved Motifs"
- '10-approvals' → "🏆 Master Designer"
```

### Award Logic
```php
// In AdminPublishedMotifController@approve
$approvedCount = $motif->user->publishedMotifs()->approved()->count();

if ($approvedCount == 1) {
    $motif->user->awardBadge('first-publish', 'First Publish', '🎉');
}
if ($approvedCount == 3) {
    $motif->user->awardBadge('3-approvals', '3 Approved Motifs', '⭐');
}
if ($approvedCount == 10) {
    $motif->user->awardBadge('10-approvals', 'Master Designer', '🏆');
}
```

---

## 📊 Database Schema Detail

### Table: published_motifs
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| user_id | bigint | Foreign key to users |
| title | string | Nama motif |
| slug | string | URL-friendly unique identifier |
| philosophy | text | Filosofi motif (max 1000) |
| image_path | string | Path di storage |
| design_data | text | Optional JSON design data |
| status | enum | pending/approved/rejected |
| rejection_reason | text | Nullable, reason jika rejected |
| likes_count | int | Counter likes |
| views_count | int | Counter views |
| is_featured | boolean | Featured flag |
| published_at | timestamp | Nullable, set saat approved |
| timestamps | | created_at, updated_at |

**Indexes:**
- `status` + `published_at`
- `user_id`

### Table: motif_likes
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| user_id | bigint | FK to users |
| published_motif_id | bigint | FK to published_motifs |
| timestamps | | created_at, updated_at |

**Unique Constraint:** (`user_id`, `published_motif_id`)

### Table: user_badges
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| user_id | bigint | FK to users |
| badge_key | string | Unique identifier |
| badge_name | string | Display name |
| badge_icon | string | Emoji icon |
| meta | json | Nullable, extra data |
| awarded_at | timestamp | Award time |
| timestamps | | created_at, updated_at |

---

## 🚀 User Flow

### Submit Flow
1. User klik "Publish Motif" di sidebar
2. Form: Upload image + title + philosophy
3. Submit → Status: `pending`
4. Redirect ke dashboard dengan success message

### Review Flow (Admin)
1. Admin buka `/admin-published-motifs`
2. Filter ke "Pending Review"
3. View motif detail: image, philosophy, user info
4. **Approve:**
   - Klik "Approve" → Status: `approved`
   - Set `published_at` = now
   - Award badge otomatis
   - Redirect dengan success message
5. **Reject:**
   - Klik "Reject" → Modal muncul
   - Input reason (required)
   - Submit → Status: `rejected`
   - Rejection reason tersimpan

### Public Gallery Flow
1. Guest/User visit `/galeri-motif`
2. Browse approved motifs
3. Search by nama motif atau pembuat
4. Sort by Terbaru atau Terpopuler
5. Klik card → Detail view
6. Like (auth required)
7. Share via sosmed
8. View related motifs

---

## 🧪 Testing Checklist

### Database
- ✅ Migrations berhasil tanpa error
- ⏳ Test slug uniqueness
- ⏳ Test like duplicate prevention
- ⏳ Test badge award logic

### Backend
- ⏳ Test image upload (valid & invalid sizes)
- ⏳ Test approval flow + badge award
- ⏳ Test rejection flow + reason storage
- ⏳ Test like toggle increment/decrement
- ⏳ Test view count increment
- ⏳ Test featured toggle
- ⏳ Test delete dengan storage cleanup
- ⏳ Test authorization (user vs admin)

### Frontend
- ⏳ Test form validation (client-side)
- ⏳ Test image preview
- ⏳ Test filter tabs (all/pending/approved/rejected)
- ⏳ Test admin search
- ⏳ Test reject modal
- ⏳ Test public gallery sort
- ⏳ Test like button animation
- ⏳ Test share buttons (open social media)
- ⏳ Test copy link feedback
- ⏳ Responsive testing (mobile/tablet/desktop)

---

## 📋 Next Steps / Enhancements

### Priority 1: Testing
- [ ] End-to-end testing full workflow
- [ ] Upload motif dengan berbagai format (JPG, PNG, WEBP)
- [ ] Test rejection reason display
- [ ] Test badge display di user profile

### Priority 2: Integrasi
- [ ] Link dari dashboard user ke Publish Motif
- [ ] Featured motifs carousel di landing page
- [ ] Latest approved motifs di landing page
- [ ] Link published motif ke user's private motifs

### Priority 3: Enhancement Features
- [ ] Comment system pada motif
- [ ] Report abuse button
- [ ] Download counter
- [ ] Category/tags untuk motif
- [ ] Advanced search & filter (by tag, user, date range)
- [ ] Pagination di gallery (currently unlimited)
- [ ] Admin bulk actions (approve/reject multiple)
- [ ] Email notification untuk approval/rejection
- [ ] Leaderboard top contributors

### Priority 4: Performance
- [ ] Lazy loading images di gallery
- [ ] Caching approved motifs
- [ ] Image optimization (thumbnail generation)
- [ ] CDN integration untuk images

---

## 🐛 Known Issues / Notes

1. **Dev Server:** PowerShell execution policy block `npm run dev`
   - **Solution:** Use `node node_modules/vite/bin/vite.js` atau set execution policy

2. **CSS Lint Warnings:** Duplicate transition classes di LandingPage.jsx
   - **Impact:** None, purely linting
   - **Fix:** Remove duplicate `transition-*` dan `duration-*` classes

3. **Pagination:** Gallery tidak menggunakan pagination Laravel
   - **Reason:** `get()` digunakan untuk map `is_liked_by_user`
   - **Todo:** Implement custom pagination atau move to frontend filter

4. **Related Motifs Query:** Complex OR condition
   - **Note:** Prioritas motif dari user yang sama, fallback ke random
   - **Performance:** Monitor dengan banyak data

---

## 📚 Code Reference

### Image Upload Example
```php
// In PublishedMotifController@store
$imagePath = $request->file('image')->store('published-motifs', 'public');
```

### Badge Award Example
```php
// In User model
public function awardBadge($key, $name, $icon, $meta = null)
{
    if (!$this->badges()->where('badge_key', $key)->exists()) {
        return $this->badges()->create([
            'badge_key' => $key,
            'badge_name' => $name,
            'badge_icon' => $icon,
            'meta' => $meta,
            'awarded_at' => now()
        ]);
    }
    return null;
}
```

### Like Toggle Example
```php
// In PublishedMotifController@toggleLike
$like = MotifLike::where('user_id', $user->id)
    ->where('published_motif_id', $motif->id)
    ->first();

if ($like) {
    $like->delete();
    $motif->decrement('likes_count');
} else {
    MotifLike::create([...]);
    $motif->increment('likes_count');
}
```

---

## 🎉 Summary

**Status:** ✅ **Feature Complete - Ready for Testing**

**Files Created:** 13 (4 migrations, 4 models, 2 controllers, 4 components, 1 updated sidebar)

**Total Lines of Code:** ~2,500+ lines

**Estimated Development Time:** 4-6 hours untuk full implementation

**Next Action:** Test end-to-end workflow dengan user dan admin account!

---

**Created:** 2025
**Last Updated:** 2025
**Version:** 1.0.0
