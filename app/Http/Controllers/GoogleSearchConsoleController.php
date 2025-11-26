<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class GoogleSearchConsoleController extends Controller
{
    /**
     * Handle Google Search Console HTML verification file
     * 
     * Google Search Console mengirimkan file verification dengan format:
     * google{hash}.html
     * 
     * Pastikan Anda sudah membuat file verification dari Google Search Console
     * dan menyimpannya di public folder dengan nama yang benar.
     */
    public function verifyHtml($filename)
    {
        // Validate filename format (harus diawali dengan 'google' dan berakhir dengan .html)
        if (!preg_match('/^google[a-f0-9]+\.html$/', $filename)) {
            abort(404);
        }

        // Path ke file di public folder
        $filePath = public_path($filename);

        // Check apakah file ada
        if (!file_exists($filePath)) {
            abort(404, 'Verification file not found');
        }

        // Return file dengan content type yang tepat
        return response()->file($filePath, [
            'Content-Type' => 'text/html; charset=utf-8',
        ]);
    }

    /**
     * Return Google Meta Verification Tag
     * 
     * Alternatif: jika Anda menggunakan meta tag verification,
     * endpoint ini bisa digunakan untuk dynamic meta tag generation
     */
    public function getMetaTag()
    {
        $verificationCode = env('GOOGLE_SEARCH_CONSOLE_META', '');

        if (empty($verificationCode)) {
            return response()->json([
                'error' => 'Google Search Console meta tag not configured'
            ], 400);
        }

        return response()->json([
            'meta_content' => $verificationCode,
            'meta_tag' => "<meta name=\"google-site-verification\" content=\"{$verificationCode}\" />"
        ]);
    }

    /**
     * Endpoint untuk submit Sitemap ke Google Search Console (optional)
     * 
     * Catatan: Fitur ini optional dan memerlukan Google API credentials
     * Untuk production, lebih baik submit manual di Google Search Console
     */
    public function submitSitemap()
    {
        // Ini hanya untuk referensi - gunakan Google Search Console UI untuk submit
        $sitemapUrl = url('/sitemap.xml');

        return response()->json([
            'message' => 'Silakan submit sitemap secara manual di Google Search Console',
            'sitemap_url' => $sitemapUrl,
            'instructions' => [
                'Buka https://search.google.com/search-console',
                'Pilih property (website Anda)',
                'Pergi ke Sitemaps di menu sidebar',
                'Klik "Add/test sitemap" dan masukkan: ' . $sitemapUrl,
                'Google akan mulai mengindex URL dari sitemap Anda'
            ]
        ]);
    }
}
