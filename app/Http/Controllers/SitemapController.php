<?php

namespace App\Http\Controllers;

use App\Models\Konveksi;
use App\Models\PublishedMotif; // Pastikan ini diimport
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
{
    $konveksis = Konveksi::where('is_verified', true)
        ->orderBy('updated_at', 'desc')
        ->get();

    $motifs = PublishedMotif::approved()
        ->orderBy('updated_at', 'desc')
        ->get();

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    // ✅ PUBLIC ONLY
    $xml .= $this->addUrl(url('/'), 'daily', '1.0', now()->toDateString());
    $xml .= $this->addUrl(route('batik.generator'), 'weekly', '0.9', now()->toDateString());
    $xml .= $this->addUrl(route('motif'), 'weekly', '0.8', now()->toDateString());
    $xml .= $this->addUrl(route('konveksi.index'), 'daily', '0.9', now()->toDateString());
    $xml .= $this->addUrl(route('bantuan'), 'monthly', '0.7', now()->toDateString());

    foreach ($konveksis as $konveksi) {
        $xml .= $this->addUrl(
            route('konveksi.show', $konveksi->id),
            'weekly',
            '0.8',
            $konveksi->updated_at->toDateString()
        );
    }

    foreach ($motifs as $motif) {
        $xml .= $this->addUrl(
            url('/published-motifs/' . $motif->slug),
            'weekly',
            '0.8',
            $motif->updated_at->toDateString()
        );
    }

    $xml .= '</urlset>';

    return response($xml, 200)
        ->header('Content-Type', 'application/xml; charset=UTF-8')
        ->header('X-Content-Type-Options', 'nosniff');
}

    private function addUrl($loc, $changefreq = 'weekly', $priority = '0.5', $lastmod = null)
    {
        $url = '<url>';
        $url .= '<loc>' . htmlspecialchars($loc, ENT_XML1, 'UTF-8') . '</loc>';
        if ($lastmod) {
            $url .= '<lastmod>' . $lastmod . '</lastmod>';
        }
        $url .= '<changefreq>' . $changefreq . '</changefreq>';
        $url .= '<priority>' . $priority . '</priority>';
        $url .= '</url>';
        return $url;
    }
}