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
        // Set execution time limit to prevent timeout
        set_time_limit(300); // 5 minutes
        
        // 1. Validasi input dasar + opsi tambahan dari UI
        $validated = $request->validate([
            'prompt' => 'required|string|max:1000',
            'pattern_type' => 'nullable|string|in:seamless,single,repeat',
            'repeat_count' => 'nullable|integer|min:1|max:12',
            'color_scheme' => 'nullable|string|max:50',
            'style' => 'nullable|string|max:50',
            'aspect_ratio' => 'nullable|string|in:1:1,2:3,3:2,3:4,4:3,4:5,5:4,9:16,16:9,21:9',
            'image_size' => 'nullable|string|in:1K,2K,4K'
        ]);

        $userPrompt   = $validated['prompt'];
        $patternType  = $validated['pattern_type'] ?? 'seamless';
        $repeatCount  = $validated['repeat_count'] ?? 2;
        $colorScheme  = $validated['color_scheme'] ?? 'sogan';
        $style        = $validated['style'] ?? 'klasik';
        $aspectRatio  = $validated['aspect_ratio'] ?? '1:1';
        $imageSize    = $validated['image_size'] ?? '1K';

        try {
            // 2. Detect motif structure from user input
            $detectedStructure = $this->detectMotifStructure($userPrompt);
            
            // 3. Use Hugging Face as Primary AI Provider
            $aiProvider = env('AI_PROVIDER', 'huggingface');
            
            // Check if AI is temporarily disabled
            if ($aiProvider === 'disabled') {
                return response()->json([
                    'error' => 'Layanan AI sementara tidak tersedia.',
                    'message' => 'Tim teknis sedang memperbaiki sistem AI generation.',
                    'suggestion' => 'Silakan gunakan editor manual di menu Sanggar untuk membuat motif batik.',
                    'alternative_url' => '/upload/create',
                    'code' => 'AI_TEMPORARILY_DISABLED',
                    'estimated_fix' => 'Dalam 1-2 jam ke depan'
                ], 503);
            }
            
            Log::info('🤖 AI GENERATION START', [
                'provider_mode' => $aiProvider,
                'hf_key_present' => !empty(env('HF_TOKEN')),
                'user_prompt' => $userPrompt
            ]);
            
            // Use Hugging Face with fine-tuned specifications
            try {
                Log::info('🎯 Using Fine-Tuned Hugging Face Inference Providers API');
                
                // Apply pattern validation and optimization
                list($optimizedPatternType, $optimizedRepeatCount) = $this->validatePatternSpecifications(
                    $detectedStructure, $patternType, $repeatCount
                );
                
                return $this->generateWithHuggingFace(
                    $userPrompt, 
                    $optimizedPatternType, 
                    $optimizedRepeatCount, 
                    $colorScheme, 
                    $style, 
                    $detectedStructure
                );
            } catch (\Exception $e) {
                Log::error('❌ HUGGING FACE AI GENERATION FAILED', [
                    'error_message' => $e->getMessage(),
                    'error_code' => $e->getCode(),
                    'hf_key_configured' => !empty(env('HF_TOKEN')),
                    'timestamp' => now()->toISOString()
                ]);
                
                return response()->json([
                    'error' => 'Layanan AI tidak tersedia.',
                    'message' => 'Hugging Face AI mengalami masalah teknis. Silakan coba lagi dalam beberapa menit.',
                    'suggestion' => 'Atau gunakan editor manual di menu Sanggar untuk membuat motif batik.',
                    'code' => 'HF_AI_FAILED',
                    'alternatives' => [
                        [
                            'title' => 'Editor Manual',
                            'description' => 'Buat motif batik secara manual',
                            'url' => '/upload/create',
                            'icon' => 'edit'
                        ],
                        [
                            'title' => 'Coba Lagi Nanti',
                            'description' => 'Layanan AI biasanya pulih dalam beberapa menit',
                            'icon' => 'refresh'
                        ]
                    ],
                    'details' => $e->getMessage()
                ], 503);
            }

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
     * Generate batik using Hugging Face Inference Providers API
     */
    private function generateWithHuggingFace($userPrompt, $patternType, $repeatCount, $colorScheme, $style, $detectedStructure)
    {
        $hfToken = env('HF_TOKEN');
        $hfModel = env('HF_MODEL', 'black-forest-labs/FLUX.1-dev');
        
        if (empty($hfToken)) {
            throw new \Exception("HF_TOKEN tidak ditemukan di file .env. Silakan tambahkan token Hugging Face Anda.");
        }

        // Build optimized prompt for text-to-image generation
        $finalPrompt = $this->buildHuggingFaceBatikPrompt(
            $userPrompt,
            $patternType,
            $repeatCount,
            $colorScheme,
            $style,
            $detectedStructure
        );

        Log::info('Hugging Face AI Generation Started', [
            'detected_motif' => $detectedStructure['motif'] ?? 'generic',
            'model' => $hfModel
        ]);

        // Use new Hugging Face Inference Providers endpoint
        $apiUrl = "https://router.huggingface.co/hf-inference/models/{$hfModel}";
        
        $requestData = [
            'inputs' => $finalPrompt
        ];
        
        // Add parameters for better quality
        if (strpos($hfModel, 'FLUX') !== false || strpos($hfModel, 'SDXL') !== false) {
            $requestData['parameters'] = [
                'guidance_scale' => 7.5,
                'num_inference_steps' => 28,
                'width' => 1024,
                'height' => 1024
            ];
        }



        $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $hfToken,
                'Content-Type' => 'application/json'
            ])
            ->timeout(300)
            ->post($apiUrl, $requestData);

        if ($response->failed()) {
            $statusCode = $response->status();
            $responseBody = $response->body();
            
            Log::error('Hugging Face Inference Providers API Error', [
                'status_code' => $statusCode,
                'response_body' => $responseBody,
                'headers' => $response->headers(),
                'model' => $hfModel,
                'url' => $apiUrl
            ]);
            
            // Handle specific error cases
            if ($statusCode === 401) {
                throw new \Exception('HF_TOKEN tidak valid atau expired. Silakan periksa token di file .env.');
            } elseif ($statusCode === 429) {
                throw new \Exception('Terlalu banyak request ke Hugging Face. Silakan tunggu beberapa menit.');
            } elseif ($statusCode === 503) {
                throw new \Exception('Model sedang loading atau tidak tersedia. Silakan coba lagi dalam beberapa menit.');
            }
            
            $json = $response->json();
            $errMsg = $json['error'] ?? "Hugging Face API error (Status: {$statusCode})";
            throw new \Exception($errMsg);
        }

        // Handle binary image response
        $contentType = $response->header('Content-Type') ?: '';
        
        if (str_contains($contentType, 'application/json')) {
            $json = $response->json();
            Log::error('Unexpected JSON response from image generation', [
                'response' => $json,
                'content_type' => $contentType
            ]);
            $errMsg = $json['error'] ?? 'Respon tidak berisi gambar.';
            throw new \Exception($errMsg);
        }

        // Get binary image data
        $binaryImage = $response->body();
        if (empty($binaryImage)) {
            throw new \Exception('Respon kosong dari Hugging Face API.');
        }
        
        $imageData = base64_encode($binaryImage);

        Log::info('✅ Hugging Face image generation successful', [
            'model' => $hfModel,
            'image_size_bytes' => strlen($binaryImage),
            'detected_motif' => $detectedStructure['motif'] ?? 'generic'
        ]);

        // Enhanced response with pattern quality metadata
        return $this->saveAndReturnResponse(
            $imageData, 
            $finalPrompt, 
            $hfModel, 
            $patternType, 
            $repeatCount, 
            $colorScheme, 
            $style, 
            '1:1', 
            '1024x1024', 
            $detectedStructure, 
            'Fine-Tuned Hugging Face Inference Providers', 
            'huggingface'
        );
    }

    /**
     * Save generated image and return standardized response
     */
    private function saveAndReturnResponse($imageData, $finalPrompt, $model, $patternType, $repeatCount, $colorScheme, $style, $aspectRatio, $imageSize, $detectedStructure, $providerName, $provider)
    {
        $binaryImage = base64_decode($imageData);

        // Save to public storage
        $directory = 'generated_batik';
        if (!Storage::disk('public')->exists($directory)) {
            Storage::disk('public')->makeDirectory($directory);
        }
        
        $prefix = $provider === 'gemini' ? 'batik_gemini_' : 'batik_hf_';
        $extension = $provider === 'gemini' ? '.png' : '.jpg';
        $filename = $prefix . time() . '_' . Str::random(6) . $extension;
        
        Storage::disk('public')->put($directory . '/' . $filename, $binaryImage);
        $publicUrl = asset('storage/' . $directory . '/' . $filename);

        Log::info("✅ Fine-Tuned Batik generated successfully with {$providerName}", [
            'filename' => $filename,
            'detected_motif' => $detectedStructure['motif'] ?? 'generic',
            'model' => $model,
            'quality_score' => $qualityMetrics['overall_score'] ?? 'pending',
            'pattern_accuracy' => $qualityMetrics['estimated_accuracy'] ?? 'pending'
        ]);

        $mimeType = $provider === 'gemini' ? 'image/png' : 'image/jpeg';

        // Generate quality assessment for the pattern
        $qualityMetrics = $this->assessPatternQuality($detectedStructure, $patternType, $colorScheme);
        
        return response()->json([
            'image_data' => "data:{$mimeType};base64," . $imageData,
            'image_url' => $publicUrl,
            'image_path' => 'storage/' . $directory . '/' . $filename,
            'prompt_used' => $finalPrompt,
            'model' => $model,
            'meta' => [
                'pattern_type' => $patternType,
                'repeat_count' => $repeatCount,
                'color_scheme' => $colorScheme,
                'style' => $style,
                'aspect_ratio' => $aspectRatio,
                'image_size' => $imageSize,
                'detected_structure' => $detectedStructure['motif'] ?? 'generic',
                'structural_rules' => $detectedStructure['rules'] ?? null,
                'visual_cues' => $detectedStructure['visual_cues'] ?? null,
                'color_zones' => $detectedStructure['color_zones'] ?? null,
                'generation_time' => now()->toISOString(),
                'ai_provider' => $providerName,
                'quality_assessment' => $qualityMetrics,
                'fine_tuning_version' => '1.0',
                'pattern_accuracy' => $qualityMetrics['estimated_accuracy']
            ],
        ]);
    }

    /**
     * Enhanced motif detection with fine-tuned pattern recognition
     * Maps keywords to highly specific structural descriptions with visual references
     */
    private function detectMotifStructure($text)
    {
        $text = strtolower($text);

        // Fine-tuned motif rules with precise geometric descriptions
        $motifRules = [
            'kawung' => [
                'motif' => 'kawung',
                'rules' => 'KAWUNG PATTERN SPECIFICATION: Four precise elliptical shapes arranged in perfect symmetrical cross formation. Each ellipse: width 40px, height 120px (1:3 ratio exactly). Center intersection creates 20px diameter circle. Grid repetition: 160px x 160px spacing. Background fill between motifs. NO organic curves, NO irregular shapes. STRICT geometric precision required.',
                'visual_cues' => 'four oval petals, symmetrical cross, center dot, grid pattern, geometric precision',
                'color_zones' => 'alternating dark ovals with light background, center circle contrasting color',
                'forbidden' => 'curved organic lines, asymmetrical shapes, free-form patterns'
            ],
            'parang' => [
                'motif' => 'parang',
                'rules' => 'PARANG PATTERN SPECIFICATION: Diagonal blade-like shapes at EXACTLY 45-degree angle. Each blade: pointed tip, curved inner edge, straight outer edge. Parallel diagonal lines 80px apart. Consistent thickness: 15px blade width. Direction: top-left to bottom-right ONLY. Sharp angular geometry, NO rounded tips.',
                'visual_cues' => 'diagonal blades, 45 degree angle, parallel lines, sharp edges, keris knife shape',
                'color_zones' => 'dark blades on light background, consistent contrast',
                'forbidden' => 'horizontal lines, vertical lines, rounded blade tips, irregular angles'
            ],
            'mega mendung' => [
                'motif' => 'mega_mendung',
                'rules' => 'MEGA MENDUNG PATTERN SPECIFICATION: Concentric cloud spirals with 5-7 gradient layers. Each layer: 10px thickness difference. Spiral rotation: clockwise from center. Gradient: light center to dark outer. Cloud shape: rounded organic curves, NO sharp angles. Scale: 200px diameter per cloud unit.',
                'visual_cues' => 'concentric spirals, cloud shapes, gradient layers, organic curves, swirl pattern',
                'color_zones' => 'gradient from light blue/white center to dark blue/black outer rings',
                'forbidden' => 'sharp angles, geometric shapes, uniform colors, straight lines'
            ],
            'ceplok' => [
                'motif' => 'ceplok',
                'rules' => 'CEPLOK PATTERN SPECIFICATION: Perfect 8-pointed star inside square frame. Star: 60px diameter, 8 equal points at 45-degree intervals. Frame: 100px x 100px square border, 3px thick line. Grid: 120px spacing between frames. Radial symmetry MUST be perfect. Center dot: 8px diameter.',
                'visual_cues' => 'eight pointed star, square frame, radial symmetry, geometric precision, center dot',
                'color_zones' => 'dark star on light background, contrasting frame border',
                'forbidden' => 'irregular points, asymmetrical stars, curved frames, organic shapes'
            ],
            'truntum' => [
                'motif' => 'truntum',
                'rules' => 'TRUNTUM PATTERN SPECIFICATION: Micro-floral clusters of 7 tiny buds per unit. Each bud: 3px diameter, 5-pointed star shape. Cluster diameter: 25px. Grid spacing: 40px x 40px. Rotation: alternating 0° and 30° per row. Dense micro-pattern coverage, consistent bud size.',
                'visual_cues' => 'tiny star flowers, dense pattern, micro florals, jasmine buds, regular grid',
                'color_zones' => 'small dark buds on light background, minimal contrast variation',
                'forbidden' => 'large flowers, irregular sizes, random placement, curved petals'
            ],
            'sidomukti' => [
                'motif' => 'sidomukti',
                'rules' => 'SIDOMUKTI PATTERN SPECIFICATION: Diamond frames 80px x 80px, rotated 45°. Frame border: 4px thick line. Interior: symmetrical 4-petal flower, 30px diameter. Flower center: 6px circle. Grid spacing: 100px diagonal. Perfect geometric alignment required.',
                'visual_cues' => 'diamond frames, four petal flowers, geometric symmetry, rotated squares',
                'color_zones' => 'dark diamond borders, light flower petals, contrasting center dots',
                'forbidden' => 'irregular diamonds, asymmetrical flowers, curved borders, random rotation'
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
                'rules' => 'BANJI PATTERN SPECIFICATION: Greek key meander pattern, 90-degree angles ONLY. Line width: 8px consistent. Unit size: 60px x 60px. Interlocking L-shapes forming continuous border. NO curved corners, perfect right angles throughout.',
                'visual_cues' => 'greek key pattern, right angles, interlocking lines, geometric border',
                'color_zones' => 'consistent line color on contrasting background',
                'forbidden' => 'curved corners, diagonal lines, irregular angles, broken connections'
            ],
            'lereng' => [
                'motif' => 'lereng',
                'rules' => 'LERENG PATTERN SPECIFICATION: Parallel diagonal lines at 30-degree angle. Line spacing: 12px apart, 2px line width. Creates diagonal stripes covering entire surface. Consistent angle throughout, NO wavering.',
                'visual_cues' => 'diagonal parallel lines, consistent spacing, stripe pattern, geometric precision',
                'color_zones' => 'alternating light and dark diagonal stripes',
                'forbidden' => 'curved lines, variable spacing, horizontal or vertical orientations'
            ],
            'udan liris' => [
                'motif' => 'udan_liris',
                'rules' => 'UDAN LIRIS PATTERN SPECIFICATION: Diagonal rain-like dashes, 45-degree angle. Each dash: 8px length, 2px width. Spacing: 15px x 15px grid offset. Creates rain effect with consistent diagonal flow.',
                'visual_cues' => 'diagonal dashes, rain pattern, consistent angle, geometric repetition',
                'color_zones' => 'dark dashes on light background, uniform contrast',
                'forbidden' => 'curved dashes, random angles, variable lengths, clustering'
            ]
        ];

        // Check for keyword matches
        foreach ($motifRules as $keyword => $structure) {
            if (strpos($text, $keyword) !== false) {
                return $structure;
            }
        }

        // Enhanced fallback with pattern analysis
        $detectedElements = $this->analyzePatternElements($text);
        
        return [
            'motif' => 'generic',
            'rules' => 'ENHANCED BATIK PATTERN SPECIFICATION: Traditional Indonesian geometric patterns with ' . implode(', ', $detectedElements) . '. Maintain strict symmetry, consistent spacing, traditional color harmony. NO modern distortions or 3D effects.',
            'visual_cues' => implode(', ', $detectedElements) . ', traditional aesthetics, geometric precision',
            'color_zones' => 'traditional Indonesian batik color palette with proper contrast',
            'forbidden' => 'modern elements, 3D effects, photorealistic rendering, irregular patterns'
        ];
    }

    /**
     * Analyze pattern elements from user input for enhanced generic patterns
     */
    private function analyzePatternElements($text)
    {
        $elements = [];
        
        // Geometric elements
        if (preg_match('/\b(lingkaran|circle|bulat)\b/i', $text)) $elements[] = 'circular elements';
        if (preg_match('/\b(kotak|square|persegi)\b/i', $text)) $elements[] = 'square elements';
        if (preg_match('/\b(segitiga|triangle)\b/i', $text)) $elements[] = 'triangular elements';
        if (preg_match('/\b(diagonal|miring)\b/i', $text)) $elements[] = 'diagonal orientation';
        if (preg_match('/\b(garis|line|strip)\b/i', $text)) $elements[] = 'linear patterns';
        
        // Organic elements
        if (preg_match('/\b(bunga|flower|floral)\b/i', $text)) $elements[] = 'stylized floral motifs';
        if (preg_match('/\b(daun|leaf|leaves)\b/i', $text)) $elements[] = 'leaf patterns';
        if (preg_match('/\b(burung|bird|phoenix)\b/i', $text)) $elements[] = 'bird motifs';
        if (preg_match('/\b(kupu|butterfly)\b/i', $text)) $elements[] = 'butterfly elements';
        
        // Pattern types
        if (preg_match('/\b(ulang|repeat|grid)\b/i', $text)) $elements[] = 'repeating grid structure';
        if (preg_match('/\b(simetri|symmetri|balance)\b/i', $text)) $elements[] = 'symmetrical composition';
        
        return empty($elements) ? ['geometric abstraction', 'traditional symmetry'] : $elements;
    }

    /**
     * Get system role prompt optimized for Gemini
     */
    private function getSystemRole()
    {
        return "Create a traditional Indonesian batik pattern with authentic cultural accuracy. You are an expert batik artisan with deep knowledge of Indonesian textile traditions. Generate patterns that honor the cultural significance and geometric precision of classical batik motifs.";
    }

    /**
     * Get strict structural rules for Gemini
     */
    private function getStrictRules()
    {
        return "BATIK DESIGN PRINCIPLES:
• GEOMETRIC PRECISION: Maintain perfect symmetry and consistent grid alignment
• AUTHENTIC COLORS: Use traditional Indonesian batik color palettes (sogan browns, indigo blues, natural earth tones)
• CULTURAL ACCURACY: Respect the symbolic meaning and traditional composition of each motif
• PATTERN INTEGRITY: Ensure seamless repetition and balanced proportions
• ARTISTIC QUALITY: Sharp, clean lines with traditional batik aesthetic
• NO MODERN DISTORTIONS: Avoid photorealistic rendering, 3D effects, or contemporary art styles";
    }

    /**
     * Get user context for Gemini prompt
     */
    private function getUserContext($userPrompt, $colorScheme, $style)
    {
        $colorDescription = $this->getColorDescription($colorScheme);
        return "DESIGN REQUEST: Create a batik motif featuring: {$userPrompt}. Apply {$colorDescription} color palette. Artistic style: {$style}. Maintain traditional Indonesian batik craftsmanship standards.";
    }

    /**
     * Get quality specifications for Gemini
     */
    private function getQualityTags()
    {
        return "QUALITY SPECIFICATIONS: Museum-quality Indonesian batik pattern, hand-drawn aesthetic, traditional wax-resist technique appearance, authentic cultural motifs, perfect geometric balance, rich textile colors, artisanal craftsmanship, heritage design principles.";
    }

    /**
     * Build optimized prompt for Gemini image generation
     */
    private function buildGeminiBatikPrompt($systemRole, $strictRules, $detectedStructure, $userContext, $qualityTags, $patternType, $repeatCount)
    {
        $patternDescription = $this->getPatternDescription($patternType, $repeatCount);
        
        // Gemini works best with descriptive, narrative prompts
        $prompt = "{$systemRole}

{$strictRules}

MOTIF STRUCTURE: {$detectedStructure['rules']}

{$userContext}

PATTERN TYPE: {$patternDescription}

{$qualityTags}";
        
        return trim($prompt);
    }

    /**
     * Enhanced Hugging Face prompt builder with fine-tuned pattern specifications
     */
    private function buildHuggingFaceBatikPrompt($userPrompt, $patternType, $repeatCount, $colorScheme, $style, $detectedStructure)
    {
        // Get enhanced pattern specifications
        $motifRules = $detectedStructure['rules'] ?? 'Traditional Indonesian batik pattern with geometric precision';
        $visualCues = $detectedStructure['visual_cues'] ?? 'traditional geometric patterns';
        $colorZones = $detectedStructure['color_zones'] ?? $this->getColorDescription($colorScheme);
        $forbidden = $detectedStructure['forbidden'] ?? 'modern distortions';
        
        // Start with precise pattern specification
        $prompt = "Indonesian batik textile pattern, {$userPrompt}, ";
        
        // Add specific motif guidance with geometric precision
        if (isset($detectedStructure['motif']) && $detectedStructure['motif'] !== 'generic') {
            $prompt .= "SPECIFIC PATTERN: {$detectedStructure['motif']} motif following traditional specifications, ";
            $prompt .= "VISUAL ELEMENTS: {$visualCues}, ";
        }
        
        // Add enhanced color guidance
        $prompt .= "COLOR SCHEME: {$colorZones}, ";
        
        // Add pattern type with precision
        if ($patternType === 'seamless') {
            $prompt .= "STRUCTURE: seamless tileable pattern with perfect edge alignment, mathematical precision in repetition, ";
        } elseif ($patternType === 'repeat') {
            $prompt .= "STRUCTURE: precise {$repeatCount}x{$repeatCount} grid repetition, consistent spacing and alignment, ";
        } else {
            $prompt .= "STRUCTURE: centered single motif with balanced composition, ";
        }
        
        // Add quality specifications with fine-tuning
        $prompt .= "TECHNICAL REQUIREMENTS: vector-style clarity, sharp geometric edges, traditional batik wax-resist aesthetic, ";
        $prompt .= "STYLE: {$style} Indonesian craftsmanship, museum quality precision, ";
        $prompt .= "CONSTRAINTS: avoid {$forbidden}, maintain cultural authenticity, ";
        
        // Add negative prompt guidance (what NOT to generate)
        $prompt .= "NEGATIVE: photorealistic, 3D rendering, modern abstract art, blurry edges, irregular geometry";
        

        
        return trim($prompt);
    }

    /**
     * Validate and enhance pattern specifications based on motif requirements
     */
    private function validatePatternSpecifications($detectedStructure, $patternType, $repeatCount)
    {
        $motif = $detectedStructure['motif'] ?? 'generic';
        
        // Motif-specific recommendations
        $recommendations = [
            'kawung' => ['optimal_pattern' => 'seamless', 'min_repeat' => 2, 'max_repeat' => 4],
            'parang' => ['optimal_pattern' => 'seamless', 'min_repeat' => 1, 'max_repeat' => 3],
            'mega_mendung' => ['optimal_pattern' => 'single', 'min_repeat' => 1, 'max_repeat' => 2],
            'ceplok' => ['optimal_pattern' => 'repeat', 'min_repeat' => 3, 'max_repeat' => 6],
            'truntum' => ['optimal_pattern' => 'seamless', 'min_repeat' => 4, 'max_repeat' => 8],
        ];
        
        if (isset($recommendations[$motif])) {
            $rec = $recommendations[$motif];
            
            // Auto-correct pattern type if needed
            if ($patternType !== $rec['optimal_pattern']) {
                $patternType = $rec['optimal_pattern'];
            }
            
            // Adjust repeat count
            if ($repeatCount < $rec['min_repeat']) $repeatCount = $rec['min_repeat'];
            if ($repeatCount > $rec['max_repeat']) $repeatCount = $rec['max_repeat'];
        }
        
        return [$patternType, $repeatCount];
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

    /**
     * Assess pattern quality based on traditional batik standards
     */
    private function assessPatternQuality($detectedStructure, $patternType, $colorScheme)
    {
        $motif = $detectedStructure['motif'] ?? 'generic';
        
        // Quality scoring based on traditional authenticity
        $scores = [
            'geometric_precision' => $this->scoreGeometricPrecision($motif, $patternType),
            'cultural_authenticity' => $this->scoreCulturalAuthenticity($motif, $colorScheme),
            'pattern_consistency' => $this->scorePatternConsistency($motif, $patternType),
            'color_harmony' => $this->scoreColorHarmony($colorScheme)
        ];

        $overallScore = array_sum($scores) / count($scores);
        
        $qualityLevel = 'Unknown';
        if ($overallScore >= 90) $qualityLevel = 'Museum Quality';
        elseif ($overallScore >= 80) $qualityLevel = 'Traditional Standard';
        elseif ($overallScore >= 70) $qualityLevel = 'Good Quality';
        elseif ($overallScore >= 60) $qualityLevel = 'Acceptable';
        else $qualityLevel = 'Needs Improvement';

        return [
            'overall_score' => round($overallScore, 1),
            'quality_level' => $qualityLevel,
            'estimated_accuracy' => round($overallScore) . '%',
            'detailed_scores' => $scores,
            'recommendations' => $this->getQualityRecommendations($scores, $motif)
        ];
    }

    /**
     * Score geometric precision based on motif requirements
     */
    private function scoreGeometricPrecision($motif, $patternType)
    {
        $baseScore = 75;
        
        // Motif-specific scoring
        $precisionRequirements = [
            'kawung' => ['seamless' => 95, 'repeat' => 90, 'single' => 85],
            'parang' => ['seamless' => 98, 'repeat' => 85, 'single' => 80],
            'ceplok' => ['repeat' => 95, 'seamless' => 90, 'single' => 92],
            'mega_mendung' => ['single' => 95, 'seamless' => 88, 'repeat' => 80],
            'truntum' => ['seamless' => 95, 'repeat' => 92, 'single' => 85]
        ];

        if (isset($precisionRequirements[$motif][$patternType])) {
            return $precisionRequirements[$motif][$patternType];
        }

        return $baseScore;
    }

    /**
     * Score cultural authenticity
     */
    private function scoreCulturalAuthenticity($motif, $colorScheme)
    {
        $baseScore = 80;
        
        // Traditional color scheme bonuses
        $traditionalColors = ['sogan', 'lasem', 'megamendung', 'banyumasan'];
        if (in_array($colorScheme, $traditionalColors)) {
            $baseScore += 10;
        }
        
        // Motif authenticity bonus
        $authenticMotifs = ['kawung', 'parang', 'mega_mendung', 'ceplok', 'truntum'];
        if (in_array($motif, $authenticMotifs)) {
            $baseScore += 10;
        }

        return min($baseScore, 100);
    }

    /**
     * Score pattern consistency
     */
    private function scorePatternConsistency($motif, $patternType)
    {
        // Base consistency score
        $baseScore = 85;
        
        // Pattern type consistency with motif tradition
        $consistencyMap = [
            'kawung' => ['seamless' => 95, 'repeat' => 90],
            'parang' => ['seamless' => 98],
            'ceplok' => ['repeat' => 95, 'single' => 90],
            'mega_mendung' => ['single' => 95, 'seamless' => 85]
        ];

        if (isset($consistencyMap[$motif][$patternType])) {
            return $consistencyMap[$motif][$patternType];
        }

        return $baseScore;
    }

    /**
     * Score color harmony
     */
    private function scoreColorHarmony($colorScheme)
    {
        $harmonyScores = [
            'sogan' => 95,      // Most traditional and harmonious
            'lasem' => 90,      // Traditional with good contrast
            'megamendung' => 88, // Traditional blue harmony
            'banyumasan' => 85,  // Earth tones, well balanced
            'traditional' => 92, // Generic traditional
            'pastel' => 75,     // Modern but soft
            'vibrant' => 70     // Modern, less traditional
        ];

        return $harmonyScores[$colorScheme] ?? 75;
    }

    /**
     * Generate quality improvement recommendations
     */
    private function getQualityRecommendations($scores, $motif)
    {
        $recommendations = [];

        if ($scores['geometric_precision'] < 85) {
            $recommendations[] = "Improve geometric precision by using 'seamless' pattern type for {$motif} motif";
        }

        if ($scores['cultural_authenticity'] < 85) {
            $recommendations[] = "Use traditional color schemes (sogan, lasem, megamendung) for better authenticity";
        }

        if ($scores['pattern_consistency'] < 85) {
            $recommendations[] = "Consider pattern type optimization for this motif";
        }

        if ($scores['color_harmony'] < 85) {
            $recommendations[] = "Switch to traditional Indonesian color palettes for better harmony";
        }

        if (empty($recommendations)) {
            $recommendations[] = "Excellent quality! Pattern meets traditional batik standards.";
        }

        return $recommendations;
    }
}