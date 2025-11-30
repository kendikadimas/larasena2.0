import Modal from '@/components/Modal'; // Kept Modal as it provides complex show/hide logic
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { AlertTriangle, Trash2, Lock } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    Hapus Akun
                </h2>
                <p className="mt-2 text-gray-600">
                    Kelola penghapusan akun Anda secara permanen
                </p>
            </header>

            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-900 mb-2">Zona Bahaya</h3>
                        <p className="text-sm text-red-800 mb-4">
                            Setelah akun Anda dihapus, semua data dan informasi akan dihapus secara permanen. 
                            Sebelum menghapus akun, pastikan Anda telah mengunduh data yang ingin disimpan.
                        </p>
                        <button
                            type="button"
                            onClick={confirmUserDeletion}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg"
                        >
                            <Trash2 className="w-4 h-4" />
                            Hapus Akun Permanen
                        </button>
                    </div>
                </div>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Konfirmasi Penghapusan Akun
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus secara permanen.
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-amber-900 font-medium">
                            Masukkan kata sandi Anda untuk mengkonfirmasi penghapusan akun.
                        </p>
                    </div>

                    <div className="space-y-2 mb-8">
                        <label htmlFor="password_delete" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-500" />
                            Kata Sandi
                        </label>
                        <input
                            id="password_delete"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                            autoFocus
                            placeholder="Masukkan kata sandi Anda"
                        />
                        {errors.password && (
                            <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                            disabled={processing}
                        >
                            <Trash2 className="w-4 h-4" />
                            {processing ? 'Menghapus...' : 'Hapus Akun Sekarang'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
