import { useState, useEffect } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import { Heart, Eye, User, Search, Filter, Star, Share2, ArrowLeft, LogIn, MapPin, Store, Users, Award } from 'lucide-react';

export default function Gallery({ motifs, user }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeBadge, setActiveBadge] = useState('all');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Kategori motif populer (3 saja)
    const categories = [
        { id: 'all', name: 'Semua Motif', },
        { id: 'parang', name: 'Parang', },
        { id: 'kawung', name: 'Kawung', },
        { id: 'mega_mendung', name: 'Mega Mendung',},
    ];

    // Badge filters
    const badges = [
        { id: 'boutique', name: 'Boutique', icon: Store },
        { id: 'community', name: 'Community', icon: Users },
        { id: 'artisan', name: 'Artisan', icon: Award },
    ];

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (sort) => {
        setSortBy(sort);
        router.get(route('published-motifs.gallery'), { sort }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
    };

    const handleBadgeChange = (badgeId) => {
        setActiveBadge(badgeId);
    };

    const handleLike = (motifId) => {
        if (!user) {
            // Redirect to login if not authenticated
            router.visit('/login');
            return;
        }
        
        // Toggle like for authenticated users
        router.post(`/motif/${motifId}/like`, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Immediately reload motifs data
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
            <Head title="Galeri Motif Batik - Larasena">
                <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
            </Head>
            
            <style jsx>{`
                * {
                    font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
            `}</style>
            
            {/* ===== NAVBAR - Same as Landing Page ===== */}
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
                    
                    {/* Auth Button - Desktop & Mobile (Scrolls Away) */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold hover:from-amber-800 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 md:px-6 md:py-2.5 rounded-xl border-2 border-amber-600 text-amber-600 font-semibold hover:bg-amber-50 transition-all duration-300"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 md:px-6 md:py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold hover:from-amber-800 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Menu - Fixed (Muncul saat scroll) */}
            <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
                isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
            }`}>
                <div className="flex items-center gap-8 px-8 py-3 rounded-3xl bg-white/90 backdrop-blur-lg border border-amber-100 shadow-lg">
                    <Link href="/" className="font-medium transition-all duration-300 relative group text-base text-gray-700 hover:text-amber-700">
                        Beranda
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href={route('published-motifs.gallery')} className="font-medium transition-all duration-300 relative group text-base text-amber-700">
                        Batikpedia
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600"></span>
                    </Link>
                    <Link href="/layanan" className="font-medium transition-all duration-300 relative group text-base text-gray-700 hover:text-amber-700">
                        Layanan
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </div>
            </nav>

            {/* Hero Section - Visual Hook */}
            <div className="bg-gradient-to-br from-[#BA682A] via-[#D2691E] to-[#F4A460] text-white relative overflow-hidden">
                {/* Batik Pattern Background */}
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="batik-pattern-hero" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                {/* Motif Kawung */}
                                <circle cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="1.5"/>
                                <circle cx="75" cy="25" r="20" fill="none" stroke="white" strokeWidth="1.5"/>
                                <circle cx="25" cy="75" r="20" fill="none" stroke="white" strokeWidth="1.5"/>
                                <circle cx="75" cy="75" r="20" fill="none" stroke="white" strokeWidth="1.5"/>
                                <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="1"/>
                                {/* Ornamen tambahan */}
                                <path d="M40,40 L60,60 M60,40 L40,60" stroke="white" strokeWidth="0.5" opacity="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#batik-pattern-hero)" />
                    </svg>
                </div>
                
                <div className="px-8 md:px-16 lg:px-24 py-16 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Temukan Inspirasi<br />
                            <span className="text-yellow-200">Motif Batik Nusantara</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                            Jelajahi koleksi motif batik original dari para kreator terbaik Indonesia. 
                            Setiap desain menceritakan warisan budaya yang kaya dan penuh makna.
                        </p>
                        <div className="flex items-center justify-center gap-6 text-white/80">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                <span className="text-lg font-medium">{filteredMotifs.length}+ Motif</span>
                            </div>
                            <div className="w-1 h-6 bg-white/20"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                <span className="text-lg font-medium">100% Original</span>
                            </div>
                            <div className="w-1 h-6 bg-white/20"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                <span className="text-lg font-medium">Gratis Akses</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Wave Separator - Konsisten */}
                <div className="relative">
                    <svg className="w-full h-16 fill-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0 C150,60 350,0 600,60 C850,0 1050,60 1200,0 L1200,120 L0,120 Z" opacity="0.3"></path>
                        <path d="M0,20 C150,80 350,20 600,80 C850,20 1050,80 1200,20 L1200,120 L0,120 Z" opacity="0.5"></path>
                        <path d="M0,40 C150,100 350,40 600,100 C850,40 1050,100 1200,40 L1200,120 L0,120 Z"></path>
                    </svg>
                </div>
            </div>

            <div className="px-8 md:px-16 lg:px-24 py-8">
                {/* Search Bar */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-full max-w-2xl">
                        <input
                            type="text"
                            placeholder="Cari motif batik..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#BA682A] focus:outline-none transition-colors"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Filters - Single Row Layout */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Filter Label */}
                        <span className="text-sm font-medium text-gray-700">Filter</span>
                        
                        {/* Category Pills */}
                        <div className="flex items-center gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        activeCategory === category.id
                                            ? 'bg-[#BA682A] text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    <span className="text-base">{category.icon}</span>
                                    <span>{category.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Badge Filters */}
                        <div className="flex items-center gap-2">
                            {badges.map((badge) => {
                                const IconComponent = badge.icon;
                                return (
                                    <button
                                        key={badge.id}
                                        onClick={() => handleBadgeChange(badge.id)}
                                        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                            activeBadge === badge.id
                                                ? 'bg-[#BA682A] text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                    >
                                        <IconComponent className="w-3.5 h-3.5" />
                                        <span>{badge.name}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Sort Dropdown - Right Side */}
                        <div className="ml-auto relative">
                            <select
                                value={sortBy}
                                onChange={(e) => handleSort(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-1.5 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BA682A]/20"
                            >
                                <option value="latest">Terbaru</option>
                                <option value="popular">Terpopuler</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Motifs Grid - Dribbble Style */}
                {filteredMotifs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-600 text-lg font-medium">Tidak ada motif ditemukan</p>
                        <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMotifs.map((motif) => (
                            <div
                                key={motif.id}
                                className="group"
                            >
                                <Link href={route('published-motifs.show', motif.slug)}>
                                    <div className="relative rounded-t-xl overflow-hidden transition-all duration-300">
                                        {/* Image Container */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                            <img
                                                src={motif.image_url}
                                                alt={motif.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            
                                            {/* Origin Badge - Top Left */}
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                                                <MapPin className="w-3.5 h-3.5 text-[#BA682A]" />
                                                <span className="text-xs font-semibold text-gray-700">
                                                    {motif.origin || 'Indonesia'}
                                                </span>
                                            </div>

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {/* Stats - Center */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2 text-white">
                                                            <Eye className="w-5 h-5" />
                                                            <span className="text-lg font-semibold">{motif.views_count}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-white">
                                                            <Heart className="w-5 h-5" />
                                                            <span className="text-lg font-semibold">{motif.likes_count}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Nama Batik & Creator Info - Bottom Left */}
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white/80 text-xs mb-1">
                                                            oleh {motif.user.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer - Nama Batik + Badge */}
                                        <div className="mt-3">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[#BA682A] transition-colors flex-1">
                                                    {motif.title}
                                                </h3>
                                                
                                                {/* Badge Icon - Unique Style */}
                                                {motif.user.badge && (
                                                    <div className="flex-shrink-0">
                                                        {motif.user.badge === 'boutique' && (
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                                                                <Store className="w-4 h-4 text-white" />
                                                            </div>
                                                        )}
                                                        {motif.user.badge === 'community' && (
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                                                                <Users className="w-4 h-4 text-white" />
                                                            </div>
                                                        )}
                                                        {motif.user.badge === 'artisan' && (
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
                                                                <Award className="w-4 h-4 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-center overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5 10-5 10-5-10z M0 30l10 5-10 5-10-5z M60 30l-10 5 10 5 10-5z M30 40l5 10-5 10-5-10z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
                        }}></div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-3">Waktunya Berkarya!</h2>
                        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                            Bagikan kreativitas batikmu dan inspirasi ribuan orang di seluruh Indonesia
                        </p>
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:shadow-2xl transition-all hover:scale-105"
                            >
                                <span>Mulai Buat Motif</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:shadow-2xl transition-all hover:scale-105"
                            >
                                <span>Gabung Sekarang</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t mt-20">
                <div className="px-8 md:px-16 lg:px-24 py-12">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">© 2025 Larasena. Platform Desain Batik Indonesia</p>
                        <div className="flex justify-center gap-8">
                            <Link href="/" className="text-gray-500 hover:text-[#BA682A] transition-colors font-medium">Beranda</Link>
                            <Link href="/login" className="text-gray-500 hover:text-[#BA682A] transition-colors font-medium">Login</Link>
                            <Link href="/register" className="text-gray-500 hover:text-[#BA682A] transition-colors font-medium">Daftar</Link>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
