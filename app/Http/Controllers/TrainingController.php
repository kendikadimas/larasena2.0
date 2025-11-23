<?php

namespace App\Http\Controllers;

use App\Models\TrainingCourse;
use App\Models\TrainingProgress;
use App\Models\TrainingCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TrainingController extends Controller
{
    public function index(Request $request)
    {
        $level = $request->get('level', 'all');
        
        $query = TrainingCourse::where('is_published', true)
            ->withCount('lessons');

        if ($level !== 'all') {
            $query->where('level', $level);
        }

        $courses = $query->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($course) {
                $userProgress = null;
                if (Auth::check()) {
                    // Hitung progress user untuk course ini
                    $totalLessons = $course->lessons()->where('is_published', true)->count();
                    $completedLessons = TrainingProgress::where('user_id', Auth::id())
                        ->where('training_course_id', $course->id)
                        ->where('completed', true)
                        ->count();
                    
                    if ($completedLessons > 0) {
                        $progressPercentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 2) : 0;
                        $isCompleted = $completedLessons === $totalLessons;
                        
                        $userProgress = [
                            'progress_percentage' => $progressPercentage,
                            'completed_lessons_count' => $completedLessons,
                            'total_lessons' => $totalLessons,
                            'is_completed' => $isCompleted
                        ];
                    }
                }

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'description' => $course->description,
                    'level' => $course->level,
                    'level_label' => $course->level_label,
                    'level_color' => $course->level_color,
                    'thumbnail_url' => $course->thumbnail_url,
                    'duration_minutes' => $course->duration_minutes,
                    'total_lessons' => $course->total_lessons,
                    'lessons_count' => $course->lessons_count,
                    'user_progress' => $userProgress
                ];
            });

        $stats = [
            'total_courses' => TrainingCourse::where('is_published', true)->count(),
            'dasar_courses' => TrainingCourse::where('is_published', true)->where('level', 'dasar')->count(),
            'menengah_courses' => TrainingCourse::where('is_published', true)->where('level', 'menengah')->count(),
            'lanjutan_courses' => TrainingCourse::where('is_published', true)->where('level', 'lanjutan')->count(),
        ];

        if (Auth::check()) {
            $stats['my_courses'] = TrainingProgress::where('user_id', Auth::id())->distinct('training_course_id')->count();
            
            // Fix: Hitung course yang semua lessonnya sudah completed
            $stats['completed_courses'] = TrainingCourse::where('is_published', true)
                ->whereExists(function($query) {
                    $query->selectRaw('1')
                        ->from('training_progress as tp')
                        ->whereColumn('training_courses.id', 'tp.training_course_id')
                        ->where('tp.user_id', Auth::id())
                        ->where('tp.completed', true)
                        ->groupBy('tp.training_course_id')
                        ->havingRaw('COUNT(DISTINCT tp.training_lesson_id) = (
                            SELECT COUNT(*) 
                            FROM training_lessons 
                            WHERE training_course_id = tp.training_course_id 
                            AND is_published = true
                        )');
                })->count();
        }

        return Inertia::render('User/Training/Index', [
            'courses' => $courses,
            'stats' => $stats,
            'filters' => ['level' => $level]
        ]);
    }

    public function show(TrainingCourse $course)
    {
        if (!$course->is_published) {
            abort(404);
        }

        $lessons = $course->lessons()
            ->where('is_published', true)
            ->orderBy('order')
            ->get()
            ->map(function ($lesson) {
                $userProgress = null;
                $isCompleted = false;
                if (Auth::check()) {
                    $userProgress = TrainingProgress::where('user_id', Auth::id())
                        ->where('training_lesson_id', $lesson->id)
                        ->first();
                    $isCompleted = $userProgress && $userProgress->completed;
                }

                return [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'slug' => $lesson->slug,
                    'description' => $lesson->description,
                    'type' => $lesson->type,
                    'type_label' => $lesson->type_label,
                    'type_icon' => $lesson->type_icon,
                    'duration' => $lesson->duration,
                    'order' => $lesson->order,
                    'is_completed' => $isCompleted,
                    'user_progress' => $userProgress ? [
                        'completed' => $userProgress->completed,
                        'completed_at' => $userProgress->completed_at?->format('d M Y')
                    ] : null
                ];
            });

        // Calculate course progress
        $userProgress = null;
        $certificate = null;

        if (Auth::check()) {
            $totalLessons = $lessons->count();
            $completedLessons = TrainingProgress::where('user_id', Auth::id())
                ->whereIn('training_lesson_id', $lessons->pluck('id'))
                ->where('completed', true)
                ->count();
            
            $progressPercentage = $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0;

            $userProgress = [
                'progress_percentage' => round($progressPercentage, 2),
                'completed_lessons' => $completedLessons,
                'total_lessons' => $totalLessons
            ];

            $cert = TrainingCertificate::where('user_id', Auth::id())
                ->where('training_course_id', $course->id)
                ->first();
            
            if ($cert) {
                $certificate = [
                    'id' => $cert->id,
                    'certificate_number' => $cert->certificate_number,
                    'issued_at' => $cert->issued_at->format('d M Y')
                ];
            }
        }

        return Inertia::render('Training/Detail', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'description' => $course->description,
                'level' => $course->level,
                'level_label' => $course->level_label,
                'level_color' => $course->level_color,
                'thumbnail' => $course->thumbnail,
                'user_progress' => $userProgress ? $userProgress['progress_percentage'] : 0,
                'lessons_count' => $lessons->count()
            ],
            'lessons' => $lessons,
            'user_progress' => $userProgress,
            'certificate' => $certificate
        ]);
    }
}
