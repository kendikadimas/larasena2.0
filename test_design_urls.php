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
    'http://127.0.0.1:8000/storage/designs/generated/3_1754808326.jpg',
    'storage/http://127.0.0.1:8000/storage/designs/generated/3_1754808326.jpg',
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
    echo "Output: " . ($mockDesign->image_url ?: 'NULL') . "\n";
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