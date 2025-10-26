import React from 'react';
import { Link } from '@inertiajs/react';
import { Package, DollarSign, CheckCircle, Eye, Plus, Inbox, Clock, XCircle } from 'lucide-react';

// Komponen Paginasi
const Pagination = ({ links = [] }) => {
    if (links.length <= 3) return null;
    return (
        <div className="flex items-center justify-end mt-6">
            {links.map((link, index) => {
                if (!link || !link.url) return <div key={index} className="px-4 py-2 mx-1 text-sm rounded-md text-gray-400" dangerouslySetInnerHTML={{ __html: link?.label ?? '' }} />;
                return <Link key={index} href={link.url} className={`px-4 py-2 mx-1 text-sm rounded-md transition-colors ${link.active ? 'bg-[#BA682A] text-white' : 'bg-white hover:bg-gray-100'}`} dangerouslySetInnerHTML={{ __html: link.label }} />;
            })}
        </div>
    );
};

// Komponen Badge Status
const StatusBadge = ({ status }) => {
    const statusMap = {
        'diterima_selesai': { text: 'Selesai', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-700' },
        'diproses': { text: 'Proses', icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-700' },
        'ditolak': { text: 'Ditolak', icon: <XCircle className="w-4 h-4" />, color: 'bg-red-100 text-red-700' },
        'dikirim': { text: 'Dikirim', icon: <Package className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700' },
        'diterima': { text: 'Diterima', icon: <Inbox className="w-4 h-4" />, color: 'bg-gray-100 text-gray-700' },
    };
    const { text, icon, color } = statusMap[status] || statusMap['diterima'];
    return <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${color}`}>{icon} {text}</span>;
};

// ✅ Helper untuk normalize image URL
const normalizeImageUrl = (url) => {
    if (!url) return null;
    
    // Jika sudah full URL (http/https), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // Jika sudah dimulai dengan /storage/, return as is
    if (url.startsWith('/storage/')) {
        return url;
    }
    
    // Jika path relatif, tambahkan /storage/
    return '/storage/' + url;
};

export default function DashboardView({ productions, totalSpent, completedOrders, onCreateNew }) {
  return (
    <div className="px-3 sm:px-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#BA682A]">Riwayat Produksi</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola semua pesanan batik Anda</p>
        </div>
        <button
          onClick={onCreateNew}
          className="w-full sm:w-auto px-6 py-3 bg-[#BA682A] text-white rounded-xl hover:bg-[#9d5a24] transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Buat Pesanan Baru</span>
        </button>
      </div>

      {/* Stats Cards - Mobile Friendly */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-md">
          <Package className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-xs opacity-90">Total Pesanan</p>
          <p className="text-2xl font-bold mt-1">{productions.total || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-md">
          <CheckCircle className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-xs opacity-90">Selesai</p>
          <p className="text-2xl font-bold mt-1">{completedOrders || 0}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">Pesanan Aktif</h2>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-4">ID Pesanan</th>
                <th className="p-4">Desain</th>
                <th className="p-4">Produk</th>
                <th className="p-4">Jumlah</th>
                <th className="p-4">Total Harga</th>
                <th className="p-4">Status</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {productions.data.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono text-gray-500">ORD-{order.id}</td>
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      <img
                        src={normalizeImageUrl(order.design?.image_url)}
                        alt={order.design?.title || 'Design'}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          // ✅ FIX: Prevent infinite loop
                          if (e.target.src !== 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12px" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E') {
                            console.error('Failed to load production image:', order.design?.image_url);
                            // Use inline SVG as fallback to prevent 404
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12px" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }
                        }}
                      />
                      <span>{order.design?.title || 'Untitled Design'}</span>
                    </div>
                  </td>
                  <td className="p-4">{order.product?.name || '-'}</td>
                  <td className="p-4">{order.quantity} pcs</td>
                  <td className="p-4 font-medium">
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR' 
                    }).format(order.total_price)}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={order.production_status} />
                  </td>
                  <td className="p-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {productions.data.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Belum ada pesanan</p>
              <p className="text-gray-400 text-sm mt-2">Buat pesanan pertama Anda sekarang!</p>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3 p-4">
          {productions.data.length > 0 ? (
            productions.data.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={normalizeImageUrl(order.design?.image_url)}
                      alt={order.design?.title || 'Design'}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        if (e.target.src !== 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12px" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E') {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12px" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{order.design?.title || 'Untitled Design'}</p>
                      <p className="text-xs text-gray-500 font-mono">ORD-{order.id}</p>
                    </div>
                  </div>
                  <StatusBadge status={order.production_status} />
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <p className="text-gray-500 mb-1">Produk</p>
                    <p className="font-medium text-gray-800">{order.product?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Jumlah</p>
                    <p className="font-medium text-gray-800">{order.quantity} pcs</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Total Harga</p>
                    <p className="font-bold text-[#BA682A] text-sm">
                      {new Intl.NumberFormat('id-ID', { 
                        style: 'currency', 
                        currency: 'IDR',
                        maximumFractionDigits: 0 
                      }).format(order.total_price)}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Eye className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Belum ada pesanan</p>
              <p className="text-gray-400 text-sm mt-2">Buat pesanan pertama Anda sekarang!</p>
            </div>
          )}
        </div>

        <Pagination links={productions.links} />
      </div>
    </div>
  );
}