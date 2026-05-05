<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\PublishedMotif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DesignController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $designs = Design::where('user_id', Auth::id())
            ->latest('updated_at')
            ->get()
            ->map(function ($design) {

                $design->canvas_data = $this->decodeCanvas($design->canvas_data);

                $design->published_status = $this->getPublishStatus($design);

                $design->image_url = $this->normalizeImageUrl($design->image_url);

                return $design;
            });

        return Inertia::render('User/Dashboard', [
            'designs' => $designs
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Manual Design
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'canvas_data'   => 'required|array',
            'canvas_width'  => 'required|integer|min:200|max:5000',
            'canvas_height' => 'required|integer|min:200|max:5000',
            'thumbnail'     => 'nullable|string',
        ]);

        $thumbnailPath = $this->saveBase64Image(
            $request->thumbnail,
            'designs/thumbnails'
        );

        Design::create([
            'title'         => $validated['title'],
            'canvas_data'   => json_encode($validated['canvas_data']),
            'canvas_width'  => $validated['canvas_width'],
            'canvas_height' => $validated['canvas_height'],
            'image_url'     => $thumbnailPath,
            'user_id'       => Auth::id(),
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Desain berhasil dibuat');
    }

    /*
    |--------------------------------------------------------------------------
    | Show Editor
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        $design = Design::where('user_id', Auth::id())
            ->findOrFail($id);

        $canvas = $this->decodeCanvas($design->canvas_data);
        $canvas = $this->normalizeCanvasImages($canvas);

        return Inertia::render('Editor/DesignEditor', [
            'initialDesign' => [
                'id'            => $design->id,
                'title'         => $design->title,
                'canvas_data'   => $canvas,
                'canvas_width'  => (int) ($design->canvas_width ?: 800),
                'canvas_height' => (int) ($design->canvas_height ?: 600),
                'image_url'     => $this->normalizeImageUrl($design->image_url),
                'created_at'    => $design->created_at,
                'updated_at'    => $design->updated_at,
            ]
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, $id)
    {
        $design = Design::where('user_id', Auth::id())
            ->findOrFail($id);

        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'canvas_data'   => 'required|array',
            'canvas_width'  => 'required|integer|min:200|max:5000',
            'canvas_height' => 'required|integer|min:200|max:5000',
            'thumbnail'     => 'nullable|string',
        ]);

        $thumbnailPath = $design->image_url;

        if ($request->thumbnail) {

            $this->deleteImageIfExists($design->image_url);

            $thumbnailPath = $this->saveBase64Image(
                $request->thumbnail,
                'designs/thumbnails'
            );
        }

        $design->update([
            'title'         => $validated['title'],
            'canvas_data'   => json_encode($validated['canvas_data']),
            'canvas_width'  => $validated['canvas_width'],
            'canvas_height' => $validated['canvas_height'],
            'image_url'     => $thumbnailPath,
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Desain berhasil diupdate');
    }

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        $design = Design::where('user_id', Auth::id())
            ->findOrFail($id);

        $this->deleteImageIfExists($design->image_url);

        $design->delete();

        return redirect()
            ->route('dashboard')
            ->with('success', 'Desain berhasil dihapus');
    }

    /*
    |--------------------------------------------------------------------------
    | Save AI Generated Design
    |--------------------------------------------------------------------------
    */

    public function storeFromAi(Request $request)
    {
        $request->validate([
            'title'      => 'required|string|max:255',
            'image_data' => 'required|string',
        ]);

        $filename = $this->saveBase64Image(
            $request->image_data,
            'designs/generated'
        );

        $canvasData = [
            [
                'id'       => 'obj_' . time(),
                'type'     => 'image',
                'x'        => 100,
                'y'        => 50,
                'width'    => 600,
                'height'   => 600,
                'rotation' => 0,
                'imageUrl' => $filename,
            ]
        ];

        Design::create([
            'title'         => $request->title,
            'canvas_data'   => json_encode($canvasData),
            'canvas_width'  => 800,
            'canvas_height' => 600,
            'image_url'     => $filename,
            'user_id'       => Auth::id(),
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Design AI berhasil disimpan');
    }

    /*
    |--------------------------------------------------------------------------
    | PRIVATE HELPERS
    |--------------------------------------------------------------------------
    */

    private function decodeCanvas($data)
    {
        if (is_array($data)) return $data;

        return json_decode($data, true) ?? [];
    }

    private function normalizeCanvasImages(array $items)
    {
        return collect($items)->map(function ($item) {

            if (isset($item['imageUrl'])) {
                $item['imageUrl'] = $this->normalizeImageUrl($item['imageUrl']);
            }

            if (isset($item['src']) && !isset($item['imageUrl'])) {
                $item['imageUrl'] = $this->normalizeImageUrl($item['src']);
            }

            return $item;
        })->toArray();
    }

    private function normalizeImageUrl($path)
    {
        if (!$path) return null;

        if (
            Str::startsWith($path, 'http://') ||
            Str::startsWith($path, 'https://')
        ) {
            return $path;
        }

        if (Str::startsWith($path, '/storage/')) {
            return $path;
        }

        return Storage::url($path);
    }

    private function saveBase64Image($base64, $folder)
    {
        if (!$base64) return null;

        $data = substr($base64, strpos($base64, ',') + 1);
        $decoded = base64_decode($data);

        $filename = $folder . '/' . Auth::id() . '_' . time() . '.jpg';

        Storage::disk('public')->put($filename, $decoded);

        return $filename;
    }

    private function deleteImageIfExists($path)
    {
        if (!$path) return;

        if (
            Str::startsWith($path, 'http://') ||
            Str::startsWith($path, 'https://')
        ) {
            return;
        }

        Storage::disk('public')->delete($path);
    }

    private function getPublishStatus($design)
    {
        $filename = basename($design->image_url);

        $motif = PublishedMotif::where('user_id', $design->user_id)
            ->where(function ($query) use ($filename, $design) {

                $query->where('image_path', 'LIKE', '%' . $filename)
                    ->orWhereRaw(
                        "JSON_UNQUOTE(JSON_EXTRACT(design_data, '$.design_id')) = ?",
                        [(string) $design->id]
                    );
            })
            ->first();

        return $motif?->status;
    }
}