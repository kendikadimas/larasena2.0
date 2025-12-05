<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleAIGeneration
{
    /**
     * Handle an incoming request for AI generation endpoints.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only apply to AI generation routes
        if ($request->is('api/batik-generator') || $request->is('batik-generator')) {
            // Set longer execution time for AI generation
            set_time_limit(300); // 5 minutes
            ini_set('memory_limit', '256M');
            
            // Log the start of AI generation
            \Illuminate\Support\Facades\Log::info('AI Generation Started', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'timestamp' => now()->toISOString()
            ]);
        }

        $response = $next($request);

        // Add CORS headers for AI endpoints
        if ($request->is('api/*')) {
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        }

        return $response;
    }
}