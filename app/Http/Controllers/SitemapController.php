<?php

namespace App\Http\Controllers;

use App\Models\Konveksi;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $konveksis = Konveksi::where('is_verified', true)
            ->orderBy('updated_at', 'desc')
            ->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Landing Page
        $xml .= $this->addUrl(url('/'), '1.0', 'daily', now()->toDateString());

        // Auth Pages
        $xml .= $this->addUrl(route('login'), '0.8', 'monthly', now()->toDateString());
        $xml .= $this->addUrl(route('register'), '0.8', 'monthly', now()->toDateString());

        // Public Static Pages
        $xml .= $this->addUrl(url('/dashboard'), '0.9', 'daily', now()->toDateString());
        $xml .= $this->addUrl(route('batik.generator'), '0.9', 'weekly', now()->toDateString());
        $xml .= $this->addUrl(route('motif'), '0.8', 'weekly', now()->toDateString());
        $xml .= $this->addUrl(route('konveksi.index'), '0.9', 'daily', now()->toDateString());
        $xml .= $this->addUrl(route('bantuan'), '0.7', 'monthly', now()->toDateString());
        $xml .= $this->addUrl(route('editor.create'), '0.8', 'weekly', now()->toDateString());
        $xml .= $this->addUrl(route('production.index'), '0.7', 'weekly', now()->toDateString());
        $xml .= $this->addUrl(route('production.create'), '0.7', 'weekly', now()->toDateString());

        // Dynamic Konveksi Pages
        foreach ($konveksis as $konveksi) {
            $xml .= $this->addUrl(
                route('konveksi.show', $konveksi->id),
                '0.8',
                'weekly',
                $konveksi->updated_at->toDateString()
            );
        }

        $xml .= '</urlset>';

        return response($xml, 200)
            ->header('Content-Type', 'application/xml');
    }

    private function addUrl($loc, $priority = '0.5', $changefreq = 'weekly', $lastmod = null)
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
