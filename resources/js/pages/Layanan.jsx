import { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import LarasenaCTA from '@/components/LarasenaCTA';
import LarasenaFooter from '@/components/LarasenaFooter';
import LarasenaNavbar from '@/components/LarasenaNavbar';

export default function Layanan({ user }) {
    const [openFaq, setOpenFaq] = useState(null);
    

    const faqData = [
        {
            q: "Apa itu Larasena?",
            a: "Larasena adalah sebuah platform digital yang memanfaatkan teknologi 3D modelling dan kecerdasan buatan (AI) untuk mendigitalisasi, memodelkan, dan mengoptimalkan produksi batik Nusantara. Kami hadir sebagai jembatan antara pelestarian budaya dan efisiensi industri tekstil lokal."
        },
        {
            q: "Apa masalah utama yang ingin diselesaikan Larasena?",
            a: "Kami fokus mengatasi krisis regenerasi pengrajin batik. Data APPBI menunjukkan jumlah pengrajin nasional menyusut drastis dari 151.565 orang pada 2020 menjadi 37.914 pada 2023. Larasena bertujuan menarik generasi muda (yang saat ini hanya 12%) untuk terlibat melalui teknologi yang modern."
        },
        {
            q: "Bagaimana cara kerja fitur AI Generator Batik?",
            a: "Anda dapat membuat desain batik menggunakan generator AI yang terintegrasi dengan Hugging Face API. Fitur ini memanfaatkan kecerdasan buatan untuk menghasilkan motif batik otomatis berdasarkan parameter atau deskripsi yang Anda tentukan."
        },
        {
            q: "Apakah saya bisa melihat desain saya di produk jadi?",
            a: "Ya. Platform kami dilengkapi fitur 3D Modelling Products menggunakan Three.js. Setelah Anda selesai mendesain di kanvas, Anda bisa melihat preview desain Anda secara langsung pada model 3D seperti kemeja, kaos, atau gaun."
        },
        {
            q: "Apakah Larasena yang akan mencetak kain batik saya?",
            a: "Tidak secara langsung. Larasena adalah platform untuk perencanaan dan desain produksi. Namun, kami memiliki fitur 'Konveksi Bermitra' yang memungkinkan Anda terhubung dan membuat pesanan produksi langsung ke mitra konveksi terverifikasi yang ada di platform kami."
        },
        {
            q: "Saya tidak tahu banyak tentang batik. Bisakah saya belajar di sini?",
            a: "Tentu. Kami memiliki fitur 'Galeri Nusantara' yang merupakan repositori untuk Anda menjelajahi koleksi motif batik dari berbagai daerah. Anda bisa mempelajari sejarah, filosofi, dan makna di balik setiap motif sebagai inspirasi desain Anda."
        },
        {
            q: "Bagaimana Larasena membantu industri konveksi?",
            a: "Kami menyediakan platform yang menghubungkan desainer dengan konveksi melalui sistem 'Konveksi Bermitra'. Konveksi dapat menerima pesanan produksi langsung dari desainer, mengelola pesanan, dan melacak status produksi secara real-time."
        },
        {
            q: "Apakah ada biaya untuk menggunakan Larasena?",
            a: "Pendaftaran dan penggunaan fitur dasar Larasena gratis. Namun, untuk layanan produksi melalui konveksi mitra, biaya akan disesuaikan dengan kesepakatan antara Anda dan konveksi yang dipilih."
        },
        {
            q: "Bagaimana cara memulai menggunakan Larasena?",
            a: "Anda cukup mendaftar akun gratis, kemudian dapat langsung mengakses fitur AI Generator untuk membuat desain batik, melihat galeri inspirasi, atau menghubungi konveksi mitra untuk produksi."
        },
        {
            q: "Apakah desain saya akan dilindungi?",
            a: "Ya. Semua desain yang Anda buat tersimpan di akun Anda dan hanya Anda yang memiliki akses penuh. Anda juga dapat memilih untuk mempublikasikan desain ke galeri atau menyimpannya sebagai private."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
            <Head title="Layanan -" />
            
            <LarasenaNavbar user={user} />

            {/* FAQ Section */}
            <section className="px-8 md:px-16 lg:px-24 py-20 bg-gradient-to-b from-gray-50 to-amber-50/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-100/20 rounded-full blur-3xl opacity-50"></div>
                
                <div className="text-center mb-16 relative z-10">
                        <p className="text-sm font-semibold text-amber-600 tracking-wider uppercase mb-3">
                            BANTUAN
                        </p>
                        <h3 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                            Pertanyaan yang <span className="text-amber-700">Sering Diajukan</span>
                        </h3>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Menemukan jawaban yang Anda butuhkan tentang platform Larasena, dari AI hingga produksi.
                        </p>
                    </div>

                    <div className="max-w-7xl mx-auto space-y-5 relative z-10">
                        {faqData.map((item, index) => (
                            <div 
                                key={index} 
                                className="bg-white rounded-2xl border border-amber-100/70 overflow-hidden transition-all duration-300 hover:border-amber-200 hover:shadow-lg hover-glow"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="flex justify-between items-center w-full p-6 text-left"
                                >
                                    <span className="text-base md:text-lg font-semibold text-gray-900">
                                        {item.q}
                                    </span>
                                    
                                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-amber-600">
                                        <svg
                                            className={`w-5 h-5 transition-transform duration-300 ${openFaq === index ? 'transform rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-screen' : 'max-h-0'}`}
                                >
                                    <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                                        <p>{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
            </section>

            <LarasenaCTA user={user} dashboardRoute={route('dashboard')} />
            <LarasenaFooter />
        </div>
        
    );
}