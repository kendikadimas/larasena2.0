import { useState } from 'react';
import UserLayout from '@/layouts/User/Layout';
import { Link, usePage, router } from '@inertiajs/react';
import { Plus, Eye, Heart, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Image as ImageIcon } from 'lucide-react';

export default function UploadMotifIndex({ motifs }) {
    const { auth } = usePage().props;
    const [filter, setFilter] = useState('all');

    const filteredMotifs = motifs.filter(motif => {
        if (filter === 'all') return true;
        return motif.status === filter;
    });

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1";
        switch (status) {
            case 'pending':
                return (
                    <span className={`${baseClasses} bg-gray-100 text-gray-700`}>
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
            case 'approved':
                return (
                    <span className={`${baseClasses} bg-green-100 text-green-700`}>
                        <CheckCircle className="w-3 h-3" />
                        Disetujui
                    </span>
                );
            case 'rejected':
                return (
                    <span className={`${baseClasses} bg-red-100 text-red-700`}>
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
        <UserLayout title="Sanggar">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div className="max-w-full">
                        <p className="text-gray-600 text-base sm:text-lg font-regular mb-2 leading-relaxed">
                            Hi, <span className="text-[#4E8070] font-semibold">{auth.user.name}</span>! Selamat datang.
                            <br className="hidden sm:block" />
                            Kamu sudah mengunggah:{' '}
                            <span className="text-[#4E8070] font-semibold">
                                {motifs.length} motif
                            </span>
                        </p>
                    </div>

                    <Link
                        href="/upload/create"
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#1A332F] text-white rounded-full font-semibold text-sm hover:scale-105 shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Upload Baru
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
                    <button onClick={() => setFilter('all')} className={`p-3 rounded-lg border transition-colors text-left ${ filter === 'all' ? 'border-[#4E8070] bg-[#EBF2EF]' : 'border-gray-200 bg-white hover:border-gray-300' }`}>
                        <div className="text-lg font-semibold text-gray-900">{stats.all}</div>
                        <div className="text-xs text-gray-600">Total</div>
                    </button>
                    <button onClick={() => setFilter('pending')} className={`p-3 rounded-lg border transition-colors text-left ${ filter === 'pending' ? 'border-[#4E8070] bg-[#EBF2EF]' : 'border-gray-200 bg-white hover:border-gray-300' }`}>
                        <div className="text-lg font-semibold text-gray-900">{stats.pending}</div>
                        <div className="text-xs text-gray-600">Pending</div>
                    </button>
                    <button onClick={() => setFilter('approved')} className={`p-3 rounded-lg border transition-colors text-left ${ filter === 'approved' ? 'border-[#4E8070] bg-[#EBF2EF]' : 'border-gray-200 bg-white hover:border-gray-300' }`}>
                        <div className="text-lg font-semibold text-gray-900">{stats.approved}</div>
                        <div className="text-xs text-gray-600">Disetujui</div>
                    </button>
                    <button onClick={() => setFilter('rejected')} className={`p-3 rounded-lg border transition-colors text-left ${ filter === 'rejected' ? 'border-[#4E8070] bg-[#EBF2EF]' : 'border-gray-200 bg-white hover:border-gray-300' }`}>
                        <div className="text-lg font-semibold text-gray-900">{stats.rejected}</div>
                        <div className="text-xs text-gray-600">Ditolak</div>
                    </button>
                </div>

                {/* Motifs List */}
                {filteredMotifs.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                        <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {filter === 'all' ? 'Belum ada motif' : `Tidak ada motif ${filter}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {filter === 'all' ? 'Mulai upload motif pertama Anda' : 'Coba ubah filter'}
                        </p>
                    </div>
                                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredMotifs.map((motif) => (
                            <div key={motif.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Image */}
                                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                    <img
                                        src={motif.image_url}
                                        alt={motif.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 left-2">{getStatusBadge(motif.status)}</div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm">
                                        {motif.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{motif.philosophy}</p>

                                    {/* Stats - Only show for approved */}
                                    {motif.status === 'approved' && (
                                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                <span>{motif.views_count || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-3 h-3" />
                                                <span>{motif.likes_count || 0}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rejection Reason */}
                                    {motif.status === 'rejected' && motif.rejection_reason && (
                                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
                                            <p className="text-xs font-semibold text-red-700 mb-0.5">Alasan penolakan:</p>
                                            <p className="text-xs text-red-600 line-clamp-2">{motif.rejection_reason}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-3 border-t">
                                        {motif.status === 'approved' && (
                                            <Link href={route('published-motifs.show', motif.slug)} className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors text-center">
                                                Lihat
                                            </Link>
                                        )}
                                        <button onClick={() => handleDelete(motif)} className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:text-red-600 rounded text-xs hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mobile FAB Button */}
                <div className="md:hidden fixed bottom-24 right-4 z-40">
                    <Link
                        href="/upload/create"
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1A332F] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                        title="Upload Motif Baru"
                    >
                        <Plus className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </UserLayout>
    );
}
