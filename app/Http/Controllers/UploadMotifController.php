<?php

namespace App\Http\Controllers;

use App\Models\PublishedMotif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UploadMotifController extends Controller
{
    /**
     * Display a listing of uploaded motifs by the user.
     */
    public function index()
    {
        $motifs = PublishedMotif::where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($motif) {
                return [
                    'id' => $motif->id,
                    'title' => $motif->title,
                    'slug' => $motif->slug,
                    'philosophy' => $motif->philosophy,
                    'origin' => $motif->origin,
                    'category' => $motif->category,
                    'image_url' => $motif->image_url,
                    'status' => $motif->status,
                    'rejection_reason' => $motif->rejection_reason,
                    'views_count' => $motif->views_count,
                    'likes_count' => $motif->likes_count,
                    'created_at' => $motif->created_at->format('d M Y'),
                ];
            });

        return Inertia::render('Motif/Upload/Index', [
            'motifs' => $motifs
        ]);
    }

    /**
     * Show the form for creating a new uploaded motif.
     */
    public function create()
    {
        return Inertia::render('Motif/Upload/Create');
    }

    /**
     * Store a newly uploaded motif.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'origin' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'philosophy' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:5120', // 5MB
        ], [
            'title.required' => 'Nama motif harus diisi',
            'origin.required' => 'Asal daerah harus diisi',
            'image.required' => 'Gambar motif harus diupload',
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus JPEG, PNG, atau JPG',
            'image.max' => 'Ukuran gambar maksimal 5MB',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = time() . '_' . Str::slug($validated['title']) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('motifs', $filename, 'public');
            $validated['image_url'] = Storage::url($path);
            $validated['image_path'] = $path; // Also set image_path for compatibility
        }

        // Create the motif with pending status
        $motif = PublishedMotif::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
            'origin' => $validated['origin'],
            'category' => $validated['category'],
            'philosophy' => $validated['philosophy'],
            'image_path' => $validated['image_path'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
            'status' => 'pending', // Waiting for admin approval
            'views_count' => 0,
            'likes_count' => 0,
        ]);

        return redirect()->route('motif.upload.index')
            ->with('success', 'Motif berhasil diupload! Menunggu review dari admin.');
    }

    /**
     * Remove the uploaded motif.
     */
    public function destroy(PublishedMotif $motif)
    {
        // Check if user owns this motif
        if ($motif->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Delete image from storage
        if ($motif->image_path) {
            Storage::disk('public')->delete($motif->image_path);
        }

        $motif->delete();

        return redirect()->route('motif.upload.index')
            ->with('success', 'Motif berhasil dihapus.');
    }
}
