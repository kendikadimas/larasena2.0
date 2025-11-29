import { useState } from 'react';
import UserLayout from '@/layouts/User/Layout';
import { router } from '@inertiajs/react';
import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

export default function UploadMotifCreate() {
    const [formData, setFormData] = useState({
        title: '',
        origin: '',
        category: '',
        philosophy: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        'Parang',
        'Kawung',
        'Mega Mendung',
        'Truntum',
        'Sekar Jagad',
        'Sido Mukti',
        'Batik Modern',
        'Lainnya'
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors({ ...errors, image: 'Ukuran file maksimal 5MB' });
                return;
            }
            
            setFormData({ ...formData, image: file });
            setPreviewUrl(URL.createObjectURL(file));
            setErrors({ ...errors, image: null });
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: null });
        setPreviewUrl(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('origin', formData.origin);
        data.append('category', formData.category);
        data.append('philosophy', formData.philosophy);
        if (formData.image) {
            data.append('image', formData.image);
        }

        router.post('/upload', data, {
            onSuccess: () => {
                // Reset form
                setFormData({
                    title: '',
                    origin: '',
                    category: '',
                    philosophy: '',
                    image: null
                });
                setPreviewUrl(null);
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            }
        });
    };

    return (
        <UserLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Motif Batik</h1>
                    <p className="text-gray-600">
                        Bagikan karya motif batik Anda ke komunitas. Motif akan ditinjau oleh admin sebelum dipublikasikan.
                    </p>
                </div>

                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Tips untuk upload yang sukses:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                            <li>Upload gambar dengan resolusi tinggi (minimal 800x800px)</li>
                            <li>Format file: JPG, PNG (maksimal 5MB)</li>
                            <li>Pastikan informasi motif lengkap dan akurat</li>
                            <li>Proses verifikasi biasanya memakan waktu 1-3 hari kerja</li>
                        </ul>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {/* Image Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Gambar Motif <span className="text-red-500">*</span>
                        </label>
                        
                        {!previewUrl ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl hover:border-amber-500 transition-colors">
                                <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
                                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        Klik untuk upload gambar
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG (max. 5MB)
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-96 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                        
                        {errors.image && (
                            <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Nama Motif <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                            placeholder="Contoh: Batik Parang Rusak"
                            required
                        />
                        {errors.title && (
                            <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    {/* Origin */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Asal Daerah <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.origin}
                            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                            placeholder="Contoh: Yogyakarta, Solo, Pekalongan"
                            required
                        />
                        {errors.origin && (
                            <p className="mt-2 text-sm text-red-600">{errors.origin}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Kategori <span className="text-gray-400 text-xs">(Opsional)</span>
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                        )}
                    </div>

                    {/* Philosophy */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Filosofi & Makna <span className="text-gray-400 text-xs">(Opsional)</span>
                        </label>
                        <textarea
                            value={formData.philosophy}
                            onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none"
                            placeholder="Jelaskan filosofi, makna, dan sejarah dari motif batik ini..."
                        />
                        {errors.philosophy && (
                            <p className="mt-2 text-sm text-red-600">{errors.philosophy}</p>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.image}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-800 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                            {isSubmitting ? 'Mengupload...' : 'Upload Motif'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.visit('/upload')}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
}
