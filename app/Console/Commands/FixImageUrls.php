<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PublishedMotif;
use App\Models\Design;
use App\Models\UserMotif;
use Illuminate\Support\Facades\Storage;

class FixImageUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:image-urls';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix corrupted image URLs in database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to fix image URLs...');
        
        // Fix PublishedMotif image URLs
        $this->fixPublishedMotifUrls();
        
        // Fix Design image URLs  
        $this->fixDesignUrls();
        
        $this->info('Image URL fixing completed!');
    }
    
    private function fixPublishedMotifUrls()
    {
        $this->info('Fixing PublishedMotif URLs...');
        
        $motifs = PublishedMotif::all();
        $fixed = 0;
        
        foreach ($motifs as $motif) {
            $originalUrl = $motif->getRawOriginal('image_url');
            $originalPath = $motif->getRawOriginal('image_path');
            
            $needsUpdate = false;
            $newUrl = null;
            $newPath = null;
            
            // Clean up malformed image_url
            if ($originalUrl) {
                if (str_contains($originalUrl, 'storage/http://') || str_contains($originalUrl, 'storage/https://')) {
                    $newUrl = str_replace(['storage/http://', 'storage/https://'], ['http://', 'https://'], $originalUrl);
                    $needsUpdate = true;
                } elseif (str_contains($originalUrl, 'storage//storage/')) {
                    $newUrl = str_replace('storage//storage/', '/storage/', $originalUrl);
                    $needsUpdate = true;
                }
            }
            
            // Clean up image_path
            if ($originalPath) {
                if (str_contains($originalPath, 'storage/storage/')) {
                    $newPath = str_replace('storage/storage/', '', $originalPath);
                    $needsUpdate = true;
                } elseif (str_starts_with($originalPath, 'http://') || str_starts_with($originalPath, 'https://')) {
                    // Extract filename from URL and create proper path
                    $filename = basename(parse_url($originalPath, PHP_URL_PATH));
                    $newPath = 'motifs/' . $filename;
                    $needsUpdate = true;
                }
            }
            
            if ($needsUpdate) {
                $updateData = [];
                if ($newUrl !== null) $updateData['image_url'] = $newUrl;
                if ($newPath !== null) $updateData['image_path'] = $newPath;
                
                $motif->update($updateData);
                $fixed++;
                
                $this->line("Fixed motif #{$motif->id}: {$motif->title}");
            }
        }
        
        $this->info("Fixed {$fixed} PublishedMotif records");
    }
    
    private function fixDesignUrls()
    {
        $this->info('Fixing Design URLs...');
        
        $designs = Design::all();
        $fixed = 0;
        
        foreach ($designs as $design) {
            $originalGenerated = $design->getRawOriginal('generated_image_path');
            $originalThumbnail = $design->getRawOriginal('thumbnail_path');
            
            $needsUpdate = false;
            $updateData = [];
            
            // Clean up generated_image_path
            if ($originalGenerated) {
                if (str_contains($originalGenerated, 'storage/http://') || str_contains($originalGenerated, 'storage/https://')) {
                    $updateData['generated_image_path'] = str_replace(['storage/http://', 'storage/https://'], ['http://', 'https://'], $originalGenerated);
                    $needsUpdate = true;
                } elseif (str_contains($originalGenerated, 'storage/storage/')) {
                    $updateData['generated_image_path'] = str_replace('storage/storage/', '', $originalGenerated);
                    $needsUpdate = true;
                }
            }
            
            // Clean up thumbnail_path
            if ($originalThumbnail) {
                if (str_contains($originalThumbnail, 'storage/http://') || str_contains($originalThumbnail, 'storage/https://')) {
                    $updateData['thumbnail_path'] = str_replace(['storage/http://', 'storage/https://'], ['http://', 'https://'], $originalThumbnail);
                    $needsUpdate = true;
                } elseif (str_contains($originalThumbnail, 'storage/storage/')) {
                    $updateData['thumbnail_path'] = str_replace('storage/storage/', '', $originalThumbnail);
                    $needsUpdate = true;
                }
            }
            
            if ($needsUpdate) {
                $design->update($updateData);
                $fixed++;
                
                $this->line("Fixed design #{$design->id}");
            }
        }
        
        $this->info("Fixed {$fixed} Design records");
    }
}
