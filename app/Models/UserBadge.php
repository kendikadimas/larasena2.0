<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBadge extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'badge_key',
        'badge_name',
        'badge_icon',
        'meta',
        'awarded_at'
    ];

    protected $casts = [
        'meta' => 'array',
        'awarded_at' => 'datetime'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
