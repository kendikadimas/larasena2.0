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
        
        // Clean up malformed URLs similar to PublishedMotif
        
        // Pattern: storage/http://localhost:8000/storage/...
        if (str_starts_with($value, 'storage/http://') || str_starts_with($value, 'storage/https://')) {
            $cleanedUrl = str_replace('storage/', '', $value);
            // If it doesn't contain /storage/ after cleaning, it means we removed the wrong storage/
            if (!str_contains($cleanedUrl, '/storage/')) {
                // Extract the path after the domain and add /storage/ back
                $parsedUrl = parse_url($cleanedUrl);
                $pathParts = explode('/', ltrim($parsedUrl['path'], '/'));
                if (!empty($pathParts) && $pathParts[0] !== 'storage') {
                    array_unshift($pathParts, 'storage');
                }
                $newPath = '/' . implode('/', $pathParts);
                return $parsedUrl['scheme'] . '://' . $parsedUrl['host'] . (isset($parsedUrl['port']) ? ':' . $parsedUrl['port'] : '') . $newPath;
            }
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
        
        // Already proper full URLs
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
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