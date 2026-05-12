<?php

namespace App\Models;

use App\Models\Concerns\NormalizesStorageUrl;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Motif extends Model
{
    use HasFactory, NormalizesStorageUrl;

    protected $fillable = [
        'name',
        'description',
        'category',
        'location',
        'file_path',
        'image_url',
        'user_id',
        'is_active',
        'is_featured',
        'colors',
    ];

    protected $casts = [
        'colors' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    // Relationship
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getImageUrlAttribute($value)
    {
        return $this->normalizeStorageUrl($value ?: ($this->attributes['file_path'] ?? null));
    }

    public function getPreviewImagePathAttribute($value)
    {
        return $this->normalizeStorageUrl($value ?: ($this->attributes['file_path'] ?? $this->attributes['image_url'] ?? null));
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getTimeAgoAttribute()
    {
        return $this->created_at->diffForHumans();
    }

    
}