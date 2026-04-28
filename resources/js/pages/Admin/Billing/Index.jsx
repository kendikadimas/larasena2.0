import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    CreditCard, Search, Filter, CheckCircle, Clock, AlertCircle, UserX,
    Calendar, RefreshCw, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useState } from 'react';

// ─── helpers ─────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
};

const formatDateInput = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
};

// ─── sub-components ──────────────────────────────────────────────────────────

const SubscriptionBadge = ({ subscription }) => {
    if (!subscription) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">
                <UserX className="w-3 h-3" /> Belum ada
            </span>
        );
    }
    const { status, subscription_ends_at, trial_ends_at } = subscription;
    const now = new Date();

    if (status === 'active' && subscription_ends_at && new Date(subscription_ends_at) > now) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3" /> Aktif
            </span>
        );
    }
    if (status === 'trial' && trial_ends_at && new Date(trial_ends_at) > now) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                <Clock className="w-3 h-3" /> Trial
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" /> Expired
        </span>
    );
};

const EndDateDisplay = ({ subscription }) => {
    if (!subscription) return <span className="text-gray-400 text-sm">—</span>;
    const { status, subscription_ends_at, trial_ends_at } = subscription;
    const dateStr = status === 'trial' ? trial_ends_at : subscription_ends_at;
    if (!dateStr) return <span className="text-gray-400 text-sm">—</span>;
    const isPast = new Date(dateStr) < new Date();
    return (
        <span className={`text-sm ${isPast ? 'text-red-500 font-medium' : 'text-gray-700'}`}>
            {isPast ? '⚠ ' : ''}{formatDate(dateStr)}
        </span>
    );
};

const Pagination = ({ links }) => {
    if (!links || links.length <= 3) return null;
    return (
        <div className="flex items-center justify-center gap-1 pt-4">
            {links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        link.active
                            ? 'bg-[#BA682A] text-white font-semibold shadow'
                            : link.url
                            ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
};

// ─── Modal Set Subscription ───────────────────────────────────────────────────

const SetSubscriptionModal = ({ user, onClose }) => {
    const sub = user.subscription;
    const [form, setForm] = useState({
        status: sub?.status || 'active',
        subscription_ends_at: formatDateInput(sub?.subscription_ends_at),
        trial_ends_at: formatDateInput(sub?.trial_ends_at),
        updated_reason: '',
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.put(
            route('admin.billing.updateSubscription', user.id),
            form,
            {
                preserveScroll: true,
                onFinish: () => { setProcessing(false); onClose(); },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Atur Langganan</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{user.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Status Langganan
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { value: 'active', label: 'Aktif', color: 'bg-green-50 border-green-300 text-green-700' },
                                { value: 'trial', label: 'Trial', color: 'bg-amber-50 border-amber-300 text-amber-700' },
                                { value: 'payment_required', label: 'Expired', color: 'bg-red-50 border-red-300 text-red-700' },
                            ].map((opt) => (
                                <label
                                    key={opt.value}
                                    className={`cursor-pointer flex items-center justify-center py-2.5 border-2 rounded-xl text-sm font-semibold transition-all ${
                                        form.status === opt.value
                                            ? opt.color + ' ring-2 ring-offset-1 ring-[#BA682A]'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        value={opt.value}
                                        checked={form.status === opt.value}
                                        onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                                        className="sr-only"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Date fields berdasarkan status */}
                    {form.status === 'active' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Aktif Hingga <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={form.subscription_ends_at}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setForm(f => ({ ...f, subscription_ends_at: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                            />
                            <p className="text-xs text-gray-400 mt-1">Tanggal berakhir masa aktif berlangganan</p>
                        </div>
                    )}

                    {form.status === 'trial' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Trial Hingga <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={form.trial_ends_at}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setForm(f => ({ ...f, trial_ends_at: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                            />
                            <p className="text-xs text-gray-400 mt-1">Tanggal berakhir masa trial</p>
                        </div>
                    )}

                    {form.status === 'payment_required' && (
                        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                            <AlertCircle className="w-4 h-4 inline mr-1" />
                            User akan masuk status <strong>expired</strong> dan diminta untuk membayar.
                        </div>
                    )}

                    {/* Alasan */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Alasan / Catatan <span className="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <input
                            type="text"
                            value={form.updated_reason}
                            onChange={(e) => setForm(f => ({ ...f, updated_reason: e.target.value }))}
                            placeholder="mis. Pembayaran manual, promo, dll."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 py-2.5 bg-[#BA682A] text-white rounded-xl text-sm font-semibold hover:bg-[#A0522D] disabled:opacity-60 transition-colors"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBilling({ users, stats, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin-billing', { search, status: statusFilter }, {
            preserveState: true, preserveScroll: true,
        });
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        router.get('/admin-billing', { search, status }, {
            preserveState: true, preserveScroll: true,
        });
    };

    const statusTabs = [
        { value: 'all', label: 'Semua', count: (stats.active + stats.trial + stats.expired + stats.no_sub) },
        { value: 'active', label: 'Aktif', count: stats.active },
        { value: 'trial', label: 'Trial', count: stats.trial },
        { value: 'payment_required', label: 'Expired', count: stats.expired },
        { value: 'none', label: 'Belum', count: stats.no_sub },
    ];

    return (
        <AdminLayout>
            <Head title="Billing Management" />

            {selectedUser && (
                <SetSubscriptionModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}

            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <CreditCard className="w-7 h-7 text-[#BA682A]" />
                        <h1 className="text-3xl font-bold text-gray-800">Billing Management</h1>
                    </div>
                    <p className="text-gray-500 ml-10">Monitor dan kelola status berlangganan semua pengguna</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Aktif', count: stats.active, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
                        { label: 'Trial', count: stats.trial, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
                        { label: 'Expired', count: stats.expired, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
                        { label: 'Belum Berlangganan', count: stats.no_sub, icon: UserX, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
                    ].map((card, i) => (
                        <div key={i} className={`rounded-xl p-5 border ${card.bg} ${card.border}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                                <span className={`text-xs font-semibold ${card.color}`}>{card.label}</span>
                            </div>
                            <p className={`text-4xl font-bold ${card.color}`}>{card.count}</p>
                            <p className="text-xs text-gray-400 mt-1">pengguna</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                />
                            </div>
                        </form>

                        {/* Status tabs */}
                        <div className="flex gap-2 flex-wrap">
                            {statusTabs.map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleStatusFilter(tab.value)}
                                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                                        statusFilter === tab.value
                                            ? 'bg-[#BA682A] text-white shadow'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                                        statusFilter === tab.value ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pengguna</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Berlaku Hingga</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Terakhir</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.data && users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=BA682A&color=fff&size=80`}
                                                        alt={user.name}
                                                        className="w-9 h-9 rounded-full shrink-0"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-400">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                    user.role === 'Convection' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <SubscriptionBadge subscription={user.subscription} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <EndDateDisplay subscription={user.subscription} />
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.subscription?.updated_at ? (
                                                    <div>
                                                        <p className="text-xs text-gray-500">{formatDate(user.subscription.updated_at)}</p>
                                                        {user.subscription.updated_reason && (
                                                            <p className="text-xs text-gray-400 truncate max-w-[160px]" title={user.subscription.updated_reason}>
                                                                {user.subscription.updated_reason}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#BA682A] hover:bg-[#A0522D] rounded-lg transition-colors shadow-sm"
                                                >
                                                    <RefreshCw className="w-3 h-3" />
                                                    Atur
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center">
                                            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 font-medium">Tidak ada data ditemukan</p>
                                            <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.data && users.data.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-100">
                            <Pagination links={users.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
