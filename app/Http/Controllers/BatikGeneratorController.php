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
            // 2. Detect motif structure from user input
            $detectedStructure = $this->detectMotifStructure($userPrompt);
            
            // 3. Ambil API key & model dari .env
            $hfApiKey = env('HF_API_KEY');
            $hfModel  = env('HF_MODEL', 'stabilityai/stable-diffusion-xl-base-1.0');
            if (empty($hfApiKey)) {
                throw new \Exception("HF_API_KEY tidak ditemukan di file .env.");
            }

            // 4. Build sophisticated prompt structure
            $systemRole = $this->getSystemRole();
            $strictRules = $this->getStrictRules();
            $userContext = $this->getUserContext($userPrompt, $colorScheme, $style);
            $qualityTags = $this->getQualityTags();

            // 5. Combine all parts into final prompt
            $finalPrompt = $this->buildFinalPrompt(
                $systemRole,
                $strictRules,
                $detectedStructure,
                $userContext,
                $qualityTags,
                $patternType,
                $repeatCount
            );

            // 6. Build negative prompts with stricter constraints
            $negativePrompt = $this->buildNegativePrompt();

            Log::info('=== BATIK GENERATOR REQUEST ===', [
                'user_prompt' => $userPrompt,
                'detected_motif' => $detectedStructure['motif'] ?? 'generic',
                'pattern_type' => $patternType,
                'color_scheme' => $colorScheme,
                'style' => $style,
                'repeat_count' => $repeatCount,
            ]);

            Log::info('Final Prompt Sent:', [
                'prompt' => $finalPrompt,
                'negative_prompt' => $negativePrompt,
            ]);

            $modelUrl = "https://api-inference.huggingface.co/models/{$hfModel}";

            // 7. Call API with strict parameters
            $response = Http::withToken($hfApiKey)
                ->timeout(180)
                ->withHeaders([
                    'Accept' => 'application/json, image/png, image/jpeg',
                ])
                ->post($modelUrl, [
                    'inputs' => $finalPrompt,
                    'parameters' => [
                        'negative_prompt' => $negativePrompt,
                        'guidance_scale' => 9.0,  // ✅ Increased for strict adherence
                        'num_inference_steps' => 40,  // ✅ Increased for better detail
                    ],
                    'options' => [
                        'wait_for_model' => true
                    ]
                ]);

            if ($response->failed()) {
                Log::error('Hugging Face API Error:', [
                    'body' => $response->body(),
                    'status' => $response->status()
                ]);
                $json = $response->json();
                $errMsg = $json['error'] ?? 'Model AI gambar sedang sibuk atau gagal merespons.';
                throw new \Exception($errMsg);
            }

            // 8. Handle response content type
            $contentType = $response->header('Content-Type');
            if (str_contains($contentType, 'application/json')) {
                $json = $response->json();
                $errMsg = $json['error'] ?? 'Respon tidak berisi gambar.';
                throw new \Exception($errMsg);
            }

            $binaryImage = $response->body();
            $imageData   = base64_encode($binaryImage);

            // 9. Save to public storage
            $directory = 'generated_batik';
            if (!Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->makeDirectory($directory);
            }
            $filename = 'batik_' . time() . '_' . Str::random(6) . '.jpg';
            Storage::disk('public')->put($directory . '/' . $filename, $binaryImage);
            $publicUrl = asset('storage/' . $directory . '/' . $filename);

            Log::info('✅ Batik generated successfully', [
                'filename' => $filename,
                'detected_motif' => $detectedStructure['motif'] ?? 'generic'
            ]);

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
                    'detected_structure' => $detectedStructure['motif'] ?? 'generic',
                    'structural_rules' => $detectedStructure['rules'] ?? null,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('❌ AI Generation Error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Gagal berkomunikasi dengan layanan AI.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Detect motif structure from user input text
     * Maps keywords to strict structural descriptions
     */
    private function detectMotifStructure($text)
    {
        $text = strtolower($text);

        $motifRules = [
            'kawung' => [
                'motif' => 'kawung',
                'rules' => 'Base Structure: Kawung Motif. Four elongated ovals forming a perfect symmetrical cross pattern. Each oval measures proportionally 1:3 (width:height). Ovals intersect at center circle. Repeating grid layout with consistent spacing. Small filled circles at intersection points.'
            ],
            'parang' => [
                'motif' => 'parang',
                'rules' => 'Base Structure: Parang Motif. Diagonal wave-like blade forms resembling keris shape. Repeating slanted pattern at 45-degree angles. Sharp edges with curved inner lines. Consistent diagonal flow from top-left to bottom-right. No irregular distortions.'
            ],
            'mega mendung' => [
                'motif' => 'mega_mendung',
                'rules' => 'Base Structure: Mega Mendung Motif. Layered cloud swirls with cascading curves. Graduating colors from inner light to outer dark. Smooth undulating waves. Multiple concentric curves creating cloud-like appearance. Consistent thickness transitions.'
            ],
            'ceplok' => [
                'motif' => 'ceplok',
                'rules' => 'Base Structure: Ceplok Motif. Repeating geometric rosettes or star patterns inside squares or circles. Perfect radial symmetry. Regular grid arrangement. Eight-pointed or four-pointed stars. Strong geometric alignment. No organic irregularities.'
            ],
            'truntum' => [
                'motif' => 'truntum',
                'rules' => 'Base Structure: Truntum Motif. Dense micro-floral patterns resembling jasmine buds or small flowers. Star-like formations. Regular grid spacing throughout. Repeating unit cells with identical dimensions. Consistent bloom orientation.'
            ],
            'sidomukti' => [
                'motif' => 'sidomukti',
                'rules' => 'Base Structure: Sidomukti Motif. Geometric diamond or square frames containing floral elements. Symmetrical arrangement of flowers inside frames. Regular repeating grid. Consistent border thickness. Balanced internal composition.'
            ],
            'sogan' => [
                'motif' => 'sogan',
                'rules' => 'Base Structure: Sogan Traditional. Brown earth-tone color palette with simple geometric patterns. Subtle repeating elements. Traditional keraton aesthetic. Muted color gradients. Classic symmetrical arrangements. Refined, minimalist approach.'
            ],
            'lasem' => [
                'motif' => 'lasem',
                'rules' => 'Base Structure: Lasem Motif. Vibrant red and gold accents with dynamic floral elements. Birds and flowering plants intertwined. Bold, expressive design. Layered composition with depth. Strong color contrast. Chinese-Javanese fusion aesthetic.'
            ],
            'nitik' => [
                'motif' => 'nitik',
                'rules' => 'Base Structure: Nitik Motif. Tiny detailed dot patterns forming micro-geometric designs. Precise grid-based arrangements. Microscopic precision. Regular spacing between dots. Creates overall geometric shapes through dotted patterns.'
            ],
            'garuda' => [
                'motif' => 'garuda',
                'rules' => 'Base Structure: Garuda Motif. Central eagle or bird figure with spread wings. Symmetrical wing patterns. Ornamental feather details. Central focal point with radiating symmetry. Majestic, balanced composition.'
            ],
            'sekar jagad' => [
                'motif' => 'sekar_jagad',
                'rules' => 'Base Structure: Sekar Jagad Motif. World flower pattern combining geographic elements with floral ornaments. Dense, complex arrangement. Multiple overlapping flora and fauna. Balanced color distribution across design. Rich, encyclopedic composition.'
            ],
            'banji' => [
                'motif' => 'banji',
                'rules' => 'Base Structure: Banji Motif. Interlocking geometric borders forming continuous lines. Meanders or Greek key patterns. Regular repeating units. Perfect angular alignment. Border-based design principle.'
            ]
        ];

        // Check for keyword matches
        foreach ($motifRules as $keyword => $structure) {
            if (strpos($text, $keyword) !== false) {
                Log::info("✅ Detected motif: {$keyword}");
                return $structure;
            }
        }

        // Fallback to generic structure
        Log::info("⚠️ No specific motif detected, using generic structure");
        return [
            'motif' => 'generic',
            'rules' => 'Base Structure: Traditional Indonesian Batik. Symmetrical repeating patterns. Balanced geometric or organic elements. Traditional aesthetic. Consistent grid spacing where applicable. Avoid hallucination and maintain pattern integrity.'
        ];
    }

    /**
     * Get system role prompt
     */
    private function getSystemRole()
    {
        return "You are a traditional Indonesian Batik Generator AI. Your sole purpose is to create accurate, geometrically precise batik patterns based on centuries-old designs. You MUST NOT hallucinate, distort, or create irregular patterns. Every element must follow strict geometric rules.";
    }

    /**
     * Get strict structural rules
     */
    private function getStrictRules()
    {
        return "STRICT RULES TO FOLLOW:
1. GEOMETRY PRESERVATION: Maintain exact geometric shapes as specified. No distortions or irregular deviations.
2. SYMMETRY ENFORCEMENT: All patterns must be perfectly symmetrical along their axes.
3. GRID ADHERENCE: Follow a strict grid layout. Spacing must be consistent and regular.
4. COLOR ADHERENCE: Use only traditional Indonesian batik colors. No unusual or modern colors unless explicitly requested.
5. PATTERN INTEGRITY: Never break repeating patterns. Each unit cell must be identical.
6. TRADITIONAL AESTHETIC: Maintain the classical Indonesian batik feel. No surrealism or abstract distortions.
7. SCALE CONSISTENCY: All elements within the pattern must maintain consistent proportions.
8. EDGE CLARITY: All pattern edges must be sharp and well-defined, not blurry or smeared.";
    }

    /**
     * Get user context for the prompt
     */
    private function getUserContext($userPrompt, $colorScheme, $style)
    {
        $colorDescription = $this->getColorDescription($colorScheme);
        return "USER REQUEST: Create a batik pattern based on: '$userPrompt'. Use color scheme: $colorDescription. Style preference: $style (traditional/modern/contemporary). Incorporate these specifications while maintaining strict geometric accuracy.";
    }

    /**
     * Get quality tags
     */
    private function getQualityTags()
    {
        return "QUALITY REQUIREMENTS: masterpiece quality, ultra-detailed, perfect geometry, sharp lines, crisp edges, professional batik artistry, traditional craftsmanship, no artifacts, museum-quality precision, perfect symmetry, consistent patterns, authentic batik aesthetic.";
    }

    /**
     * Build final sophisticated prompt
     */
    private function buildFinalPrompt($systemRole, $strictRules, $detectedStructure, $userContext, $qualityTags, $patternType, $repeatCount)
    {
        $patternDescription = $this->getPatternDescription($patternType, $repeatCount);

        return trim("{$systemRole} {$strictRules} STRUCTURAL CONSTRAINT: {$detectedStructure['rules']} {$userContext} {$patternDescription} {$qualityTags}");
    }

    /**
     * Build negative prompt with strict constraints
     */
    private function buildNegativePrompt()
    {
        return "low quality, worst quality, blurry, noisy, distorted geometry, irregular grid, broken pattern, hallucination, artifacts, watermark, text, signature, jpeg compression, oversaturated, desaturated, deformed shapes, misaligned pattern, asymmetrical, inconsistent spacing, amateur work, photorealistic, 3D rendering, modern art, surrealism, abstract distortion, ugly, malformed, cropped pattern, incomplete motif";
    }

    /**
     * Get pattern type description
     */
    private function getPatternDescription($patternType, $repeatCount)
    {
        $descriptions = [
            'seamless' => 'Generate as a seamless tileable pattern that repeats infinitely without seams.',
            'single' => 'Generate as a single centered motif without repetition.',
            'repeat' => "Generate as a repeating pattern. Repeat the motif {$repeatCount}x{$repeatCount} times in a grid layout."
        ];

        return $descriptions[$patternType] ?? $descriptions['seamless'];
    }

    /**
     * Get color scheme description
     */
    private function getColorDescription($colorScheme)
    {
        $colorDescriptions = [
            'sogan' => 'Sogan (traditional brown earth tones: #6E3B1E, #D2A679, #EADCC2)',
            'lasem' => 'Lasem (vibrant reds and golds: #A61C20, #F4C2C2, #E9C46A)',
            'megamendung' => 'Mega Mendung (blues and whites: #1E3A8A, #3B82F6, #93C5FD)',
            'banyumasan' => 'Banyumasan (dark earth browns: #3E2723, #6D4C41, #BCAAA4)',
            'pastel' => 'Modern Pastel (soft pastels: #FEE2E2, #E0E7FF, #D1FAE5)',
            'traditional' => 'Traditional Indonesian (muted natural pigments with vintage appearance)',
            'vibrant' => 'Vibrant traditional (bold, saturated traditional colors)'
        ];

        return $colorDescriptions[$colorScheme] ?? $colorDescriptions['sogan'];
    }
}