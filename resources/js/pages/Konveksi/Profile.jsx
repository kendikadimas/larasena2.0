import React, { useState } from 'react';
import KonveksiLayout from '@/layouts/Konveksi/Layout';
import { Head, useForm } from '@inertiajs/react';
import { Camera, Upload, MapPin, Phone, FileText, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

export default function Profile({ konveksi, auth }) {
    const [previewIcon, setPreviewIcon] = useState(konveksi.icon_url);
    const [documentationPreviews, setDocumentationPreviews] = useState(
        konveksi.documentation ? JSON.parse(konveksi.documentation) : []
    );

    const { data, setData, post, processing, errors, progress } = useForm({
        name: konveksi.name || '',
        location: konveksi.location || '',
        no_telp: konveksi.no_telp || '',
        description: konveksi.description || '',
        icon: null,
        documentation: [],
        _method: 'PUT'
    });

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('icon', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewIcon(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDocumentationChange = (e) => {
        const files = Array.from(e.target.files);
        setData('documentation', files);
        
        // Create previews
        const previews = [];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push(reader.result);
                if (previews.length === files.length) {
                    setDocumentationPreviews([...documentationPreviews, ...previews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeDocumentationPreview = (index) => {
        const newPreviews = documentationPreviews.filter((_, i) => i !== index);
        setDocumentationPreviews(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('konveksi.profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <KonveksiLayout title="Profil Konveksi">
            <Head title="Profil Konveksi" />
            
            <div className="p-4 sm:p-6 max-w-5xl mx-auto">
                {/* Header with Status */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#BA682A]">Profil Konveksi</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">Kelola informasi konveksi Anda</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {konveksi.is_verified ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-semibold text-sm">Terverifikasi</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-semibold text-sm">Menunggu Verifikasi</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Icon Upload Section */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-[#BA682A]" />
                            Logo Konveksi
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative">
                                <img
                                    src={previewIcon || `https://ui-avatars.com/api/?name=${data.name}&size=128&background=BA682A&color=fff`}
                                    alt="Icon Preview"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                />
                                <label className="absolute bottom-0 right-0 bg-[#BA682A] text-white p-2 rounded-full cursor-pointer hover:bg-[#9d5a24] transition-colors shadow-lg">
                                    <Camera className="w-5 h-5" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleIconChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <p className="text-sm text-gray-600 mb-2">Upload logo konveksi Anda</p>
                                <p className="text-xs text-gray-500">Format: JPG, PNG (Max: 2MB)</p>
                                {errors.icon && <p className="text-red-500 text-xs mt-2">{errors.icon}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#BA682A]" />
                            Informasi Dasar
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Nama Konveksi *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    Lokasi *
                                </label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                                    required
                                />
                                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    Nomor Telepon *
                                </label>
                                <input
                                    type="tel"
                                    value={data.no_telp}
                                    onChange={e => setData('no_telp', e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    placeholder="08123456789"
                                    required
                                />
                                {errors.no_telp && <p className="text-red-500 text-xs mt-1">{errors.no_telp}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi Konveksi *
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows="4"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    placeholder="Ceritakan tentang konveksi Anda, spesialisasi, pengalaman, dll..."
                                    required
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Documentation/Gallery */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-[#BA682A]" />
                            Galeri Portfolio
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center hover:border-[#BA682A] transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleDocumentationChange}
                                    className="hidden"
                                    id="documentation-upload"
                                />
                                <label htmlFor="documentation-upload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        Klik untuk upload foto portfolio
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, JPEG (Max: 2MB per file)
                                    </p>
                                </label>
                            </div>

                            {/* Preview Gallery */}
                            {documentationPreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                    {documentationPreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full aspect-square object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeDocumentationPreview(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.documentation && <p className="text-red-500 text-xs mt-2">{errors.documentation}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 px-6 py-3 bg-[#BA682A] text-white font-semibold rounded-lg sm:rounded-xl hover:bg-[#9d5a24] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>

                    {/* Upload Progress */}
                    {progress && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-700">Uploading...</span>
                                <span className="text-sm font-semibold text-blue-700">{progress.percentage}%</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress.percentage}%` }}
                                />
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </KonveksiLayout>
    );
}
