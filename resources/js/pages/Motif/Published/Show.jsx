import { useState } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import { Heart, Eye, Share2, Facebook, Twitter, Copy, Check, Calendar, ArrowLeft, MapPin, Store, Users, Award } from 'lucide-react';
import LarasenaNavbar from '@/components/LarasenaNavbar';
import LarasenaFooter from '@/components/LarasenaFooter';

export default function Show({ motif, relatedMotifs, user }) {
    const [copied, setCopied] = useState(false);
    const shareUrl = window.location.href;
    const shareText = `Lihat motif batik "${motif.title}" - ${motif.philosophy.substring(0, 100)}...`;

    const handleLike = () => {
        if (!user) {
            router.visit('/login');
            return;
        }
        router.post(`/motif/${motif.id}/like`, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
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
        if (url) window.open(url, '_blank', 'width=600,height=400');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FBF8F1 0%, #F5F0E8 100%)' }}>
            <Head title={motif.title}>
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
            </Head>

            <style jsx>{`
                * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .serif { font-family: 'Playfair Display', Georgia, serif; }
                .gradient-text {
                    background: linear-gradient(135deg, #1A332F 0%, #2C5E54 45%, #8B6F47 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .hover-lift { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
                .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(26, 51, 47, 0.12); }
                .hover-glow { transition: box-shadow 0.4s ease; }
                .hover-glow:hover { box-shadow: 0 0 20px rgba(139, 111, 71, 0.2); }
                .batik-border {
                    position: relative;
                    padding-left: 16px;
                }
                .batik-border::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background: linear-gradient(180deg, #1A332F, #C9A84C, #1A332F);
                    border-radius: 4px;
                }
            `}</style>

            <LarasenaNavbar user={user} />

            <div className="px-8 md:px-16 lg:px-24 py-8">
                {/* Back Button */}
                <Link
                    href="/galeri-motif"
                    className="inline-flex items-center gap-2 mb-8 transition-all duration-300 group"
                    style={{ color: '#8B6F47' }}
                >
                    <span className="w-8 h-8 rounded-full border border-[#D9CCBF] flex items-center justify-center group-hover:border-[#1A332F] group-hover:bg-white transition-all">
                        <ArrowLeft className="w-4 h-4 group-hover:text-[#1A332F] transition-colors" />
                    </span>
                    <span className="font-medium text-sm group-hover:text-[#1A332F] transition-colors">Kembali ke Galeri</span>
                </Link>

                {/* Title & Creator */}
                <div className="mb-8">
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <h1 className="serif text-3xl md:text-5xl font-bold leading-tight" style={{ color: '#1A332F', letterSpacing: '-0.02em' }}>
                            {motif.title}
                        </h1>
                        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#D9CCBF] bg-white/80 backdrop-blur-sm">
                            <MapPin className="w-4 h-4" style={{ color: '#8B6F47' }} />
                            <span className="text-sm font-semibold" style={{ color: '#1A332F' }}>
                                {motif.origin || 'Indonesia'}
                            </span>
                        </div>
                    </div>

                    {/* Creator & Stats */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A332F] to-[#2C5E54] flex items-center justify-center text-white font-bold overflow-hidden ring-2 ring-[#D9CCBF]">
                                {motif.user.profile_photo_url ? (
                                    <img src={motif.user.profile_photo_url} alt={motif.user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm">{motif.user.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div>
                                <div className="text-sm font-semibold" style={{ color: '#1A332F' }}>{motif.user.name}</div>
                                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8B6F47' }}>
                                    <Calendar className="w-3 h-3" />
                                    <span>{motif.published_at}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats & Like */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-4" style={{ color: '#6F6358' }}>
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4" />
                                    <span className="text-sm font-medium">{motif.views_count}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Heart className={`w-4 h-4 ${motif.is_liked_by_user ? 'fill-current text-rose-500' : ''}`} />
                                    <span className="text-sm font-medium">{motif.likes_count}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLike}
                                className={`px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                                    motif.is_liked_by_user
                                        ? 'bg-rose-500 text-white shadow-lg'
                                        : 'bg-white border border-[#D9CCBF] hover:border-[#1A332F] hover:shadow-md'
                                }`}
                                style={motif.is_liked_by_user ? {} : { color: '#1A332F' }}
                            >
                                <Heart className={`w-4 h-4 ${motif.is_liked_by_user ? 'fill-current' : ''}`} />
                                {motif.is_liked_by_user ? 'Disukai' : 'Suka'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ornamen divider */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #D9CCBF)' }} />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="3" fill="#C9A84C" opacity="0.6" />
                        <circle cx="12" cy="12" r="7" stroke="#C9A84C" strokeWidth="1" opacity="0.3" fill="none" />
                    </svg>
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #D9CCBF, transparent)' }} />
                </div>

                {/* Main Image */}
                <div className="mb-10">
                    <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-[#D9CCBF]/50 hover-glow">
                        <img
                            src={motif.image_url}
                            alt={motif.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Philosophy */}
                <div className="max-w-3xl mx-auto mb-12">
                    <h2 className="serif text-2xl font-bold mb-6 text-center" style={{ color: '#1A332F' }}>
                        Filosofi Motif
                    </h2>
                    <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-[#D9CCBF]/60 shadow-sm">
                        {/* decorative quote mark */}
                        <svg className="absolute top-6 left-8 w-8 h-8 opacity-10" viewBox="0 0 32 32" fill="#1A332F">
                            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.648-7.104 6.624-9.024L25.864 4z"/>
                        </svg>
                        <p className="text-lg leading-relaxed text-center italic" style={{ color: '#5A4F3E', lineHeight: 1.9 }}>
                            {motif.philosophy}
                        </p>
                    </div>
                </div>

                {/* Share Section */}
                <div className="mb-16 pb-16 border-b" style={{ borderColor: '#D9CCBF' }}>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: '#8B6F47' }}>
                        Bagikan Motif
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleShare('facebook')}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-2 text-sm"
                        >
                            <Facebook className="w-4 h-4" />
                            Facebook
                        </button>
                        <button
                            onClick={() => handleShare('twitter')}
                            className="px-5 py-2.5 bg-sky-500 text-white rounded-2xl font-medium hover:bg-sky-600 transition-all hover:scale-105 flex items-center gap-2 text-sm"
                        >
                            <Twitter className="w-4 h-4" />
                            Twitter
                        </button>
                        <button
                            onClick={() => handleShare('whatsapp')}
                            className="px-5 py-2.5 bg-emerald-500 text-white rounded-2xl font-medium hover:bg-emerald-600 transition-all hover:scale-105 flex items-center gap-2 text-sm"
                        >
                            <Share2 className="w-4 h-4" />
                            WhatsApp
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className="px-5 py-2.5 rounded-2xl font-medium transition-all hover:scale-105 flex items-center gap-2 text-sm border border-[#D9CCBF] bg-white/80 hover:bg-white hover:border-[#1A332F]"
                            style={{ color: '#1A332F' }}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-emerald-600" />
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
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: '#8B6F47' }}>Koleksi Lainnya</p>
                                <h2 className="serif text-2xl font-bold" style={{ color: '#1A332F' }}>Motif Terkait</h2>
                            </div>
                            <Link
                                href="/galeri-motif"
                                className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3 group"
                                style={{ color: '#1A332F' }}
                            >
                                Lihat Semua
                                <span className="w-7 h-7 rounded-full border border-[#D9CCBF] flex items-center justify-center group-hover:border-[#1A332F] group-hover:bg-white transition-all">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {relatedMotifs.map((related) => (
                                <Link key={related.id} href={route('published-motifs.show', related.slug)}>
                                    <div className="relative rounded-2xl overflow-hidden transition-all duration-300">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                            <img
                                                src={related.image_url}
                                                alt={related.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full">
                                                <MapPin className="w-3.5 h-3.5 text-[#BA682A]" />
                                                <span className="text-xs font-semibold text-gray-700">
                                                    {related.origin || 'Indonesia'}
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-white text-sm font-medium flex-1 truncate">
                                                            {related.user?.name}
                                                        </p>
                                                        {related.user?.badge && (
                                                            <div className="flex-shrink-0">
                                                                {related.user.badge === 'boutique' && (
                                                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                                                        <Store className="w-3 h-3 text-white" />
                                                                    </div>
                                                                )}
                                                                {related.user.badge === 'community' && (
                                                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                                                        <Users className="w-3 h-3 text-white" />
                                                                    </div>
                                                                )}
                                                                {related.user.badge === 'artisan' && (
                                                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                                                                        <Award className="w-3 h-3 text-white" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 p-1">
                                            <h3 className="text-sm font-semibold text-gray-800 flex-1 truncate">
                                                {related.title}
                                            </h3>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Eye className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{related.views_count}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-red-500">
                                                    <Heart className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{related.likes_count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <LarasenaFooter />
        </div>
    );
}
