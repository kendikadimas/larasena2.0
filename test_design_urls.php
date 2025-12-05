<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Design;

echo "=== Testing Design URL Accessor ===\n\n";

// Test cases for URL processing
$testUrls = [
    'https://larasena.id/storage/designs/generated/3_1761487967.jpg',
    'http://localhost/storage/designs/generated/3_1760144183.jpg',
    'http://localhost/designs/thumbnails/3_1758427073.jpg', // New problem case
    'http://127.0.0.1:8000/storage/designs/generated/3_1754808326.jpg',
    'storage/http://127.0.0.1:8000/storage/designs/generated/3_1754808326.jpg',
    'storage/https://larasena.id/storage/designs/thumbnails/3_1760143679.jpg',
    'storage/designs/generated/3_1760144183.jpg',
    'designs/generated/3_1760144183.jpg',
    '/storage/designs/generated/3_1760144183.jpg',
    'storage/https://larasena.id/storage/designs/generated/3_1754736278.jpg',
    'storage//storage/designs/thumbnails/3_1754736293.jpg',
];

foreach ($testUrls as $testUrl) {
    $mockDesign = new Design();
    $mockDesign->setRawAttributes(['image_url' => $testUrl]);
    
    echo "Input: {$testUrl}\n";
    $output = $mockDesign->image_url ?: 'NULL';
    echo "Output: {$output}\n";
    
    // Debug problematic cases
    if (str_starts_with($testUrl, 'storage/http://') || str_starts_with($testUrl, 'storage/https://')) {
        $cleaned = str_replace('storage/', '', $testUrl);
        echo "  Debug - Cleaned URL: {$cleaned}\n";
        if (str_contains($cleaned, '127.0.0.1:8000') || str_contains($cleaned, 'localhost:8000')) {
            echo "  Debug - Contains localhost/127.0.0.1\n";
            if (preg_match('/\/storage\/(.+)$/', $cleaned, $matches)) {
                echo "  Debug - Regex match: {$matches[1]}\n";
            } else {
                echo "  Debug - No regex match\n";
            }
        }
        if (str_contains($cleaned, 'larasena.id')) {
            echo "  Debug - Contains larasena.id\n";
            echo "  Debug - Cleaned string: '{$cleaned}'\n";
            if (preg_match('/\/storage\/(.+)$/', $cleaned, $matches)) {
                echo "  Debug - Regex match: {$matches[1]}\n";
            } else {
                echo "  Debug - No regex match (looking for /storage/ pattern)\n";
                // Check if there's any storage in the string
                if (str_contains($cleaned, 'storage')) {
                    echo "  Debug - But 'storage' exists in: " . $cleaned . "\n";
                }
            }
        }
    }
    
    echo "---\n";
}

echo "\n=== Real Design Data from Database ===\n";

$designs = Design::select('id', 'title', 'image_url')->latest()->limit(5)->get();

foreach ($designs as $design) {
    echo "ID: {$design->id}\n";
    echo "Title: " . ($design->title ?: 'Untitled') . "\n";
    echo "Raw image_url: " . ($design->getRawOriginal('image_url') ?: 'NULL') . "\n";
    echo "Processed image_url: " . ($design->image_url ?: 'NULL') . "\n";
    echo "---\n";
}

echo "\nDone.\n";