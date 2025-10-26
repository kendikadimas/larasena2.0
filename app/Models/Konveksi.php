<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Konveksi extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'is_verified',
        'rating',
        'no_telp',
        'description',
        'documentation',
        'icon',
        'user_id'
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'rating' => 'decimal:1',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationship
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function productions()
    {
        return $this->hasMany(Production::class, 'convection_id');
    }

    // Scope untuk konveksi terverifikasi
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    // Scope untuk rating tinggi
    public function scopeHighRating($query, $minRating = 4.0)
    {
        return $query->where('rating', '>=', $minRating);
    }

    // Scope untuk pencarian berdasarkan lokasi
    public function scopeByLocation($query, $location)
    {
        return $query->where('location', 'like', '%' . $location . '%');
    }

    // Scope untuk pencarian berdasarkan nama
    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', '%' . $search . '%')
                     ->orWhere('description', 'like', '%' . $search . '%');
    }

    // Accessor untuk mendapatkan URL dokumentasi
    public function getDocumentationUrlAttribute()
    {
        if ($this->documentation) {
            $docs = json_decode($this->documentation, true);
            if (is_array($docs)) {
                return array_map(function($doc) {
                    return asset('storage/' . $doc);
                }, $docs);
            }
        }
        return [];
    }

    // Accessor untuk mendapatkan URL icon
    public function getIconUrlAttribute()
    {
        if ($this->icon) {
            return asset('storage/' . $this->icon);
        }
        return null;
    }

    // Accessor untuk status verifikasi
    public function getVerificationStatusAttribute()
    {
        return $this->is_verified ? 'Terverifikasi' : 'Belum Terverifikasi';
    }
}
