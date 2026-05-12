<?php

namespace App\Console\Commands;

use App\Models\Motif;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImportMotifsFromFolder extends Command
{
    /**
     * php artisan motifs:import {folder} {--category=Umum} {--active} {--dry-run}
     *
     * Contoh:
     *   php artisan motifs:import storage/app/public/motifs/parang --category=Parang --active
     *   php artisan motifs:import /var/www/html/batik-assets --category=Kawung --dry-run
     */
    protected $signature = 'motifs:import
                            {folder : Path folder berisi file SVG/PNG}
                            {--category=Umum : Kategori default untuk semua motif}
                            {--active : Set motif menjadi aktif langsung}
                            {--dry-run : Preview tanpa menyimpan ke database}
                            {--recursive : Scan subfolder juga}';

    protected $description = 'Import motif canvas elements dari folder lokal ke database Larasena';

    private array $allowedExtensions = ['svg', 'png', 'jpg', 'jpeg'];

    public function handle(): int
    {
        $folderPath  = rtrim($this->argument('folder'), '/\\');
        $category    = $this->option('category');
        $isActive    = $this->option('active');
        $isDryRun    = $this->option('dry-run');
        $isRecursive = $this->option('recursive');

        // ── Validasi folder ──────────────────────────────────────────────
        if (!is_dir($folderPath)) {
            $this->error("Folder tidak ditemukan: {$folderPath}");
            return self::FAILURE;
        }

        $this->info("📂 Scanning folder: {$folderPath}");
        $this->info("📁 Kategori default: {$category}");
        $this->info("🔍 Mode: " . ($isDryRun ? 'DRY RUN (tidak menyimpan)' : 'IMPORT'));
        $this->newLine();

        // ── Collect files ────────────────────────────────────────────────
        $pattern = $isRecursive
            ? $folderPath . '/**/*'
            : $folderPath . '/*';

        $files = $this->collectFiles($folderPath, $isRecursive);

        if (empty($files)) {
            $this->warn('Tidak ada file SVG/PNG ditemukan di folder tersebut.');
            return self::SUCCESS;
        }

        $this->info("📋 Ditemukan " . count($files) . " file gambar\n");

        // ── Preview table ────────────────────────────────────────────────
        $rows = [];
        foreach ($files as $filePath) {
            $basename  = basename($filePath);
            $ext       = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            $name      = Str::title(str_replace(['-', '_'], ' ', pathinfo($filePath, PATHINFO_FILENAME)));
            $duplicate = Motif::whereRaw("file_path LIKE ?", ['%' . $basename])->exists() ? '⚠️ Duplikat' : '✅ Baru';
            $rows[]    = [$basename, $name, $category, $ext, $duplicate];
        }

        $this->table(['File', 'Nama', 'Kategori', 'Tipe', 'Status'], $rows);
        $this->newLine();

        if ($isDryRun) {
            $this->info('DRY RUN selesai. Tidak ada yang disimpan.');
            return self::SUCCESS;
        }

        // ── Konfirmasi ───────────────────────────────────────────────────
        if (!$this->confirm("Lanjutkan import " . count($files) . " motif ke database?")) {
            $this->info('Import dibatalkan.');
            return self::SUCCESS;
        }

        // ── Import ───────────────────────────────────────────────────────
        $bar      = $this->output->createProgressBar(count($files));
        $imported = 0;
        $skipped  = 0;

        $bar->start();

        foreach ($files as $absolutePath) {
            $basename = basename($absolutePath);
            $ext      = strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION));
            $name     = Str::title(str_replace(['-', '_'], ' ', pathinfo($absolutePath, PATHINFO_FILENAME)));

            // Copy ke storage Laravel
            $storedFilename = time() . '_' . Str::random(4) . '_' . Str::slug(pathinfo($absolutePath, PATHINFO_FILENAME)) . '.' . $ext;
            $storedPath     = 'motifs/admin/' . $storedFilename;

            $fileContent = file_get_contents($absolutePath);

            if ($fileContent === false) {
                $skipped++;
                $bar->advance();
                continue;
            }

            // Skip duplikat
            if (Motif::whereRaw("file_path LIKE ?", ['%' . $basename])->exists()) {
                $skipped++;
                $bar->advance();
                continue;
            }

            Storage::disk('public')->put($storedPath, $fileContent);

            Motif::create([
                'name'      => $name,
                'category'  => $category,
                'file_path' => $storedPath,
                'image_url' => $storedPath,
                'is_active' => $isActive,
                'user_id'   => null,
            ]);

            $imported++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("✅ Berhasil import: {$imported} motif");
        if ($skipped > 0) {
            $this->warn("⏭️  Dilewati (duplikat/error): {$skipped} motif");
        }

        return self::SUCCESS;
    }

    private function collectFiles(string $folder, bool $recursive): array
    {
        $files = [];

        if ($recursive) {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($folder, \FilesystemIterator::SKIP_DOTS)
            );
        } else {
            $iterator = new \DirectoryIterator($folder);
        }

        foreach ($iterator as $file) {
            if ($file->isDir()) continue;
            $ext = strtolower($file->getExtension());
            if (in_array($ext, $this->allowedExtensions)) {
                $files[] = $file->getRealPath();
            }
        }

        return $files;
    }
}
