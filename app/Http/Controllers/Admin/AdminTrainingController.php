<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminTrainingController extends Controller
{
    public function index()
    {
        $courses = TrainingCourse::withCount('lessons')
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'level' => $course->level,
                    'level_label' => $course->level_label,
                    'level_color' => $course->level_color,
                    'thumbnail_url' => $course->thumbnail_url,
                    'certificate_file_url' => $course->certificate_file_url,
                    'duration_minutes' => $course->duration_minutes,
                    'total_lessons' => $course->total_lessons,
                    'lessons_count' => $course->lessons_count,
                    'is_published' => $course->is_published,
                    'order' => $course->order,
                    'created_at' => $course->created_at->format('d M Y')
                ];
            });

        return Inertia::render('Admin/Training/Index', [
            'courses' => $courses
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'level' => 'required|in:dasar,menengah,lanjutan',
            'thumbnail' => 'nullable|image|max:2048',
            'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'duration_minutes' => 'nullable|integer|min:0',
            'is_published' => 'boolean',
            'order' => 'nullable|integer|min:0'
        ]);

        // Generate slug
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
        
        // Ensure unique slug
        $originalSlug = $validated['slug'];
        $counter = 1;
        while (TrainingCourse::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('training/thumbnails', 'public');
        }

        if ($request->hasFile('certificate_file')) {
            $validated['certificate_file'] = $request->file('certificate_file')->store('training/certificates', 'public');
        }

        $course = TrainingCourse::create($validated);

        return redirect()->back()->with('success', 'Course created successfully');
    }

    public function update(Request $request, TrainingCourse $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'level' => 'required|in:dasar,menengah,lanjutan',
            'thumbnail' => 'nullable|image|max:2048',
            'certificate_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'duration_minutes' => 'nullable|integer|min:0',
            'total_lessons' => 'nullable|integer|min:0',
            'is_published' => 'boolean',
            'order' => 'nullable|integer|min:0'
        ]);

        // Update slug if title changed
        if ($validated['title'] !== $course->title) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
            
            // Ensure unique slug
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (TrainingCourse::where('slug', $validated['slug'])->where('id', '!=', $course->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($course->thumbnail) {
                Storage::disk('public')->delete($course->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('training/thumbnails', 'public');
        }

        if ($request->hasFile('certificate_file')) {
            // Delete old certificate file
            if ($course->certificate_file) {
                Storage::disk('public')->delete($course->certificate_file);
            }
            $validated['certificate_file'] = $request->file('certificate_file')->store('training/certificates', 'public');
        }

        $course->update($validated);

        return redirect()->back()->with('success', 'Course updated successfully');
    }

    public function destroy(TrainingCourse $course)
    {
        // Delete thumbnail
        if ($course->thumbnail) {
            Storage::disk('public')->delete($course->thumbnail);
        }

        // Delete certificate file
        if ($course->certificate_file) {
            Storage::disk('public')->delete($course->certificate_file);
        }

        $course->delete();

        return redirect()->back()->with('success', 'Course deleted successfully');
    }

    public function togglePublish(TrainingCourse $course)
    {
        $course->update(['is_published' => !$course->is_published]);

        return redirect()->back()->with('success', 'Course publish status updated');
    }
}
