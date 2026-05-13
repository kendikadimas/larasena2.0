<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PublishedMotif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AdminPublishedMotifController extends Controller
{
    // List semua motif pending
    public function index()
    {
        $filter = request('filter', 'pending');

        $query = PublishedMotif::with('user');

        switch ($filter) {
            case 'pending':
                $query->pending();
                break;
            case 'approved':
                $query->approved();
                break;
            case 'rejected':
                $query->rejected();
                break;
        }

        $motifs = $query->latest()
            ->get()
            ->map(function ($motif) {
                return [
                    'id' => $motif->id,
                    'title' => $motif->title,
                    'slug' => $motif->slug,
                    'philosophy' => $motif->philosophy,
                    'image_url' => $motif->image_url,
                    'status' => $motif->status,
                    'rejection_reason' => $motif->rejection_reason,
                    'likes_count' => $motif->likes_count,
                    'views_count' => $motif->views_count,
                    'is_featured' => $motif->is_featured,
                    'published_at' => $motif->published_at?->format('d M Y H:i'),
                    'created_at' => $motif->created_at->format('d M Y H:i'),
                    'user' => [
                        'id' => $motif->user->id,
                        'name' => $motif->user->name,
                        'email' => $motif->user->email,
                        'profile_photo_url' => $motif->user->profile_photo_url
                    ]
                ];
            });

        $stats = [
            'pending' => PublishedMotif::pending()->count(),
            'approved' => PublishedMotif::approved()->count(),
            'rejected' => PublishedMotif::rejected()->count(),
        ];

        return Inertia::render('Admin/PublishedMotifs/Index', [
            'motifs' => $motifs,
            'stats' => $stats,
            'currentFilter' => $filter
        ]);
    }

    // Approve motif
    public function approve(PublishedMotif $motif)
    {
        $motif->approve();

        return redirect()->back()->with('success', 'Motif berhasil disetujui dan dipublikasikan!');
    }

    // Bulk approve motifs
    public function bulkApprove(Request $request)
    {
        $validated = $request->validate([
            'motif_ids' => 'required|array',
            'motif_ids.*' => 'exists:published_motifs,id'
        ]);

        $motifs = PublishedMotif::whereIn('id', $validated['motif_ids'])->pending()->get();
        
        foreach ($motifs as $motif) {
            $motif->approve();
        }

        return redirect()->back()->with('success', count($motifs) . ' motif berhasil disetujui!');
    }

    // Reject motif
    public function reject(Request $request, PublishedMotif $motif)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $motif->reject($validated['reason']);

        return redirect()->back()->with('success', 'Motif ditolak');
    }

    // Toggle featured
    public function toggleFeatured(PublishedMotif $motif)
    {
        $motif->update([
            'is_featured' => !$motif->is_featured
        ]);

        return redirect()->back()->with('success', 'Status featured diupdate');
    }

    // Delete motif
    public function destroy(PublishedMotif $motif)
    {
        if ($motif->image_path) {
            \Storage::disk('public')->delete($motif->image_path);
        }

        $motif->delete();
        Cache::forget('public_sitemap_xml');

        return redirect()->back()->with('success', 'Motif berhasil dihapus');
    }
}
