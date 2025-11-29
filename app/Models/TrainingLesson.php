<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingLesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'training_course_id',
        'title',
        'slug',
        'description',
        'content',
        'video_url',
        'type',
        'canvas_data',
        'quiz_data',
        'duration',
        'order',
        'is_published'
    ];

    protected $casts = [
        'quiz_data' => 'array',
        'canvas_data' => 'array',
        'is_published' => 'boolean',
        'order' => 'integer'
    ];

    public function course()
    {
        return $this->belongsTo(TrainingCourse::class, 'training_course_id');
    }

    public function progress()
    {
        return $this->hasMany(TrainingProgress::class, 'training_lesson_id');
    }

    // Check if user has completed this lesson
    public function isCompletedByUser($userId)
    {
        return $this->progress()
            ->where('user_id', $userId)
            ->where('is_completed', true)
            ->exists();
    }

    // Get type label
    public function getTypeLabelAttribute()
    {
        return match($this->type) {
            'theory' => 'Teori',
            'practice' => 'Praktik',
            'quiz' => 'Kuis',
            default => 'Unknown'
        };
    }

    // Get type icon
    public function getTypeIconAttribute()
    {
        return match($this->type) {
            'theory' => 'BookOpen',
            'practice' => 'Palette',
            'quiz' => 'ClipboardCheck',
            default => 'File'
        };
    }
}
