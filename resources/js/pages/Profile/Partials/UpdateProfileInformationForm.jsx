import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Camera, Upload, User as UserIcon } from 'lucide-react';

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
        
        if (data.profile_photo) {
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
        } else {
            post(route('profile.update'), {
                preserveScroll: true,
                _method: 'patch',
            });
        }
    };

    const currentPhoto = photoPreview || user.profile_photo_url;

    return (
        <section className={className}>
            <header className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-[#BA682A]" />
                    Informasi Profil
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Perbarui informasi profil dan foto Anda
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                {/* Profile Photo Section */}
                <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-gray-200">
                    {/* Photo Preview */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#BA682A] to-[#8B4513] flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
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
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 bg-[#BA682A] text-white rounded-full p-2 shadow-lg hover:bg-[#A0522D] transition-colors"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                        {photoPreview && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-bold shadow-lg">
                                NEW
                            </div>
                        )}
                    </div>

                    {/* Upload Info */}
                    <div className="flex-1 space-y-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/gif"
                            onChange={handlePhotoChange}
                            className="hidden"
                            id="profile-photo-input"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Foto Profil</p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                <Upload className="w-4 h-4" />
                                Pilih Foto
                            </button>
                            <p className="mt-1.5 text-xs text-gray-500">
                                JPG, PNG, atau GIF. Maksimal 2MB.
                            </p>
                        </div>
                        {errors.profile_photo && (
                            <p className="text-red-500 text-sm">{errors.profile_photo}</p>
                        )}
                        {photoPreview && (
                            <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Foto siap diupload
                            </p>
                        )}
                    </div>
                </div>

                {/* Name & Email Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Nama Lengkap
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:border-[#BA682A] focus:ring focus:ring-[#BA682A] focus:ring-opacity-30 transition"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:border-[#BA682A] focus:ring focus:ring-[#BA682A] focus:ring-opacity-30 transition"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 rounded-md text-sm text-gray-600 underline hover:text-[#BA682A] focus:outline-none focus:ring-2 focus:ring-[#BA682A] focus:ring-offset-2 transition"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-6 py-2.5 bg-[#BA682A] text-white rounded-lg hover:bg-[#A0522D] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out duration-300"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out duration-300"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Tersimpan!
                            </p>
                        </Transition>
                    </div>
                </div>
            </form>
        </section>
    );
}

