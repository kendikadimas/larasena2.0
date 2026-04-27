#!/bin/bash

# Script untuk mengecek dan memperbaiki data PublishedMotif di production
echo "=== Checking PublishedMotif data in production ==="

cd /home/larasena/web/larasena.id/public_html/awdawadad

# Check database content
php artisan tinker --execute="
App\Models\PublishedMotif::all()->each(function(\$motif) {
    echo \"ID: {\$motif->id}, Title: {\$motif->title}\n\";
    echo \"Raw image_url: \" . (\$motif->getRawOriginal('image_url') ?: 'NULL') . \"\n\";
    echo \"Raw image_path: \" . (\$motif->getRawOriginal('image_path') ?: 'NULL') . \"\n\";
    echo \"Processed image_url: \" . (\$motif->image_url ?: 'NULL') . \"\n\";
    
    // Check if file exists
    \$filename = basename(\$motif->getRawOriginal('image_url') ?: '');
    if (\$filename) {
        \$filePath = storage_path('app/public/published-motifs/' . \$filename);
        echo \"File exists: \" . (file_exists(\$filePath) ? 'YES' : 'NO') . \"\n\";
        if (file_exists(\$filePath)) {
            echo \"File path: \" . \$filePath . \"\n\";
            echo \"File size: \" . filesize(\$filePath) . \" bytes\n\";
        }
    }
    echo \"---\n\";
});
"