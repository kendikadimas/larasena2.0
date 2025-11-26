import { useState } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import { Heart, Eye, User, Search, Filter, Star, Share2, ArrowLeft, LogIn, MapPin } from 'lucide-react';

export default function Gallery({ motifs, user }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [activeCategory, setActiveCategory] = useState('all');

    // Kategori motif populer
    const categories = [
        { id: 'all', name: 'Semua Motif', icon: '🎨' },
        { id: 'parang', name: 'Parang', icon: '⚔️' },
        { id: 'kawung', name: 'Kawung', icon: '🌸' },
        { id: 'mega_mendung', name: 'Mega Mendung', icon: '☁️' },
        { id: 'truntum', name: 'Truntum', icon: '✨' },
        { id: 'sekar_jagad', name: 'Sekar Jagad', icon: '🌺' },
        { id: 'sido_mukti', name: 'Sido Mukti', icon: '👑' },
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
        
        return matchesSearch && matchesCategory;
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
                {/* Search Bar - Dribbble Style */}
                <div className="mb-6">
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari inspirasi motif batik..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-[#BA682A]/20 focus:border-[#BA682A] transition-all text-gray-700 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Category Pills - Horizontal Scroll */}
                <div className="mb-8 -mx-4 px-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-1 rounded-full font-medium transition-all ${
                                    activeCategory === category.id
                                        ? 'bg-[#BA682A] text-white shadow-[#BA682A]/25'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                <span className="text-lg">{category.icon}</span>
                                <span className="text-sm">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort Options - Minimal */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSort('latest')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                sortBy === 'latest'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Terbaru
                        </button>
                        <button
                            onClick={() => handleSort('popular')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                sortBy === 'popular'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Terpopuler
                        </button>
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
                                    <div className="relative rounded-xl overflow-hidden transition-all duration-300">
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

                                            {/* Nama Batik Overlay - Muncul on Hover */}
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <h3 className="text-white font-bold text-base line-clamp-2">
                                                    {motif.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Card Footer - Profile + Stats */}
                                        <div className="">
                                            <div className="flex items-center justify-between gap-3">
                                                {/* Creator Info */}
                                                <div className="flex items-center gap-2 flex-1">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#BA682A] to-[#D2691E] flex items-center justify-center overflow-hidden ring-2 ring-gray-100 flex-shrink-0">
                                                        {motif.user.profile_photo_url ? (
                                                            <img
                                                                src={motif.user.profile_photo_url}
                                                                alt={motif.user.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-white text-xs font-bold">
                                                                {motif.user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#BA682A] transition-colors">
                                                        {motif.user.name}
                                                    </p>
                                                </div>

                                                {/* Stats + Like Button */}
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Eye className="w-4 h-4" />
                                                        <span className="text-xs font-medium">{motif.views_count}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Heart className="w-4 h-4" />
                                                        <span className="text-xs font-medium">{motif.likes_count}</span>
                                                    </div>
                                                    {user && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleLike(motif.id);
                                                            }}
                                                            className={`p-1.5 rounded-full transition-all ${
                                                                motif.is_liked_by_user
                                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                                                            }`}
                                                        >
                                                            <Heart className={`w-3.5 h-3.5 ${motif.is_liked_by_user ? 'fill-current' : ''}`} />
                                                        </button>
                                                    )}
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
