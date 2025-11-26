import { useState } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import { Heart, Eye, User, Share2, Facebook, Twitter, Copy, Check, Calendar, ArrowLeft, MapPin } from 'lucide-react';

export default function Show({ motif, relatedMotifs, user }) {
    const [copied, setCopied] = useState(false);
    const shareUrl = window.location.href;
    const shareText = `Lihat motif batik "${motif.title}" - ${motif.philosophy.substring(0, 100)}...`;

    const handleLike = () => {
        if (!user) {
            // Redirect to login if not authenticated
            router.visit('/login');
            return;
        }
        
        // Toggle like for authenticated users
        router.post(`/motif/${motif.id}/like`, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Immediately reload motif data
                router.reload({ only: ['motif'], preserveScroll: true });
            }
        });
    };

    const handleShare = (platform) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(shareText);
        
        let url = '';
        switch(platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${encodedText} ${encodedUrl}`;
                break;
        }
        
        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
            <Head title={motif.title}>
                <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
            </Head>
            
            <style jsx>{`
                * {
                    font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
            `}</style>
            
            {/* ===== NAVBAR - Same as Gallery ===== */}
            {/* Logo & Auth Button - Scrolls Away */}
            <div className="relative w-full py-4 bg-transparent">
                <div className="px-8 md:px-16 lg:px-24 flex justify-between items-center">
                    <Link href="/" className="flex-shrink-0 flex items-center transform hover:scale-105 transition-transform duration-300">
                        <img 
                            src="/images/logolarasena.png" 
                            alt="Larasena Logo" 
                            className="h-12 w-auto"
                        />
                    </Link>
                    
                    {/* Auth Button - Desktop (Scrolls Away) */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold hover:from-amber-800 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold hover:from-amber-800 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Masuk
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Menu - Fixed Centered */}
            <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex items-center gap-8 px-8 py-3 rounded-3xl bg-white/90 backdrop-blur-lg border border-amber-100 shadow-lg">
                    <Link href="/" className="font-medium transition-all duration-300 relative group text-base text-gray-700 hover:text-amber-700">
                        Beranda
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href={route('published-motifs.gallery')} className="font-medium transition-all duration-300 relative group text-base text-amber-700">
                        Batikpedia
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600"></span>
                    </Link>
                    <Link href="/#bantuan" className="font-medium transition-all duration-300 relative group text-base text-gray-700 hover:text-amber-700">
                        Bantuan
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </div>
            </nav>

            <div className="px-8 md:px-16 lg:px-24 py-8">
                {/* Back Button */}
                <Link
                    href="/galeri-motif"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#BA682A] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Kembali ke Galeri</span>
                </Link>

                {/* Title & Profile Creator */}
                <div className="flex items-center justify-between mb-8">
                    {/* Title */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{motif.title}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#BA682A] to-[#D2691E] flex items-center justify-center text-white font-bold overflow-hidden ring-2 ring-gray-100">
                                    {motif.user.profile_photo_url ? (
                                        <img
                                            src={motif.user.profile_photo_url}
                                            alt={motif.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm">{motif.user.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {motif.user.name}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        <span>{motif.published_at}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Like Button */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <Eye className="w-5 h-5" />
                                <span className="font-semibold">{motif.views_count}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Heart className={`w-5 h-5 ${motif.is_liked_by_user ? 'fill-current text-red-500' : ''}`} />
                                <span className="font-semibold">{motif.likes_count}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLike}
                            className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                                motif.is_liked_by_user
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <Heart className={`w-4 h-4 ${motif.is_liked_by_user ? 'fill-current' : ''}`} />
                            {motif.is_liked_by_user ? 'Disukai' : 'Suka'}
                        </button>
                    </div>
                </div>

                {/* Main Image - Full Width */}
                <div className="mb-8">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gray-50">
                        <img
                            src={motif.image_url}
                            alt={motif.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Philosophy - Below Image */}
                <div className=" mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Filosofi Motif</h2>
                    <p className="text-gray-700 leading-relaxed text-center text-lg whitespace-pre-wrap">
                        {motif.philosophy}
                    </p>
                </div>

                {/* Share Section - Minimal */}
                <div className="mb-16 pb-16 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Bagikan Motif</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleShare('facebook')}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Facebook className="w-4 h-4" />
                            Facebook
                        </button>
                        <button
                            onClick={() => handleShare('twitter')}
                            className="px-5 py-2.5 bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-600 transition-colors flex items-center gap-2"
                        >
                            <Twitter className="w-4 h-4" />
                            Twitter
                        </button>
                        <button
                            onClick={() => handleShare('whatsapp')}
                            className="px-5 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            WhatsApp
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-green-600" />
                                    Tersalin!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy Link
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Related Motifs */}
                {relatedMotifs && relatedMotifs.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Motif Lainnya</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {relatedMotifs.map((related) => (
                                <div key={related.id} className="group">
                                    <Link href={route('published-motifs.show', related.slug)}>
                                        <div className="relative rounded-2xl overflow-hidden transition-all duration-300">
                                            {/* Image Container */}
                                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                                <img
                                                    src={related.image_url}
                                                    alt={related.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                
                                                {/* Origin Badge - Top Left */}
                                                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                                                    <MapPin className="w-3.5 h-3.5 text-[#BA682A]" />
                                                    <span className="text-xs font-semibold text-gray-700">
                                                        {related.origin || 'Indonesia'}
                                                    </span>
                                                </div>

                                                {/* Nama Batik Overlay - Muncul on Hover */}
                                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <h3 className="text-white font-bold text-base line-clamp-2">
                                                        {related.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Card Footer - Stats Only */}
                                            <div className="pt-3">
                                                <div className="flex items-center gap-4 text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4" />
                                                        <span className="text-xs font-medium">{related.views_count}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Heart className="w-4 h-4" />
                                                        <span className="text-xs font-medium">{related.likes_count}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-white border-t mt-20">
                <div className="px-8 md:px-16 lg:px-24 py-12">
                    <div className="text-center text-gray-600">
                        <p className="mb-2">© 2025 Larasena. Platform Desain Batik Indonesia</p>
                        <div className="flex justify-center gap-6 mt-4">
                            <Link href="/" className="hover:text-[#BA682A] transition-colors">Beranda</Link>
                            <Link href="/galeri-motif" className="hover:text-[#BA682A] transition-colors">Galeri</Link>
                            <Link href="/login" className="hover:text-[#BA682A] transition-colors">Login</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
