<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PublishedMotif extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'philosophy',
        'origin',
        'category',
        'image_path',
        'image_url',
        'design_data',
        'status',
        'rejection_reason',
        'likes_count',
        'views_count',
        'is_featured',
        'published_at'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
        'likes_count' => 'integer',
        'views_count' => 'integer'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($motif) {
            if (empty($motif->slug)) {
                $motif->slug = Str::slug($motif->title);
                
                // Ensure unique slug
                $originalSlug = $motif->slug;
                $counter = 1;
                while (static::where('slug', $motif->slug)->exists()) {
                    $motif->slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(MotifLike::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopePublished($query)
    {
        return $query->approved()->whereNotNull('published_at');
    }

    // Accessors
    public function getImageUrlAttribute($value)
    {
        // If image_url is already stored in database, use it
        if (!empty($value)) {
            // Clean up malformed URLs - various patterns from the error log
            
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
            
            // Direct filenames without path (like uK1cP8I4k8CQQhG9ga5RLIBUSGrWqdu37QguPErJ.jpg)
            if (!str_contains($value, '/') && (str_ends_with($value, '.jpg') || str_ends_with($value, '.png') || str_ends_with($value, '.jpeg'))) {
                return asset('/storage/motifs/' . $value);
            }
            
            // Default: assume it's a path that needs /storage/ prefix
            return asset('/storage/' . ltrim($value, '/'));
        }

        // Fall back to image_path if image_url is empty
        if (!empty($this->attributes['image_path'])) {
            $imagePath = $this->attributes['image_path'];
            
            // Clean up double storage paths
            $imagePath = str_replace(['storage/storage/', 'storage/', '/storage/'], '', $imagePath);
            $imagePath = ltrim($imagePath, '/');
            
            return asset('/storage/' . $imagePath);
        }

        return null;
    }

    // Methods
    public function incrementViews()
    {
        $this->increment('views_count');
    }

    public function isLikedBy($user)
    {
        if (!$user) return false;
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    public function approve()
    {
        $this->update([
            'status' => 'approved',
            'published_at' => now(),
            'rejection_reason' => null
        ]);

        // Award badge to user
        $this->user->awardBadge('first-publish', 'First Published Motif', '🎨');
    }

    public function reject($reason)
    {
        $this->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
            'published_at' => null
        ]);
    }
}
