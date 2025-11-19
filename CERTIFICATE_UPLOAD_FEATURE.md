# Certificate File Upload Feature

## Overview
Admin can now upload custom certificate files (PDF or images) for each training course. Users will download the uploaded certificate template when they complete a course.

## Changes Made

### 1. Database Migration
- **File**: `database/migrations/2025_11_17_000001_add_certificate_file_to_training_courses_table.php`
- Added `certificate_file` column (nullable string) to `training_courses` table
- Migration completed successfully ✅

### 2. Model Updates
- **File**: `app/Models/TrainingCourse.php`
  - Added `certificate_file` to `$fillable` array
  - Added `getCertificateFileUrlAttribute()` accessor method for easy URL access
  - Returns full storage URL with proper path handling

### 3. Controller Updates

#### AdminTrainingController
- **File**: `app/Http/Controllers/Admin/AdminTrainingController.php`
- **store()**: 
  - Added validation: `certificate_file` (nullable|file|mimes:pdf,jpg,jpeg,png|max:10240)
  - Stores file to `storage/app/public/training/certificates/`
  - Added `certificate_file_url` to course data returned to frontend
  
- **update()**:
  - Same validation as store
  - Deletes old certificate file before uploading new one
  
- **destroy()**:
  - Deletes certificate file along with thumbnail when course is deleted

#### TrainingCertificateController
- **File**: `app/Http/Controllers/TrainingCertificateController.php`
- **download()**:
  - Checks if course has uploaded certificate file
  - Serves the file with proper download headers
  - Filename format: `Sertifikat-{certificate_number}.{ext}`
  - Fallback: Redirects to certificate view page if no file uploaded

### 4. Frontend Updates

#### Admin Training Management Form
- **File**: `resources/js/pages/Admin/Training/Index.jsx`
- Added `certificate_file` to form state
- New file upload field in modal form:
  - Label: "File Sertifikat (PDF/Image, max 10MB)"
  - Accepts: PDF and image files
  - Shows existing file indicator when editing
  - Link to view current certificate file
  - Helper text explaining the upload purpose

## Usage Instructions

### For Admin:
1. Go to Admin → Manajemen Pelatihan
2. Click "Tambah Course" or edit existing course
3. Fill in all course details
4. Upload certificate template in "File Sertifikat" field
   - Supported formats: PDF, JPG, JPEG, PNG
   - Max file size: 10MB
5. Save the course

### For Users:
1. Complete all lessons in a course (100% progress)
2. Certificate is automatically generated
3. Click "Download Sertifikat" button
4. User receives the uploaded certificate file from admin
5. If no certificate file uploaded, user is redirected to certificate view page

## File Storage
- **Path**: `storage/app/public/training/certificates/`
- **Access URL**: `{APP_URL}/storage/training/certificates/{filename}`
- Files are automatically deleted when:
  - Course is updated with new certificate file (old file deleted)
  - Course is deleted (all associated files deleted)

## Validation Rules
- File is optional (nullable)
- Allowed types: PDF, JPG, JPEG, PNG
- Max size: 10MB (10240 KB)

## Benefits
✅ Admin has full control over certificate design
✅ Each course can have unique certificate template
✅ Supports both PDF and image formats
✅ Automatic file cleanup on updates/deletes
✅ Fallback behavior if no file uploaded

## Migration Status
```bash
php artisan migrate:status
```
✅ `2025_11_17_000001_add_certificate_file_to_training_courses_table` - Ran successfully

## Testing Checklist
- [ ] Upload PDF certificate on course creation
- [ ] Upload image certificate (JPG/PNG) on course creation
- [ ] Edit course and replace certificate file (old file deleted)
- [ ] Complete course and download certificate
- [ ] Delete course (verify certificate file deleted from storage)
- [ ] Course without certificate file (fallback to view page)
- [ ] File size validation (reject files > 10MB)
- [ ] File type validation (reject non-PDF/image files)
