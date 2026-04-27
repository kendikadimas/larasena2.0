import { Head, router, usePage } from '@inertiajs/react';

export default function BillingRequired({ subscription, message }) {
    const { auth } = usePage().props;

    const handleCreateInvoice = () => {
        router.post(route('billing.create-invoice'));
    };

    const handleRefreshStatus = () => {
        router.reload({ only: ['subscription'] });
    };

    const activeEndDate = subscription?.is_trial ? subscription?.trial_ends_at : subscription?.subscription_ends_at;

    return (
        <>
            <Head title="Pembayaran Langganan" />

            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-2xl rounded-3xl bg-white border border-amber-100 shadow-xl p-6 md:p-10">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-700 font-semibold">Billing Gateway</p>
                    <h1 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">
                        Langganan diperlukan untuk melanjutkan
                    </h1>
                    <p className="mt-3 text-sm text-gray-600">
                        Halo {auth?.user?.name}, akses fitur saat ini dibatasi karena trial/langganan sudah berakhir.
                        Lanjutkan pembayaran Rp30.000 untuk aktivasi 30 hari.
                    </p>

                    {message && (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                            {message}
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                            <p className="text-xs text-gray-500">Status Saat Ini</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">
                                {subscription?.payment_required
                                    ? 'Pembayaran Diperlukan'
                                    : subscription?.is_trial
                                    ? 'Trial Aktif'
                                    : 'Aktif'}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                            <p className="text-xs text-gray-500">Berlaku Sampai</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">
                                {activeEndDate ? new Date(activeEndDate).toLocaleString('id-ID') : '-'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={handleCreateInvoice}
                            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#BA682A] text-white font-semibold hover:opacity-90 transition"
                        >
                            Buat Invoice Pembayaran
                        </button>

                        {subscription?.invoice_url && (
                            <a
                                href={subscription.invoice_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-[#BA682A] text-[#BA682A] font-semibold hover:bg-amber-50 transition"
                            >
                                Buka Invoice Terakhir
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={handleRefreshStatus}
                            className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                        >
                            Refresh Status
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
