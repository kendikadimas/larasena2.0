import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Users, Search, Filter, Edit, Trash2, UserCheck, UserX, Mail, Calendar, Shield, CreditCard } from 'lucide-react';
import { useState } from 'react';

const UserRoleBadge = ({ role }) => {
    const roleMap = {
        'Admin': { text: 'Admin', color: 'bg-red-100 text-red-700' },
        'Convection': { text: 'Convection', color: 'bg-blue-100 text-blue-700' },
        'General': { text: 'General', color: 'bg-gray-100 text-gray-700' },
    };
    const { text, color } = roleMap[role] || roleMap['General'];
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${color}`}>{text}</span>;
};

const StatusBadge = ({ isActive }) => {
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
            {isActive ? 'Active' : 'Inactive'}
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

export default function AdminUsers({ users, stats, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedRole, setSelectedRole] = useState(filters?.role || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', {
            search: search,
            role: selectedRole,
            status: selectedStatus,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleRoleFilter = (role) => {
        setSelectedRole(role);
        router.get('/admin/users', {
            search: search,
            role: role,
            status: selectedStatus,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        router.get('/admin/users', {
            search: search,
            role: selectedRole,
            status: status,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleToggleStatus = (userId) => {
        if (confirm('Are you sure you want to toggle this user status?')) {
            router.post(`/admin/users/${userId}/toggle-status`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            router.delete(`/admin/users/${userId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleSubscriptionTesting = (userId, status) => {
        const reason = window.prompt('Alasan override (opsional):', 'Testing langganan internal') || 'Testing langganan internal';

        router.put(route('admin.users.subscription-testing', userId), {
            status,
            updated_reason: reason,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Manage Users" />
            
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
                    <p className="text-gray-600">Manage all users and their permissions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total_users}</p>
                            </div>
                            <div className="bg-blue-500 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Admin Users</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.admin_users}</p>
                            </div>
                            <div className="bg-red-500 p-3 rounded-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Convection Users</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.convection_users}</p>
                            </div>
                            <div className="bg-purple-500 p-3 rounded-lg">
                                <UserCheck className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">General Users</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.general_users}</p>
                            </div>
                            <div className="bg-gray-500 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="md:col-span-1">
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Role Filter */}
                        <div className="md:col-span-1">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={selectedRole}
                                    onChange={(e) => handleRoleFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BA682A] focus:border-transparent appearance-none bg-white cursor-pointer"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Convection">Convection</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
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
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Joined Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.data && users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img 
                                                        src={`https://ui-avatars.com/api/?name=${user.name}&background=BA682A&color=fff`}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <UserRoleBadge role={user.role} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge isActive={user.is_active} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">
                                                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            user.is_active 
                                                                ? 'text-gray-600 hover:bg-gray-100' 
                                                                : 'text-green-600 hover:bg-green-50'
                                                        }`}
                                                        title={user.is_active ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {user.is_active ? (
                                                            <UserX className="w-4 h-4" />
                                                        ) : (
                                                            <UserCheck className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    
                                                    {user.role !== 'Admin' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleSubscriptionTesting(user.id, 'trial')}
                                                                className="p-2 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                                                                title="Set Trial"
                                                            >
                                                                <CreditCard className="w-4 h-4" />
                                                            </button>

                                                            <button
                                                                onClick={() => handleSubscriptionTesting(user.id, 'active')}
                                                                className="px-2 py-1 text-xs font-semibold text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Set Active"
                                                            >
                                                                Active
                                                            </button>

                                                            <button
                                                                onClick={() => handleSubscriptionTesting(user.id, 'payment_required')}
                                                                className="px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Set Expired"
                                                            >
                                                                Expired
                                                            </button>

                                                            <button
                                                                onClick={() => handleDelete(user.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Users className="w-12 h-12 text-gray-400 mb-3" />
                                                <p className="text-gray-500 font-medium">No users found</p>
                                                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.data && users.data.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4">
                            <Pagination links={users.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
