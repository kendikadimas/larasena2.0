<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BatikGeneratorController extends Controller
{
    public function generate(Request $request)
    {
        // 1. Validasi input dasar + opsi tambahan dari UI
        $validated = $request->validate([
            'prompt' => 'required|string|max:1000',
            'pattern_type' => 'nullable|string|in:seamless,single,repeat',
            'repeat_count' => 'nullable|integer|min:1|max:12',
            'color_scheme' => 'nullable|string|max:50',
            'style' => 'nullable|string|max:50'
        ]);

        $userPrompt   = $validated['prompt'];
        $patternType  = $validated['pattern_type'] ?? 'seamless';
        $repeatCount  = $validated['repeat_count'] ?? 2;
        $colorScheme  = $validated['color_scheme'] ?? 'sogan';
        $style        = $validated['style'] ?? 'klasik';

        try {
            // 2. Ambil API key & model dari .env
            $hfApiKey = env('HF_API_KEY');
            $hfModel  = env('HF_MODEL', 'stabilityai/stable-diffusion-xl-base-1.0');
            if (empty($hfApiKey)) {
                throw new \Exception("HF_API_KEY tidak ditemukan di file .env.");
            }

            // 3. Susun prompt komposit
            $patternDescriptor = match($patternType) {
                'seamless' => 'tileable seamless repeating pattern',
                'repeat' => 'repeating motif layout pattern',
                default => 'single centered motif'
            };

            $repeatInfo = $patternType === 'single' ? '' : " repeated ${repeatCount}x";

            $baseQuality = 'masterpiece, best quality, ultra-detailed, sharp lines';
            $cultureTag  = 'traditional Indonesian batik art';
            $styleTags   = "$style style, $colorScheme color palette";

            $finalPrompt = trim("$baseQuality, $cultureTag, $patternDescriptor$repeatInfo featuring $userPrompt, $styleTags, vector art look, smooth curves, balanced composition");

            // 4. Negative prompt (mengurangi artefak umum)
            $negativePrompt = 'low quality, worst quality, blurry, noisy, distorted anatomy, watermark, text, signature, jpeg artifacts, oversaturated, deformed, cropped';

            Log::info('Sending to Hugging Face', [
                'model' => $hfModel,
                'prompt' => $finalPrompt,
                'negative' => $negativePrompt,
            ]);

            $modelUrl = "https://api-inference.huggingface.co/models/{$hfModel}";

            // 5. Panggil API (menunggu model kalau cold start)
            $response = Http::withToken($hfApiKey)
                ->timeout(180) // beri sedikit lebih lama untuk cold start
                ->withHeaders([
                    'Accept' => 'application/json, image/png, image/jpeg',
                ])
                ->post($modelUrl, [
                    'inputs' => $finalPrompt,
                    'parameters' => [
                        'negative_prompt' => $negativePrompt,
                        'guidance_scale' => 7.5,
                        'num_inference_steps' => 30,
                    ],
                    'options' => [
                        'wait_for_model' => true
                    ]
                ]);

            if ($response->failed()) {
                Log::error('Hugging Face API Error raw body: ' . $response->body());
                // Jika JSON error (misal model loading / rate limit)
                $json = $response->json();
                $errMsg = $json['error'] ?? 'Model AI gambar sedang sibuk atau gagal merespons.';
                throw new \Exception($errMsg);
            }

            // 6. Tangani konten: jika JSON berarti bukan image (fallback error)
            $contentType = $response->header('Content-Type');
            if (str_contains($contentType, 'application/json')) {
                $json = $response->json();
                $errMsg = $json['error'] ?? 'Respon tidak berisi gambar.';
                throw new \Exception($errMsg);
            }

            $binaryImage = $response->body();
            $imageData   = base64_encode($binaryImage);

            // 7. Simpan ke storage publik agar bisa dipakai ulang (cache sederhana)
            $directory = 'generated_batik';
            if (!Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->makeDirectory($directory);
            }
            $filename = 'batik_' . time() . '_' . Str::random(6) . '.jpg';
            Storage::disk('public')->put($directory . '/' . $filename, $binaryImage);
            $publicUrl = asset('storage/' . $directory . '/' . $filename);

            return response()->json([
                'image_data' => 'data:image/jpeg;base64,' . $imageData,
                'image_url' => $publicUrl,
                'image_path' => 'storage/' . $directory . '/' . $filename,
                'prompt_used' => $finalPrompt,
                'negative_prompt' => $negativePrompt,
                'model' => $hfModel,
                'meta' => [
                    'pattern_type' => $patternType,
                    'repeat_count' => $repeatCount,
                    'color_scheme' => $colorScheme,
                    'style' => $style,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('AI Generation Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Gagal berkomunikasi dengan layanan AI.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}