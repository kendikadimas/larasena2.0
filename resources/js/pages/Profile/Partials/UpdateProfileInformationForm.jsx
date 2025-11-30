import { Transition } from '@headlessui/react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Camera, Upload, User as UserIcon, Mail, Shield, Store, Users, Award } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            profile_photo: null,
        });

    // Badge configuration
    const getBadgeConfig = (badge) => {
        const configs = {
            boutique: {
                name: 'Boutique',
                icon: Store,
                gradient: 'from-blue-500 to-blue-600',
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                border: 'border-blue-200'
            },
            community: {
                name: 'Community',
                icon: Users,
                gradient: 'from-emerald-500 to-emerald-600',
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                border: 'border-emerald-200'
            },
            artisan: {
                name: 'Artisan',
                icon: Award,
                gradient: 'from-amber-500 to-amber-600',
                bg: 'bg-amber-50',
                text: 'text-amber-700',
                border: 'border-amber-200'
            }
        };
        return configs[badge] || configs.community;
    };

    const badgeConfig = getBadgeConfig(user.badge);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_photo', file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        // For file uploads, we need to use POST with _method spoofing
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setPhotoPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                // Reload with fresh props to get updated user data
                router.reload({ only: ['auth'] });
            },
        });
    };

    const currentPhoto = photoPreview || user.profile_photo_url;
    const BadgeIcon = badgeConfig.icon;

    return (
        <section className={className}>
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#BA682A] to-[#8B4513] flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    Informasi Profil
                </h2>
                <p className="mt-2 text-gray-600">
                    Kelola informasi pribadi dan foto profil Anda
                </p>
            </header>

            <form onSubmit={submit} className="space-y-8">
                {/* Profile Photo & Badge Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Photo Preview with Badge */}
                        <div className="relative shrink-0">
                            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-[#BA682A] to-[#8B4513] flex items-center justify-center text-white text-4xl font-bold shadow-xl">
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
                            
                            {/* Badge Overlay */}
                            <div className="absolute -bottom-2 -right-2">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${badgeConfig.gradient} flex items-center justify-center shadow-lg`}>
                                    <BadgeIcon className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            {/* Camera Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute top-0 right-0 bg-white text-gray-700 rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            
                            {photoPreview && (
                                <div className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full px-2.5 py-1 text-xs font-bold shadow-lg">
                                    BARU
                                </div>
                            )}
                        </div>

                        {/* Upload Info & Badge Status */}
                        <div className="flex-1 space-y-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                onChange={handlePhotoChange}
                                className="hidden"
                                id="profile-photo-input"
                            />
                            
                            {/* Badge Display */}
                            <div className={`${badgeConfig.bg} border ${badgeConfig.border} rounded-xl p-4`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${badgeConfig.gradient} flex items-center justify-center`}>
                                        <BadgeIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status Akun</p>
                                        <p className={`text-lg font-bold ${badgeConfig.text}`}>{badgeConfig.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <p className="text-sm font-semibold text-gray-900 mb-3">Foto Profil</p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-[#BA682A]"
                                >
                                    <Upload className="w-4 h-4" />
                                    Pilih Foto Baru
                                </button>
                                <p className="mt-2 text-xs text-gray-500">
                                    Format: JPG, PNG, atau GIF • Maksimal: 2MB
                                </p>
                            </div>
                            
                            {errors.profile_photo && (
                                <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                    {errors.profile_photo}
                                </p>
                            )}
                            {photoPreview && (
                                <p className="text-green-600 text-sm font-medium flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    Foto siap diupload
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-[#BA682A]" />
                        Informasi Akun
                    </h3>

                    {/* Name Field */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                            Nama Lengkap
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                            placeholder="Masukkan nama lengkap Anda"
                        />
                        {errors.name && (
                            <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                            Alamat Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                            placeholder="nama@email.com"
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Email Verification Notice */}
                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                            <p className="text-sm text-gray-800">
                                Email Anda belum diverifikasi.
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="ml-1 text-[#BA682A] hover:text-[#A0522D] underline font-semibold transition"
                                >
                                    Klik di sini untuk mengirim ulang email verifikasi.
                                </Link>
                            </p>
                            {status === 'verification-link-sent' && (
                                <p className="mt-2 text-sm text-green-600 font-semibold flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Link verifikasi baru telah dikirim ke email Anda.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-4 pt-2">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-x-2"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-sm text-green-700 font-semibold">Perubahan berhasil disimpan!</p>
                        </div>
                    </Transition>

                    <button
                        type="submit"
                        disabled={processing}
                        className="ml-auto px-6 py-3 bg-gradient-to-r from-[#BA682A] to-[#A0522D] text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </section>
    );
}

