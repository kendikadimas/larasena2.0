<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\PublishedMotif;

echo "=== PublishedMotif Debug di Production ===\n\n";

$motifs = PublishedMotif::all();

if ($motifs->isEmpty()) {
    echo "Tidak ada data PublishedMotif di database.\n";
} else {
    echo "Total motifs: " . $motifs->count() . "\n\n";
    
    foreach ($motifs as $motif) {
        echo "ID: {$motif->id}\n";
        echo "Title: {$motif->title}\n";
        echo "Raw image_url: " . ($motif->getRawOriginal('image_url') ?: 'NULL') . "\n";
        echo "Raw image_path: " . ($motif->getRawOriginal('image_path') ?: 'NULL') . "\n";
        echo "Processed image_url: " . ($motif->image_url ?: 'NULL') . "\n";
        
        // Cek file existence
        $rawUrl = $motif->getRawOriginal('image_url');
        if ($rawUrl) {
            $filename = basename($rawUrl);
            $filePath = storage_path('app/public/published-motifs/' . $filename);
            $fileExists = file_exists($filePath);
            
            echo "Filename: {$filename}\n";
            echo "File path: {$filePath}\n";
            echo "File exists: " . ($fileExists ? 'YES' : 'NO') . "\n";
            
            if ($fileExists) {
                echo "File size: " . number_format(filesize($filePath)) . " bytes\n";
                echo "File permissions: " . substr(sprintf('%o', fileperms($filePath)), -4) . "\n";
            }
            
            // Cek public URL
            $publicPath = public_path('storage/published-motifs/' . $filename);
            echo "Public path: {$publicPath}\n";
            echo "Public file exists: " . (file_exists($publicPath) ? 'YES' : 'NO') . "\n";
        }
        
        echo "---\n";
    }
}

// Cek symlink
echo "\n=== Symlink Check ===\n";
$symlinkPath = public_path('storage');
if (is_link($symlinkPath)) {
    echo "Symlink exists: YES\n";
    echo "Symlink target: " . readlink($symlinkPath) . "\n";
    echo "Symlink valid: " . (file_exists($symlinkPath) ? 'YES' : 'NO') . "\n";
} else {
    echo "Symlink exists: NO\n";
}

// Test specific problematic files
echo "\n=== Test Specific Files ===\n";
$testFiles = [
    'DCVr7xZhsAbQ6eoImgRgamZvFBHK9glY55Lbus9u.jpg',
    'FGY0sZZjejsxWaCXdkAijQug646F2bOsBDtqaqoF.jpg',
    '1YSmlrLLU49XcqPqNlkst4VY99tIrzOgd5cE8LCx.jpg'
];

foreach ($testFiles as $filename) {
    $storagePath = storage_path('app/public/published-motifs/' . $filename);
    $publicPath = public_path('storage/published-motifs/' . $filename);
    
    echo "File: {$filename}\n";
    echo "Storage exists: " . (file_exists($storagePath) ? 'YES' : 'NO') . "\n";
    echo "Public exists: " . (file_exists($publicPath) ? 'YES' : 'NO') . "\n";
    echo "Expected URL: " . url('/storage/published-motifs/' . $filename) . "\n";
    echo "---\n";
}

echo "\nDone.\n";