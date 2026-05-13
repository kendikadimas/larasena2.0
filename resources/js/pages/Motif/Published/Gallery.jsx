import { useState, useEffect } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import { Heart, Eye, Search, Filter, Store, Users, Award, MapPin } from 'lucide-react';
import LarasenaCTA from '@/components/LarasenaCTA';
import LarasenaFooter from '@/components/LarasenaFooter';
import LarasenaNavbar from '@/components/LarasenaNavbar';

// ============================================================
// Batik pattern SVG — dipakai di Hero background (sangat tipis)
// ============================================================
const BatikPatternHero = () => (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.045 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="batik-gallery-hero" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M15,15 L65,15 L65,65 L15,65 Z" fill="none" stroke="#1A332F" strokeWidth="1.5" />
                    <path d="M25,25 L55,25 L55,55 L25,55 Z" fill="none" stroke="#1A332F" strokeWidth="1" />
                    <circle cx="40" cy="40" r="10" fill="none" stroke="#1A332F" strokeWidth="1" />
                    <path d="M32,32 L48,48 M48,32 L32,48" stroke="#C9A84C" strokeWidth="0.7" opacity="0.7" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#batik-gallery-hero)" />
        </svg>
    </div>
);

// ============================================================
// Ornament pemisah section — konsisten dengan LandingPage
// ============================================================
const SectionDivider = () => (
    <div className="flex items-center justify-center gap-4 my-2">
        <div className="flex-1 h-px max-w-16" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C)' }} />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2.5" fill="#C9A84C" opacity="0.7" />
            <circle cx="8" cy="8" r="5.5" stroke="#C9A84C" strokeWidth="0.8" opacity="0.35" fill="none" />
        </svg>
        <div className="flex-1 h-px max-w-16" style={{ background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
    </div>
);

export default function Gallery({ motifs, user }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeBadge, setActiveBadge] = useState('all');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const categories = [
        { id: 'all', name: 'Semua Motif' },
        { id: 'parang', name: 'Parang' },
        { id: 'kawung', name: 'Kawung' },
        { id: 'mega_mendung', name: 'Mega Mendung' },
    ];

    const badges = [
        { id: 'boutique', name: 'Boutique', icon: Store },
        { id: 'community', name: 'Community', icon: Users },
        { id: 'artisan', name: 'Artisan', icon: Award },
    ];

    const handleSort = (sort) => {
        setSortBy(sort);
        router.get(route('published-motifs.gallery'), { sort }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleLike = (motifId) => {
        if (!user) {
            router.visit('/login');
            return;
        }
        router.post(`/motif/${motifId}/like`, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                router.reload({ only: ['motifs'], preserveScroll: true });
            }
        });
    };

    const filteredMotifs = motifs.filter(motif => {
        const matchesSearch = motif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            motif.user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' ||
            motif.title.toLowerCase().includes(activeCategory.replace('_', ' '));
        const matchesBadge = activeBadge === 'all' ||
            (motif.user.badge && motif.user.badge.toLowerCase() === activeBadge);
        return matchesSearch && matchesCategory && matchesBadge;
    });

    return (
        <div className="min-h-screen pt-16" style={{ background: 'linear-gradient(180deg, #FBF8F1 0%, #F5F0E8 40%, #FBF8F1 100%)' }}>
            <Head>
                {/* Title & primary meta di-handle server-side oleh app.blade.php */}
                {/* agar social media crawler membaca OG tags yang benar */}
                <title>Galeri Motif Batik Nusantara | Temukan Inspirasi Batik Indonesia — Larasena</title>
                <meta name="description" content="Jelajahi ratusan motif batik nusantara lengkap dengan filosofi, asal daerah, dan makna budayanya. Temukan inspirasi desain batik kawung, parang, mega mendung & lainnya." />
                <meta name="keywords" content="galeri motif batik, motif batik Indonesia, batik kawung, batik parang, mega mendung, desain batik online, filosofi batik" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
            </Head>

            <style>{`
                * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .serif { font-family: 'Playfair Display', Georgia, serif; }
                .gradient-text {
                    background: linear-gradient(135deg, #1A332F 0%, #2C5E54 45%, #8B6F47 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                /* Hover lift & glow — konsisten dengan landing page */
                .hover-lift { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
                .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 16px 32px rgba(26, 51, 47, 0.14); }
                .hover-glow { transition: box-shadow 0.4s ease; }
                .hover-glow:hover { box-shadow: 0 0 22px rgba(139, 111, 71, 0.2); }
                /* Fade animations */
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fade-up 0.7s ease-out both; }
                .stagger-1 { animation-delay: 0.05s; }
                .stagger-2 { animation-delay: 0.1s; }
                .stagger-3 { animation-delay: 0.15s; }
                /* Pill filter */
                .pill-active {
                    background: #1A332F;
                    color: white;
                    box-shadow: 0 4px 12px rgba(26, 51, 47, 0.25);
                }
                .pill-inactive {
                    background: white;
                    color: #5A4F3E;
                    border: 1.5px solid #D9CCBF;
                }
                .pill-inactive:hover {
                    border-color: #1A332F;
                    color: #1A332F;
                }
                /* Search focus */
                .search-input:focus {
                    outline: none;
                    border-color: #1A332F;
                    box-shadow: 0 0 0 3px rgba(26, 51, 47, 0.08);
                }
                /* Scrollbar hide */
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <LarasenaNavbar user={user} />

            {/* ===== HERO SECTION — Tema Premium Cream/Teal ===== */}
            <section className="relative overflow-hidden pt-4 pb-16" style={{ background: 'linear-gradient(135deg, #FBF8F1 0%, #F0EBE0 60%, #F5F0E8 100%)' }}>
                <BatikPatternHero />

                {/* Soft glow decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(44,94,84,0.06) 0%, transparent 70%)' }} />

                <div className="px-8 md:px-16 lg:px-24 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Label */}
                        <p className="text-xs font-semibold tracking-[0.24em] uppercase mb-4 fade-up stagger-1" style={{ color: '#8B6F47' }}>
                            Batikpedia
                        </p>

                        {/* Heading */}
                        <h1 className="serif font-bold mb-4 fade-up stagger-2 leading-tight"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#1A332F', letterSpacing: '-0.02em' }}>
                            Temukan Inspirasi <br />
                            <span className="gradient-text">Motif Batik Nusantara</span>
                        </h1>

                        <SectionDivider />

                        {/* Deskripsi */}
                        <p className="text-base md:text-lg mb-8 fade-up stagger-3 max-w-2xl mx-auto"
                            style={{ color: '#6F6358', lineHeight: 1.8, marginTop: '12px' }}>
                            Jelajahi koleksi motif batik original dari para kreator terbaik Indonesia.
                            Setiap desain menceritakan warisan budaya yang kaya dan penuh makna.
                        </p>

                        {/* Stats badges */}
                        <div className="flex items-center justify-center gap-6 fade-up stagger-3">
                            {[
                                { value: `${filteredMotifs.length}+`, label: 'Motif' },
                                { value: '100%', label: 'Original' },
                                { value: 'Gratis', label: 'Akses' },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center gap-0.5">
                                    <span className="serif text-xl font-bold" style={{ color: '#1A332F' }}>{stat.value}</span>
                                    <span className="text-xs font-medium" style={{ color: '#8B6F47' }}>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Wave bottom separator */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '40px' }}>
                    <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-full" style={{ fill: '#FBF8F1' }}>
                        <path d="M0,20 C200,40 400,0 600,20 C800,40 1000,0 1200,20 L1200,40 L0,40 Z" opacity="0.5" />
                        <path d="M0,30 C200,10 400,40 600,30 C800,10 1000,40 1200,30 L1200,40 L0,40 Z" />
                    </svg>
                </div>
            </section>

            {/* ===== MAIN CONTENT ===== */}
            <div className="px-8 md:px-16 lg:px-24 py-10">

                {/* Search Bar */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8B6F47' }} />
                        <input
                            type="text"
                            placeholder="Cari inspirasi motif batik..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input w-full pl-11 pr-5 py-3 rounded-2xl border border-[#D9CCBF] bg-white/80 backdrop-blur-sm transition-all text-sm"
                            style={{ color: '#1A332F' }}
                        />
                    </div>
                </div>

                {/* ===== FILTER BAR ===== */}
                <div className="mb-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => handleSort(e.target.value)}
                                className="appearance-none pl-4 pr-9 py-2 rounded-2xl text-xs font-semibold border border-[#D9CCBF] cursor-pointer focus:outline-none transition-all hover:border-[#1A332F]"
                                style={{ color: '#1A332F' }}
                            >
                                <option value="latest">Terbaru</option>
                                <option value="popular">Terpopuler</option>
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" fill="none" stroke="#8B6F47" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Category & Badge pills */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${activeCategory === cat.id ? 'pill-active' : 'pill-inactive'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}

                            {/* Divider */}
                            <div className="w-px h-5" style={{ background: '#D9CCBF' }} />

                            {badges.map((badge) => {
                                const Icon = badge.icon;
                                return (
                                    <button
                                        key={badge.id}
                                        onClick={() => setActiveBadge(activeBadge === badge.id ? 'all' : badge.id)}
                                        className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${activeBadge === badge.id ? 'pill-active' : 'pill-inactive'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {badge.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Result count */}
                    <div className="mt-4">
                        <p className="text-xs" style={{ color: '#8B6F47' }}>
                            Menampilkan <span className="font-semibold" style={{ color: '#1A332F' }}>{filteredMotifs.length}</span> motif
                        </p>
                    </div>
                </div>

                {/* ===== MOTIF GRID ===== */}
                {filteredMotifs.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                            style={{ background: 'transparent' }}>
                            <Filter className="w-9 h-9" style={{ color: '#C9B8A2' }} />
                        </div>
                        <p className="font-semibold mb-1" style={{ color: '#1A332F' }}>Tidak ada motif ditemukan</p>
                        <p className="text-sm" style={{ color: '#8B6F47' }}>Coba ubah filter atau kata kunci pencarian</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMotifs.map((motif) => (
                            <div key={motif.id} className="group">
                                <Link href={route('published-motifs.show', motif.slug)}>
                                    <div className="relative rounded-2xl overflow-hidden transition-all duration-300">

                                        {/* Image Container */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                            <img
                                                src={motif.image_url}
                                                alt={motif.title}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Origin Badge - Top Left */}
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full">
                                                <MapPin className="w-3.5 h-3.5 text-[#BA682A]" />
                                                <span className="text-xs font-semibold text-gray-700">
                                                    {motif.origin || 'Indonesia'}
                                                </span>
                                            </div>


                                        </div>

                                        {/* Card Footer — Title + Stats */}
                                        <div className="flex items-center justify-between gap-3 p-1">
                                            <h3 className="text-sm font-semibold text-gray-800 flex-1 truncate">
                                                {motif.title}
                                            </h3>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Eye className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{motif.views_count}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-red-500">
                                                    <Heart className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{motif.likes_count}</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-16">
                    <LarasenaCTA user={user} dashboardRoute={route('dashboard')} />
                </div>
            </div>

            <LarasenaFooter />
        </div>
    );
}
