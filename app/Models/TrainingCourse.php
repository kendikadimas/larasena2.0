<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingCourse extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'level',
        'thumbnail',
        'certificate_file',
        'duration_minutes',
        'total_lessons',
        'is_published',
        'order'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'duration_minutes' => 'integer',
        'total_lessons' => 'integer',
        'order' => 'integer'
    ];

    public function lessons()
    {
        return $this->hasMany(TrainingLesson::class, 'training_course_id')->orderBy('order');
    }

    public function progress()
    {
        return $this->hasMany(TrainingProgress::class, 'training_course_id');
    }

    public function certificates()
    {
        return $this->hasMany(TrainingCertificate::class, 'training_course_id');
    }

    // Get user's progress for this course
    public function userProgress($userId)
    {
        return $this->progress()->where('user_id', $userId)->first();
    }

    // Get thumbnail URL
    public function getThumbnailUrlAttribute()
    {
        if (!$this->thumbnail) {
            return null;
        }
        
        if (str_starts_with($this->thumbnail, 'http')) {
            return $this->thumbnail;
        }
        
        return asset('storage/' . str_replace('storage/', '', $this->thumbnail));
    }

    // Get certificate file URL
    public function getCertificateFileUrlAttribute()
    {
        if (!$this->certificate_file) {
            return null;
        }
        
        if (str_starts_with($this->certificate_file, 'http')) {
            return $this->certificate_file;
        }
        
        return asset('storage/' . str_replace('storage/', '', $this->certificate_file));
    }

    // Get level badge color
    public function getLevelColorAttribute()
    {
        return match($this->level) {
            'dasar' => '#10B981',     // green
            'menengah' => '#F59E0B',  // amber
            'lanjutan' => '#EF4444',  // red
            default => '#6B7280'      // gray
        };
    }

    // Get level label
    public function getLevelLabelAttribute()
    {
        return match($this->level) {
            'dasar' => 'Dasar',
            'menengah' => 'Menengah',
            'lanjutan' => 'Lanjutan',
            default => 'Unknown'
        };
    }
}
