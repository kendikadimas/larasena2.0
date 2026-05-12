import { X, AlertCircle, CreditCard } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function PaymentPopupModal({ isOpen, onClose, title = 'Upgrade Diperlukan', message = 'Anda perlu berlangganan untuk mengakses fitur ini', ctaText = 'Lihat Paket Berlangganan' }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-[999] transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-300">
                    {/* Header with close button */}
                    <div className="flex items-start justify-between p-6 border-b border-gray-200">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <AlertCircle className="w-6 h-6 text-amber-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-gray-600 mb-6">{message}</p>

                        {/* Feature list */}
                        <div className="bg-[#EBF2EF] rounded-lg p-4 mb-6 border border-[#D9D5CC]">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Keuntungan berlangganan:</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="w-1.5 h-1.5 bg-[#4E8070] rounded-full" />
                                    Akses ke semua fitur premium
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="w-1.5 h-1.5 bg-[#4E8070] rounded-full" />
                                    Produksi unlimited
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="w-1.5 h-1.5 bg-[#4E8070] rounded-full" />
                                    Dukungan prioritas
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer with actions */}
                    <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                        >
                            Batal
                        </button>
                        <Link
                            href={route('billing.required')}
                            className="flex-1 px-4 py-2 bg-[#4E8070] text-white rounded-lg font-medium text-sm hover:bg-[#3F6D5F] transition-colors flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-4 h-4" />
                            {ctaText}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
