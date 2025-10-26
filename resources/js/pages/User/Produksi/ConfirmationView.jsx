import React from 'react';
import { CheckCircle, Package, Home } from 'lucide-react';

export default function ConfirmationView({ onFinish }) {
  return (
    <div className="px-3 sm:px-6 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
            Pesanan Berhasil Dibuat! 🎉
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Pesanan Anda telah berhasil disimpan dan akan segera diproses oleh mitra konveksi kami.
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Apa Selanjutnya?</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Tim konveksi akan meninjau desain Anda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Anda akan menerima konfirmasi harga final melalui email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Produksi akan dimulai setelah pembayaran dikonfirmasi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Pantau status pesanan Anda di dashboard produksi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onFinish}
            className="flex-1 px-6 py-3 bg-[#BA682A] text-white rounded-xl hover:bg-[#9d5a24] transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
          >
            <Home className="w-5 h-5" />
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
