<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotifLike extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'published_motif_id'
    ];

    public $timestamps = true;

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function motif()
    {
        return $this->belongsTo(PublishedMotif::class, 'published_motif_id');
    }
}
