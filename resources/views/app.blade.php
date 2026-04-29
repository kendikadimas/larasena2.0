<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- SEO Meta Tags -->
        <meta name="description" content="Larasena - Platform desain dan produksi batik berbasis AI. Buat motif batik unik dengan teknologi AI dan produksi bersama konveksi terpercaya.">
        <meta name="keywords" content="batik, desain batik, AI batik generator, motif batik, konveksi batik, produksi batik, batik Indonesia">
        <meta name="author" content="Larasena">
        <meta name="robots" content="index, follow">
        <meta name="language" content="Indonesian">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="Larasena - Platform Desain Batik AI">
        <meta property="og:description" content="Buat motif batik unik dengan teknologi AI dan produksi bersama konveksi terpercaya.">
        <meta property="og:image" content="{{ asset('images/larasena-icon.svg') }}">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ url()->current() }}">
        <meta property="twitter:title" content="Larasena - Platform Desain Batik AI">
        <meta property="twitter:description" content="Buat motif batik unik dengan teknologi AI dan produksi bersama konveksi terpercaya.">
        <meta property="twitter:image" content="{{ asset('images/larasena-icon.svg') }}">

        <!-- Canonical URL -->
        <link rel="canonical" href="{{ url()->current() }}">

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
