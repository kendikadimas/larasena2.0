import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Mail, Phone, MapPin, MessageCircle, ChevronDown } from 'lucide-react';
import LarasenaCTA from '@/components/LarasenaCTA';
import LarasenaFooter from '@/components/LarasenaFooter';
import LarasenaNavbar from '@/components/LarasenaNavbar';

// ============================================================
// Batik pattern SVG — dipakai di Hero background (sangat tipis)
// ============================================================
const BatikPatternHero = () => (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.045 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="batik-layanan-hero" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M15,15 L65,15 L65,65 L15,65 Z" fill="none" stroke="#1A332F" strokeWidth="1.5" />
                    <path d="M25,25 L55,25 L55,55 L25,55 Z" fill="none" stroke="#1A332F" strokeWidth="1" />
                    <circle cx="40" cy="40" r="10" fill="none" stroke="#1A332F" strokeWidth="1" />
                    <path d="M32,32 L48,48 M48,32 L32,48" stroke="#C9A84C" strokeWidth="0.7" opacity="0.7" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#batik-layanan-hero)" />
        </svg>
    </div>
);

// ============================================================
// Ornament pemisah section
// ============================================================
const SectionDivider = () => (
    <div className="flex items-center justify-center gap-4 my-2">
        <div className="flex-1 h-px max-w-16" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C)' }} />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2.5" fill="#C9A84C" opacity="0.7" />
            <circle cx="8" cy="8" r="5.5" stroke="#C9A84C" strokeWidth="0.8" opacity="0.35" fill="none" />
        </svg>
        <div className="flex-1 h-px max-w-16" style={{ background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
    </div>
);

export default function Layanan({ user }) {
    const [openFaq, setOpenFaq] = useState(null);

    const faqData = [
        {
            q: "Apa itu Larasena?",
            a: "Larasena adalah sebuah platform digital yang memanfaatkan teknologi 3D modelling dan kecerdasan buatan (AI) untuk mendigitalisasi, memodelkan, dan mengoptimalkan produksi batik Nusantara. Kami hadir sebagai jembatan antara pelestarian budaya dan efisiensi industri tekstil lokal."
        },
        {
            q: "Apa masalah utama yang ingin diselesaikan Larasena?",
            a: "Kami fokus mengatasi krisis regenerasi pengrajin batik. Larasena bertujuan menarik generasi muda untuk terlibat melalui teknologi modern yang mudah diakses dan inovatif."
        },
        {
            q: "Bagaimana cara kerja fitur AI Generator Batik?",
            a: "Anda dapat membuat desain batik menggunakan generator AI yang terintegrasi dengan teknologi terkini. Fitur ini memanfaatkan kecerdasan buatan untuk menghasilkan motif batik otomatis berdasarkan parameter atau deskripsi yang Anda tentukan."
        },
        {
            q: "Apakah saya bisa melihat desain saya di produk jadi?",
            a: "Ya. Platform kami dilengkapi fitur 3D Modelling. Setelah Anda selesai mendesain di kanvas, Anda bisa melihat preview desain Anda secara langsung pada model 3D seperti kemeja, kaos, atau gaun."
        },
        {
            q: "Apakah Larasena yang akan mencetak kain batik saya?",
            a: "Tidak secara langsung. Larasena adalah platform untuk perencanaan dan desain produksi. Namun, kami memiliki fitur 'Konveksi Bermitra' yang memungkinkan Anda terhubung dan membuat pesanan produksi langsung ke mitra konveksi terverifikasi."
        },
        {
            q: "Bagaimana cara memulai menggunakan Larasena?",
            a: "Anda cukup mendaftar akun gratis, kemudian dapat langsung mengakses fitur AI Generator untuk membuat desain batik, melihat galeri inspirasi, atau menghubungi konveksi mitra untuk produksi."
        }
    ];

    return (
        <div className="min-h-screen pt-16" style={{ background: 'linear-gradient(180deg, #FBF8F1 0%, #F5F0E8 100%)' }}>
            <Head title="Layanan & Bantuan -">
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
            </Head>

            <style>{`
                * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .serif { font-family: 'Playfair Display', Georgia, serif; }
                .gradient-text {
                    background: linear-gradient(135deg, #1A332F 0%, #2C5E54 45%, #8B6F47 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .hover-glow { transition: box-shadow 0.4s ease; }
                .hover-glow:hover { box-shadow: 0 0 22px rgba(139, 111, 71, 0.15); }
                /* Fade animations */
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fade-up 0.7s ease-out both; }
                .stagger-1 { animation-delay: 0.05s; }
                .stagger-2 { animation-delay: 0.1s; }
                .stagger-3 { animation-delay: 0.15s; }
            `}</style>

            <LarasenaNavbar user={user} />

            {/* ===== HERO SECTION ===== */}
            <section className="relative overflow-hidden pt-12 pb-20" style={{ background: 'linear-gradient(135deg, #FBF8F1 0%, #F0EBE0 60%, #F5F0E8 100%)' }}>
                <BatikPatternHero />

                {/* Soft glow decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(44,94,84,0.06) 0%, transparent 70%)' }} />

                <div className="px-8 md:px-16 lg:px-24 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-xs font-semibold tracking-[0.24em] uppercase mb-4 fade-up stagger-1" style={{ color: '#8B6F47' }}>
                            Pusat Bantuan
                        </p>
                        <h1 className="serif font-bold mb-4 fade-up stagger-2 leading-tight"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#1A332F', letterSpacing: '-0.02em' }}>
                            Layanan & <span className="gradient-text">Informasi</span>
                        </h1>
                        <SectionDivider />
                        <p className="text-base md:text-lg mt-6 mb-8 fade-up stagger-3 max-w-2xl mx-auto"
                            style={{ color: '#6F6358', lineHeight: 1.8 }}>
                            Temukan jawaban untuk pertanyaan umum mengenai Larasena atau hubungi tim kami untuk bantuan lebih lanjut terkait pembuatan motif, produksi, maupun kemitraan.
                        </p>
                    </div>
                </div>

                {/* Wave bottom separator */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '40px' }}>
                    <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-full" style={{ fill: '#FBF8F1' }}>
                        <path d="M0,20 C200,40 400,0 600,20 C800,40 1000,0 1200,20 L1200,40 L0,40 Z" opacity="0.5" />
                        <path d="M0,30 C200,10 400,40 600,30 C800,10 1000,40 1200,30 L1200,40 L0,40 Z" />
                    </svg>
                </div>
            </section>

            <div className="px-8 md:px-16 lg:px-24 py-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* ===== FAQ SECTION ===== */}
                    <div className="lg:col-span-7">
                        <div className="mb-8">
                            <h2 className="serif text-2xl font-bold mb-2" style={{ color: '#1A332F' }}>Pertanyaan yang Sering Diajukan</h2>
                            <p className="text-sm" style={{ color: '#8B6F47' }}>Informasi dasar mengenai platform dan fitur Larasena.</p>
                        </div>

                        <div className="space-y-4">
                            {faqData.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl border transition-all duration-300 hover-glow"
                                    style={{ borderColor: openFaq === index ? '#1A332F' : '#D9CCBF' }}
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="flex justify-between items-center w-full p-6 text-left"
                                    >
                                        <span className="text-base font-semibold" style={{ color: '#1A332F' }}>
                                            {item.q}
                                        </span>
                                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center transition-transform duration-300" style={{ color: '#8B6F47', transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-6 pt-0 leading-relaxed text-sm" style={{ color: '#5A4F3E' }}>
                                            <p>{item.a}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ===== CONTACT US SECTION ===== */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24">
                            <div className="mb-8">
                                <h2 className="serif text-2xl font-bold mb-2" style={{ color: '#1A332F' }}>Hubungi Kami</h2>
                                <p className="text-sm" style={{ color: '#8B6F47' }}>Butuh bantuan lebih lanjut? Tim kami siap membantu.</p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-[#D9CCBF] shadow-sm relative overflow-hidden">
                                {/* Decorative circle */}
                                <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(44,94,84,0.08) 0%, transparent 70%)' }}></div>

                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#E9E0D4] bg-[#F5F0E8]">
                                            <MessageCircle className="w-5 h-5" style={{ color: '#1A332F' }} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1" style={{ color: '#1A332F' }}>WhatsApp Bantuan</h4>
                                            <p className="text-sm mb-2" style={{ color: '#6F6358' }}>Layanan cepat untuk kendala teknis.</p>
                                            <a href="https://wa.me/6285814174267" target="_blank" rel="noopener noreferrer" className="inline-flex font-semibold text-sm hover:underline transition-all" style={{ color: '#8B6F47' }}>
                                                +62 858-1417-4267
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#E9E0D4] bg-[#F5F0E8]">
                                            <Mail className="w-5 h-5" style={{ color: '#1A332F' }} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1" style={{ color: '#1A332F' }}>Email Partnership</h4>
                                            <p className="text-sm mb-2" style={{ color: '#6F6358' }}>Untuk kerjasama konveksi dan bisnis.</p>
                                            <a href="mailto:larasenabatik@gmail.com" className="inline-flex font-semibold text-sm hover:underline transition-all" style={{ color: '#8B6F47' }}>
                                                larasenabatik@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#E9E0D4] bg-[#F5F0E8]">
                                            <MapPin className="w-5 h-5" style={{ color: '#1A332F' }} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1" style={{ color: '#1A332F' }}>Kantor Pusat</h4>
                                            <p className="text-sm leading-relaxed" style={{ color: '#6F6358' }}>
                                                Jl. Veteran No. 19<br />
                                                Kecamatan Purwokerto Selatan, Kabupaten Banyumas<br />
                                                Jawa Tengah 53141
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Extra Info Box */}
                            <div className="mt-6 p-5 rounded-2xl border border-[#D9CCBF] bg-[#FBF8F1] flex gap-3 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#C9A84C' }}></div>
                                <p className="text-xs leading-relaxed" style={{ color: '#6F6358' }}>
                                    Jam operasional layanan pelanggan kami adalah Senin—Jumat, 09:00 - 17:00 WIB. Pertanyaan di luar jam kerja akan dibalas pada hari kerja berikutnya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <LarasenaCTA user={user} dashboardRoute={route('dashboard')} />
                </div>
            </div>

            <LarasenaFooter />
        </div>
    );
}