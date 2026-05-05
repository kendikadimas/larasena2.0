<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @if(isset($pageMeta))
            {{-- Dynamic Meta Tags for Individual Pages (SEO-friendly for social media crawlers) --}}
            <title inertia>{{ $pageMeta['title'] }}</title>

            <meta name="title" content="{{ $pageMeta['title'] }}">
            <meta name="description" content="{{ $pageMeta['description'] }}">
            <meta name="keywords" content="{{ $pageMeta['keywords'] ?? 'batik, motif batik, desain batik, batik Indonesia, Larasena' }}">
            <meta name="author" content="Larasena">
            <meta name="robots" content="index, follow">
            <meta name="language" content="Indonesian">

            <!-- Open Graph / Facebook / WhatsApp -->
            <meta property="og:type" content="{{ $pageMeta['type'] ?? 'website' }}">
            <meta property="og:url" content="{{ $pageMeta['url'] }}">
            <meta property="og:title" content="{{ $pageMeta['title'] }}">
            <meta property="og:description" content="{{ $pageMeta['description'] }}">
            <meta property="og:image" content="{{ $pageMeta['image'] }}">
            <meta property="og:image:width" content="1200">
            <meta property="og:image:height" content="630">
            <meta property="og:image:type" content="image/jpeg">
            <meta property="og:site_name" content="Larasena">
            <meta property="og:locale" content="id_ID">

            <!-- Twitter / X -->
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:url" content="{{ $pageMeta['url'] }}">
            <meta name="twitter:title" content="{{ $pageMeta['title'] }}">
            <meta name="twitter:description" content="{{ $pageMeta['description'] }}">
            <meta name="twitter:image" content="{{ $pageMeta['image'] }}">
            <meta name="twitter:creator" content="@larasena_id">
            <meta name="twitter:site" content="@larasena_id">

            <!-- Canonical URL -->
            <link rel="canonical" href="{{ $pageMeta['url'] }}">

            <!-- JSON-LD Structured Data (Schema.org) -->
            @if(!empty($pageMeta['jsonLd']))
            <script type="application/ld+json">{!! $pageMeta['jsonLd'] !!}</script>
            @endif
        @else
            {{-- Default Meta Tags (Homepage & Other Pages) --}}
            <title inertia>{{ config('app.name', 'Laravel') }}</title>

            <!-- SEO Meta Tags -->
            <meta name="description" content="Larasena adalah platform digital untuk desain batik, upload karya batik, dan komunitas kreator batik Indonesia. Buat motif batik unikmu dengan AI dan bagikan ke ribuan pengguna.">
            <meta name="keywords" content="desain batik, upload batik, komunitas batik, kreator batik Indonesia, motif batik, batik AI, galeri motif batik, batik online, Larasena">
            <meta name="author" content="Larasena">
            <meta name="robots" content="index, follow">
            <meta name="language" content="Indonesian">
            
            <!-- Open Graph / Facebook -->
            <meta property="og:type" content="website">
            <meta property="og:url" content="{{ url()->current() }}">
            <meta property="og:title" content="Larasena — Desain Batik & Galeri Motif Batik Indonesia">
            <meta property="og:description" content="Larasena adalah platform digital untuk desain batik, upload karya batik, dan komunitas kreator batik Indonesia.">
            <meta property="og:image" content="{{ asset('images/larasena-icon.svg') }}">

            <!-- Twitter -->
            <meta property="twitter:card" content="summary_large_image">
            <meta property="twitter:url" content="{{ url()->current() }}">
            <meta property="twitter:title" content="Larasena — Desain Batik & Galeri Motif Batik Indonesia">
            <meta property="twitter:description" content="Buat motif batik unik dengan teknologi AI dan produksi bersama konveksi terpercaya.">
            <meta property="twitter:image" content="{{ asset('images/larasena-icon.svg') }}">

            <!-- Canonical URL -->
            <link rel="canonical" href="{{ url()->current() }}">
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <link rel="icon" type="image/svg+xml" href="/images/larasena-icon.svg">
        <link rel="apple-touch-icon" href="/images/larasena-icon.svg">
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/pages/{$page['component']}.jsx"])
        @vite('resources/css/app.css')
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
