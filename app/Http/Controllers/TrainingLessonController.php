<?php

namespace App\Http\Controllers;

use App\Models\TrainingCourse;
use App\Models\TrainingLesson;
use App\Models\TrainingProgress;
use App\Models\TrainingCertificate;
use App\Models\Motif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TrainingLessonController extends Controller
{
    public function show(TrainingCourse $course, TrainingLesson $lesson)
    {
        if (!$course->is_published || !$lesson->is_published) {
            abort(404);
        }

        // Get all lessons for navigation
        $allLessons = $course->lessons()
            ->where('is_published', true)
            ->orderBy('order')
            ->get()
            ->map(function ($l) use ($lesson) {
                $userProgress = null;
                if (Auth::check()) {
                    $userProgress = TrainingProgress::where('user_id', Auth::id())
                        ->where('training_lesson_id', $l->id)
                        ->first();
                }

                return [
                    'id' => $l->id,
                    'title' => $l->title,
                    'slug' => $l->slug,
                    'type' => $l->type,
                    'duration' => $l->duration,
                    'order' => $l->order,
                    'user_progress' => $userProgress ? [
                        'completed' => $userProgress->completed,
                        'completed_at' => $userProgress->completed_at
                    ] : null
                ];
            });

        // Find next and previous lessons
        $currentIndex = $allLessons->search(fn($l) => $l['id'] === $lesson->id);
        $nextLesson = $allLessons->get($currentIndex + 1);
        $prevLesson = $currentIndex > 0 ? $allLessons->get($currentIndex - 1) : null;

        // Get user progress for current lesson
        $progress = null;
        $canvasWork = null;
        
        if (Auth::check()) {
            $progress = TrainingProgress::where('user_id', Auth::id())
                ->where('training_lesson_id', $lesson->id)
                ->first();
            
            if ($progress) {
                $canvasWork = $progress->canvas_work;
            }
        }

        // Calculate course progress
        $courseProgress = 0;
        if (Auth::check()) {
            $totalLessons = $allLessons->count();
            $completedLessons = TrainingProgress::where('user_id', Auth::id())
                ->whereIn('training_lesson_id', $allLessons->pluck('id'))
                ->where('completed', true)
                ->count();
            
            $courseProgress = $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0;
        }

        // Get available motifs for practice lessons
        $availableMotifs = [];
        if ($lesson->type === 'practice' && $lesson->canvas_data && isset($lesson->canvas_data['available_motifs'])) {
            $motifIds = $lesson->canvas_data['available_motifs'];
            $availableMotifs = Motif::whereIn('id', $motifIds)
                ->active()
                ->get()
                ->map(function ($motif) {
                    return [
                        'id' => $motif->id,
                        'name' => $motif->name,
                        'category' => $motif->category,
                        'image_url' => $motif->image_url,
                        'file_path' => $motif->file_path
                    ];
                })
                ->values();
        }

        return Inertia::render('Training/Lesson', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'level' => $course->level,
                'user_progress' => round($courseProgress, 2)
            ],
            'lesson' => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'slug' => $lesson->slug,
                'description' => $lesson->description,
                'content' => $lesson->content,
                'video_url' => $lesson->video_url,
                'type' => $lesson->type,
                'duration' => $lesson->duration,
                'canvas_data' => $lesson->canvas_data,
                'order' => $lesson->order
            ],
            'availableMotifs' => $availableMotifs,
            'allLessons' => $allLessons,
            'nextLesson' => $nextLesson,
            'prevLesson' => $prevLesson,
            'progress' => $progress,
            'canvasWork' => $canvasWork
        ]);
    }

    public function saveProgress(Request $request, TrainingCourse $course, TrainingLesson $lesson)
    {
        $validated = $request->validate([
            'canvas_work' => 'nullable|array'
        ]);

        // Save or update progress
        $progress = TrainingProgress::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'training_lesson_id' => $lesson->id
            ],
            [
                'training_course_id' => $course->id,
                'canvas_work' => $validated['canvas_work'] ?? null,
                'completed' => true,
                'completed_at' => now()
            ]
        );

        // Check if all lessons completed -> generate certificate
        $totalLessons = $course->lessons()->where('is_published', true)->count();
        $completedLessons = TrainingProgress::where('user_id', Auth::id())
            ->where('training_course_id', $course->id)
            ->where('completed', true)
            ->count();

        if ($totalLessons === $completedLessons) {
            // Generate certificate if not exists
            TrainingCertificate::firstOrCreate(
                [
                    'user_id' => Auth::id(),
                    'training_course_id' => $course->id
                ],
                [
                    'certificate_number' => TrainingCertificate::generateCertificateNumber(),
                    'issued_at' => now()
                ]
            );
        }

        return back()->with('success', 'Progress berhasil disimpan!');
    }
}
