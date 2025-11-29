import { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';

export default function Layanan({ user }) {
    const [openFaq, setOpenFaq] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <Head title="Layanan - Larasena" />
            
            {/* ===== NAVBAR ===== */}
            <div className="relative w-full py-4 bg-transparent">
                <div className="px-8 md:px-16 lg:px-24 flex justify-between items-center">
                    <Link href="/" className="flex-shrink-0 flex items-center transform hover:scale-105 transition-transform duration-300">
                        <img 
                            src="/images/logolarasena.png" 
                            alt="Larasena Logo" 
                            className="h-12 w-auto"
                        />
                    </Link>
                    
                    {/* Auth Button - Desktop & Mobile (Scrolls Away) */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold hover:from-amber-800 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 md:px-6 md:py-2.5 rounded-xl border-2 border-amber-600 text-amber-600 font-semibold hover:bg-amber-50 transition-all duration-300"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 md:px-6 md:py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold hover:from-amber-800 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Menu - Fixed (Muncul saat scroll) */}
            <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
                isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
            }`}>
                <div className="flex items-center gap-8 px-8 py-3 rounded-3xl bg-white/90 backdrop-blur-lg border border-amber-100 shadow-lg">
                    <Link href="/" className="font-medium transition-all duration-300 relative group text-base text-gray-700 hover:text-amber-700">
                        Beranda
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="/galeri-motif" className="font-medium transition-all duration-300 relative group text-base text-gray-700 hover:text-amber-700">
                        Batikpedia
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="/layanan" className="font-medium transition-all duration-300 relative group text-base text-amber-700">
                        Layanan
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600"></span>
                    </Link>
                </div>
            </nav>

            {/* FAQ Section */}
            <section className="px-8 md:px-16 lg:px-24 py-20 bg-gradient-to-b from-gray-50 to-amber-50/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-100/20 rounded-full blur-3xl opacity-50"></div>
                
                <div className="text-center mb-16 relative z-10">
                        <p className="text-sm font-semibold text-amber-600 tracking-wider uppercase mb-3">
                            BANTUAN
                        </p>
                        <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
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
                                className="bg-white rounded-2xl border border-amber-100/70 overflow-hidden transition-all duration-300 hover:border-amber-200 hover:shadow-lg"
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

            {/* CTA Section */}
            <div className="px-8 md:px-16 lg:px-24 py-8">
                <div className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-center overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5 10-5 10-5-10z M0 30l10 5-10 5-10-5z M60 30l-10 5 10 5 10-5z M30 40l5 10-5 10-5-10z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
                        }}></div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-3">Waktunya Berkarya!</h2>
                        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                            Bagikan kreativitas batikmu dan inspirasi ribuan orang di seluruh Indonesia
                        </p>
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:shadow-2xl transition-all hover:scale-105"
                            >
                                <span>Mulai Buat Motif</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:shadow-2xl transition-all hover:scale-105"
                            >
                                <span>Gabung Sekarang</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Footer */}
                  {/* ===== FOOTER MODERN & HANGAT ===== */}
                    <footer className="bg-gradient-to-br from-amber-50 via-orange-50/40 to-white text-gray-800 px-8 md:px-16 lg:px-24 py-16 relative overflow-hidden">
                    {/* Background dekoratif lembut */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                        <div className="absolute top-10 right-20 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 left-10 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl"></div>
                    </div>
                    {/* Konten utama footer */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative z-10">
                        {/* Brand */}
                        <div>
                        <div className="flex items-center gap-3 mb-6">
                          <a href="/" className="flex-shrink-0 flex items-center transform hover:scale-105 transition-transform duration-300 group">
                                  <img 
                                    src="/images/logolarasena.png" 
                                    alt="Larasena Logo" 
                                    className="h-12 w-auto"
                                  />
                                </a>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                            Platform digital terdepan untuk mendesain dan memproduksi batik dengan teknologi modern,
                            melestarikan warisan budaya dengan sentuhan inovasi terkini.
                        </p>
                        </div>
                        {/* Link Sections */}
                        {[
                        {
                            title: "Fitur",
                            links: ["Generte Batik AI", "Canvas Digital", "3D Model Batik", "Mitra Konveksi"]
                        },
                        {
                            title: "Perusahaan",
                            links: ["Tentang Kami", "Galeri", "Fitur", "Mitra"]
                        },
                        {
                            title: "Dukungan",
                            links: ["Bantuan", "Dokumentasi", "Privasi", "Syarat Layanan"]
                        }
                        ].map((section, index) => (
                        <div key={index}>
                            <h4 className="font-semibold text-lg mb-4 text-gray-900">{section.title}</h4>
                            <ul className="space-y-3">
                            {section.links.map((link, linkIndex) => (
                                <li key={linkIndex}>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-orange-600 transition-colors duration-300 text-sm"
                                >
                                    {link}
                                </a>
                                </li>
                            ))}
                            </ul>
                        </div>
                        ))}
                    </div>
                    {/* Garis & Copyright */}
                    <div className="border-t border-amber-200/70 pt-8 relative z-10 text-sm text-gray-600">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            © {new Date().getFullYear()} <span className="font-semibold text-orange-600">Larasena</span> — Teknologi Batik Dengan Tradisi
                        </div>
                    
                        </div>
                    </div>
                    {/* Ornamen bawah */}
                    <div className="absolute -bottom-10 right-10 w-60 h-60 bg-gradient-to-tr from-orange-200/40 to-amber-100/30 rounded-full blur-3xl opacity-60"></div>
                    </footer>
        </div>
        
    );
}