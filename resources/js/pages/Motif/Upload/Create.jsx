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
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Bagikan Motif Batik</h1>
                    <p className="text-gray-600 text-base">Upload karya Anda untuk diulas oleh tim kami</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8">
                    {/* Image Upload */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Gambar Motif</label>
                        
                        {!previewUrl ? (
                            <div className="border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                                <label className="flex flex-col items-center justify-center h-56 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-700 font-medium">Pilih gambar</p>
                                    <p className="text-xs text-gray-500 mt-1">atau drag & drop</p>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                        ) : (
                            <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <img src={previewUrl} alt="Preview" className="w-full h-80 object-cover" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1.5 bg-white/90 text-gray-600 hover:text-gray-900 rounded transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        
                        {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Nama Motif</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none text-sm"
                            placeholder="Contoh: Batik Parang Rusak"
                            required
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                    </div>

                    {/* Origin */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Asal Daerah</label>
                        <input
                            type="text"
                            value={formData.origin}
                            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none text-sm"
                            placeholder="Contoh: Yogyakarta, Solo, Pekalongan"
                            required
                        />
                        {errors.origin && <p className="mt-1 text-xs text-red-600">{errors.origin}</p>}
                    </div>

                    {/* Category */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Kategori</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none text-sm"
                        >
                            <option value="">Pilih kategori</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
                    </div>

                    {/* Philosophy */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Filosofi & Makna</label>
                        <textarea
                            value={formData.philosophy}
                            onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none text-sm resize-none"
                            placeholder="Ceritakan makna dan sejarah motif ini..."
                        />
                        {errors.philosophy && <p className="mt-1 text-xs text-red-600">{errors.philosophy}</p>}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-6 border-t">
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.image}
                            className="flex-1 px-4 py-2.5 bg-[#4E8070] text-white rounded-lg font-medium text-sm hover:bg-[#3F6D5F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Mengupload...' : 'Upload'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.visit('/upload')}
                            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
}
