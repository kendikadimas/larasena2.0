import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { 
    Eye, Heart, Clock, CheckCircle, XCircle, Star, Trash2, 
    Filter, Search, User, Calendar, MessageSquare 
} from 'lucide-react';

export default function AdminPublishedMotifsIndex({ motifs, stats, currentFilter }) {
    const [filter, setFilter] = useState(currentFilter);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedMotif, setSelectedMotif] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedMotifs, setSelectedMotifs] = useState([]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setSelectedMotifs([]); // Reset selections on filter change
        router.get(route('admin.published-motifs.index'), { filter: newFilter }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleApprove = (motif) => {
        if (confirm(`Setujui motif "${motif.title}" untuk dipublikasikan?`)) {
            router.put(route('admin.published-motifs.approve', motif.id));
        }
    };

    const handleBulkApprove = () => {
        if (selectedMotifs.length === 0) return;
        if (confirm(`Setujui ${selectedMotifs.length} motif terpilih untuk dipublikasikan?`)) {
            router.put(route('admin.published-motifs.bulk-approve'), {
                motif_ids: selectedMotifs
            }, {
                onSuccess: () => {
                    setSelectedMotifs([]);
                }
            });
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const pendingMotifs = filteredMotifs.filter(m => m.status === 'pending');
            setSelectedMotifs(pendingMotifs.map(m => m.id));
        } else {
            setSelectedMotifs([]);
        }
    };

    const handleSelectMotif = (motifId) => {
        setSelectedMotifs(prev => 
            prev.includes(motifId) 
                ? prev.filter(id => id !== motifId)
                : [...prev, motifId]
        );
    };

    const handleReject = (motif) => {
        setSelectedMotif(motif);
        setShowRejectModal(true);
    };

    const submitReject = () => {
        if (!rejectReason.trim()) {
            alert('Mohon berikan alasan penolakan');
            return;
        }

        router.put(route('admin.published-motifs.reject', selectedMotif.id), {
            reason: rejectReason
        }, {
            onSuccess: () => {
                setShowRejectModal(false);
                setRejectReason('');
                setSelectedMotif(null);
            }
        });
    };

    const handleToggleFeatured = (motif) => {
        router.put(route('admin.published-motifs.toggle-featured', motif.id));
    };

    const handleDelete = (motif) => {
        if (confirm(`Hapus permanent motif "${motif.title}"?`)) {
            router.delete(route('admin.published-motifs.destroy', motif.id));
        }
    };

    const filteredMotifs = motifs.filter(motif =>
        motif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        motif.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Moderasi Motif Publik">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Moderasi Motif Publik</h1>
                        <p className="text-gray-600 mt-1">Review dan kelola motif yang disubmit user</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => handleFilterChange('pending')}
                        className={`p-6 rounded-xl border transition-all text-left ${
                            filter === 'pending'
                                ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-200 shadow-sm'
                                : 'bg-white border-gray-100 hover:bg-amber-50/50 hover:border-amber-200'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-lg ${filter === 'pending' ? 'bg-amber-200' : 'bg-amber-100'}`}>
                                <Clock className={`w-5 h-5 ${filter === 'pending' ? 'text-amber-800' : 'text-amber-600'}`} />
                            </div>
                            <span className={`text-xs font-semibold ${filter === 'pending' ? 'text-amber-600' : 'text-gray-500'}`}>
                                Pending Review
                            </span>
                        </div>
                        <div className={`text-3xl font-bold ${filter === 'pending' ? 'text-amber-700' : 'text-gray-800'}`}>
                            {stats.pending}
                        </div>
                    </button>

                    <button
                        onClick={() => handleFilterChange('approved')}
                        className={`p-6 rounded-xl border transition-all text-left ${
                            filter === 'approved'
                                ? 'bg-green-50 border-green-200 ring-1 ring-green-200 shadow-sm'
                                : 'bg-white border-gray-100 hover:bg-green-50/50 hover:border-green-200'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-lg ${filter === 'approved' ? 'bg-green-200' : 'bg-green-100'}`}>
                                <CheckCircle className={`w-5 h-5 ${filter === 'approved' ? 'text-green-800' : 'text-green-600'}`} />
                            </div>
                            <span className={`text-xs font-semibold ${filter === 'approved' ? 'text-green-600' : 'text-gray-500'}`}>
                                Approved
                            </span>
                        </div>
                        <div className={`text-3xl font-bold ${filter === 'approved' ? 'text-green-700' : 'text-gray-800'}`}>
                            {stats.approved}
                        </div>
                    </button>

                    <button
                        onClick={() => handleFilterChange('rejected')}
                        className={`p-6 rounded-xl border transition-all text-left ${
                            filter === 'rejected'
                                ? 'bg-red-50 border-red-200 ring-1 ring-red-200 shadow-sm'
                                : 'bg-white border-gray-100 hover:bg-red-50/50 hover:border-red-200'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-lg ${filter === 'rejected' ? 'bg-red-200' : 'bg-red-100'}`}>
                                <XCircle className={`w-5 h-5 ${filter === 'rejected' ? 'text-red-800' : 'text-red-600'}`} />
                            </div>
                            <span className={`text-xs font-semibold ${filter === 'rejected' ? 'text-red-600' : 'text-gray-500'}`}>
                                Rejected
                            </span>
                        </div>
                        <div className={`text-3xl font-bold ${filter === 'rejected' ? 'text-red-700' : 'text-gray-800'}`}>
                            {stats.rejected}
                        </div>
                    </button>

                    <div className="p-6 rounded-xl border border-[#BA682A]/20 bg-[#BA682A]/5 text-left">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-[#BA682A]/20 p-2.5 rounded-lg">
                                <Star className="w-5 h-5 text-[#BA682A]" />
                            </div>
                            <span className="text-xs font-semibold text-[#BA682A]">
                                Featured
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-[#BA682A]">
                            {motifs.filter(m => m.is_featured).length}
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama motif atau user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Bulk Actions Banner */}
                {selectedMotifs.length > 0 && filter === 'pending' && (
                    <div className="bg-white rounded-xl shadow-sm border border-[#BA682A] p-4 flex items-center justify-between animate-fade-in-up">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#BA682A]/10 text-[#BA682A] px-3 py-1 rounded-lg font-semibold">
                                {selectedMotifs.length} terpilih
                            </div>
                            <span className="text-gray-600">Pilih tindakan untuk motif yang ditandai:</span>
                        </div>
                        <button
                            onClick={handleBulkApprove}
                            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold flex items-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Setujui Terpilih
                        </button>
                    </div>
                )}

                {/* Motifs Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {filteredMotifs.length === 0 ? (
                        <div className="p-12 text-center">
                            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">Tidak ada motif ditemukan</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        {filter === 'pending' && (
                                            <th className="px-6 py-4 text-left">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-gray-300 text-[#BA682A] focus:ring-[#BA682A]"
                                                    onChange={handleSelectAll}
                                                    checked={filteredMotifs.length > 0 && filteredMotifs.filter(m => m.status === 'pending').every(m => selectedMotifs.includes(m.id))}
                                                />
                                            </th>
                                        )}
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Preview</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Motif & User</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Filosofi</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Stats</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredMotifs.map((motif) => (
                                        <tr key={motif.id} className={`hover:bg-gray-50 transition-colors ${selectedMotifs.includes(motif.id) ? 'bg-[#BA682A]/5' : ''}`}>
                                            {filter === 'pending' && (
                                                <td className="px-6 py-4">
                                                    <input 
                                                        type="checkbox" 
                                                        className="rounded border-gray-300 text-[#BA682A] focus:ring-[#BA682A]"
                                                        checked={selectedMotifs.includes(motif.id)}
                                                        onChange={() => handleSelectMotif(motif.id)}
                                                    />
                                                </td>
                                            )}
                                            <td className="px-6 py-4">
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                                    <img
                                                        src={motif.image_url}
                                                        alt={motif.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {motif.is_featured && (
                                                        <div className="absolute top-1 right-1 bg-yellow-400 rounded-full p-1">
                                                            <Star className="w-3 h-3 text-white fill-current" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800 mb-1">{motif.title}</div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <User className="w-4 h-4" />
                                                    <span>{motif.user.name}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">{motif.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                                                    {motif.philosophy}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Heart className="w-4 h-4 text-red-500" />
                                                        <span>{motif.likes_count} likes</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4 text-blue-500" />
                                                        <span>{motif.views_count} views</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{motif.created_at}</span>
                                                    </div>
                                                    {motif.published_at && (
                                                        <div className="text-xs text-green-600">
                                                            Published: {motif.published_at}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    {motif.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(motif)}
                                                                className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(motif)}
                                                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {motif.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleToggleFeatured(motif)}
                                                            className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1 ${
                                                                motif.is_featured
                                                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            <Star className="w-4 h-4" />
                                                            {motif.is_featured ? 'Unfeature' : 'Feature'}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(motif)}
                                                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Reject Motif</h2>
                            <p className="text-gray-600 mb-4">
                                Motif: <strong>{selectedMotif?.title}</strong>
                            </p>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Alasan Penolakan *
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                rows={4}
                                placeholder="Berikan alasan kenapa motif ini ditolak..."
                                required
                            />
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                    setSelectedMotif(null);
                                }}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={submitReject}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                            >
                                Reject Motif
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
