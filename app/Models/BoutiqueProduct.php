<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BoutiqueProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'motif_id',
        'name',
        'description',
        'price',
        'stock',
        'sizes',
        'photos',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sizes' => 'array',
        'photos' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Relasi ke User (Boutique owner)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Motif
     */
    public function motif(): BelongsTo
    {
        return $this->belongsTo(Motif::class);
    }
}
