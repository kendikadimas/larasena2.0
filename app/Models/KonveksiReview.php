<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KonveksiReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'konveksi_id',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function konveksi()
    {
        return $this->belongsTo(Konveksi::class);
    }
}
