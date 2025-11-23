import { Link } from '@inertiajs/react';

export default function GalleryCTA({ user, dashboardRoute }) {
  return (
    <section className="py-16 px-8 md:px-16 lg:px-24 bg-gradient-to-br from-amber-50 via-orange-50/30 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl opacity-50"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
          Jelajahi <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Galeri Motif</span> Komunitas
        </h3>
        
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Temukan ribuan desain batik karya komunitas kami. Dapatkan inspirasi, berikan apresiasi dengan like, dan bagikan karya favorit Anda.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/galeri-motif"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Lihat Galeri Lengkap
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <Link
            href={user ? dashboardRoute : '/login'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-700 font-semibold rounded-xl border-2 border-amber-600 hover:bg-amber-50 transition-all duration-300 group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Unggah Desain Anda
          </Link>
        </div>
        
        <div className="mt-10 grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
          <div>
            <div className="text-3xl font-bold text-amber-600 mb-1">10K+</div>
            <div className="text-sm text-gray-600">Desain Motif</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600 mb-1">5K+</div>
            <div className="text-sm text-gray-600">Desainer</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600 mb-1">50K+</div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
        </div>
      </div>
    </section>
  );
}
