import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Building2, Search, Filter, CheckCircle, XCircle, MapPin, Phone, Star, Eye, Edit } from 'lucide-react';
import { useState } from 'react';

const StatusBadge = ({ isVerified }) => {
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
            {isVerified ? 'Bermitra' : 'Menunggu '}
        </span>
    );
};

const Pagination = ({ links }) => {
    if (!links || links.length === 0) return null;
    
    return (
        <div className="flex items-center justify-center mt-6 gap-2">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    className={`px-4 py-2 text-sm rounded-lg transition-all ${
                        link.active
                            ? 'bg-[#BA682A] text-white font-semibold shadow-md'
                            : link.url
                            ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    preserveScroll
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
};

export default function AdminKonveksi({ konveksis, stats, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin-konveksi', {
            search: search,
            status: selectedStatus,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        router.get('/admin-konveksi', {
            search: search,
            status: status,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleToggleVerification = (konveksiId, currentStatus) => {
        const action = currentStatus ? 'mencabut verifikasi' : 'memverifikasi';
        if (confirm(`Apakah Anda yakin ingin ${action} konveksi ini?`)) {
            router.put(`/admin-konveksi/${konveksiId}/toggle-verification`, {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Konveksi" />
            
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Kelola Konveksi</h1>
                    <p className="text-gray-600">Kelola dan verifikasi mitra konveksi</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Konveksi</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total || 0}</p>
                            </div>
                            <div className="bg-blue-500 p-3 rounded-lg">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Terverifikasi</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.verified || 0}</p>
                            </div>
                            <div className="bg-green-500 p-3 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Menunggu Verifikasi</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.unverified || 0}</p>
                            </div>
                            <div className="bg-yellow-500 p-3 rounded-lg">
                                <XCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Rata-rata Rating</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.avg_rating || 0}</p>
                            </div>
                            <div className="bg-yellow-400 p-3 rounded-lg">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="md:col-span-1">
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari nama konveksi..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Status Filter */}
                        <div className="md:col-span-1">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => handleStatusFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BA682A] focus:border-transparent appearance-none bg-white cursor-pointer"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="verified">Terverifikasi</option>
                                    <option value="unverified">Menunggu Verifikasi</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Konveksi Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Konveksi
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Lokasi
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Kontak
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Rating
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {konveksis.data && konveksis.data.length > 0 ? (
                                    konveksis.data.map((konveksi) => (
                                        <tr key={konveksi.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img 
                                                        src={konveksi.icon_url || `https://ui-avatars.com/api/?name=${konveksi.name}&background=BA682A&color=fff`}
                                                        alt={konveksi.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{konveksi.name}</p>
                                                        <p className="text-xs text-gray-500">ID: {konveksi.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{konveksi.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{konveksi.no_telp}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm font-semibold text-gray-900">{konveksi.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge isVerified={konveksi.is_verified} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleVerification(konveksi.id, konveksi.is_verified)}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            konveksi.is_verified 
                                                                ? 'text-red-600 hover:bg-red-50' 
                                                                : 'text-green-600 hover:bg-green-50'
                                                        }`}
                                                        title={konveksi.is_verified ? 'Cabut Verifikasi' : 'Verifikasi'}
                                                    >
                                                        {konveksi.is_verified ? (
                                                            <XCircle className="w-5 h-5" />
                                                        ) : (
                                                            <CheckCircle className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    
                                                    <Link
                                                        href={`/konveksi/${konveksi.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Building2 className="w-12 h-12 text-gray-400 mb-3" />
                                                <p className="text-gray-500 font-medium">Tidak ada konveksi ditemukan</p>
                                                <p className="text-gray-400 text-sm mt-1">Coba sesuaikan filter pencarian Anda</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {konveksis.data && konveksis.data.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4">
                            <Pagination links={konveksis.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
