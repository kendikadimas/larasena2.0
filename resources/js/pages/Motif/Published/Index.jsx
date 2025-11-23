import { useState } from 'react';
import UserLayout from '@/layouts/User/Layout';
import { Link } from '@inertiajs/react';
import { Plus, Eye, Heart, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Sparkles } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function PublishedMotifsIndex({ motifs }) {
    const [filter, setFilter] = useState('all');

    const filteredMotifs = motifs.filter(motif => {
        if (filter === 'all') return true;
        return motif.status === filter;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending Review
                    </span>
                );
            case 'approved':
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Rejected
                    </span>
                );
        }
    };

    const handleDelete = (motif) => {
        if (confirm(`Hapus motif "${motif.title}"?`)) {
            router.delete(route('motif.published.destroy', motif.id));
        }
    };

    const stats = {
        all: motifs.length,
        pending: motifs.filter(m => m.status === 'pending').length,
        approved: motifs.filter(m => m.status === 'approved').length,
        rejected: motifs.filter(m => m.status === 'rejected').length
    };

    return (
        <UserLayout title="Motif Terpublikasi">
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Motif Terpublikasi</h1>
                            <p className="text-gray-600">Kelola motif yang sudah Anda submit untuk publikasi</p>
                        </div>
                        <Link
                            href={route('motif.published.create')}
                            className="bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Publish Motif Baru
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <button
                            onClick={() => setFilter('all')}
                            className={`p-6 rounded-xl border-2 transition-all ${
                                filter === 'all'
                                    ? 'bg-[#BA682A] border-[#BA682A] text-white shadow-lg'
                                    : 'bg-white border-gray-200 hover:border-[#BA682A]'
                            }`}
                        >
                            <div className="text-3xl font-bold mb-1">{stats.all}</div>
                            <div className={`text-sm ${filter === 'all' ? 'text-white' : 'text-gray-600'}`}>
                                Total Motif
                            </div>
                        </button>

                        <button
                            onClick={() => setFilter('pending')}
                            className={`p-6 rounded-xl border-2 transition-all ${
                                filter === 'pending'
                                    ? 'bg-yellow-500 border-yellow-500 text-white shadow-lg'
                                    : 'bg-white border-gray-200 hover:border-yellow-500'
                            }`}
                        >
                            <div className="text-3xl font-bold mb-1">{stats.pending}</div>
                            <div className={`text-sm ${filter === 'pending' ? 'text-white' : 'text-gray-600'}`}>
                                Pending
                            </div>
                        </button>

                        <button
                            onClick={() => setFilter('approved')}
                            className={`p-6 rounded-xl border-2 transition-all ${
                                filter === 'approved'
                                    ? 'bg-green-500 border-green-500 text-white shadow-lg'
                                    : 'bg-white border-gray-200 hover:border-green-500'
                            }`}
                        >
                            <div className="text-3xl font-bold mb-1">{stats.approved}</div>
                            <div className={`text-sm ${filter === 'approved' ? 'text-white' : 'text-gray-600'}`}>
                                Approved
                            </div>
                        </button>

                        <button
                            onClick={() => setFilter('rejected')}
                            className={`p-6 rounded-xl border-2 transition-all ${
                                filter === 'rejected'
                                    ? 'bg-red-500 border-red-500 text-white shadow-lg'
                                    : 'bg-white border-gray-200 hover:border-red-500'
                            }`}
                        >
                            <div className="text-3xl font-bold mb-1">{stats.rejected}</div>
                            <div className={`text-sm ${filter === 'rejected' ? 'text-white' : 'text-gray-600'}`}>
                                Rejected
                            </div>
                        </button>
                    </div>

                    {/* Motifs Grid */}
                    {filteredMotifs.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                            <Sparkles className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Belum Ada Motif
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {filter === 'all' 
                                    ? 'Mulai publish motif batik karya Anda!'
                                    : `Tidak ada motif dengan status ${filter}`
                                }
                            </p>
                            {filter === 'all' && (
                                <Link
                                    href={route('motif.published.create')}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    Publish Motif Pertama
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMotifs.map((motif) => (
                                <div key={motif.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:shadow-xl transition-all group">
                                    {/* Image */}
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={motif.image_url}
                                            alt={motif.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 right-3">
                                            {getStatusBadge(motif.status)}
                                        </div>
                                        {motif.is_featured && (
                                            <div className="absolute top-3 left-3">
                                                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                                                    ⭐ Featured
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                                            {motif.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {motif.philosophy}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" />
                                                <span>{motif.likes_count}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{motif.views_count}</span>
                                            </div>
                                            <div className="flex items-center gap-1 ml-auto">
                                                <Clock className="w-4 h-4" />
                                                <span>{motif.created_at}</span>
                                            </div>
                                        </div>

                                        {/* Rejection Reason */}
                                        {motif.status === 'rejected' && motif.rejection_reason && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-red-900 mb-1">Alasan Ditolak:</p>
                                                        <p className="text-xs text-red-700">{motif.rejection_reason}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {motif.status === 'approved' && (
                                                <Link
                                                    href={route('motif.show', motif.slug)}
                                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium text-center"
                                                >
                                                    Lihat Detail
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleDelete(motif)}
                                                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
