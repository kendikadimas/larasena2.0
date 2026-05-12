<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Motif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use ZipArchive;

class AdminMotifBulkController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    // Halaman UI Bulk Import
    // ─────────────────────────────────────────────────────────────────────────

    public function index()
    {
        $stats = [
            'total'      => Motif::count(),
            'active'     => Motif::where('is_active', true)->count(),
            'categories' => Motif::distinct()->pluck('category')->filter()->values(),
        ];

        return Inertia::render('Admin/Motifs/BulkImport', [
            'stats' => $stats,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Method 1: ZIP Bundle Upload
    // Admin upload 1 file ZIP berisi banyak SVG/PNG beserta manifest.json
    //
    // Struktur ZIP yang diharapkan:
    // motifs-batch.zip/
    //   ├── manifest.json         ← metadata (opsional)
    //   ├── parang-diagonal.svg
    //   ├── kawung-basic.svg
    //   └── mega-mendung.png
    //
    // manifest.json format:
    // [
    //   { "file": "parang-diagonal.svg", "name": "Parang Diagonal", "category": "Parang" },
    //   { "file": "kawung-basic.svg",     "name": "Kawung Basic",    "category": "Kawung" }
    // ]
    // ─────────────────────────────────────────────────────────────────────────

    public function importZip(Request $request)
    {
        $request->validate([
            'zip_file'        => 'required|file|mimes:zip|max:51200', // max 50MB
            'default_category'=> 'required|string|max:100',
            'default_active'  => 'nullable|boolean',
        ]);

        if (!class_exists('ZipArchive')) {
            return back()->with('error', 'Ekstensi PHP ZipArchive tidak aktif di server ini. Hubungi developer.');
        }

        $zip     = new ZipArchive();
        $zipFile = $request->file('zip_file');
        $tmpPath = $zipFile->getRealPath();

        if ($zip->open($tmpPath) !== true) {
            return back()->with('error', 'File ZIP tidak valid atau tidak dapat dibuka.');
        }

        // Baca manifest jika ada
        $manifest    = [];
        $manifestIdx = $zip->locateName('manifest.json');
        if ($manifestIdx !== false) {
            $manifestData = json_decode($zip->getFromIndex($manifestIdx), true);
            if (is_array($manifestData)) {
                // Key by filename agar mudah di-lookup
                foreach ($manifestData as $entry) {
                    if (!empty($entry['file'])) {
                        $manifest[$entry['file']] = $entry;
                    }
                }
            }
        }

        $allowedExtensions = ['svg', 'png', 'jpg', 'jpeg'];
        $defaultCategory   = $request->input('default_category');
        $defaultActive     = $request->boolean('default_active', true);

        $imported = 0;
        $skipped  = 0;
        $errors   = [];

        DB::beginTransaction();

        try {
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $filename  = $zip->getNameIndex($i);
                $ext       = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
                $basename  = basename($filename);

                // Skip directory entries, manifest, hidden files
                if (
                    str_ends_with($filename, '/')
                    || $basename === 'manifest.json'
                    || str_starts_with($basename, '.')
                    || !in_array($ext, $allowedExtensions)
                ) {
                    continue;
                }

                $fileContent = $zip->getFromIndex($i);
                if ($fileContent === false) {
                    $errors[] = "Gagal membaca: {$basename}";
                    $skipped++;
                    continue;
                }

                // Nama bersih dari filename jika tidak ada di manifest
                $meta = $manifest[$basename] ?? [];
                $name = $meta['name'] ?? $this->filenameToName($basename);
                $category = $meta['category'] ?? $meta['type'] ?? $defaultCategory;

                // Simpan ke storage
                $storedName = time() . '_' . $i . '_' . Str::slug(pathinfo($basename, PATHINFO_FILENAME)) . '.' . $ext;
                $storedPath = 'motifs/admin/' . $storedName;

                Storage::disk('public')->put($storedPath, $fileContent);

                Motif::create([
                    'name'      => $name,
                    'category'  => $category,
                    'file_path' => $storedPath,
                    'image_url' => $storedPath,
                    'is_active' => $defaultActive,
                    'user_id'   => null,
                ]);

                $imported++;
            }

            $zip->close();
            DB::commit();

            return back()->with('success', "Berhasil import {$imported} motif." . ($skipped > 0 ? " {$skipped} dilewati." : ''));

        } catch (\Throwable $e) {
            DB::rollBack();
            $zip->close();
            \Log::error('ZIP import error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat import: ' . $e->getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Method 2: Multi-file Upload (drag & drop banyak file sekaligus)
    // Admin pilih banyak SVG/PNG → semua masuk satu batch dengan 1 form submit
    // ─────────────────────────────────────────────────────────────────────────

    public function importMultifile(Request $request)
    {
        $request->validate([
            'files'           => 'required|array|min:1|max:100',
            'files.*'         => 'required|file|mimes:svg,png,jpg,jpeg|max:5120',
            'default_category'=> 'required|string|max:100',
            'default_active'  => 'nullable|boolean',
            // metadata per-file (opsional, dikirim sebagai JSON string)
            'metadata'        => 'nullable|string',
        ]);

        $defaultCategory = $request->input('default_category');
        $defaultActive   = $request->boolean('default_active', true);

        // Parse per-file metadata jika ada (format: {"filename.svg": {"name": "...", "category": "..."}})
        $metadata = [];
        if ($request->filled('metadata')) {
            $metadata = json_decode($request->input('metadata'), true) ?? [];
        }

        $imported = 0;
        $errors   = [];

        DB::beginTransaction();

        try {
            foreach ($request->file('files') as $file) {
                $originalName = $file->getClientOriginalName();
                $ext          = strtolower($file->getClientOriginalExtension());

                $meta     = $metadata[$originalName] ?? [];
                $name     = $meta['name'] ?? $this->filenameToName($originalName);
                $category = $meta['category'] ?? $defaultCategory;

                $storedName = time() . '_' . Str::random(6) . '_' . Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '.' . $ext;
                $storedPath = $file->storeAs('motifs/admin', $storedName, 'public');

                Motif::create([
                    'name'      => $name,
                    'category'  => $category,
                    'file_path' => $storedPath,
                    'image_url' => $storedPath,
                    'is_active' => $defaultActive,
                    'user_id'   => null,
                ]);

                $imported++;
            }

            DB::commit();
            return back()->with('success', "Berhasil upload {$imported} motif.");

        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Multi-file import error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Method 3: JSON Metadata Import
    // Untuk situasi di mana file sudah ada di storage (via FTP/cPanel)
    // Admin upload JSON berisi mapping file path → metadata
    //
    // Format JSON:
    // [
    //   { "file_path": "motifs/admin/parang.svg", "name": "Parang Classic", "category": "Parang" },
    //   { "file_path": "motifs/admin/kawung.svg", "name": "Kawung Dasar",   "category": "Kawung" }
    // ]
    // ─────────────────────────────────────────────────────────────────────────

    public function importJson(Request $request)
    {
        $request->validate([
            'json_file' => 'required|file|mimes:json|max:2048',
        ]);

        $content = file_get_contents($request->file('json_file')->getRealPath());
        $entries = json_decode($content, true);

        if (!is_array($entries)) {
            return back()->with('error', 'Format JSON tidak valid. Harus berupa array.');
        }

        $imported = 0;
        $skipped  = 0;

        DB::beginTransaction();

        try {
            foreach ($entries as $entry) {
                if (empty($entry['file_path']) || empty($entry['name']) || empty($entry['category'])) {
                    $skipped++;
                    continue;
                }

                // Verifikasi file ada di storage
                if (!Storage::disk('public')->exists($entry['file_path'])) {
                    $skipped++;
                    continue;
                }

                // Cegah duplicate
                if (Motif::where('file_path', $entry['file_path'])->exists()) {
                    $skipped++;
                    continue;
                }

                Motif::create([
                    'name'        => $entry['name'],
                    'description' => $entry['description'] ?? null,
                    'category'    => $entry['category'],
                    'file_path'   => $entry['file_path'],
                    'image_url'   => $entry['file_path'],
                    'is_active'   => $entry['is_active'] ?? true,
                    'user_id'     => null,
                ]);

                $imported++;
            }

            DB::commit();
            return back()->with('success', "Berhasil import {$imported} motif." . ($skipped > 0 ? " {$skipped} dilewati (file tidak ditemukan atau duplikat)." : ''));

        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Bulk Activate / Deactivate / Delete
    // ─────────────────────────────────────────────────────────────────────────

    public function bulkAction(Request $request)
    {
        $request->validate([
            'action'  => 'required|in:activate,deactivate,delete',
            'ids'     => 'required|array|min:1',
            'ids.*'   => 'integer|exists:motifs,id',
        ]);

        $ids    = $request->input('ids');
        $action = $request->input('action');

        switch ($action) {
            case 'activate':
                Motif::whereIn('id', $ids)->update(['is_active' => true]);
                return back()->with('success', count($ids) . ' motif diaktifkan.');

            case 'deactivate':
                Motif::whereIn('id', $ids)->update(['is_active' => false]);
                return back()->with('success', count($ids) . ' motif dinonaktifkan.');

            case 'delete':
                $motifs = Motif::whereIn('id', $ids)->get();
                foreach ($motifs as $motif) {
                    if ($motif->file_path && Storage::disk('public')->exists($motif->file_path)) {
                        Storage::disk('public')->delete($motif->file_path);
                    }
                    $motif->delete();
                }
                return back()->with('success', count($ids) . ' motif dihapus.');
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: Konversi nama file ke nama yang readable
    // "parang-diagonal-modern.svg" → "Parang Diagonal Modern"
    // ─────────────────────────────────────────────────────────────────────────

    private function filenameToName(string $filename): string
    {
        $name = pathinfo($filename, PATHINFO_FILENAME);
        $name = str_replace(['-', '_'], ' ', $name);
        return Str::title($name);
    }
}
