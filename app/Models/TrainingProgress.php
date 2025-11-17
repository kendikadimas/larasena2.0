<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'training_course_id',
        'training_lesson_id',
        'canvas_work',
        'completed',
        'completed_at'
    ];

    protected $casts = [
        'canvas_work' => 'array',
        'completed' => 'boolean',
        'completed_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(TrainingCourse::class, 'training_course_id');
    }

    public function lesson()
    {
        return $this->belongsTo(TrainingLesson::class, 'training_lesson_id');
    }

    // Mark lesson as completed
    public function completeLesson()
    {
        $this->completed = true;
        $this->completed_at = now();
        $this->save();
    }
}
