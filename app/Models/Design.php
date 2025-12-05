<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Design extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        // 'description',
        'image_url',
        'canvas_data',
        'canvas_width',
        'canvas_height',
        'user_id',
        'preview_3d_models_id',
    ];

    protected $casts = [
        'canvas_data' => 'array', // Otomatis konversi JSON ke array
        'canvas_width' => 'integer',
        'canvas_height' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function preview3DModel(): BelongsTo
    {
        return $this->belongsTo(Preview3DModel::class, 'preview_3d_models_id');
    }

    public function publishedMotif()
    {
        return $this->hasOne(PublishedMotif::class, 'design_data->design_id');
    }
    
    // Accessor to fix image URL paths
    public function getImageUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }
        
        // First check: Already proper full URLs - return as is without further processing
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            // But if it's localhost/127.0.0.1, convert to production domain
            if (str_contains($value, '127.0.0.1:8000') || str_contains($value, 'localhost:8000')) {
                // Extract the path part after /storage/
                if (preg_match('/\/storage\/(.+)$/', $value, $matches)) {
                    return asset('/storage/' . $matches[1]);
                }
            }
            return $value;
        }
        
        // Clean up malformed URLs
        
        // Pattern: storage/http://... or storage/https://...
        if (str_starts_with($value, 'storage/http://') || str_starts_with($value, 'storage/https://')) {
            // Remove only the first "storage/" prefix, not all occurrences
            $cleanedUrl = preg_replace('/^storage\//', '', $value);
            
            // If it's localhost/127.0.0.1, extract the file path and use production domain
            if (str_contains($cleanedUrl, '127.0.0.1:8000') || str_contains($cleanedUrl, 'localhost:8000')) {
                if (preg_match('/\/storage\/(.+)$/', $cleanedUrl, $matches)) {
                    return asset('/storage/' . $matches[1]);
                }
                // Fallback if no /storage/ found in path
                return $cleanedUrl;
            }
            
            // If it's production domain (larasena.id), extract the file path and recreate properly
            if (str_contains($cleanedUrl, 'larasena.id')) {
                if (preg_match('/\/storage\/(.+)$/', $cleanedUrl, $matches)) {
                    return asset('/storage/' . $matches[1]);
                }
                // Fallback if no /storage/ found in path  
                return $cleanedUrl;
            }
            
            // For other cases, return the cleaned URL
            return $cleanedUrl;
        }
        
        // Pattern: storage//storage/...
        if (str_contains($value, 'storage//storage/')) {
            $cleaned = str_replace('storage//storage/', '', $value);
            return asset('/storage/' . $cleaned);
        }
        
        // Pattern: storage/designs/... (missing leading slash)
        if (str_starts_with($value, 'storage/') && !str_starts_with($value, 'storage/http')) {
            return asset('/' . $value);
        }
        
        // Already proper relative paths with /storage/
        if (str_starts_with($value, '/storage/')) {
            return asset($value);
        }
        
        // Direct paths like designs/generated/... or designs/thumbnails/...
        if (str_starts_with($value, 'designs/')) {
            return asset('/storage/' . $value);
        }
        
        // Direct filenames
        if (!str_contains($value, '/') && (str_ends_with($value, '.jpg') || str_ends_with($value, '.png') || str_ends_with($value, '.jpeg'))) {
            return asset('/storage/designs/' . $value);
        }
        
        // Default: assume it's a path that needs /storage/ prefix
        return asset('/storage/' . ltrim($value, '/'));
    }
}