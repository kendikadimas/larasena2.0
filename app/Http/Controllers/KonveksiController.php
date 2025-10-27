<?php

namespace App\Http\Controllers;

use App\Models\Konveksi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class KonveksiController extends Controller
{
    public function index(Request $request)
    {
        $query = Konveksi::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by location
        if ($request->filled('location') && $request->location !== 'all') {
            $query->byLocation($request->location);
        }

        // Filter by verification status
        if ($request->filled('verified')) {
            if ($request->verified === 'true') {
                $query->verified();
            }
        }

        // Filter by rating
        if ($request->filled('min_rating')) {
            $query->highRating($request->min_rating);
        }

        // Order by rating desc and verification status
        $konveksis = $query->orderBy('is_verified', 'desc')
                            ->orderBy('rating', 'desc')
                            ->paginate(12)
                            ->withQueryString()
                            ->through(function ($konveksi) {
                                return [
                                    'id' => $konveksi->id,
                                    'name' => $konveksi->name,
                                    'location' => $konveksi->location,
                                    'is_verified' => $konveksi->is_verified,
                                    'rating' => $konveksi->rating,
                                    'no_telp' => $konveksi->no_telp,
                                    'description' => $konveksi->description,
                                    'documentation' => $konveksi->documentation,
                                    'documentation_url' => $konveksi->documentation_url,
                                    'thumbnail_url' => $konveksi->thumbnail_url, // Thumbnail dari gambar pertama
                                    'icon' => $konveksi->icon,
                                    'icon_url' => $konveksi->icon_url,
                                ];
                            });

        // Get statistics
        $stats = $this->getStatistics();

        return Inertia::render('User/Konveksi', [
            'konveksis' => $konveksis,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'location' => $request->location,
                'verified' => $request->verified,
                'min_rating' => $request->min_rating,
            ],
            'locations' => $this->getUniqueLocations()
        ]);
    }

    public function show(Konveksi $konveksi)
    {
        // Load reviews dengan user relationship
        $konveksi->load(['reviews' => function ($query) {
            $query->with('user')->latest();
        }]);

        // Check jika user sudah memberi review
        $userReview = null;
        if (auth()->check()) {
            $userReview = $konveksi->reviews()->where('user_id', auth()->id())->first();
        }

        return Inertia::render('User/KonveksiDetail', [
            'konveksi' => [
                'id' => $konveksi->id,
                'name' => $konveksi->name,
                'location' => $konveksi->location,
                'is_verified' => $konveksi->is_verified,
                'rating' => $konveksi->rating,
                'no_telp' => $konveksi->no_telp,
                'description' => $konveksi->description,
                'documentation' => $konveksi->documentation,
                'documentation_url' => $konveksi->documentation_url,
                'icon_url' => $konveksi->icon_url,
                'reviews' => $konveksi->reviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => $review->rating,
                        'comment' => $review->comment,
                        'created_at' => $review->created_at->diffForHumans(),
                        'user' => [
                            'name' => $review->user->name,
                        ],
                    ];
                }),
                'reviews_count' => $konveksi->reviews->count(),
                'average_rating' => $konveksi->reviews->avg('rating') ?? 0,
            ],
            'userReview' => $userReview ? [
                'id' => $userReview->id,
                'rating' => $userReview->rating,
                'comment' => $userReview->comment,
            ] : null,
        ]);
    }

    public function storeReview(Request $request, Konveksi $konveksi)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Update or create review
        $review = $konveksi->reviews()->updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
            ]
        );

        // Update average rating konveksi
        $avgRating = $konveksi->reviews()->avg('rating');
        $konveksi->update(['rating' => round($avgRating, 1)]);

        return redirect()->back()->with('success', 'Review berhasil disimpan');
    }

    public function deleteReview(Konveksi $konveksi)
    {
        $review = $konveksi->reviews()->where('user_id', auth()->id())->first();
        
        if ($review) {
            $review->delete();
            
            // Update average rating
            $avgRating = $konveksi->reviews()->avg('rating') ?? 0;
            $konveksi->update(['rating' => round($avgRating, 1)]);
        }

        return redirect()->back()->with('success', 'Review berhasil dihapus');
    }

    private function getStatistics()
    {
        return [
            'total_partners' => Konveksi::count(),
            'verified_partners' => Konveksi::verified()->count(),
            'total_locations' => Konveksi::distinct('location')->count(),
            'average_rating' => round(Konveksi::avg('rating'), 1)
        ];
    }

    private function getUniqueLocations()
    {
        return Konveksi::select('location')
                      ->distinct()
                      ->orderBy('location')
                      ->pluck('location')
                      ->map(function ($location) {
                          return [
                              'label' => $location,
                              'value' => strtolower(str_replace(' ', '', $location))
                          ];
                      });
    }

    // API endpoint untuk mendapatkan data konveksi
    public function apiIndex(Request $request)
    {
        $query = Konveksi::query();

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('location')) {
            $query->byLocation($request->location);
        }

        if ($request->filled('verified')) {
            $query->verified();
        }

        $konveksis = $query->orderBy('is_verified', 'asc')
                          ->orderBy('rating', 'asc')
                          ->paginate(12);

        return response()->json([
            'konveksis' => $konveksis,
            'stats' => $this->getStatistics()
        ]);
    }
}