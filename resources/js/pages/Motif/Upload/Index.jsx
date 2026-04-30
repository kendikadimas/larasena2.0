import { useState } from 'react';
import UserLayout from '@/layouts/User/Layout';
import { Link } from '@inertiajs/react';
import { Plus, Eye, Heart, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Image as ImageIcon } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function UploadMotifIndex({ motifs }) {
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
                        Menunggu Review
                    </span>
                );
            case 'approved':
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Disetujui
                    </span>
                );
            case 'rejected':
                return (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Ditolak
                    </span>
                );
        }
    };

    const handleDelete = (motif) => {
        if (confirm(`Hapus motif "${motif.title}"?`)) {
            // Use POST with method spoofing to avoid servers/firewalls that block DELETE
            router.post(route('motif.upload.destroy', motif.id), {
                _method: 'delete',
            });
        }
    };

    const stats = {
        all: motifs.length,
        pending: motifs.filter(m => m.status === 'pending').length,
        approved: motifs.filter(m => m.status === 'approved').length,
        rejected: motifs.filter(m => m.status === 'rejected').length,
    };

    return (
        <UserLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Unggah Batik ke Komunitas</h1>
                    <p className="text-gray-600">
                        Kelola motif batik yang telah diunggah
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => setFilter('all')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                            filter === 'all'
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 bg-white hover:border-amber-300'
                        }`}
                    >
                        <div className="text-2xl font-bold text-gray-900">{stats.all}</div>
                        <div className="text-sm text-gray-600">Total Motif</div>
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                            filter === 'pending'
                                ? 'border-yellow-500 bg-yellow-50'
                                : 'border-gray-200 bg-white hover:border-yellow-300'
                        }`}
                    >
                        <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                            filter === 'approved'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-green-300'
                        }`}
                    >
                        <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
                        <div className="text-sm text-gray-600">Disetujui</div>
                    </button>
                </div>

                {/* Motifs List */}
                {filteredMotifs.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {filter === 'all' ? 'Belum ada motif' : `Tidak ada motif ${filter}`}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {filter === 'all' 
                                ? 'Mulai upload motif batik pertama Anda'
                                : 'Coba ubah filter untuk melihat motif lainnya'
                            }
                        </p>
                        {filter === 'all' && (
                            <Link
                                href="/upload/create"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-800 hover:to-amber-600 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Upload Motif
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMotifs.map((motif) => (
                            <div
                                key={motif.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Image */}
                                <div className="relative aspect-square bg-gray-100">
                                    <img
                                        src={motif.image_url}
                                        alt={motif.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3">
                                        {getStatusBadge(motif.status)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                                        {motif.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {motif.philosophy}
                                    </p>

                                    {/* Stats - Only show for approved */}
                                    {motif.status === 'approved' && (
                                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{motif.views_count || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" />
                                                <span>{motif.likes_count || 0}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rejection Reason */}
                                    {motif.status === 'rejected' && motif.rejection_reason && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-xs font-semibold text-red-700 mb-1">
                                                Alasan Penolakan:
                                            </p>
                                            <p className="text-xs text-red-600">
                                                {motif.rejection_reason}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-3 border-t">
                                        {motif.status === 'approved' && (
                                            <Link
                                                href={route('published-motifs.show', motif.slug)}
                                                className="flex-1 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium text-sm hover:bg-amber-200 transition-colors text-center"
                                            >
                                                Lihat di Gallery
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => handleDelete(motif)}
                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors"
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

            {/* Floating Action Button (Mobile) */}
            <div className="md:hidden">
                <button
                    onClick={() => router.visit('/upload/create')}
                    aria-label="Upload Motif Baru"
                    className="fixed right-4 bottom-20 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-transform active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
                    }}
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            {/* Desktop Button */}
            <div className="hidden md:block fixed right-8 bottom-8 z-50">
                <Link
                    href="/upload/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-800 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    Upload Motif Baru
                </Link>
            </div>
        </UserLayout>
    );
}
