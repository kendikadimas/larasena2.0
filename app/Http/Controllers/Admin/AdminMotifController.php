<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Motif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminMotifController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $status = $request->input('status');
        
        $motifs = Motif::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($category && $category !== 'all', function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($status !== null && $status !== 'all', function ($query) use ($status) {
                $query->where('is_active', $status === '1');
            })
            ->with('user:id,name')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        // ✅ FIX: Transform image URLs for display
        $motifs->getCollection()->transform(function ($motif) {
            if ($motif->file_path && !str_starts_with($motif->file_path, 'http')) {
                $motif->image_url = Storage::url($motif->file_path);
                $motif->preview_image_path = Storage::url($motif->file_path);
            }
            return $motif;
        });

        $categories = Motif::distinct()->pluck('category')->filter();
        
        $stats = [
            'total_motifs' => Motif::count(),
            'active_motifs' => Motif::where('is_active', true)->count(),
            'inactive_motifs' => Motif::where('is_active', false)->count(),
            'total_categories' => Motif::distinct('category')->count('category'),
        ];

        return Inertia::render('Admin/Motifs/Index', [
            'motifs' => $motifs,
            'categories' => $categories,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'status' => $status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'is_active' => 'boolean',
        ]);

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('motifs/admin', $fileName, 'public');
        
        // ✅ FIX: Store consistent URLs
        $publicUrl = Storage::url($path);

        Motif::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'file_path' => $path, // Store relative path in DB
            'image_url' => $publicUrl, // Full URL for display
            'preview_image_path' => $publicUrl, // Full URL for display
            'is_active' => $validated['is_active'] ?? true,
            'user_id' => null, // Admin uploaded
        ]);

        return back()->with('success', 'Motif berhasil ditambahkan.');
    }

    public function update(Request $request, Motif $motif)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('file')) {
            
            if ($motif->file_path && Storage::disk('public')->exists($motif->file_path)) {
                Storage::disk('public')->delete($motif->file_path);
            }

            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('motifs/admin', $fileName, 'public');
            $publicUrl = Storage::url($path);

            $validated['file_path'] = $path;
            $validated['image_url'] = $publicUrl;
            $validated['preview_image_path'] = $publicUrl;
        }

        $motif->update($validated);

        return back()->with('success', 'Motif berhasil diperbarui.');
    }

    public function toggleStatus(Motif $motif)
    {
        $motif->update(['is_active' => !$motif->is_active]);

        $status = $motif->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Motif berhasil {$status}.");
    }

    public function destroy(Motif $motif)
    {
        if ($motif->file_path && Storage::disk('public')->exists($motif->file_path)) {
            Storage::disk('public')->delete($motif->file_path);
        }

        $motif->delete();

        return back()->with('success', 'Motif berhasil dihapus.');
    }
}