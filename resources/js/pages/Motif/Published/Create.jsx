import { useState } from 'react';
import UserLayout from '@/layouts/User/Layout';
import { router } from '@inertiajs/react';
import { Upload, Image as ImageIcon, FileText, Sparkles, Info, CheckCircle, MapPin } from 'lucide-react';

export default function CreatePublishedMotif() {
    const [formData, setFormData] = useState({
        title: '',
        philosophy: '',
        origin: '',
        image: null,
        design_data: null
    });
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, image: 'Ukuran file maksimal 5MB' });
                return;
            }
            
            setFormData({ ...formData, image: file });
            setErrors({ ...errors, image: null });
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('philosophy', formData.philosophy);
        data.append('origin', formData.origin);
        if (formData.image) {
            data.append('image', formData.image);
        }
        if (formData.design_data) {
            data.append('design_data', formData.design_data);
        }

        router.post(route('motif.published.store'), data, {
            forceFormData: true,
            onSuccess: () => {
                setSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setSubmitting(false);
            }
        });
    };

    return (
        <UserLayout title="Publish Motif">
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#BA682A] to-[#D2691E] rounded-2xl mb-4">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-3">Publish Motif Batik</h1>
                        <p className="text-gray-600 text-lg">
                            Bagikan karya motif batik Anda ke galeri publik
                        </p>
                    </div>

                    {/* Info Card */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-2">Informasi Penting</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Motif akan direview oleh admin sebelum dipublikasikan</li>
                                    <li>• Pastikan motif adalah karya original Anda</li>
                                    <li>• Ukuran file maksimal 5MB (JPG, PNG, WEBP)</li>
                                    <li>• Filosofi motif akan membantu orang lain memahami makna karya Anda</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
                        <div className="p-8 space-y-6">
                            {/* Upload Image */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                    Gambar Motif *
                                </label>
                                
                                {!preview ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#BA682A] hover:bg-amber-50/50 transition-all cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 font-medium mb-2">
                                                Klik untuk upload gambar motif
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                JPG, PNG, WEBP (Max 5MB)
                                            </p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-96 object-cover rounded-xl border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(null);
                                                setFormData({ ...formData, image: null });
                                            }}
                                            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                                        >
                                            Ganti Gambar
                                        </button>
                                    </div>
                                )}
                                
                                {errors.image && (
                                    <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                    Nama Motif *
                                </label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-[#BA682A] transition-all"
                                        placeholder="Contoh: Batik Parang Rusak Modern"
                                        required
                                    />
                                </div>
                                {errors.title && (
                                    <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            {/* Origin (Asal Kota) */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                    Asal Daerah Motif *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.origin}
                                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-[#BA682A] transition-all"
                                        placeholder="Contoh: Solo, Yogyakarta, Pekalongan, dll."
                                        required
                                    />
                                </div>
                                {errors.origin && (
                                    <p className="mt-2 text-sm text-red-600">{errors.origin}</p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    Nama daerah/kota asal motif batik ini berasal
                                </p>
                            </div>

                            {/* Philosophy */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                    Filosofi & Makna Motif *
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                    <textarea
                                        value={formData.philosophy}
                                        onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-[#BA682A] transition-all"
                                        rows={5}
                                        placeholder="Ceritakan makna dan filosofi di balik motif ini... (Min. 50 karakter)"
                                        required
                                        maxLength={1000}
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <p className="text-sm text-gray-500">
                                        {formData.philosophy.length}/1000 karakter
                                    </p>
                                    {errors.philosophy && (
                                        <p className="text-sm text-red-600">{errors.philosophy}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-t-2 border-gray-100">
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.get(route('motif.published.index'))}
                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !formData.image || !formData.title || !formData.origin || !formData.philosophy}
                                    className="flex-1 bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Mengirim...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Submit untuk Review</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Tips */}
                    <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                        <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Tips Agar Motif Disetujui
                        </h3>
                        <ul className="text-sm text-green-800 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Gunakan gambar berkualitas tinggi dengan resolusi minimal 1000x1000px</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Berikan nama motif yang unik dan deskriptif</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Jelaskan filosofi dengan detail dan mudah dipahami</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Pastikan motif adalah karya original, bukan hasil copy-paste</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
