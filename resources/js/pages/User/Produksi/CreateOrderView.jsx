import React from 'react';
import { ArrowRight } from 'lucide-react';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
};

export default function CreateOrderView({ designs, setCurrentStep, setData, setSelectedMotif }) {
    return (
        <div className="px-3 sm:px-6 py-4">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button 
                    onClick={() => setCurrentStep('dashboard')} 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                    <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#BA682A' }}>Pilih Desain Batik</h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Pilih desain yang ingin diproduksi</p>
                </div>
            </div>
            
            {designs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {designs.map((design) => (
                        <div
                            key={design.id}
                            onClick={() => {
                                setData('design_id', design.id);
                                setSelectedMotif(design);
                                setCurrentStep('form');
                            }}
                            className="group bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <img 
                                    src={design.image_url || 'https://via.placeholder.com/300'} 
                                    alt={design.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                                        <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-1">{design.title}</h3>
                                        <p className="text-white/90 text-xs sm:text-sm">Mulai dari {formatCurrency(50000)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 sm:p-4 lg:hidden">
                                <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{design.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">Dari {formatCurrency(50000)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 sm:py-20">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Belum Ada Desain</h3>
                    <p className="text-sm text-gray-500 mb-6">Buat desain batik terlebih dahulu sebelum memesan</p>
                    <button
                        onClick={() => window.location.href = '/designs'}
                        className="inline-flex items-center px-5 py-2.5 bg-[#BA682A] text-white rounded-xl hover:bg-[#9d5a24] transition-colors text-sm font-medium"
                    >
                        Buat Desain Baru
                    </button>
                </div>
            )}
        </div>
    );
}