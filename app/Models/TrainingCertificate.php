<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'training_course_id',
        'certificate_number',
        'issued_at'
    ];

    protected $casts = [
        'issued_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(TrainingCourse::class, 'training_course_id');
    }

    // Generate unique certificate number
    public static function generateCertificateNumber()
    {
        $prefix = 'CERT-BATIK-';
        $date = now()->format('Ymd');
        $random = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));
        
        return $prefix . $date . '-' . $random;
    }

    // Get certificate file URL
    public function getCertificateUrlAttribute()
    {
        if (!$this->certificate_file) {
            return null;
        }
        
        if (str_starts_with($this->certificate_file, 'http')) {
            return $this->certificate_file;
        }
        
        return asset('storage/' . str_replace('storage/', '', $this->certificate_file));
    }
}
