<?php

use App\Http\Controllers\BatikGeneratorController;
use App\Http\Controllers\BoutiqueProductController;
use App\Http\Controllers\DesignEditorController;
use App\Http\Controllers\DesignController;
use App\Http\Controllers\KonveksiController;
use App\Http\Controllers\MotifController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserMotifController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\GoogleSearchConsoleController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\TrainingLessonController;
use App\Http\Controllers\TrainingCertificateController;
use App\Http\Controllers\UploadMotifController;
use App\Http\Controllers\BillingController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Admin Controllers
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminMotifController;
use App\Http\Controllers\Admin\AdminTransactionController;
use App\Http\Controllers\Admin\AdminKonveksiController;
use App\Http\Controllers\Admin\AdminTrainingController;
use App\Http\Controllers\Admin\AdminTrainingLessonController;
use App\Http\Controllers\Admin\AdminBillingController;
use App\Http\Controllers\Admin\AdminMotifBulkController;

// Konveksi Controllers
use App\Http\Controllers\Konveksi\DashboardController as KonveksiDashboardController;
use App\Http\Controllers\Konveksi\ProfileController as KonveksiProfileController;

// ============================================================================
// 🏠 LANDING PAGE (Publik & Authenticated)
// ============================================================================
Route::get('/', function () {
    // Render LandingPage untuk semua user, baik login maupun tidak
    // NavBar akan menampilkan Dashboard button jika sudah login
    return Inertia::render('LandingPage', [
        'user' => Auth::user()
    ]);
})->name('landing');

// Public Motif Gallery
Route::get('/galeri-motif', [\App\Http\Controllers\PublishedMotifController::class, 'gallery'])->name('published-motifs.gallery');
Route::get('/galeri-motif/{slug}', [\App\Http\Controllers\PublishedMotifController::class, 'show'])->name('published-motifs.show');

// Layanan Page
Route::get('/layanan', function () {
    return Inertia::render('Layanan', [
        'user' => Auth::user()
    ]);
})->name('layanan');

// ============================================================================
// 💳 BILLING ROUTES (Non-Admin)
// ============================================================================
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/billing/required', [BillingController::class, 'required'])->name('billing.required');
    Route::post('/billing/invoice', [BillingController::class, 'createInvoice'])->name('billing.create-invoice');
    Route::get('/billing/pay-now', [BillingController::class, 'payNow'])->name('billing.pay-now');
    Route::get('/billing/status', [BillingController::class, 'status'])->name('billing.status');
});

// ============================================================================
// 👤 ROUTE UNTUK GENERAL USER (role: General)
// ============================================================================
Route::middleware(['auth', 'verified', 'role:General', 'subscription.enforce'])->group(function () {
    Route::get('/dashboard', [DesignController::class, 'index'])->name('dashboard');

    // CRUD Desain
    Route::post('/designs', [DesignController::class, 'store'])->name('designs.store');
    Route::get('/designs/{id}', [DesignController::class, 'show'])->name('designs.show');
    Route::put('/designs/{id}', [DesignController::class, 'update'])->name('designs.update');
    Route::delete('/designs/{id}', [DesignController::class, 'destroy'])->name('designs.destroy');

    // Motif dan AI
    Route::get('/motif', [MotifController::class, 'index'])->name('motif');
    Route::post('/motifs/ai', [MotifController::class, 'storeFromAi'])->name('motifs.store.ai');
    Route::post('/designs/ai', [DesignController::class, 'storeFromAi'])->name('designs.store.ai');

    // Menu utama
    Route::get('/konveksi', [KonveksiController::class, 'index'])->name('konveksi.index');
    Route::get('/konveksi/{konveksi}', [KonveksiController::class, 'show'])->name('konveksi.show');
    Route::post('/konveksi/{konveksi}/review', [KonveksiController::class, 'storeReview'])->name('konveksi.review.store');
    Route::delete('/konveksi/{konveksi}/review', [KonveksiController::class, 'deleteReview'])->name('konveksi.review.delete');
    Route::get('/bantuan', fn () => Inertia::render('User/Bantuan'))->name('bantuan');
    Route::get('/editor', [DesignEditorController::class, 'create'])->name('editor.create');
    Route::get('/batik-generator', fn () => Inertia::render('BatikGeneratorPage'))->name('batik.generator');

    // Produksi
    Route::get('/produksi', [ProductionController::class, 'index'])->name('production.index');
    Route::post('/produksi', [ProductionController::class, 'store'])->name('production.store');
    Route::get('/produksi/pesan', [ProductionController::class, 'create'])->name('production.create');

    // Training/Pelatihan Batik (feature-flagged)
    if (config('features.training', false)) {
        Route::get('/pelatihan', [TrainingController::class, 'index'])->name('training.index');
        Route::get('/pelatihan/{course:slug}', [TrainingController::class, 'show'])->name('training.show');
        Route::get('/pelatihan/{course:slug}/lesson/{lesson:slug}', [TrainingLessonController::class, 'show'])->name('training.lesson.show');
        Route::post('/pelatihan/{course:slug}/lesson/{lesson:slug}/progress', [TrainingLessonController::class, 'saveProgress'])->name('training.lesson.progress');
        Route::post('/pelatihan/{course:slug}/lesson/{lesson:slug}/quiz-submit',[TrainingLessonController::class, 'submitQuiz'])->name('training.lesson.quiz.submit');

        // Certificates
        Route::get('/sertifikat', [TrainingCertificateController::class, 'index'])->name('training.certificates.index');
        Route::get('/sertifikat/{certificate}', [TrainingCertificateController::class, 'show'])->name('training.certificates.show');
        Route::get('/sertifikat/{certificate}/download', [TrainingCertificateController::class, 'download'])->name('training.certificates.download');
    }

    // Published Motifs (Submit from Dashboard)
    Route::post('/motif/publish', [\App\Http\Controllers\PublishedMotifController::class, 'store'])->name('motif.published.store');
    Route::delete('/motif/publish/{motif}', [\App\Http\Controllers\PublishedMotifController::class, 'destroy'])->name('motif.published.destroy');
    
    // Upload Motif (New Feature - Separate Menu)
    Route::get('/upload', [\App\Http\Controllers\UploadMotifController::class, 'index'])->name('motif.upload.index');
    Route::get('/upload/create', [\App\Http\Controllers\UploadMotifController::class, 'create'])->name('motif.upload.create');
    Route::post('/upload', [\App\Http\Controllers\UploadMotifController::class, 'store'])->name('motif.upload.store');
    Route::delete('/upload/{motif}', [\App\Http\Controllers\UploadMotifController::class, 'destroy'])->name('motif.upload.destroy');
    
    // Like motif
    Route::post('/motif/{motif}/like', [\App\Http\Controllers\PublishedMotifController::class, 'toggleLike'])->name('motif.like');

    // Boutique Products Management
    Route::middleware(['auth'])->prefix('boutique')->name('boutique.')->group(function () {
        Route::get('/products', [BoutiqueProductController::class, 'index'])->name('products.index');
        Route::get('/products/create', [BoutiqueProductController::class, 'create'])->name('products.create');
        Route::post('/products', [BoutiqueProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}', [BoutiqueProductController::class, 'show'])->name('products.show');
        Route::get('/products/{product}/edit', [BoutiqueProductController::class, 'edit'])->name('products.edit');
        Route::put('/products/{product}', [BoutiqueProductController::class, 'update'])->name('products.update');
        Route::put('/products/{product}/toggle-status', [BoutiqueProductController::class, 'toggleStatus'])->name('products.toggleStatus');
        Route::delete('/products/{product}', [BoutiqueProductController::class, 'destroy'])->name('products.destroy');
    });

    // Profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile', [ProfileController::class, 'update']); // Support file upload via POST
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ============================================================================
// 🧵 ROUTE UNTUK KONVEKSI (role: Convection)
// ============================================================================
Route::middleware(['auth', 'verified', 'role:Convection', 'subscription.enforce'])->group(function () {
    Route::get('/konveksi-dashboard', [KonveksiDashboardController::class, 'index'])->name('konveksi.dashboard');
    Route::get('/konveksi-pesanan', [KonveksiDashboardController::class, 'orders'])->name('konveksi.orders');
    Route::get('/konveksi-pelanggan', [KonveksiDashboardController::class, 'customers'])->name('konveksi.customers');
    Route::get('/konveksi-penghasilan', [KonveksiDashboardController::class, 'income'])->name('konveksi.income');

    // Profil Konveksi
    Route::get('/konveksi-profile', [KonveksiProfileController::class, 'edit'])->name('konveksi.profile.edit');
    Route::post('/konveksi-profile', [KonveksiProfileController::class, 'update'])->name('konveksi.profile.update');
    Route::post('/konveksi-profile/documentation/delete', [KonveksiProfileController::class, 'deleteDocumentation'])->name('konveksi.profile.deleteDocumentation');
});

// ============================================================================
// 🛠️ ROUTE UNTUK ADMIN (role: Admin)
// ============================================================================
Route::middleware(['auth', 'verified', 'role:Admin'])->group(function () {
    Route::get('/admin-dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    // User Management
    Route::get('/admin-users', [AdminUserController::class, 'index'])->name('admin.users.index');
    Route::post('/admin-users', [AdminUserController::class, 'store'])->name('admin.users.store');
    Route::put('/admin-users/{user}', [AdminUserController::class, 'update'])->name('admin.users.update');
    Route::put('/admin-users/{user}/role', [AdminUserController::class, 'updateRole'])->name('admin.users.updateRole');
    Route::put('/admin-users/{user}/badge', [AdminUserController::class, 'updateBadge'])->name('admin.users.updateBadge');
    Route::put('/admin-users/{user}/subscription-testing', [AdminUserController::class, 'updateSubscriptionTesting'])->name('admin.users.subscription-testing');
    Route::delete('/admin-users/{user}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
    Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy']);

    // Motif Management
    Route::get('/admin-motifs', [AdminMotifController::class, 'index'])->name('admin.motifs.index');
    Route::post('/admin-motifs', [AdminMotifController::class, 'store'])->name('admin.motifs.store');
    Route::put('/admin-motifs/{motif}', [AdminMotifController::class, 'update'])->name('admin.motifs.update');
    Route::put('/admin-motifs/{motif}/toggle-status', [AdminMotifController::class, 'toggleStatus'])->name('admin.motifs.toggleStatus');
    Route::delete('/admin-motifs/{motif}', [AdminMotifController::class, 'destroy'])->name('admin.motifs.destroy');

    // Motif Bulk Import
    Route::get('/admin-motifs/bulk', [AdminMotifBulkController::class, 'index'])->name('admin.motifs.bulk.index');
    Route::post('/admin-motifs/bulk/multifile', [AdminMotifBulkController::class, 'importMultifile'])->name('admin.motifs.bulk.multifile');
    Route::post('/admin-motifs/bulk/zip', [AdminMotifBulkController::class, 'importZip'])->name('admin.motifs.bulk.zip');
    Route::post('/admin-motifs/bulk/json', [AdminMotifBulkController::class, 'importJson'])->name('admin.motifs.bulk.json');
    Route::post('/admin-motifs/bulk/action', [AdminMotifBulkController::class, 'bulkAction'])->name('admin.motifs.bulk.action');

    // Transaction Management
    Route::get('/admin-transactions', [AdminTransactionController::class, 'index'])->name('admin.transactions.index');
    Route::get('/admin-transactions/{transaction}', [AdminTransactionController::class, 'show'])->name('admin.transactions.show');
    Route::put('/admin-transactions/{transaction}/status', [AdminTransactionController::class, 'updateStatus'])->name('admin.transactions.updateStatus');
    Route::delete('/admin-transactions/{transaction}', [AdminTransactionController::class, 'destroy'])->name('admin.transactions.destroy');

    // Konveksi Management
    Route::get('/admin-konveksi', [AdminKonveksiController::class, 'index'])->name('admin.konveksi.index');
    Route::get('/admin-konveksi/{konveksi}', [AdminKonveksiController::class, 'show'])->name('admin.konveksi.show');
    Route::put('/admin-konveksi/{konveksi}/toggle-verification', [AdminKonveksiController::class, 'toggleVerification'])->name('admin.konveksi.toggleVerification');

    // Training Management (feature-flagged)
    if (config('features.training', false)) {
        Route::get('/admin-training', [AdminTrainingController::class, 'index'])->name('admin.training.index');
        Route::post('/admin-training', [AdminTrainingController::class, 'store'])->name('admin.training.store');
        Route::put('/admin-training/{course}', [AdminTrainingController::class, 'update'])->name('admin.training.update');
        Route::delete('/admin-training/{course}', [AdminTrainingController::class, 'destroy'])->name('admin.training.destroy');
        Route::put('/admin-training/{course}/toggle-publish', [AdminTrainingController::class, 'togglePublish'])->name('admin.training.togglePublish');

        // Training Lessons Management
        Route::get('/admin-training/{course}/lessons', [AdminTrainingLessonController::class, 'index'])->name('admin.training.lessons.index');
        Route::post('/admin-training/{course}/lessons', [AdminTrainingLessonController::class, 'store'])->name('admin.training.lessons.store');
        Route::put('/admin-training/lessons/{lesson}', [AdminTrainingLessonController::class, 'update'])->name('admin.training.lessons.update');
        Route::delete('/admin-training/lessons/{lesson}', [AdminTrainingLessonController::class, 'destroy'])->name('admin.training.lessons.destroy');
        Route::put('/admin-training/lessons/{lesson}/toggle-publish', [AdminTrainingLessonController::class, 'togglePublish'])->name('admin.training.lessons.togglePublish');
    }

    // Billing Management
    Route::get('/admin-billing', [AdminBillingController::class, 'index'])->name('admin.billing.index');
    Route::put('/admin-billing/{user}/subscription', [AdminBillingController::class, 'updateSubscription'])->name('admin.billing.updateSubscription');

    // Published Motifs Management (Admin Moderation)
    Route::prefix('admin-published-motifs')->name('admin.published-motifs.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\AdminPublishedMotifController::class, 'index'])->name('index');
        Route::put('/bulk-approve', [\App\Http\Controllers\Admin\AdminPublishedMotifController::class, 'bulkApprove'])->name('bulk-approve');
        Route::put('/{motif}/approve', [\App\Http\Controllers\Admin\AdminPublishedMotifController::class, 'approve'])->name('approve');
        Route::put('/{motif}/reject', [\App\Http\Controllers\Admin\AdminPublishedMotifController::class, 'reject'])->name('reject');
        Route::put('/{motif}/toggle-featured', [\App\Http\Controllers\Admin\AdminPublishedMotifController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::delete('/{motif}', [\App\Http\Controllers\Admin\AdminPublishedMotifController::class, 'destroy'])->name('destroy');
    });
});

// ============================================================================
// 🌐 ROUTE UNTUK SEMUA AUTHENTICATED USER
// ============================================================================
Route::middleware('auth')->group(function () {
    // API Motif
    Route::get('/api/motifs/editor', [MotifController::class, 'editor'])->name('motifs.editor');
    Route::get('/api/user-motifs', [UserMotifController::class, 'index'])->name('motifs.user.index');
    Route::post('/api/user-motifs', [UserMotifController::class, 'store'])->name('motifs.user.store');

    // API Batik Generator
    Route::post('/api/batik-generator', [BatikGeneratorController::class, 'generate']);
});

// ============================================================================
// 🔒 AUTH SANCTUM
// ============================================================================
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// ============================================================================
// 📡 API PUBLIK
// ============================================================================
Route::prefix('api')->group(function () {
    Route::get('/konveksi', [KonveksiController::class, 'apiIndex']);
});

// ============================================================================
// 📡 SITEMAP & SEO
// ============================================================================
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', [RobotsController::class, 'index'])->name('robots');

// Google Search Console Verification
Route::get('/{filename}', [GoogleSearchConsoleController::class, 'verifyHtml'])
    ->where('filename', 'google[a-f0-9]+\.html')
    ->name('google.verify');

// Optional: Meta tag endpoint
Route::get('/api/google-meta-verification', [GoogleSearchConsoleController::class, 'getMetaTag'])
    ->name('google.meta-verification');

// Optional: Sitemap submission info
Route::post('/api/google-submit-sitemap', [GoogleSearchConsoleController::class, 'submitSitemap'])
    ->name('google.submit-sitemap');

// ============================================================================
// �🔑 AUTH ROUTES
// ============================================================================
require __DIR__ . '/auth.php';

// ============================================================================
// 🚧 ROUTE FALLBACK (404)
// ============================================================================
Route::fallback(function () {
    return Inertia::render('Errors/NotFound', [
        'title' => 'Halaman tidak ditemukan',
    ]);
});
