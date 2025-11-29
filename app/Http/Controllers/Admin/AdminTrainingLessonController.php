<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingCourse;
use App\Models\TrainingLesson;
use App\Models\Motif;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTrainingLessonController extends Controller
{
    public function index(TrainingCourse $course)
    {
        $lessons = $course->lessons()
            ->orderBy('order')
            ->get()
            ->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'training_course_id' => $lesson->training_course_id,
                    'title' => $lesson->title,
                    'slug' => $lesson->slug,
                    'description' => $lesson->description,
                    'type' => $lesson->type,
                    'type_label' => $lesson->type_label,
                    'type_icon' => $lesson->type_icon,
                    'video_url' => $lesson->video_url,
                    'canvas_data' => $lesson->canvas_data,
                    'quiz_data' => $lesson->quiz_data, // ⬅ TAMBAH INI
                    'duration' => $lesson->duration,
                    'order' => $lesson->order,
                    'is_published' => $lesson->is_published,
                    'created_at' => $lesson->created_at->format('d M Y')
                ];
            });

        $motifs = Motif::active()
            ->orderBy('name')
            ->get()
            ->map(function ($motif) {
                return [
                    'id' => $motif->id,
                    'name' => $motif->name,
                    'category' => $motif->category,
                    'image_url' => $motif->image_url,
                    'file_path' => $motif->file_path
                ];
            });

        return Inertia::render('Admin/Training/Lessons', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'level' => $course->level,
                'level_label' => $course->level_label
            ],
            'lessons' => $lessons,
            'availableMotifs' => $motifs
        ]);
    }

    public function store(Request $request, TrainingCourse $course)
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'content'       => 'nullable|string',
            'video_url'     => 'nullable|url',
            'type'          => 'required|in:theory,practice,quiz',
            'canvas_data'   => 'nullable|array',
            'quiz_data'     => 'nullable|array', // ⬅ WAJIB UNTUK KUIS
            'duration'      => 'nullable|integer|min:1',
            'order'         => 'nullable|integer|min:0',
            'is_published'  => 'boolean'
        ]);

        // Generate unique slug
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
        $originalSlug = $validated['slug'];
        $counter = 1;

        while (TrainingLesson::where('training_course_id', $course->id)
            ->where('slug', $validated['slug'])
            ->exists()) 
        {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        $validated['training_course_id'] = $course->id;

        TrainingLesson::create($validated);

        // Update total lesson count
        $course->update(['total_lessons' => $course->lessons()->count()]);

        return back()->with('success', 'Lesson created successfully');
    }

    public function update(Request $request, TrainingLesson $lesson)
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'content'       => 'nullable|string',
            'video_url'     => 'nullable|url',
            'type'          => 'required|in:theory,practice,quiz',
            'canvas_data'   => 'nullable|array',
            'quiz_data'     => 'nullable|array', // ⬅ WAJIB UNTUK KUIS
            'duration'      => 'nullable|integer|min:1',
            'order'         => 'nullable|integer|min:0',
            'is_published'  => 'boolean'
        ]);

        // Slug regeneration if title changed
        if ($validated['title'] !== $lesson->title) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
            $originalSlug = $validated['slug'];
            $counter = 1;

            while (TrainingLesson::where('training_course_id', $lesson->training_course_id)
                ->where('slug', $validated['slug'])
                ->where('id', '!=', $lesson->id)
                ->exists()) 
            {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        $lesson->update($validated);

        return back()->with('success', 'Lesson updated successfully');
    }

    public function destroy(TrainingLesson $lesson)
    {
        $course = $lesson->course;
        $lesson->delete();

        $course->update(['total_lessons' => $course->lessons()->count()]);

        return back()->with('success', 'Lesson deleted successfully');
    }

    public function togglePublish(TrainingLesson $lesson)
    {
        $lesson->update(['is_published' => !$lesson->is_published]);

        return back()->with('success', 'Lesson publish status updated');
    }
}
