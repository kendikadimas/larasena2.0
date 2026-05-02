<?php

namespace App\Http\Controllers;

use App\Models\PublishedMotif;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        // Hanya ambil halaman publik yang layak diindex
        $motifs = PublishedMotif::approved()
            ->orderBy('updated_at', 'desc')
            ->get();

        $today = now()->toDateString();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        /*
        |--------------------------------------------------------------------------
        | PUBLIC CORE PAGES
        |--------------------------------------------------------------------------
        | Hanya halaman publik dan SEO value tinggi
        */

        // Homepage
        $xml .= $this->addUrl(
            url('/'),
            'daily',
            '1.0',
            $today
        );

        // Galeri motif utama
        $xml .= $this->addUrl(
            route('published-motifs.gallery'),
            'daily',
            '0.95',
            $today
        );

        // Halaman layanan (commercial page)
        $xml .= $this->addUrl(
            route('layanan'),
            'weekly',
            '0.90',
            $today
        );

        /*
        |--------------------------------------------------------------------------
        | DETAIL MOTIF
        |--------------------------------------------------------------------------
        */

        foreach ($motifs as $motif) {
            $xml .= $this->addUrl(
                route('published-motifs.show', $motif->slug),
                'weekly',
                '0.85',
                $motif->updated_at->toDateString()
            );
        }

        $xml .= '</urlset>';

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8')
            ->header('X-Content-Type-Options', 'nosniff');
    }

    /**
     * Generate single URL node
     */
    private function addUrl(
        string $loc,
        string $changefreq = 'weekly',
        string $priority = '0.5',
        ?string $lastmod = null
    ): string {
        $url = '<url>';

        $url .= '<loc>' .
            htmlspecialchars($loc, ENT_XML1, 'UTF-8') .
            '</loc>';

        if ($lastmod) {
            $url .= '<lastmod>' . $lastmod . '</lastmod>';
        }

        $url .= '<changefreq>' . $changefreq . '</changefreq>';
        $url .= '<priority>' . $priority . '</priority>';

        $url .= '</url>';

        return $url;
    }
}