<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Design;

echo "=== Production Debug - Design URL Processing ===\n\n";

// Get recent designs to see what's actually in database
$designs = Design::select('id', 'title', 'image_url')->latest()->limit(10)->get();

foreach ($designs as $design) {
    $rawUrl = $design->getRawOriginal('image_url');
    $processedUrl = $design->image_url;
    
    echo "Design ID: {$design->id}\n";
    echo "Title: " . ($design->title ?: 'Untitled') . "\n";
    echo "Raw URL: '{$rawUrl}'\n";
    echo "Processed URL: '{$processedUrl}'\n";
    
    // Check if it's a problematic double URL
    if (str_contains($processedUrl, '/storage/http://') || str_contains($processedUrl, '/storage/https://')) {
        echo "❌ PROBLEM: Double URL detected!\n";
        
        // Show what should happen step by step
        echo "Step-by-step processing:\n";
        
        if (str_starts_with($rawUrl, 'http://') || str_starts_with($rawUrl, 'https://')) {
            echo "1. Raw URL starts with http/https: YES\n";
            
            if (str_contains($rawUrl, 'localhost/designs/') || str_contains($rawUrl, '127.0.0.1:8000/designs/')) {
                echo "2. Contains localhost/designs/ without storage: YES\n";
                if (preg_match('/\/(designs\/.+)$/', $rawUrl, $matches)) {
                    $expectedUrl = asset('/storage/' . $matches[1]);
                    echo "3. Expected result: {$expectedUrl}\n";
                }
            } else if (str_contains($rawUrl, '127.0.0.1:8000') || str_contains($rawUrl, 'localhost:8000')) {
                echo "2. Contains localhost with port: YES\n";
                if (preg_match('/\/storage\/(.+)$/', $rawUrl, $matches)) {
                    $expectedUrl = asset('/storage/' . $matches[1]);
                    echo "3. Expected result: {$expectedUrl}\n";
                }
            } else {
                echo "2. Should return as-is: YES\n";
                echo "3. Expected result: {$rawUrl}\n";
            }
        }
    } else {
        echo "✅ URL looks correct\n";
    }
    
    echo "---\n";
}

echo "\n=== Environment Check ===\n";
echo "APP_URL: " . config('app.url') . "\n";
echo "Asset helper result for '/storage/test': " . asset('/storage/test') . "\n";

echo "\nDone.\n";