<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class RobotsController extends Controller
{
    /**
     * Generate robots.txt dynamically
     * 
     * Ini memberikan Anda flexibility untuk mengubah rules tanpa restart server
     * Bisa diintegrasikan dengan database untuk dynamic rules management
     */
    public function index()
    {
        $robotsContent = $this->generateRobotsContent();

        return response($robotsContent, 200)
            ->header('Content-Type', 'text/plain; charset=utf-8');
    }

    /**
     * Generate robots.txt content
     */
    private function generateRobotsContent()
    {
        $content = "# Robots.txt for Larasena - Indonesian Batik Design Platform\n";
        $content .= "# Generated on: " . now()->toRfc2822String() . "\n\n";

        // Allow all bots to crawl public content
        $content .= "User-agent: *\n";
        $content .= "Allow: /\n";
        $content .= "Allow: /galeri-motif/\n";          // Galeri publik
        $content .= "Allow: /storage/published-motifs/\n"; // Gambar motif publik — PENTING untuk OG image
        $content .= "Allow: /storage/generated_batik/\n";  // Gambar batik AI
        $content .= "Allow: /images/\n";                // Aset publik
        $content .= "Disallow: /admin*\n";
        $content .= "Disallow: /dashboard\n";
        $content .= "Disallow: /konveksi-dashboard\n";
        $content .= "Disallow: /konveksi-pesanan\n";
        $content .= "Disallow: /konveksi-pelanggan\n";
        $content .= "Disallow: /konveksi-penghasilan\n";
        $content .= "Disallow: /konveksi-profile\n";
        $content .= "Disallow: /vendor/\n";
        $content .= "Disallow: /tests/\n";
        $content .= "Disallow: /bootstrap/\n";
        $content .= "Disallow: /config/\n";
        $content .= "Disallow: /database/\n";
        $content .= "Disallow: /upload\n";
        $content .= "Disallow: /motif/publish\n";
        $content .= "Disallow: /api/\n";

        // Crawl delay
        $content .= "Crawl-delay: 1\n\n";

        // Specific rules for Googlebot — prioritaskan halaman motif
        $content .= "User-agent: Googlebot\n";
        $content .= "Allow: /\n";
        $content .= "Allow: /galeri-motif/\n";
        $content .= "Allow: /storage/published-motifs/\n";
        $content .= "Allow: /storage/generated_batik/\n";
        $content .= "Disallow: /admin*\n";
        $content .= "Disallow: /private/\n";
        $content .= "Disallow: /konveksi-dashboard\n";
        $content .= "Disallow: /konveksi-pesanan\n";
        $content .= "Disallow: /konveksi-pelanggan\n";
        $content .= "Disallow: /konveksi-penghasilan\n";
        $content .= "Disallow: /konveksi-profile\n";

        // Googlebot Image — pastikan bisa crawl gambar motif
        $content .= "\nUser-agent: Googlebot-Image\n";
        $content .= "Allow: /storage/published-motifs/\n";
        $content .= "Allow: /storage/generated_batik/\n";
        $content .= "Allow: /images/\n";

        // Sitemap location
        $content .= "\nSitemap: " . url('/sitemap.xml') . "\n";

        return $content;
    }
}
