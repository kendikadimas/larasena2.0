<?php

namespace App\Http\Controllers\Konveksi;

use App\Http\Controllers\Controller;
use App\Models\Konveksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        
        // Get or create konveksi profile
        $konveksi = Konveksi::firstOrCreate(
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'location' => '',
                'no_telp' => '',
                'description' => '',
                'is_verified' => false,
                'rating' => 0,
            ]
        );

        return Inertia::render('Konveksi/Profile', [
            'konveksi' => [
                'id' => $konveksi->id,
                'name' => $konveksi->name,
                'location' => $konveksi->location,
                'no_telp' => $konveksi->no_telp,
                'description' => $konveksi->description,
                'is_verified' => $konveksi->is_verified,
                'rating' => $konveksi->rating,
                'icon' => $konveksi->icon,
                'icon_url' => $konveksi->icon_url,
                'documentation' => $konveksi->documentation,
                'documentation_url' => $konveksi->documentation_url,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'no_telp' => 'required|string|max:20',
            'description' => 'nullable|string',
            'icon' => 'nullable|file|image|max:2048',
            'documentation.*' => 'nullable|file|image|max:2048',
        ]);

        $konveksi = Konveksi::where('user_id', $user->id)->firstOrFail();

        // Handle icon upload
        if ($request->hasFile('icon')) {
            // Delete old icon if exists
            if ($konveksi->icon) {
                Storage::disk('public')->delete($konveksi->icon);
            }
            
            $iconPath = $request->file('icon')->store('konveksi/icons', 'public');
            $validated['icon'] = $iconPath;
        }

        // Handle documentation upload
        if ($request->hasFile('documentation')) {
            $documentationPaths = [];
            
            foreach ($request->file('documentation') as $file) {
                $path = $file->store('konveksi/documentation', 'public');
                $documentationPaths[] = $path;
            }
            
            // Merge with existing documentation
            $existingDocs = $konveksi->documentation ? json_decode($konveksi->documentation, true) : [];
            $validated['documentation'] = json_encode(array_merge($existingDocs, $documentationPaths));
        }

        $konveksi->update($validated);

        return redirect()->back()->with('success', 'Profil berhasil diperbarui');
    }

    public function deleteDocumentation(Request $request, Konveksi $konveksi)
    {
        // Check authorization
        if ($konveksi->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'index' => 'required|integer|min:0',
        ]);

        $documentation = json_decode($konveksi->documentation, true) ?? [];
        
        if (isset($documentation[$validated['index']])) {
            // Delete file from storage
            Storage::disk('public')->delete($documentation[$validated['index']]);
            
            // Remove from array
            unset($documentation[$validated['index']]);
            
            // Reindex array
            $documentation = array_values($documentation);
            
            // Update database
            $konveksi->update([
                'documentation' => json_encode($documentation),
            ]);
        }

        return redirect()->back()->with('success', 'Dokumentasi berhasil dihapus');
    }
}
