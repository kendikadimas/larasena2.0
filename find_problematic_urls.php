<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Design;

echo "=== Searching for Problematic URLs ===\n\n";

// Search for designs with potentially problematic URLs
$problematicPatterns = [
    'http://localhost/%',
    'http://127.0.0.1%',
    'storage/http%',
    '%/storage/http%',
    '%localhost/designs%',
];

$foundProblems = false;

foreach ($problematicPatterns as $pattern) {
    echo "Searching pattern: {$pattern}\n";
    
    $designs = Design::where('image_url', 'LIKE', $pattern)->get();
    
    if ($designs->count() > 0) {
        $foundProblems = true;
        echo "Found {$designs->count()} designs:\n";
        
        foreach ($designs as $design) {
            $rawUrl = $design->getRawOriginal('image_url');
            $processedUrl = $design->image_url;
            
            echo "  ID: {$design->id}\n";
            echo "  Title: " . ($design->title ?: 'Untitled') . "\n";
            echo "  Raw: '{$rawUrl}'\n";
            echo "  Processed: '{$processedUrl}'\n";
            
            if (str_contains($processedUrl, '/storage/http://') || str_contains($processedUrl, '/storage/https://')) {
                echo "  ❌ DOUBLE URL PROBLEM!\n";
            } else {
                echo "  ✅ Fixed by accessor\n";
            }
            echo "  ---\n";
        }
    } else {
        echo "No matches found.\n";
    }
    echo "\n";
}

if (!$foundProblems) {
    echo "🎉 No problematic URL patterns found in database!\n";
    echo "All URLs should be working correctly now.\n\n";
    
    // Let's check the most recent 20 to be sure
    echo "=== Recent 20 Designs Check ===\n";
    $recent = Design::select('id', 'title', 'image_url')->latest()->limit(20)->get();
    
    foreach ($recent as $design) {
        $processedUrl = $design->image_url;
        if (str_contains($processedUrl, '/storage/http://') || str_contains($processedUrl, '/storage/https://')) {
            echo "❌ ID {$design->id}: {$processedUrl}\n";
            $foundProblems = true;
        }
    }
    
    if (!$foundProblems) {
        echo "✅ All recent designs have correct URLs!\n";
    }
}

echo "\nDone.\n";