import React, { useEffect, useState } from 'react';
import { ArrowRight, User, Palette, AlertCircle, Ruler } from 'lucide-react';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
};

const SIZE_CHART = {
    'S': { chest: '96cm', length: '68cm', shoulder: '44cm', markup: '+0%' },
    'M': { chest: '100cm', length: '70cm', shoulder: '46cm', markup: '+5%' },
    'L': { chest: '104cm', length: '72cm', shoulder: '48cm', markup: '+10%' },
    'XL': { chest: '108cm', length: '74cm', shoulder: '50cm', markup: '+15%' },
    'XXL': { chest: '112cm', length: '76cm', shoulder: '52cm', markup: '+20%' },
};

export default function OrderFormView({ data, setData, errors, processing, handleSubmitOrder, setCurrentStep, selectedMotif, konveksis, calculateEstimatedPrice, products, selectedConvection }) {
    const selectedProduct = products.find(p => parseInt(p.id) === parseInt(data.product_id));
    const isFabric = selectedProduct?.category === 'fabric';
    
    const [showSizeChart, setShowSizeChart] = useState(false);

    useEffect(() => {
        if (selectedProduct) {
            if (selectedProduct.category === 'fabric') {
                setData('fabric_size', '5');
            } else {
                setData('fabric_size', 'M');
            }
        }
    }, [data.product_id, selectedProduct?.id]);

    return (
        <div className="px-3 sm:px-6 py-4">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button onClick={() => setCurrentStep('create')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#BA682A' }}>Detail Pesanan</h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-1">Untuk desain {selectedMotif?.title}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 order-2 lg:order-1">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
                        <form onSubmit={handleSubmitOrder} className="space-y-6 sm:space-y-8">
                            {/* Informasi Customer */}
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#BA682A]" />
                                    <span className="text-sm sm:text-base">Informasi Customer</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                                        <input 
                                            type="text" 
                                            value={data.customer_name} 
                                            onChange={e => setData('customer_name', e.target.value)} 
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent" 
                                            required 
                                        />
                                        {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Nama Perusahaan</label>
                                        <input 
                                            type="text" 
                                            value={data.customer_company} 
                                            onChange={e => setData('customer_company', e.target.value)} 
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email *</label>
                                        <input 
                                            type="email" 
                                            value={data.customer_email} 
                                            onChange={e => setData('customer_email', e.target.value)} 
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent" 
                                            required 
                                        />
                                        {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Nomor Telepon *</label>
                                        <input 
                                            type="tel" 
                                            value={data.customer_phone} 
                                            onChange={e => setData('customer_phone', e.target.value)} 
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent" 
                                            required 
                                        />
                                        {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-6">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Alamat Lengkap *</label>
                                    <textarea 
                                        rows="3" 
                                        value={data.customer_address} 
                                        onChange={e => setData('customer_address', e.target.value)} 
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent" 
                                        required 
                                    />
                                    {errors.customer_address && <p className="text-red-500 text-xs mt-1">{errors.customer_address}</p>}
                                </div>
                            </div>

                            {/* Detail Produk */}
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-[#BA682A]" />
                                    <span className="text-sm sm:text-base">Detail Produk</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {/* Jenis Batik */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">Jenis Batik *</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                            {[
                                                { value: 'Batik Printing', label: 'Batik Printing', multiplier: '1x', desc: 'Proses cetak digital' },
                                                { value: 'Batik Cap', label: 'Batik Cap', multiplier: '2x', desc: 'Dengan cap tembaga' },
                                                { value: 'Batik Tulis', label: 'Batik Tulis', multiplier: '3x', desc: 'Handmade tradisional' }
                                            ].map((option) => (
                                                <label
                                                    key={option.value}
                                                    className={`relative flex flex-col p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                                                        data.batik_type === option.value
                                                            ? 'border-[#BA682A] bg-orange-50'
                                                            : 'border-gray-200 hover:border-[#BA682A]/50'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="batik_type"
                                                        value={option.value}
                                                        checked={data.batik_type === option.value}
                                                        onChange={e => setData('batik_type', e.target.value)}
                                                        className="sr-only"
                                                    />
                                                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                                                        <span className="font-semibold text-gray-800 text-xs sm:text-sm">{option.label}</span>
                                                        <span className="text-xs font-medium text-[#BA682A] bg-orange-100 px-2 py-1 rounded-full">
                                                            {option.multiplier}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] sm:text-xs text-gray-500">{option.desc}</span>
                                                    {data.batik_type === option.value && (
                                                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 bg-[#BA682A] rounded-full flex items-center justify-center">
                                                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                        {errors.batik_type && <p className="text-red-500 text-xs mt-2">{errors.batik_type}</p>}
                                    </div>

                                    {/* Pilih Tipe Produk */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Pilih Tipe Produk *</label>
                                        <select 
                                            value={data.product_id}
                                            onChange={e => setData('product_id', e.target.value)}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                            required
                                        >
                                            {products.map(product => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>}
                                    </div>

                                    {/* Ukuran Dinamis */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                            {isFabric ? 'Panjang Kain (meter)' : 'Ukuran'} *
                                        </label>
                                        
                                        {isFabric ? (
                                            <div>
                                                <input 
                                                    type="number" 
                                                    value={data.fabric_size} 
                                                    onChange={e => {
                                                        const value = parseInt(e.target.value) || 5;
                                                        setData('fabric_size', Math.max(5, value).toString());
                                                    }}
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent" 
                                                    min="5"
                                                    step="1"
                                                    required 
                                                />
                                                <p className="text-[10px] sm:text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                    <Ruler className="w-3 h-3" />
                                                    Minimal 5 meter | Lebar: 110-115cm
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <select 
                                                    value={data.fabric_size} 
                                                    onChange={e => setData('fabric_size', e.target.value)} 
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                                    required
                                                >
                                                    {Object.entries(SIZE_CHART).map(([size, details]) => (
                                                        <option key={size} value={size}>
                                                            {size} - {details.markup}
                                                        </option>
                                                    ))}
                                                </select>
                                                
                                                {SIZE_CHART[data.fabric_size] && (
                                                    <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-[10px] sm:text-xs font-semibold text-gray-700">Detail Ukuran {data.fabric_size}</p>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] sm:text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                                                    {SIZE_CHART[data.fabric_size].markup}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowSizeChart(!showSizeChart)}
                                                                    className="text-[10px] sm:text-xs text-[#BA682A] hover:underline"
                                                                >
                                                                    {showSizeChart ? 'Sembunyikan' : 'Lihat Semua'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs">
                                                            <div>
                                                                <span className="text-gray-500">Chest:</span>
                                                                <span className="font-medium ml-1">{SIZE_CHART[data.fabric_size].chest}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Length:</span>
                                                                <span className="font-medium ml-1">{SIZE_CHART[data.fabric_size].length}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Shoulder:</span>
                                                                <span className="font-medium ml-1">{SIZE_CHART[data.fabric_size].shoulder}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {showSizeChart && (
                                                    <div className="mt-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
                                                        <h4 className="text-xs sm:text-sm font-semibold mb-3 text-gray-800">Tabel Ukuran & Harga</h4>
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-[10px] sm:text-xs">
                                                                <thead className="bg-gray-50">
                                                                    <tr>
                                                                        <th className="px-2 sm:px-3 py-2 text-left font-semibold">Size</th>
                                                                        <th className="px-2 sm:px-3 py-2 text-left font-semibold">Chest</th>
                                                                        <th className="px-2 sm:px-3 py-2 text-left font-semibold">Length</th>
                                                                        <th className="px-2 sm:px-3 py-2 text-left font-semibold">Shoulder</th>
                                                                        <th className="px-2 sm:px-3 py-2 text-left font-semibold">Harga</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {Object.entries(SIZE_CHART).map(([size, measurements]) => (
                                                                        <tr 
                                                                            key={size} 
                                                                            className={`border-t ${data.fabric_size === size ? 'bg-orange-50' : ''}`}
                                                                        >
                                                                            <td className="px-2 sm:px-3 py-2 font-medium">{size}</td>
                                                                            <td className="px-2 sm:px-3 py-2">{measurements.chest}</td>
                                                                            <td className="px-2 sm:px-3 py-2">{measurements.length}</td>
                                                                            <td className="px-2 sm:px-3 py-2">{measurements.shoulder}</td>
                                                                            <td className="px-2 sm:px-3 py-2">
                                                                                <span className="text-orange-600 font-medium">{measurements.markup}</span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="mt-3 p-2 bg-blue-50 rounded text-[10px] sm:text-xs text-blue-700">
                                                            💡 <strong>Contoh:</strong> Kaos M dengan Batik Printing = Rp 25.000 × 1.05 = Rp 26.250/pcs
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {errors.fabric_size && <p className="text-red-500 text-xs mt-1">{errors.fabric_size}</p>}
                                    </div>

                                    {/* Jumlah */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Jumlah (pcs) *</label>
                                        <input 
                                            type="number" 
                                            value={data.quantity} 
                                            onChange={e => setData('quantity', parseInt(e.target.value) || 1)} 
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent" 
                                            min="1" 
                                            required 
                                        />
                                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                                    </div>

                                    {/* Konveksi Partner - Full Width */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Konveksi Partner *</label>
                                        {selectedConvection ? (
                                            <div className="w-full p-3 border border-gray-300 rounded-lg sm:rounded-xl bg-gray-100">
                                                <p className="font-semibold text-sm">{selectedConvection.name}</p>
                                                <p className="text-xs sm:text-sm text-gray-500">{selectedConvection.location}</p>
                                            </div>
                                        ) : (
                                            <select 
                                                value={data.convection_id}
                                                onChange={e => setData('convection_id', e.target.value)}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                                required
                                            >
                                                {konveksis.map(konveksi => (
                                                    <option key={konveksi.id} value={konveksi.id}>
                                                        {konveksi.name} - {konveksi.location}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {errors.convection_id && <p className="text-red-500 text-xs mt-1">{errors.convection_id}</p>}
                                    </div>
                                </div>

                                {/* Catatan Khusus */}
                                <div className="mt-4 sm:mt-6">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Catatan Khusus</label>
                                    <textarea 
                                        rows="3" 
                                        value={data.special_notes} 
                                        onChange={e => setData('special_notes', e.target.value)} 
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent" 
                                        placeholder="Contoh: Warna lebih gelap, motif diperbesar, dll"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 sm:gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => setCurrentStep('create')} 
                                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm border border-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Kembali
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm bg-[#BA682A] text-white rounded-lg sm:rounded-xl hover:bg-[#9d5a24] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    {processing ? 'Memproses...' : 'Buat Pesanan'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Ringkasan Pesanan</h3>
                        
                        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                            <div className="flex items-center gap-3">
                                <img
                                    src={selectedMotif?.image_url || 'https://via.placeholder.com/64'}
                                    alt={selectedMotif?.title}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{selectedMotif?.title}</h4>
                                    <p className="text-xs sm:text-sm text-gray-500">{data.batik_type}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3 py-3 sm:py-4 border-t border-gray-200">
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-gray-600">Jenis Batik</span>
                                <span className="font-medium text-right">{data.batik_type}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-gray-600">Produk</span>
                                <span className="font-medium text-right">{selectedProduct?.name}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-gray-600">{isFabric ? 'Panjang' : 'Ukuran'}</span>
                                <span className="font-medium text-right">
                                    {isFabric ? `${data.fabric_size} meter` : data.fabric_size}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-gray-600">Quantity</span>
                                <span className="font-medium text-right">{data.quantity} pcs</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-gray-600">Estimasi per Unit</span>
                                <span className="font-medium text-right">
                                    {data.quantity > 0 ? formatCurrency(calculateEstimatedPrice() / data.quantity) : formatCurrency(0)}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between text-base sm:text-lg font-semibold pt-3 sm:pt-4 border-t border-gray-200">
                            <span>Total Estimasi</span>
                            <span style={{ color: '#BA682A' }} className="text-right">{formatCurrency(calculateEstimatedPrice())}</span>
                        </div>

                        <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-[10px] sm:text-xs text-blue-800 font-medium">Catatan Harga</p>
                                    <p className="text-[10px] sm:text-xs text-blue-700 mt-1">
                                        Harga final akan dikonfirmasi oleh konveksi setelah review desain.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}