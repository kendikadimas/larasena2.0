<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'badge',
        'profile_photo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relasi ke Design
     */
    public function designs()
    {
        return $this->hasMany(Design::class);
    }

    // Pengguna bisa mengunggah banyak motif
    public function motifs(): HasMany
    {
        return $this->hasMany(Motif::class);
    }
    
    // ✅ Alias untuk productions (semua pesanan yang dibuat user sebagai customer)
    public function productions(): HasMany
    {
        return $this->hasMany(Production::class, 'user_id');
    }

    // Pesanan produksi yang dibuat oleh pengguna (sebagai customer)
    public function productionOrders(): HasMany
    {
        return $this->hasMany(Production::class, 'user_id');
    }

    // Pekerjaan produksi yang dikerjakan oleh pengguna (sebagai konveksi)
    public function convectionJobs(): HasMany
    {
        return $this->hasMany(Production::class, 'convection_user_id');
    }

    // Published Motifs
    public function publishedMotifs(): HasMany
    {
        return $this->hasMany(PublishedMotif::class);
    }

    // Boutique Products
    public function boutiqueProducts(): HasMany
    {
        return $this->hasMany(BoutiqueProduct::class);
    }

    // Badges
    public function badges(): HasMany
    {
        return $this->hasMany(UserBadge::class);
    }

    /**
     * Get badge display name
     */
    public function getBadgeNameAttribute()
    {
        return match($this->badge) {
            'boutique' => 'Boutique',
            'artisan' => 'Artisan',
            default => 'Community',
        };
    }

    /**
     * Check if user has specific badge
     */
    public function hasBadge($badge)
    {
        return $this->badge === $badge;
    }

    // Motif Likes
    public function motifLikes(): HasMany
    {
        return $this->hasMany(MotifLike::class);
    }

    // Award badge to user
    public function awardBadge($badgeKey, $badgeName, $badgeIcon = null, $meta = [])
    {
        if (!$this->badges()->where('badge_key', $badgeKey)->exists()) {
            $this->badges()->create([
                'badge_key' => $badgeKey,
                'badge_name' => $badgeName,
                'badge_icon' => $badgeIcon,
                'meta' => $meta,
                'awarded_at' => now()
            ]);
        }
    }

    // Get profile photo URL
    public function getProfilePhotoUrlAttribute()
    {
        if (!$this->profile_photo) {
            return null;
        }
        
        if (str_starts_with($this->profile_photo, 'http')) {
            return $this->profile_photo;
        }
        
        return asset('storage/' . str_replace('storage/', '', $this->profile_photo));
    }
}
