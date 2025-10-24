<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Konveksi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminKonveksiController extends Controller
{
    public function index(Request $request)
    {
        $query = Konveksi::query()->with('user');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('no_telp', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by verification status
        if ($request->filled('status')) {
            if ($request->status === 'verified') {
                $query->where('is_verified', true);
            } elseif ($request->status === 'unverified') {
                $query->where('is_verified', false);
            }
        }

        // Order by verification status and creation date
        $konveksis = $query->orderBy('is_verified', 'desc')
                           ->orderBy('created_at', 'desc')
                           ->paginate(10)
                           ->withQueryString()
                           ->through(function ($konveksi) {
                               return [
                                   'id' => $konveksi->id,
                                   'name' => $konveksi->name,
                                   'location' => $konveksi->location,
                                   'no_telp' => $konveksi->no_telp,
                                   'description' => $konveksi->description,
                                   'is_verified' => $konveksi->is_verified,
                                   'rating' => $konveksi->rating,
                                   'icon_url' => $konveksi->icon_url,
                                   'documentation_url' => $konveksi->documentation_url,
                                   'user' => $konveksi->user ? [
                                       'id' => $konveksi->user->id,
                                       'name' => $konveksi->user->name,
                                       'email' => $konveksi->user->email,
                                   ] : null,
                                   'created_at' => $konveksi->created_at->format('d M Y'),
                               ];
                           });

        // Get statistics
        $stats = [
            'total' => Konveksi::count(),
            'verified' => Konveksi::where('is_verified', true)->count(),
            'unverified' => Konveksi::where('is_verified', false)->count(),
            'avg_rating' => round(Konveksi::avg('rating'), 1),
        ];

        return Inertia::render('Admin/Konveksi/Index', [
            'konveksis' => $konveksis,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
        ]);
    }

    public function toggleVerification(Konveksi $konveksi)
    {
        $konveksi->update([
            'is_verified' => !$konveksi->is_verified,
        ]);

        return redirect()->back()->with('success', $konveksi->is_verified 
            ? 'Konveksi berhasil diverifikasi' 
            : 'Verifikasi konveksi berhasil dibatalkan'
        );
    }

    public function show(Konveksi $konveksi)
    {
        $konveksi->load('user');
        
        return Inertia::render('Admin/Konveksi/Show', [
            'konveksi' => [
                'id' => $konveksi->id,
                'name' => $konveksi->name,
                'location' => $konveksi->location,
                'no_telp' => $konveksi->no_telp,
                'description' => $konveksi->description,
                'is_verified' => $konveksi->is_verified,
                'rating' => $konveksi->rating,
                'icon_url' => $konveksi->icon_url,
                'documentation_url' => $konveksi->documentation_url,
                'user' => $konveksi->user ? [
                    'id' => $konveksi->user->id,
                    'name' => $konveksi->user->name,
                    'email' => $konveksi->user->email,
                ] : null,
                'created_at' => $konveksi->created_at->format('d M Y H:i'),
                'updated_at' => $konveksi->updated_at->format('d M Y H:i'),
            ],
        ]);
    }
}
