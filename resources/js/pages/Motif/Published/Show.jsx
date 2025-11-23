import { useState } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import { Heart, Eye, User, Share2, Facebook, Twitter, Copy, Check, Calendar, ArrowLeft } from 'lucide-react';

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
        <div className="min-h-screen bg-gray-50">
            <Head title={motif.title} />
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#BA682A] via-[#D2691E] to-[#F4A460] text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/galeri-motif"
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Kembali ke Galeri</span>
                    </Link>
                    <h1 className="text-4xl font-bold">{motif.title}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Image */}
                    <div className="relative">
                        <div className="sticky top-8">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                                <img
                                    src={motif.image_url}
                                    alt={motif.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Stats */}
                            <div className="mt-6 flex items-center justify-between bg-white rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Eye className="w-5 h-5 text-blue-500" />
                                        <span className="font-semibold">{motif.views_count}</span>
                                        <span className="text-sm text-gray-500">views</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Heart className={`w-5 h-5 ${motif.is_liked_by_user ? 'text-red-500 fill-current' : 'text-red-500'}`} />
                                        <span className="font-semibold">{motif.likes_count}</span>
                                        <span className="text-sm text-gray-500">likes</span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleLike}
                                    className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                                        motif.is_liked_by_user
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 inline mr-2 ${motif.is_liked_by_user ? 'fill-current' : ''}`} />
                                    {motif.is_liked_by_user ? 'Disukai' : 'Suka'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        {/* Publisher */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Dibuat Oleh</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#BA682A] to-[#D2691E] flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                                    {motif.user.profile_photo_url ? (
                                        <img
                                            src={motif.user.profile_photo_url}
                                            alt={motif.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        motif.user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-xl font-bold text-gray-800">
                                        {motif.user.name}
                                    </div>
                                    {motif.user.badges && motif.user.badges.length > 0 && (
                                        <div className="flex gap-2 mt-1">
                                            {motif.user.badges.map((badge, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold"
                                                >
                                                    {badge.badge_icon} {badge.badge_name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-gray-600 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>Dipublikasikan {motif.published_at}</span>
                            </div>
                        </div>

                        {/* Philosophy */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Filosofi Motif</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {motif.philosophy}
                            </p>
                        </div>

                        {/* Share */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Bagikan Motif</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className="flex-1 min-w-[140px] px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Facebook className="w-5 h-5" />
                                    Facebook
                                </button>
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className="flex-1 min-w-[140px] px-4 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Twitter className="w-5 h-5" />
                                    Twitter
                                </button>
                                <button
                                    onClick={() => handleShare('whatsapp')}
                                    className="flex-1 min-w-[140px] px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Share2 className="w-5 h-5" />
                                    WhatsApp
                                </button>
                                <button
                                    onClick={handleCopyLink}
                                    className="flex-1 min-w-[140px] px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-5 h-5 text-green-600" />
                                            Tersalin!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5" />
                                            Copy Link
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Motifs */}
                {relatedMotifs && relatedMotifs.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Motif Lainnya</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedMotifs.map((related) => (
                                <Link
                                    key={related.id}
                                    href={route('published-motifs.show', related.slug)}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={related.image_url}
                                            alt={related.title}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">
                                            {related.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" />
                                                <span>{related.likes_count}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{related.views_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
