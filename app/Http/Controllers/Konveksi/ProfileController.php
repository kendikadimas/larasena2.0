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

        // Prepare data to update (only text fields first)
        $updateData = [
            'name' => $validated['name'],
            'location' => $validated['location'],
            'no_telp' => $validated['no_telp'],
            'description' => $validated['description'] ?? '',
        ];

        // Handle icon upload
        if ($request->hasFile('icon')) {
            // Delete old icon if exists
            if ($konveksi->icon) {
                Storage::disk('public')->delete($konveksi->icon);
            }
            
            $iconPath = $request->file('icon')->store('konveksi/icons', 'public');
            $updateData['icon'] = $iconPath;
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
            $updateData['documentation'] = json_encode(array_merge($existingDocs, $documentationPaths));
        }

        $konveksi->update($updateData);

        return redirect()->back()->with('success', 'Profil berhasil diperbarui');
    }

    public function deleteDocumentation(Request $request)
    {
        $user = Auth::user();
        $konveksi = Konveksi::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'path' => 'required|string',
        ]);

        $documentation = json_decode($konveksi->documentation, true) ?? [];
        
        // Find and remove the specific file path
        $key = array_search($validated['path'], $documentation);
        
        if ($key !== false) {
            // Delete file from storage
            Storage::disk('public')->delete($documentation[$key]);
            
            // Remove from array
            unset($documentation[$key]);
            
            // Reindex array
            $documentation = array_values($documentation);
            
            // Update database
            $konveksi->update([
                'documentation' => json_encode($documentation),
            ]);

            return response()->json(['success' => true, 'message' => 'Dokumentasi berhasil dihapus']);
        }

        return response()->json(['success' => false, 'message' => 'File tidak ditemukan'], 404);
    }
}
