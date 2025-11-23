import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import SEO from '@/components/SEO';
import GalleryCTA from '@/components/GalleryCTA';

// Ikon Batik yang lebih detail (Disimpan jika diperlukan di masa depan)
const BatikIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

// Pattern Batik untuk background
const BatikPattern = () => (
  <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="batik-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="#C97540" strokeWidth="2"/>
          <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="#C97540" strokeWidth="1"/>
          <circle cx="50" cy="50" r="15" fill="none" stroke="#C97540" strokeWidth="1"/>
          <path d="M40,40 L60,60 M60,40 L40,60" fill="none" stroke="#C97540" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#batik-pattern)" />
    </svg>
  </div>
);

// Floating Elements untuk animasi
const FloatingElement = ({ delay, children }) => (
  <div 
    className="absolute animate-float"
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </div>
);

// Traditional Ornament untuk dekorasi
const TraditionalOrnament = () => (
  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-3 opacity-25">
    <svg viewBox="0 0 256 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8,6 L24,6 M32,6 L48,6 M56,6 L72,6 M80,6 L96,6 M104,6 L120,6 M128,6 L144,6 M152,6 L168,6 M176,6 L192,6 M200,6 L216,6 M224,6 L240,6 M248,6 L256,6" 
            stroke="#C97540" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="4" cy="6" r="2.5" fill="#C97540"/>
      <circle cx="28" cy="6" r="1.5" fill="#C97540"/>
      <circle cx="52" cy="6" r="2.5" fill="#C97540"/>
      <circle cx="76" cy="6" r="1.5" fill="#C97540"/>
      <circle cx="100" cy="6" r="2.5" fill="#C97540"/>
      <circle cx="124" cy="6" r="1.5" fill="#C97540"/>
      <circle cx="148" cy="6" r="2.5" fill="#C97540"/>
      <circle cx="172" cy="6" r="1.5" fill="#C97540"/>
      <circle cx="196" cy="6" r="2.5" fill="#C97540"/>
      <circle cx="220" cy="6" r="1.5" fill="#C97540"/>
      <circle cx="244" cy="6" r="2.5" fill="#C97540"/>
      <circle cx="252" cy="6" r="1.5" fill="#C97540"/>
    </svg>
  </div>
);

// Canting Traditional Icon (Dihapus dari JSX, tapi komponen disimpan)
const CantingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export default function LandingPage() {
  // --- STATE LAMA KAMU ---
  const [user] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  
  // --- BARU: STATE UNTUK MENU MOBILE ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- BARU: STATE & DATA UNTUK GALERI INTERAKTIF ---
  const galleryItems = [
    { name: "Batik Parang", img: "/images/kategori/parang.jpg" },
    { name: "Batik Kawung", img: "/images/kategori/kawung.jpg" },
    { name: "Mega Mendung", img: "/images/kategori/megamendung.jpg" },
    { name: "Batik Truntum", img: "/images/kategori/truntum.jpg" },
    { name: "Sekar Jagad", img: "/images/kategori/sekarjagad.jpg" },
    { name: "Sido Mukti", img: "/images/kategori/sidomukti.jpg" }, // Motif baru
    { name: "Batik Modern", img: "/images/kategori/modern.jpg" }  // Motif baru
  ];

  // Buat daftar filter dari data galeri + "View More"
  const filterNames = [
    ...galleryItems.map(item => item.name),
    "View More →"
  ];
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  // Set default featured ke tengah array (lebih dinamis)
  const [featuredIndex, setFeaturedIndex] = useState(Math.floor(galleryItems.length / 2)); 

  // --- BARU: FUNGSI HANDLER UNTUK TOMBOL GALERI ---
  const handleNext = () => {
    setFeaturedIndex((prevIndex) => (prevIndex + 1) % galleryItems.length);
  };
  
  const handlePrev = () => {
    setFeaturedIndex((prevIndex) => (prevIndex - 1 + galleryItems.length) % galleryItems.length);
  };
  
  const handleFilterClick = (index) => {
    // Cek jika tombol adalah "View More →"
    if (index >= galleryItems.length) {
      console.log("Tombol View More diklik!"); // (Ganti dengan navigasi)
      return; // Stop eksekusi
    }
    setActiveFilterIndex(index);
    setFeaturedIndex(index); // Ini kuncinya: set gambar di tengah
  };

  // --- useEffect LAMA KAMU ---
  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- useEffect BARU: Mencegah scroll body saat menu mobile terbuka ---
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);


  // --- dashboardRoute LAMA KAMU ---
  const dashboardRoute = user?.role === 'Admin' 
    ? '/admin/dashboard' 
    : user?.role === 'Convection'
    ? '/konveksi/dashboard'
    : '/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden relative">
      {/* Custom CSS untuk animasi */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes gentle-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-gentle-glow {
          animation: gentle-glow 4s ease-in-out infinite;
        }
        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        /* Style untuk Hero */
        .gradient-text { 
          background: linear-gradient(135deg, #8B4513 0%, #C97540 50%, #D2691E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-gradient {
          background: linear-gradient(135deg, #FDF8F3 0%, #FEF5EC 30%, #FDF6F0 70%, #FDF8F3 100%);
          position: relative;
          overflow: hidden;
        }
        .nav-shadow {
          box-shadow: 0 4px 25px rgba(139, 69, 19, 0.12);
        }
        .traditional-border {
          position: relative;
        }
        .traditional-border::before {
          content: '';
          position: absolute;
          top: -1.5px;
          left: -1.5px;
          right: -1.5px;
          bottom: -1.5px;
          background: linear-gradient(45deg, #8B4513, #C97540, #8B4513);
          border-radius: 9999px; /* Disesuaikan dengan rounded-full */
          z-index: -1;
          opacity: 0.2;
        }
        /* Perbaikan: border-radius untuk navbar */
        .traditional-border.rounded-2xl::before {
          border-radius: 1rem; /* 16px */
        }
        .handcrafted-underline {
          background: linear-gradient(90deg, transparent, #C97540, transparent);
          height: 2px;
          width: 100%;
          margin-top: 4px;
        }
        {/* --- PERBAIKAN: CSS digabung & ganti nama biar gak konflik --- */}
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Style khusus untuk Galeri & Section lain di bawah Hero */
        .gallery-gradient-text { 
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* ===== NAVBAR ELEGAN DENGAN LOGO ASLI ===== */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/97 backdrop-blur-md nav-shadow py-3' 
          : 'bg-transparent py-4'
      }`}>
        <div className="px-8 md:px-16 lg:px-24">
          {/* PENYESUAIAN PADDING: px-10 diubah menjadi responsif */}
          <div className={`flex justify-between items-center px-4 sm:px-6 md:px-10 py-2 rounded-2xl transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/90 backdrop-blur-lg border border-amber-100 traditional-border' 
              : 'bg-white/85 backdrop-blur-lg border border-amber-50/30 traditional-border'
          }`}>
            
            {/* Logo dengan gambar asli dari local */}
            <a href="/" className="flex-shrink-0 flex items-center transform hover:scale-105 transition-transform duration-300 group">
              <img 
                src="/images/logolarasena.png" 
                alt="Larasena Logo" 
                className="h-12 w-auto"
              />
            </a>

            {/* Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center gap-10">
              <a href="#tentang" className="text-gray-700 hover:text-amber-700 font-medium transition-all duration-300 relative group text-lg group-hover:-translate-y-0.5 transform transition-transform duration-300">
                Tentang
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <Link href="/galeri-motif" className="text-gray-700 hover:text-amber-700 font-medium transition-all duration-300 relative group text-lg group-hover:-translate-y-0.5 transform transition-transform duration-300">
                Galeri
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <a href="#fitur" className="text-gray-700 hover:text-amber-700 font-medium transition-all duration-300 relative group text-lg group-hover:-translate-y-0.5 transform transition-transform duration-300">
                Fitur
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#mitra" className="text-gray-700 hover:text-amber-700 font-medium transition-all duration-300 relative group text-lg group-hover:-translate-y-0.5 transform transition-transform duration-300">
                Mitra
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#bantuan" className="text-gray-700 hover:text-amber-700 font-medium transition-all duration-300 relative group text-lg group-hover:-translate-y-0.5 transform transition-transform duration-300">
                Bantuan
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* Auth Buttons (Desktop) - TAMBAHKAN hidden md:flex */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <a
                  href={dashboardRoute}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold hover:from-amber-800 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Dashboard
                </a>
              ) : (
                <>
                  <a
                    href="/login"
                    className="px-6 py-3 rounded-xl border-2 border-amber-600 text-amber-600 font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    Masuk
                  </a>
                  <a
                    href="/register"
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold hover:from-amber-800 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Mulai Sekarang
                  </a>
                </>
              )}
            </div>

            {/* ===== BARU: Tombol Hamburger Menu (Mobile) ===== */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-800 hover:text-amber-700 focus:outline-none"
                aria-label="Buka menu"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== BARU: Panel Menu Mobile ===== */}
      <div
        className={`fixed inset-0 z-[60] bg-white transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} 
                    transition-transform duration-300 ease-in-out md:hidden`}
      >
        {/* Header Menu Mobile */}
        <div className="flex justify-between items-center p-8 border-b border-gray-200">
          <a href="/" className="flex items-center">
            <img 
              src="/images/logolarasena.png" 
              alt="Larasena Logo" 
              className="h-10 w-auto"
            />
          </a>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-gray-800 hover:text-amber-700 focus:outline-none"
            aria-label="Tutup menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Konten Menu Mobile */}
        <div className="flex flex-col items-center justify-center h-full space-y-8 -mt-20">
          <a href="#tentang" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-gray-700 hover:text-amber-700 transition-colors">Tentang</a>
          <Link href="/galeri-motif" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-gray-700 hover:text-amber-700 transition-colors">Galeri</Link>
          <a href="#fitur" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-gray-700 hover:text-amber-700 transition-colors">Fitur</a>
          <a href="#mitra" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-gray-700 hover:text-amber-700 transition-colors">Mitra</a>
          <a href="#bantuan" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-gray-700 hover:text-amber-700 transition-colors">Bantuan</a>
          
          {/* Garis pemisah */}
          <div className="border-t border-gray-200 w-3/4 pt-8 mt-8 flex flex-col items-center gap-5">
            {user ? (
              <a
                href={dashboardRoute}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center px-7 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold transition-all duration-300"
              >
                Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-6 py-3 rounded-xl border-2 border-amber-600 text-amber-600 font-semibold transition-all duration-300"
                >
                  Masuk
                </a>
                <a
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-7 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold transition-all duration-300"
                >
                  Mulai Sekarang
                </a>
              </>
            )}
          </div>
        </div>
      </div>


      {/* ===== HERO SECTION YANG LEBIH ORGANIK DAN ALAMI ===== */}
      {/* Padding atas (pt-48) Anda biarkan sesuai asli untuk memberi ruang bagi nav fixed */}
      <header className="relative flex flex-col md:flex-row items-center justify-between flex-1 px-8 md:px-16 lg:px-24 pt-48 pb-24 md:pt-32 md:pb-36 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-20 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5 10-5 10-5-10z M0 30l10 5-10 5-10-5z M60 30l-10 5 10 5 10-5z M30 40l5 10-5 10-5-10z' fill='%23d97706' fill-opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Traditional Ornament */}
        <TraditionalOrnament />
        {/* Floating Elements yang lebih natural */}
        <FloatingElement delay={0}>
          <div className="w-10 h-10 bg-amber-200 rounded-full opacity-40 blur-sm top-24 left-16 animate-gentle-glow"></div>
        </FloatingElement>
        <FloatingElement delay={1.5}>
          <div className="w-16 h-16 bg-amber-300 rounded-full opacity-30 blur-sm top-44 right-24 animate-gentle-glow"></div>
        </FloatingElement>
        <FloatingElement delay={3}>
          <div className="w-8 h-8 bg-amber-400 rounded-full opacity-35 blur-sm bottom-40 left-32 animate-gentle-glow"></div>
        </FloatingElement>
        <FloatingElement delay={4.5}>
          <div className="w-12 h-12 bg-amber-100 rounded-full opacity-25 blur-sm bottom-28 right-16 animate-gentle-glow"></div>
        </FloatingElement>
        {/* Konten Teks Kiri yang lebih natural */}
        <div className={`md:w-1/2 space-y-8 relative z-10 fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/90 backdrop-blur-sm border border-amber-200 text-amber-800 rounded-full text-sm font-medium shadow-lg traditional-border">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span>Platform Batik dengan AI dan Canvas Digital</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-serif">
              <span className="text-gray-800">Wujudkan</span>
              <br />
              <span className="gradient-text">Kreativitas Batik</span>
              <br />
              <span className="text-gray-800">Digital Anda</span>
            </h2>
            
            <div className="handcrafted-underline"></div>
          </div>
          
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
            Larasena menghadirkan platform komprehensif untuk mendesain, memproduksi, dan berkolaborasi dalam ekosistem batik digital. 
            <span className="text-amber-700 font-medium"> Menggabungkan warisan tradisi Nusantara dengan inovasi teknologi modern</span> untuk melestarikan dan mengembangkan seni batik.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 pt-6">
            <a
              href={user ? dashboardRoute : '/register'}
              className="px-9 py-4 bg-gradient-to-r from-amber-700 to-amber-500 text-white text-lg font-semibold rounded-xl hover:from-amber-800 hover:to-amber-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-center traditional-border group flex items-center justify-center"
            >
              <span>{user ? 'Buka Dashboard' : 'Mulai Kreasi Batik'}</span>
            </a>
          </div>
        </div>
        {/* Gambar Hero yang lebih natural */}
        <div className={`md:w-1/2 mt-16 md:mt-0 flex justify-center relative z-10 fade-in-up ${isVisible ? 'visible' : ''}`} style={{transitionDelay: '0.3s'}}>
          <div className="relative">
            {/* Frame dekoratif yang lebih natural */}
            <div className="absolute -inset-6 bg-gradient-to-br from-amber-100 to-amber-50 rounded-3xl opacity-40 blur-md"></div>
            <div className="absolute -inset-3 bg-gradient-to-br from-amber-200 to-amber-100 rounded-2xl opacity-20 blur-sm"></div>
            
            <div className="relative traditional-border rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/larasena-membatik-bg.png" 
                alt="Ilustrasi Larasena membatik digital"
                className="w-full max-w-lg h-auto transform hover:scale-105 transition-transform duration-1000"
              />
            </div>
            
            {/* Floating badges yang lebih natural */}
            <div className="absolute -top-5 -right-5 bg-white rounded-2xl px-5 py-3 shadow-xl border border-amber-200 transform rotate-3 transition-all duration-300 hover:scale-110 hover:rotate-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">AI Canggih</span>
              </div>
            </div>
            
            <div className="absolute -bottom-5 -left-5 bg-gradient-to-r from-amber-700 to-amber-500 text-white rounded-2xl px-5 py-3 shadow-xl transform -rotate-2 transition-all duration-300 hover:scale-110 hover:rotate-0">
              <div className="flex items-center">
                <span className="text-sm font-semibold">Canvas Digital</span>
              </div>
            </div>
          </div>
        </div>
      </header>
 
     {/* ===== KATEGORI POPULER (VERSI GALERI 3D INTERAKTIF) ===== */}
     <section id="galeri" className="py-20 bg-gradient-to-b from-white via-amber-50/30 to-white overflow-hidden">
        {/* Judul Section */}
        <div
          className={`text-center mb-12 px-8 md:px-16 lg:px-24 fade-in-up ${
            isVisible ? "visible" : ""
          }`}
        >
          <p className="text-sm font-semibold text-amber-600 tracking-wider uppercase mb-3">
            GALERI
          </p>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
            {/* PERBAIKAN: Menggunakan .gallery-gradient-text agar tidak konflik */}
            Visual <span className="gallery-gradient-text">Batik</span> Larasena
          </h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Lihat dunia melalui karya, petualangan dalam pola dan desain batik
          </p>
        </div>
        {/* Filter Pills Navigation (INTERAKTIF) */}
        <div
          className={`flex justify-center gap-3 mb-16 px-8 overflow-x-auto hide-scrollbar fade-in-up ${
            isVisible ? "visible" : ""
          }`}
          style={{ transitionDelay: "0.1s" }}
        >
          {/* PERBAIKAN: Menggunakan filterNames, key unik, dan onClick */}
          {filterNames.map(
            (filter, idx) => (
              <button
                key={`${filter}-${idx}`} // Key dibuat unik
                onClick={() => handleFilterClick(idx)} // <-- FUNGSI onClick DITAMBAHKAN
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap
                          transition-all duration-300 flex-shrink-0
                          ${
                            // Logika diganti pakai state
                            idx === activeFilterIndex
                              ? "bg-gray-900 text-white shadow-lg"
                              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-900 hover:text-gray-900"
                          }`}
              >
                {filter}
              </button>
            )
          )}
        </div>
        {/* GALERI 3D CASCADING (INTERAKTIF) */}
        <div className="relative px-8 md:px-16 lg:px-24">
          {/* Container dengan perspective untuk efek 3D */}
          <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
            {/* PERBAIKAN: Menggunakan state 'galleryItems' */}
            {galleryItems.map((category, index) => {
              // Posisi dan transformasi untuk setiap card
              const positions = [
                // Kiri belakang
                { left: "5%", top: "25%", rotate: "-8deg", scale: "0.85", zIndex: 1 },
                // Kiri depan
                { left: "15%", top: "15%", rotate: "-4deg", scale: "0.92", zIndex: 2 },
                // Center (Featured)
                { left: "50%", top: "50%", rotate: "0deg", scale: "1", zIndex: 5, transform: "translate(-50%, -50%)" },
                // Kanan depan
                { right: "15%", top: "15%", rotate: "4deg", scale: "0.92", zIndex: 2 },
                // Kanan belakang
                { right: "5%", top: "25%", rotate: "8deg", scale: "0.85", zIndex: 1 },
              ];
              // --- LOGIKA DINAMIS BARU (untuk 5 posisi) ---
              const len = galleryItems.length;
              // '2' adalah index 'Center' di array positions
              let posIndex = (index - featuredIndex + 2 + len) % len;
              // Sembunyikan item jika di luar jangkauan 5 posisi
              if (posIndex > 4) { 
                posIndex = -1;
              }
              
              const pos = positions[posIndex];
              // Jangan render card yang disembunyikan
              if (!pos) return null; 
              
              const isFeatured = index === featuredIndex;
              // -------------------------
              return (
                <div
                  key={category.name}
                  className={`absolute fade-in-up ${isVisible ? "visible" : ""}`}
                  style={{
                    left: pos.left,
                    right: pos.right,
                    top: pos.top,
                    transform: pos.transform || `rotate(${pos.rotate}) scale(${pos.scale})`,
                    zIndex: pos.zIndex,
                    transition: "all 0.5s ease-out", // Transisi dinamis
                  }}
                >
                  {/* !!! INI PERBAIKAN ERROR UTAMA KAMU !!! */}
                  <a
                    href="#"
className={`block group relative overflow-hidden rounded-2xl
                      transition-all duration-500 ease-out
                      ${
                        isFeatured
                          ? "w-72 md:w-96 shadow-2xl hover:shadow-3xl hover:scale-105"
                          : "w-56 md:w-72 shadow-xl hover:shadow-2xl hover:scale-102"
                      }`}
                  >
                    {/* Gambar */}
                    <img
                      src={category.img}
                      alt={`Motif ${category.name}`}
                      className={`w-full object-cover transition-transform duration-700 ease-out
                                  group-hover:scale-110
                                  ${isFeatured ? "aspect-[3/4]" : "aspect-[3/4]"}`}
                    />
                    {/* Gradient Overlay (Muncul pas hover) */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    {/* Konten Text (Muncul pas hover) */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-6
                                  transform translate-y-8 group-hover:translate-y-0
                                  opacity-0 group-hover:opacity-100
                                  transition-all duration-300 ease-out"
                    >
                      <h4 className="font-bold text-white text-xl md:text-2xl mb-1 drop-shadow-lg">
                        {category.name}
                      </h4>
                    <p className="text-amber-300 font-medium text-sm flex items-center gap-2">
                      View Detail
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </p>
                    </div>
                  
                    {/* Border Batik */}
                    <div className="absolute inset-0 border-4 border-amber-600/20 rounded-2xl pointer-events-none" />
                  </a>
                </div>
              );
            })}
          </div>
          {/* Navigation Arrows (INTERAKTIF) */}
          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={handlePrev} // <-- FUNGSI onClick DITAMBAHKAN
              className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center
                           hover:border-gray-900 hover:bg-gray-900 hover:text-white
                           transition-all duration-300 group"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext} // <-- FUNGSI onClick DITAMBAHKAN
              className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center
                           hover:border-gray-900 hover:bg-gray-900 hover:text-white
                           transition-all duration-300 group"
            >
              <svg
                className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      {/* --- BATAS AKHIR SECTION GALERI --- */}

      {/* ===== CTA GALERI MOTIF ===== */}
      <GalleryCTA user={user} dashboardRoute={dashboardRoute} />


      {/* ===== FITUR UTAMA (VERSI ZIG-ZAG REFINED) ===== */}
<section id="fitur" className="px-8 md:px-16 lg:px-24 py-20 bg-gray-50 relative overflow-hidden">
  {/* Subtle Pattern Background */}
  <div className="absolute inset-0 opacity-30">
    <div className="absolute inset-0" style={{
      backgroundImage: `radial-gradient(circle at 2px 2px, rgb(217, 119, 6, 0.15) 1px, transparent 0)`,
      backgroundSize: '32px 32px'
    }}></div>
  </div>
  
  {/* Judul Section */}
  <div className={`text-center mb-20 md:mb-24 fade-in-up relative z-10 ${isVisible ? 'visible' : ''}`}>
    <p className="text-sm font-semibold text-amber-600 tracking-wider uppercase mb-3">
      FITUR UNGGULAN
    </p>
    <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
      <span className="gallery-gradient-text">Teknologi Canggih</span> untuk Batik Modern
    </h3>
    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
      Dilengkapi dengan AI, platform kami menghadirkan pengalaman mendesain batik yang revolusioner
    </p>
  </div>
  {/* Fitur Cards (Layout Zig-Zag) */}
  <div className="space-y-16 md:space-y-24 relative z-10">
    {[
      {
        title: "Generate Motif dengan AI",
        description: "Cukup deskripsikan motif yang Anda inginkan, AI generator kami akan merekomendasikan desain batik yang seamless dan realistis.",
        img: "/images/fitur/ai.png",
        delay: 0.1,
        stats: { label: "Desain", value: "10,000+" }
      },
      {
        title: "Editor & Kanvas Digital",
        description: "Generator desain batik revolusioner dengan proses yang mudah. Upload inspirasi atau gunakan AI prompt, lihat desain batik Anda dalam preview 3D secara instan.",
        img: "/images/fitur/editor.png",
        delay: 0.2,
        stats: { label: "Tools", value: "50+" }
      },
      {
        title: "3D Modeling & Batik",
        description: "Sistem produksi batik yang komprehensif. Kelola pesanan, pantau progres produksi, koordinasi dengan konveksi, hingga pengiriman dalam satu platform.",
        img: "/images/fitur/3d.png",
        delay: 0.3,
        stats: { label: "Pesanan", value: "5,000+" }
      },
      {
        title: "Jaringan Mitra Konveksi",
        description: "Akses ke jaringan mitra konveksi profesional dan terpercaya. Pilih, hubungkan, dan kelola proyek batik Anda dengan mudah.",
        img: "/images/fitur/mitra.png",
        delay: 0.4,
        stats: { label: "Mitra", value: "200+" }
      }
    ].map((feature, index) => (
      <div 
        key={feature.title}
        className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 fade-in-up ${isVisible ? 'visible' : ''}`}
        style={{transitionDelay: `${feature.delay}s`}}
      >
        
        {/* --- BLOK TEKS --- */}
        <div className={`lg:w-1/2 ${index % 2 !== 0 ? 'lg:order-last' : ''}`}>
          {/* Icon Container - More refined */}
        
          
          <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {feature.title}
          </h4>
          
          <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-6">
            {feature.description}
          </p>
        
          {/* CTA Link */}
          <a href="#" className="inline-flex items-center gap-2 text-amber-600 font-semibold 
                               hover:text-amber-700 hover:gap-3 transition-all duration-300 group">
            Pelajari lebih lanjut
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        {/* --- BLOK GAMBAR --- */}
        <div className="lg:w-1/2 w-full">
          <div className="relative group">
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl 
                          transform group-hover:scale-[1.02] transition-all duration-500">
              <img 
                src={feature.img} 
                alt={feature.title}
                className="w-full h-auto object-cover"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
              {/* Border accent */}
              <div className="absolute inset-0 border-2 border-amber-500/20 rounded-2xl 
                            group-hover:border-amber-500/40 transition-colors duration-300">
              </div>
            </div>
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-100/50 to-amber-50/50 
                          rounded-3xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 
                          transition-opacity duration-500">
            </div>
            {/* Floating Badge - Top Right */}
            <div className="absolute -top-3 -right-3 bg-amber-500 text-white px-4 py-2 
                          rounded-full text-xs font-bold shadow-lg
                          transform group-hover:scale-110 group-hover:rotate-3 
                          transition-all duration-300">
              #{index + 1}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
  {/* Bottom CTA */}
  <div className={`text-center mt-20 fade-in-up relative z-10 ${isVisible ? 'visible' : ''}`}
       style={{transitionDelay: '0.5s'}}>
    <a href="#" className="inline-flex items-center gap-3 bg-gray-900 text-white 
                         px-8 py-4 rounded-full font-semibold text-lg
                         hover:bg-amber-600 hover:shadow-xl hover:scale-105
                         transition-all duration-300 group">
      Jelajahi Semua Fitur
      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </a>
  </div>
</section>
{/* Custom Styles */}
<style jsx>{`
  .gallery-gradient-text {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`}</style>

     {/* ===== MITRA KONVEKSI (VERSI STATIS 2 LOGO) ===== */}
<section id="mitra" className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
  {/* Header (Tidak berubah) */}
  <div className={`text-center mb-12 px-8 md:px-16 lg:px-24 fade-in-up ${isVisible ? 'visible' : ''}`}>
    <p className="text-sm font-semibold text-amber-600 tracking-wider uppercase mb-3">
      TERPERCAYA
    </p>
    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
      Berbagai <span className="gallery-gradient-text"> Mitra </span> Konveksi
    </h3>
    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
      Bergabung dengan jaringan konveksi profesional yang tersebar di seluruh Indonesia
    </p>
  </div>
  
  {/* === PERUBAHAN UTAMA DI SINI === */}
  {/* Logo Container (Menggantikan <div className="relative">) */}
  <div 
    className={`flex justify-center items-center gap-12 md:gap-20 lg:gap-24 px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
    style={{ transitionDelay: '0.1s' }}
  >
    {/* Logo 1 */}
    <img 
      src="/images/mitra/batikantodjamil.jpg" 
      alt="Logo Mitra Batik Antodjamil"
      className="h-20 md:h-24 w-auto object-contain transition-all duration-300 hover:scale-110"
    />
    {/* Logo 2 */}
    <img 
      src="/images/mitra/batikmartadireja.jpg" 
      alt="Logo Mitra Batik Martadireja"
      className="h-20 md:h-24 w-auto object-contain transition-all duration-300 hover:scale-110"
    />
  </div>
</section>

{/* Custom Animations (HANYA CSS YANG DIPERLUKAN) */}
<style jsx>{`
  /* Animasi scroll-right dan scroll-left dihapus karena tidak lagi digunakan */

  .gallery-gradient-text {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`}</style>

{/* ===== TESTIMONI SECTION (VIDEO CENTERED) ===== */}
<section
  id="testimonials"
  className="px-8 md:px-16 lg:px-24 py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
>
  {/* ===== Dekorasi background ===== */}
  <div className="absolute top-1/2 -right-10 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl opacity-60 -z-0 transform -translate-y-1/2"></div>
  <div className="absolute top-1/4 -left-10 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl opacity-50 -z-0"></div>
  {/* ===== FLEX UTAMA ===== */}
  <div
    className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10 fade-in-up ${
      isVisible ? "visible" : ""
    }`}
  >
    {/* === KOLOM KIRI === */}
    <div className="lg:w-6/12 w-full flex flex-col justify-between">
      {/* Judul & Deskripsi */}
      <div>
        <p className="text-sm font-semibold text-amber-600 tracking-wider uppercase mb-3">
          TESTIMONI
        </p>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-serif">
          Dari <span className="gallery-gradient-text">Industri</span> Hingga{" "}
          <span className="gallery-gradient-text">Edukasi</span>
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Dengarkan langsung dari para pelaku industri dan pendidikan yang telah
          merasakan dampak positif Larasena dalam menjembatani tradisi dengan
          teknologi.
        </p>
      </div>
      {/* === QUOTES HORIZONTAL SCROLL === */}
      <div className="relative fade-in-up w-full overflow-hidden">
        {/* Fade Edge */}
  
        {/* Kontainer Quote dengan tinggi tetap */}
        <div className="w-full h-[210px] relative overflow-hidden">
          {(() => {
            const testimonialData = [
              {
                quote:
                  "Setelah kami menggunakan Larasena, sangat seru dalam membuat gambar bantik bisa menggunakan AI. Kami jadi lebih mudah dalam membuat motif batik sesuai imajinasi kami.",
                name: "Thalita, Dina, Tia",
                role: "Siswi Kesenian SMP Persada Sokaraja",
                isKonveksi: true,
              },
              {
                quote:
                  "Dengan adanya Larasena, kami dapat mengembangkan desain batik yang lebih kreatif dan unik terutama pada pembelajaran seni pada siswa siswi kami menjadi lebih interaktif karena adanya AI dan Membatik digital.",
                name: "Mas Rey",
                role: "Guru Kesenian SMP Persada Sokaraja",
                isKonveksi: true,
              },
              {
                quote:
                  "Melalui Larasena, dengan adanya AI, kami dapat mempercepat proses desain batik kami menjadi lebih efisien dan model batik yang dihasilkan juga lebih variatif.",
                name: " Bapak Anto Djamil",
                role: "Owner 'Batik Anto Djamil'",
                isKonveksi: false,
              },
              {
                quote:
                  "Harapanya, dengan Larasena kami dapat lebih mudah dalam mengelola produksi batik kami, serta memperluas jaringan pemasaran kami ke seluruh Indonesia.",
                name: "Bapak Untung",
                role: "Owner 'Batik Martadireja'",
                isKonveksi: false,
              },
              {
                quote:
                  "Akhirnya ada platform yang memikirkan efisiensi dari hulu ke hilir. mulai dari desain 3d modeling hingga produksi semua ada di Larasena.",
                name: "Mba Nabila Rima",
                role: "Tim Desain 'Batik Martadireja'",
                isKonveksi: true,
              },
            ];
            const loopedData = [...testimonialData, ...testimonialData];
            return (
              <div className="flex gap-8 animate-scroll-right hover:pause-animation absolute">
                {loopedData.map((item, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[19rem] md:w-[21rem] bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/70"
                  >
                    <p className="text-gray-700 italic leading-relaxed mb-4 line-clamp-4">
                      "{item.quote}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                        {item.isKonveksi ? (
                          <svg
                            className="w-5 h-5 text-amber-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V10M19 10L12 3L5 10M19 10H5M21 21H3M12 21V14"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 text-amber-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6L3 9m9 5l9-5M3 9v6l9 5"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-amber-600 font-medium">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
    {/* === KOLOM KANAN (VIDEO CENTERED) === */}
    <div className="lg:w-6/12 w-full flex justify-center lg:justify-end items-center">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 backdrop-blur-sm transform hover:scale-[1.02] transition-transform duration-500 max-w-xl w-full"
      >
        <div className="absolute -inset-4 bg-gradient-to-br from-amber-100/50 to-amber-50/50 rounded-3xl blur-2xl -z-10 opacity-75"></div>
        <video
          className="w-full h-auto object-cover rounded-xl"
          controls
          src="video/testi.mp4"
        >
          Browser Anda tidak mendukung tag video.
        </video>
      </div>
    </div>
  </div>
  {/* Animasi Scroll */}
  <style jsx>{`
    @keyframes scroll-right {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    .animate-scroll-right {
      animation: scroll-right 45s linear infinite;
    }
    .hover\:pause-animation:hover {
      animation-play-state: paused;
    }
  `}</style>
</section>
      {/* --- BATAS AKHIR SECTION TESTIMONI --- */}

{/* ===== FAQ SECTION (BERDASARKAN PROPOSAL) ===== */}
<section id="bantuan" className="px-8 md:px-16 lg:px-24 py-20 bg-gradient-to-b from-gray-50 to-amber-50/30 relative overflow-hidden">
  
  {/* Dekorasi background senada tema */}
  <div className="absolute top-0 left-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl opacity-50 -z-0"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-100/20 rounded-full blur-3xl opacity-50 -z-0"></div>
  {/* Header Section */}
  <div className={`text-center mb-16 fade-in-up relative z-10 ${isVisible ? 'visible' : ''}`}>
    <p className="text-sm font-semibold text-amber-600 tracking-wider uppercase mb-3">
      BANTUAN
    </p>
    <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
      Pertanyaan yang <span className="gallery-gradient-text">Sering Diajukan</span>
    </h3>
    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
      Menemukan jawaban yang Anda butuhkan tentang platform Larasena, dari AI hingga produksi.
    </p>
  </div>
  {/* Data FAQ */}
  {(() => {
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
      }
    ];
    return (
      <div className={`max-w-7xl mx-auto space-y-5 relative z-10 fade-in-up ${isVisible ? 'visible' : ''}`} style={{transitionDelay: '0.2s'}}>
        {faqData.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl border border-amber-100/70 overflow-hidden transition-all duration-300"
          >
            
            {/* Tombol Pertanyaan */}
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="flex justify-between items-center w-full p-6 text-left"
            >
              <span className="text-base md:text-lg font-semibold text-gray-900">
                {item.q}
              </span>
              
              {/* Ikon Chevron */}
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
            {/* Area Jawaban */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-screen' : 'max-h-0'}`}
            >
              <div className="p-6 pt-0 prose prose-sm md:prose-base text-gray-600 leading-relaxed">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  })()}
</section>
{/* --- BATAS AKHIR SECTION FAQ --- */}

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
