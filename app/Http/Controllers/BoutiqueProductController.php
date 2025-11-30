<?php

namespace App\Http\Controllers;

use App\Models\BoutiqueProduct;
use App\Models\Motif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BoutiqueProductController extends Controller
{
    /**
     * Display boutique products for the authenticated user
     */
    public function index()
    {
        // Check if user is boutique
        if (Auth::user()->badge !== 'boutique') {
            abort(403, 'Hanya mitra boutique yang dapat mengakses halaman ini.');
        }

        $products = Auth::user()->boutiqueProducts()
            ->with('motif')
            ->latest()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'sizes' => $product->sizes,
                    'photos' => $product->photos,
                    'is_active' => $product->is_active,
                    'motif' => [
                        'id' => $product->motif->id,
                        'title' => $product->motif->title,
                        'image_url' => $product->motif->image_url,
                    ],
                    'created_at' => $product->created_at->format('d M Y'),
                ];
            });

        return Inertia::render('Boutique/Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show form to create new product
     */
    public function create()
    {
        if (Auth::user()->badge !== 'boutique') {
            abort(403);
        }

        // Get user's approved motifs
        $motifs = Auth::user()->publishedMotifs()
            ->where('status', 'approved')
            ->get()
            ->map(function ($motif) {
                return [
                    'id' => $motif->id,
                    'title' => $motif->title,
                    'image_url' => $motif->image_url,
                ];
            });

        return Inertia::render('Boutique/Products/Create', [
            'motifs' => $motifs
        ]);
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request)
    {
        if (Auth::user()->badge !== 'boutique') {
            abort(403);
        }

        $validated = $request->validate([
            'motif_id' => 'required|exists:motifs,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'sizes' => 'required|array',
            'sizes.*' => 'string|in:S,M,L,XL,XXL',
            'photos' => 'required|array|min:1|max:5',
            'photos.*' => 'image|mimes:jpeg,png,jpg|max:5120',
        ]);

        // Upload photos
        $photoPaths = [];
        foreach ($request->file('photos') as $photo) {
            $path = $photo->store('boutique-products', 'public');
            $photoPaths[] = $path;
        }

        $product = Auth::user()->boutiqueProducts()->create([
            'motif_id' => $validated['motif_id'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'sizes' => $validated['sizes'],
            'photos' => $photoPaths,
            'is_active' => true,
        ]);

        return redirect()->route('boutique.products.index')
            ->with('success', 'Produk berhasil ditambahkan!');
    }

    /**
     * Display the specified product
     */
    public function show(BoutiqueProduct $product)
    {
        // Check ownership
        if ($product->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Boutique/Products/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'sizes' => $product->sizes,
                'photos' => $product->photos,
                'is_active' => $product->is_active,
                'motif' => [
                    'id' => $product->motif->id,
                    'title' => $product->motif->title,
                    'image_url' => $product->motif->image_url,
                ],
                'created_at' => $product->created_at->format('d M Y'),
            ]
        ]);
    }

    /**
     * Show form to edit product
     */
    public function edit(BoutiqueProduct $product)
    {
        if ($product->user_id !== Auth::id()) {
            abort(403);
        }

        $motifs = Auth::user()->publishedMotifs()
            ->where('status', 'approved')
            ->get()
            ->map(function ($motif) {
                return [
                    'id' => $motif->id,
                    'title' => $motif->title,
                    'image_url' => $motif->image_url,
                ];
            });

        return Inertia::render('Boutique/Products/Edit', [
            'product' => [
                'id' => $product->id,
                'motif_id' => $product->motif_id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'sizes' => $product->sizes,
                'photos' => $product->photos,
                'is_active' => $product->is_active,
            ],
            'motifs' => $motifs
        ]);
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, BoutiqueProduct $product)
    {
        if ($product->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'motif_id' => 'required|exists:motifs,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'sizes' => 'required|array',
            'sizes.*' => 'string|in:S,M,L,XL,XXL',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $updateData = [
            'motif_id' => $validated['motif_id'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'sizes' => $validated['sizes'],
        ];

        // If new photos uploaded, delete old and upload new
        if ($request->hasFile('photos')) {
            // Delete old photos
            foreach ($product->photos as $oldPhoto) {
                Storage::disk('public')->delete($oldPhoto);
            }

            // Upload new photos
            $photoPaths = [];
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('boutique-products', 'public');
                $photoPaths[] = $path;
            }
            $updateData['photos'] = $photoPaths;
        }

        $product->update($updateData);

        return redirect()->route('boutique.products.index')
            ->with('success', 'Produk berhasil diperbarui!');
    }

    /**
     * Toggle product active status
     */
    public function toggleStatus(BoutiqueProduct $product)
    {
        if ($product->user_id !== Auth::id()) {
            abort(403);
        }

        $product->update([
            'is_active' => !$product->is_active
        ]);

        return back()->with('success', 'Status produk berhasil diubah!');
    }

    /**
     * Remove the specified product
     */
    public function destroy(BoutiqueProduct $product)
    {
        if ($product->user_id !== Auth::id()) {
            abort(403);
        }

        // Delete photos
        foreach ($product->photos as $photo) {
            Storage::disk('public')->delete($photo);
        }

        $product->delete();

        return redirect()->route('boutique.products.index')
            ->with('success', 'Produk berhasil dihapus!');
    }
}
