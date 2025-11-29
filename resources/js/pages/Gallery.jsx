import { useState } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import { Heart, Eye, User, Search, Filter, Star, Share2, ArrowLeft, LogIn } from 'lucide-react';

export default function Gallery({ motifs, user }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');

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

    const filteredMotifs = motifs.filter(motif =>
        motif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        motif.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Galeri Motif Batik - Larasena" />
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-[#BA682A] via-[#D2691E] to-[#F4A460] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Galeri Motif Batik</h1>
                    <p className="text-xl opacity-90 max-w-3xl">
                        Temukan inspirasi dari koleksi motif batik original karya komunitas kami
                    </p>
                    <p className="text-white/80 mt-2">
                        {filteredMotifs.length} motif tersedia
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search & Filter */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 sticky top-0 bg-white/95 backdrop-blur-sm py-4 z-10 -mx-4 px-4 border-b">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari motif atau pembuat..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                        />
                    </div>

                    {/* Sort */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSort('latest')}
                            className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                                sortBy === 'latest'
                                    ? 'bg-[#BA682A] text-white shadow-lg'
                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#BA682A]'
                            }`}
                        >
                            Terbaru
                        </button>
                        <button
                            onClick={() => handleSort('popular')}
                            className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                                sortBy === 'popular'
                                    ? 'bg-[#BA682A] text-white shadow-lg'
                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#BA682A]'
                            }`}
                        >
                            Terpopuler
                        </button>
                    </div>
                </div>

                {/* Motifs Masonry Grid - Pinterest Style */}
                {filteredMotifs.length === 0 ? (
                    <div className="text-center py-16">
                        <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">Tidak ada motif ditemukan</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {filteredMotifs.map((motif) => (
                            <div
                                key={motif.id}
                                className="break-inside-avoid group cursor-pointer"
                            >
                                <Link href={route('published-motifs.show', motif.slug)}>
                                    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300">
                                        {/* Image */}
                                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                                            <img
                                                src={motif.image_url}
                                                alt={motif.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            
                                            {/* Featured Badge */}
                                            {motif.is_featured && (
                                                <div className="absolute top-3 right-3 bg-yellow-400 rounded-full p-2 shadow-lg">
                                                    <Star className="w-5 h-5 text-white fill-current" />
                                                </div>
                                            )}

                                            {/* Hover Overlay with Info */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                    {/* Publisher */}
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                                                            {motif.user.profile_photo_url ? (
                                                                <img
                                                                    src={motif.user.profile_photo_url}
                                                                    alt={motif.user.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <User className="w-4 h-4 text-white" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-sm font-semibold">
                                                                {motif.user.name}
                                                            </div>
                                                            <div className="text-xs opacity-80">
                                                                {motif.published_at}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            <span>{motif.views_count}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Heart className={`w-4 h-4 ${motif.is_liked_by_user ? 'fill-current' : ''}`} />
                                                            <span>{motif.likes_count}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title & Like Button - Always Visible */}
                                        <div className="p-4 bg-white">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#BA682A] transition-colors line-clamp-2 flex-1">
                                                    {motif.title}
                                                </h3>
                                                {user && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleLike(motif.id);
                                                        }}
                                                        className={`flex-shrink-0 p-2 rounded-full transition-all ${
                                                            motif.is_liked_by_user
                                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                                                        }`}
                                                        title={motif.is_liked_by_user ? 'Unlike' : 'Like motif ini'}
                                                    >
                                                        <Heart className={`w-5 h-5 ${motif.is_liked_by_user ? 'fill-current' : ''}`} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA untuk Upload */}
                <div className="mt-12 bg-gradient-to-br from-[#BA682A] to-[#D2691E] rounded-2xl p-8 text-white text-center shadow-lg">
                    <h2 className="text-2xl font-bold mb-3">Punya Motif Original?</h2>
                    <p className="text-lg opacity-90 mb-6">
                        Bagikan karya motif batikmu dengan komunitas!
                    </p>
                    {user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-block px-8 py-3 bg-white text-[#BA682A] rounded-xl font-bold hover:shadow-xl transition-all hover:-translate-y-0.5"
                        >
                            Buat & Upload Motif
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="inline-block px-8 py-3 bg-white text-[#BA682A] rounded-xl font-bold hover:shadow-xl transition-all hover:-translate-y-0.5"
                        >
                            Login untuk Upload
                        </Link>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-600">
                        <p className="mb-2">© 2025 Larasena. Platform Desain Batik Indonesia</p>
                        <div className="flex justify-center gap-6 mt-4">
                            <Link href="/" className="hover:text-[#BA682A] transition-colors">Beranda</Link>
                            <Link href="/login" className="hover:text-[#BA682A] transition-colors">Login</Link>
                            <Link href="/register" className="hover:text-[#BA682A] transition-colors">Daftar</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
