import { useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Camera, Upload, X } from 'lucide-react';

export default function ProfilePhotoSection({ className = '' }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        profile_photo: null,
        name: user.name,
        email: user.email,
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_photo', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            _method: 'patch',
            onSuccess: () => {
                setPhotoPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleCancel = () => {
        setPhotoPreview(null);
        setData('profile_photo', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const currentPhoto = photoPreview || user.profile_photo_url;

    return (
        <section className={className}>
            <header className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Camera className="w-6 h-6 text-[#BA682A]" />
                    Foto Profil
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Upload foto profil untuk personalisasi akun Anda
                </p>
            </header>

            <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Photo Preview */}
                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#BA682A] to-[#8B4513] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {currentPhoto ? (
                            <img
                                src={currentPhoto}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            user.name?.charAt(0).toUpperCase()
                        )}
                    </div>
                    {photoPreview && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-2">
                            <span className="text-xs font-bold">NEW</span>
                        </div>
                    )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-4">
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/gif"
                            onChange={handlePhotoChange}
                            className="hidden"
                            id="profile-photo-input"
                        />
                        <label
                            htmlFor="profile-photo-input"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#BA682A] text-white rounded-lg hover:bg-[#A0522D] transition cursor-pointer"
                        >
                            <Upload className="w-4 h-4" />
                            Pilih Foto
                        </label>
                        <p className="mt-2 text-xs text-gray-500">
                            JPG, PNG, atau GIF. Maksimal 2MB.
                        </p>
                    </div>

                    {errors.profile_photo && (
                        <p className="text-red-500 text-sm">{errors.profile_photo}</p>
                    )}

                    {photoPreview && (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Uploading...' : 'Upload Foto'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                            >
                                <X className="w-4 h-4" />
                                Batal
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
