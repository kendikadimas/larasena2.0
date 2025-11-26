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
        'image_path',
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
    public function getImageUrlAttribute()
    {
        if (!$this->image_path) {
            return null;
        }
        
        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }
        
        return asset('storage/' . str_replace('storage/', '', $this->image_path));
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
