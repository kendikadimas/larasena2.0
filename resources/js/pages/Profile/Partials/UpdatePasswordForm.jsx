import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Shield, Lock, Check } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    Keamanan Akun
                </h2>
                <p className="mt-2 text-gray-600">
                    Pastikan akun Anda menggunakan kata sandi yang kuat untuk menjaga keamanan
                </p>
            </header>

            <form onSubmit={updatePassword} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="current_password" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-gray-500" />
                        Kata Sandi Saat Ini
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                        autoComplete="current-password"
                        placeholder="Masukkan kata sandi saat ini"
                    />
                    {errors.current_password && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            {errors.current_password}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-gray-500" />
                        Kata Sandi Baru
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                        autoComplete="new-password"
                        placeholder="Masukkan kata sandi baru"
                    />
                    {errors.password && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Check className="w-4 h-4 text-gray-500" />
                        Konfirmasi Kata Sandi Baru
                    </label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                        autoComplete="new-password"
                        placeholder="Ulangi kata sandi baru"
                    />
                    {errors.password_confirmation && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-x-2"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-sm text-green-700 font-semibold">Kata sandi berhasil diperbarui!</p>
                        </div>
                    </Transition>

                    <button
                        type="submit"
                        disabled={processing}
                        className="ml-auto px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm"
                    >
                        {processing ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
                    </button>
                </div>
            </form>
        </section>
    );
}
