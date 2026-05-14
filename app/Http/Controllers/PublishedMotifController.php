<?php

namespace App\Http\Controllers;

use App\Models\PublishedMotif;
use App\Models\MotifLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PublishedMotifController extends Controller
{
    // Lihat semua motif milik user
    public function index()
    {
        $motifs = Auth::user()->publishedMotifs()
            ->latest()
            ->get()
            ->map(function ($motif) {
                return [
                    'id' => $motif->id,
                    'title' => $motif->title,
                    'slug' => $motif->slug,
                    'philosophy' => $motif->philosophy,
                    'origin' => $motif->origin,
                    'image_url' => $motif->image_url,
                    'status' => $motif->status,
                    'rejection_reason' => $motif->rejection_reason,
                    'likes_count' => $motif->likes_count,
                    'views_count' => $motif->views_count,
                    'is_featured' => $motif->is_featured,
                    'published_at' => $motif->published_at?->format('d M Y'),
                    'created_at' => $motif->created_at->format('d M Y')
                ];
            });

        return Inertia::render('Motif/Published/Index', [
            'motifs' => $motifs
        ]);
    }

    // Form submit motif untuk review
    public function create()
    {
        return Inertia::render('Motif/Published/Create');
    }

    // Submit motif untuk review
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'philosophy' => 'required|string|max:1000',
            'origin' => 'required|string|max:100',
            'image' => 'required|file|image|max:5120', // 5MB max
            'design_data' => 'nullable|string',
            'design_id' => 'nullable|integer'
        ]);

        // Upload image
        $imagePath = $request->file('image')->store('published-motifs', 'public');

        // Prepare design_data
        $designData = $validated['design_data'] ?? null;
        if (!$designData && $request->has('design_id')) {
            $designData = json_encode([
                'design_id' => $request->input('design_id')
            ]);
        }

        $motif = Auth::user()->publishedMotifs()->create([
            'title' => $validated['title'],
            'philosophy' => $validated['philosophy'],
            'origin' => $validated['origin'],
            'image_path' => $imagePath,
            'design_data' => $designData,
            'status' => 'pending'
        ]);

        return redirect()->route('dashboard')->with('success', 'Motif berhasil disubmit! Menunggu persetujuan admin.');
    }

    // View detail motif
    public function show($slug)
    {
        $motif = PublishedMotif::where('slug', $slug)
            ->with(['user.badges'])
            ->firstOrFail();

        // Increment views
        $motif->incrementViews();

        $isLiked = $motif->isLikedBy(Auth::user());

        // Get related motifs (same user or random approved)
        $relatedMotifs = PublishedMotif::approved()
            ->where('id', '!=', $motif->id)
            ->where('user_id', $motif->user_id)
            ->orWhere(function($q) use ($motif) {
                $q->where('id', '!=', $motif->id)
                  ->where('status', 'approved')
                  ->where('user_id', '!=', $motif->user_id);
            })
            ->inRandomOrder()
            ->limit(4)
            ->get()
            ->map(function ($m) {
                return [
                    'id' => $m->id,
                    'title' => $m->title,
                    'slug' => $m->slug,
                    'origin' => $m->origin,
                    'image_url' => $m->image_url,
                    'likes_count' => $m->likes_count,
                    'views_count' => $m->views_count,
                    'user' => [
                        'name' => $m->user->name,
                        'profile_photo_url' => $m->user->profile_photo_url,
                    ],
                ];
            });

        // ── SEO Meta Data ──────────────────────────────────────────
        $metaTitle       = "{$motif->title} | Larasena";
        $metaDescription = $this->buildMetaDescription($motif);
        $metaKeywords    = $this->buildKeywords($motif);
        $metaImage       = $motif->image_url;
        $metaUrl         = route('published-motifs.show', $motif->slug);

        // JSON-LD Structured Data (Schema.org CreativeWork)
        $jsonLd = json_encode([
            '@context'      => 'https://schema.org',
            '@type'         => 'CreativeWork',
            'name'          => "Motif Batik {$motif->title}",
            'description'   => $metaDescription,
            'image'         => $metaImage,
            'url'           => $metaUrl,
            'inLanguage'    => 'id-ID',
            'keywords'      => $metaKeywords,
            'datePublished' => $motif->published_at?->toIso8601String(),
            'dateModified'  => $motif->updated_at?->toIso8601String(),
            'creator' => [
                '@type' => 'Person',
                'name'  => $motif->user->name,
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name'  => 'Larasena',
                'url'   => url('/'),
            ],
            'about' => [
                '@type'       => 'Thing',
                'name'        => 'Batik',
                'description' => 'Seni tekstil tradisional Indonesia',
            ],
            'locationCreated' => $motif->origin ? [
                '@type' => 'Place',
                'name'  => $motif->origin,
            ] : null,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        // Share ke Blade (server-side — dibaca social media crawler)
        view()->share('pageMeta', [
            'title'       => $metaTitle,
            'description' => $metaDescription,
            'image'       => $metaImage,
            'url'         => $metaUrl,
            'type'        => 'article',
            'keywords'    => $metaKeywords,
            'jsonLd'      => $jsonLd,
        ]);

        return Inertia::render('Motif/Published/Show', [
            'motif' => [
                'id'              => $motif->id,
                'title'           => $motif->title,
                'slug'            => $motif->slug,
                'philosophy'      => $motif->philosophy,
                'origin'          => $motif->origin,
                'category'        => $motif->category,
                'image_url'       => $motif->image_url,
                'status'          => $motif->status,
                'likes_count'     => $motif->likes_count,
                'views_count'     => $motif->views_count,
                'is_featured'     => $motif->is_featured,
                'published_at'    => $motif->published_at?->format('d M Y'),
                'is_liked_by_user'=> $isLiked,
                'user' => [
                    'id'               => $motif->user->id,
                    'name'             => $motif->user->name,
                    'profile_photo_url'=> $motif->user->profile_photo_url,
                    'badges'           => $motif->user->badges->map(fn($b) => [
                        'badge_name' => $b->badge_name,
                        'badge_icon' => $b->badge_icon,
                    ]),
                ],
            ],
            'relatedMotifs' => $relatedMotifs,
            'user' => Auth::user() ? [
                'id'    => Auth::user()->id,
                'name'  => Auth::user()->name,
                'email' => Auth::user()->email,
            ] : null,
            // SEO props — juga dikirim ke React untuk fallback client-side
            'meta' => [
                'title'       => $metaTitle,
                'description' => $metaDescription,
                'image'       => $metaImage,
                'url'         => $metaUrl,
                'type'        => 'article',
                'keywords'    => $metaKeywords,
            ],
            'jsonLd' => $jsonLd,
        ]);
    }

    // Toggle like
    public function toggleLike(PublishedMotif $motif)
    {
        $user = Auth::user();
        
        $like = MotifLike::where('user_id', $user->id)
            ->where('published_motif_id', $motif->id)
            ->first();

        if ($like) {
            $like->delete();
            $motif->decrement('likes_count');
        } else {
            MotifLike::create([
                'user_id' => $user->id,
                'published_motif_id' => $motif->id
            ]);
            $motif->increment('likes_count');
        }

        // Return back without response (Inertia will handle the reload)
        return back();
    }

    // Public gallery (untuk landing page)
    public function gallery(Request $request)
    {
        $sort = $request->get('sort', 'latest');
        
        $query = PublishedMotif::approved()
            ->published()
            ->with('user');
            
        if ($sort === 'popular') {
            $query->orderBy('likes_count', 'desc')
                  ->orderBy('views_count', 'desc');
        } else {
            $query->latest('published_at');
        }
            
        $motifs = $query->get()->map(function ($motif) {
            $isLiked = $motif->isLikedBy(Auth::user());
            
            return [
                'id' => $motif->id,
                'title' => $motif->title,
                'slug' => $motif->slug,
                'philosophy' => substr($motif->philosophy, 0, 100) . (strlen($motif->philosophy) > 100 ? '...' : ''),
                'origin' => $motif->origin,
                'image_url' => $motif->image_url,
                'likes_count' => $motif->likes_count,
                'views_count' => $motif->views_count,
                'is_featured' => $motif->is_featured,
                'published_at' => $motif->published_at->format('d M Y'),
                'is_liked_by_user' => $isLiked,
                'user' => [
                    'name' => $motif->user->name,
                    'profile_photo_url' => $motif->user->profile_photo_url,
                    'badge' => $motif->user->badge,
                    'badge_name' => $motif->user->badge_name,
                ]
            ];
        });

        // JSON-LD untuk halaman galeri
        $galleryJsonLd = json_encode([
            '@context'    => 'https://schema.org',
            '@type'       => 'CollectionPage',
            'name'        => 'Galeri Motif Batik Nusantara — Larasena',
            'description' => 'Jelajahi koleksi motif batik nusantara dengan filosofi mendalam dari berbagai daerah di Indonesia.',
            'url'         => route('published-motifs.gallery'),
            'inLanguage'  => 'id-ID',
            'publisher'   => [
                '@type' => 'Organization',
                'name'  => 'Larasena',
                'url'   => url('/'),
            ],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        // Share SEO meta data for gallery page
        view()->share('pageMeta', [
            'title'       => 'Galeri Motif Batik Nusantara | Temukan Inspirasi Batik Indonesia — Larasena',
            'description' => 'Jelajahi ratusan motif batik nusantara lengkap dengan filosofi, asal daerah, dan kreatornya. Temukan motif batik perpaduan tradisional dan modern.',
            'image'       => asset('images/og-gallery.jpg'),
            'url'         => route('published-motifs.gallery'),
            'type'        => 'website',
            'keywords'    => 'galeri motif batik, motif batik Indonesia, batik kawung, batik parang, mega mendung, desain batik online, filosofi batik, koleksi batik',
            'jsonLd'      => $galleryJsonLd,
        ]);

        return Inertia::render('Motif/Published/Gallery', [
            'motifs' => $motifs,
            'user' => Auth::user() ? [
                'id'    => Auth::user()->id,
                'name'  => Auth::user()->name,
                'email' => Auth::user()->email,
            ] : null,
        ]);
    }

    // ── Private SEO Helpers ────────────────────────────────────────

    /**
     * Build keyword-rich, unique meta description per motif.
     * Target: ~155 chars, natural language, mengandung keyword utama.
     */
    private function buildMetaDescription(PublishedMotif $motif): string
    {
        $origin  = $motif->origin ? " asal {$motif->origin}" : '';
        $author  = $motif->user ? " karya koleksi {$motif->user->name}" : '';
        $excerpt = Str::limit(strip_tags($motif->philosophy ?? ''), 100);
        return "{$motif->title}{$origin}{$author}";
    }

    /**
     * Build comma-separated keywords dari data motif.
     */
    private function buildKeywords(PublishedMotif $motif): string
    {
        $keywords = [
            "motif batik {$motif->title}",
            "{$motif->title}",
            "batik {$motif->title}",
            "filosofi batik {$motif->title}",
            "arti motif {$motif->title}",
        ];

        if ($motif->origin) {
            $keywords[] = "batik {$motif->origin}";
            $keywords[] = "motif batik {$motif->origin}";
        }

        if ($motif->category) {
            $keywords[] = "batik {$motif->category}";
        }

        $keywords = array_merge($keywords, [
            'motif batik',
            'desain batik online',
            'batik Indonesia',
            'batik modern',
            'Larasena',
        ]);

        return implode(', ', $keywords);
    }

    // Delete motif
    public function destroy(PublishedMotif $motif)
    {
        // Check ownership
        if ($motif->user_id !== Auth::id()) {
            abort(403);
        }

        // Delete image
        if ($motif->image_path) {
            Storage::disk('public')->delete($motif->image_path);
        }

        $motif->delete();

        return redirect()->route('dashboard')->with('success', 'Motif berhasil dihapus');
    }
}
