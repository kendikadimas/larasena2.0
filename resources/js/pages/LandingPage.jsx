import { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
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
          <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="#8B6F47" strokeWidth="2" />
          <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="#8B6F47" strokeWidth="1" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="#8B6F47" strokeWidth="1" />
          <path d="M40,40 L60,60 M60,40 L40,60" fill="none" stroke="#8B6F47" strokeWidth="1" />
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
        stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4" cy="6" r="2.5" fill="#C9A84C" />
      <circle cx="28" cy="6" r="1.5" fill="#C9A84C" />
      <circle cx="52" cy="6" r="2.5" fill="#C9A84C" />
      <circle cx="76" cy="6" r="1.5" fill="#C9A84C" />
      <circle cx="100" cy="6" r="2.5" fill="#C9A84C" />
      <circle cx="124" cy="6" r="1.5" fill="#C9A84C" />
      <circle cx="148" cy="6" r="2.5" fill="#C9A84C" />
      <circle cx="172" cy="6" r="1.5" fill="#C9A84C" />
      <circle cx="196" cy="6" r="2.5" fill="#C9A84C" />
      <circle cx="220" cy="6" r="1.5" fill="#C9A84C" />
      <circle cx="244" cy="6" r="2.5" fill="#C9A84C" />
      <circle cx="252" cy="6" r="1.5" fill="#C9A84C" />
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
  const [openFaq, setOpenFaq] = useState(null);  // --- BARU: STATE & DATA UNTUK GALERI INTERAKTIF ---
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
  // --- dashboardRoute LAMA KAMU ---
  const dashboardRoute = user?.role === 'Admin'
    ? '/admin/dashboard'
    : user?.role === 'Convection'
      ? '/konveksi/dashboard'
      : '/dashboard';

  return (

    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden relative">
      <Head title="larasena - Desain Batik Online & Kolaborasi Kreatif" />
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
          background: linear-gradient(135deg, #1A332F 0%, #2C5E54 45%, #8B6F47 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-gradient {
          background: linear-gradient(135deg, #FBF8F1 0%, #F5F0E8 35%, #F8F4EE 70%, #FBF8F1 100%);
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
          background: linear-gradient(45deg, #8B6F47, #C9A84C, #8B6F47);
          border-radius: 9999px; /* Disesuaikan dengan rounded-full */
          z-index: -1;
          opacity: 0.2;
        }
        /* Perbaikan: border-radius untuk navbar */
        .traditional-border.rounded-2xl::before {
          border-radius: 1rem; /* 16px */
        }
        .handcrafted-underline {
          background: linear-gradient(90deg, transparent, #8B6F47, transparent);
          height: 2px;
          width: 100%;
          margin-top: 4px;
        }
        /* --- PERBAIKAN: CSS digabung & ganti nama biar gak konflik --- */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Style khusus untuk Galeri & Section lain di bawah Hero */
        .gallery-gradient-text { 
          background: linear-gradient(135deg, #1A332F 0%, #2C5E54 45%, #8B6F47 100%);
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
        /* ===== SMOOTH & ELEGANT ANIMATIONS ===== */
        @keyframes subtle-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.02); }
        }
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes soft-rotate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.5deg); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes scale-in-fade {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes gentle-rise {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* Animation Classes */
        .animate-subtle-pulse {
          animation: subtle-pulse 4s ease-in-out infinite;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-soft-rotate {
          animation: soft-rotate 6s ease-in-out infinite;
        }
        .animate-scale-in-fade {
          animation: scale-in-fade 0.6s ease-out;
        }
        .animate-gentle-rise {
          animation: gentle-rise 0.7s ease-out;
        }
        /* Staggered animations */
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        /* Smooth Hover Effects */
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(26, 51, 47, 0.12);
        }
        /* Soft Border Glow on Hover */
        .hover-glow {
          transition: box-shadow 0.4s ease;
        }
        .hover-glow:hover {
          box-shadow: 0 0 20px rgba(139, 111, 71, 0.25);
        }
        /* Text animation */
        .text-shimmer {
          background: linear-gradient(
            90deg,
            #1A332F 0%,
            #2C5E54 25%,
            #1A332F 50%,
            #2C5E54 75%,
            #1A332F 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* ===== NAVBAR ELEGAN DENGAN LOGO ASLI ===== */}
      {/* Logo & Auth Button - Not Fixed (Scrolls Away) */}
      <div className="relative w-full py-4 bg-transparent">
        <div className="px-8 md:px-16 lg:px-24 flex justify-between items-center">
          <a href="/" className="flex-shrink-0 flex items-center transform hover:scale-105 transition-transform duration-300">
            <img
              src="/images/larasena-icon.svg"
              alt="Larasena Logo"
              className="h-12 w-auto"
            />
            <span className="ml-3 font-serif text-lg font-semibold text-[#1A332F] tracking-tight lowercase">larasena</span>
          </a>

          {/* Auth Button - Desktop & Mobile (Scrolls Away) */}
          <div className="flex items-center gap-3">
            {user ? (
              <a
                href={dashboardRoute}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1A332F] to-[#2C5E54] text-white font-semibold hover:from-[#0F2420] hover:to-[#1A4A3F] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-4 py-2 md:px-6 md:py-2.5 rounded-xl border-2 border-[#8B6F47] text-[#8B6F47] font-semibold hover:bg-[#F5F0E8] transition-all duration-300"
                >
                  Masuk
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 md:px-6 md:py-2.5 rounded-xl bg-gradient-to-r from-[#1A332F] to-[#2C5E54] text-white font-semibold hover:from-[#0F2420] hover:to-[#1A4A3F] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Daftar
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu - Fixed (Muncul saat scroll) */}
      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
        }`}>
        <div className="flex items-center gap-8 px-8 py-3 rounded-3xl bg-white/90 backdrop-blur-lg border border-[#D9CCBF] shadow-lg">
          <a href="#hero" className="font-medium transition-all duration-300 relative group text-base text-gray-700 hover:text-[#1A332F]">
            Beranda
            <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#8B6F47]"></span>
          </a>
          <Link href="/galeri-motif" className="font-medium transition-all duration-300 relative group text-base text-gray-700 hover:text-[#1A332F]">
            Batikpedia
            <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#8B6F47]"></span>
          </Link>
          <Link href="/layanan" className="font-medium transition-all duration-300 relative group text-base text-gray-700 hover:text-[#1A332F]">
            Layanan
            <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#8B6F47]"></span>
          </Link>
        </div>
      </nav>


     <header
  id="hero"
  className="relative flex items-center overflow-hidden"
  style={{
    background: 'linear-gradient(135deg, #FBF8F1 0%, #F5F0E8 100%)',
    minHeight: '560px'
  }}
>
  {/* CONTENT WRAPPER */}
  <div className="w-full flex flex-col md:flex-row items-center justify-between">
    
    {/* TEXT LEFT */}
    <div className={`w-full md:w-[45%] pl-8 md:pl-16 lg:pl-24 pr-6 space-y-6 relative z-10 fade-in-up ${isVisible ? 'visible' : ''}`}>
      
      <h1
        className="font-serif leading-tight"
        style={{
          fontSize: 'clamp(2rem, 3.8vw, 3.5rem)',
          fontWeight: 600,
          color: '#1C3A35',
          letterSpacing: '-0.02em'
        }}
      >
        Design Your Batik,
        <br />
        Preserve the Culture
      </h1>

      <p
        style={{
          color: '#5A4F3E',
          fontSize: '0.95rem',
          lineHeight: 1.8,
          maxWidth: '360px'
        }}
      >
        Larasena is a creative platform to design, customize, and share your own batik patterns with the world.
      </p>

      {/* CTA */}
      <div className="flex items-center gap-5 pt-2">
        
        <a
          href={user ? dashboardRoute : '/register'}
          className="inline-flex items-center gap-2 font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          style={{
            background: '#1A332F',
            color: '#fff',
            padding: '14px 30px',
            borderRadius: '50px',
            fontSize: '0.9rem'
          }}
        >
          Start Designing
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/galeri-motif"
          className="inline-flex items-center gap-3 font-medium transition-all duration-300 hover:gap-4 group"
          style={{ color: '#1A332F', fontSize: '0.9rem' }}
        >
          Explore Gallery
          <div className="w-8 h-8 rounded-full border border-[#1A332F] flex items-center justify-center group-hover:bg-[#1A332F]/5 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>

      </div>
    </div>

    {/* IMAGE RIGHT */}
    <div
      className={`hidden md:block absolute top-0 right-0 h-full w-[60%] z-0 pointer-events-none fade-in-up ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: '0.2s' }}
    >
      <img
        src="/images/hero-section.webp"
        alt="Batik Illustration"
        className="w-full h-full object-cover object-[70%_center]"
        style={{
          WebkitMaskImage: 'linear-gradient(to left, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to left, black 85%, transparent 100%)'
        }}
      />
    </div>

  </div>
</header>

      {/* ===== GALLERY SECTION ===== */}
      <section id="galeri" className="py-20 md:py-24 bg-gradient-to-b from-[#FBF8F1] via-white to-[#F8F4EE] overflow-hidden">
        <div className={`px-8 md:px-16 lg:px-24 fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.24em] uppercase mb-3" style={{ color: '#8B6F47' }}>
                Gallery
              </p>
              <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#1A332F', letterSpacing: '-0.02em' }}>
                Explore Beautiful <span className="gallery-gradient-text">Creations</span>
              </h3>
              <p className="text-base md:text-lg max-w-xl" style={{ color: '#6F6358', lineHeight: 1.7 }}>
                A softer showcase of batik motifs where traditional patterns meet a calm, modern digital presentation.
              </p>
            </div>
            <Link href="/galeri-motif" className="inline-flex items-center gap-3 font-medium transition-transform duration-300 hover:scale-105 group whitespace-nowrap" style={{ color: '#1A332F' }}>
              View All Gallery
              <span className="w-9 h-9 rounded-full border border-[#D9CCBF] flex items-center justify-center group-hover:border-[#1A332F] transition-colors bg-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-4">
            {galleryItems.slice(0, 5).map((item, idx) => (
              <a
                key={item.name}
                href="#"
                className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 border border-[#E9E0D4]/40 rounded-xl">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark Overlay dengan gradient - muncul saat hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A332F]/75 via-[#1A332F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  
                  {/* Favorite Button - always visible */}
                  <button
                    type="button"
                    aria-label={`Favorite ${item.name}`}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-[#F5F0E8]/90 backdrop-blur-sm flex items-center justify-center text-[#1A332F] shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#FBF8F1]"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z" />
                    </svg>
                  </button>
                  
                  {/* Info Section - hanya muncul saat hover */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h4 className="font-serif text-sm md:text-base font-bold text-center text-white px-3">
                      {item.name}
                    </h4>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CARA KERJA LARASENA — 4 STEPS dengan ilustrasi ===== */}
      <section id="cara-kerja" className="py-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #F8F4EE 0%, #F2EBE0 100%)' }}>
        {/* Subtle dot pattern — menyatu dengan cream bg */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(180,130,80,0.08) 1.5px, transparent 0)',
          backgroundSize: '28px 28px'
        }} />

        <div className={`text-center px-8 md:px-16 lg:px-24 fade-in-up relative z-10 ${isVisible ? 'visible' : ''}`}>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1C3A35' }}>
            Ciptakan Batikmu Sendiri
          </h2>
          <div style={{ height: '2px', width: '50px', background: 'linear-gradient(90deg, #C9A84C, rgba(201,168,76,0.15))', margin: '0 auto 12px' }} />
          <p className="text-base max-w-md mx-auto" style={{ color: '#6B5E50', lineHeight: 1.7 }}>
            Dari ide menjadi mahakarya hanya dalam beberapa langkah mudah.
          </p>
        </div>

        {/* Steps — transparent, ilustrasi blend ke cream */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 px-8 md:px-16 lg:px-24 relative z-10">
          {[
            { n: 1, img: '/images/idea.png', title: 'Mulai Ideamu', desc: 'Sketsa konsep atau tulis deskripsi, AI kami akan membantu menemukan arahnya.' },
            { n: 2, img: '/images/create.png', title: 'Buat Motifmu', desc: 'Gunakan tool kami untuk membuat motif di atas kanvas digital.' },
            { n: 3, img: '/images/customize.png', title: 'Sesuaikan Detail', desc: 'Eksplorasi warna dan variasi hingga setiap detail terasa sempurna.' },
            { n: 4, img: '/images/save&share.png', title: 'Simpan & Bagikan', desc: 'Unduh karya finalmu dan hubungkan dengan mitra konveksi kami.' },
          ].map((step, i) => (
            <div
              key={step.n}
              className={`fade-in-up ${isVisible ? 'visible' : ''} relative flex flex-col items-center text-center px-4 lg:px-6`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Illustration — mix-blend-mode multiply agar bg putih aset hilang */}
              <div className="w-36 h-36 md:w-44 md:h-44 flex items-center justify-center mb-3">
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>

              {/* Step circle number */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: '#1C3A35' }}>
                  {step.n}
                </div>
                {/* Connecting line — hidden on mobile, visible on lg+ */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-[5.5rem] left-[calc(50%+72px)] right-[calc(-50%+72px)] h-px"
                    style={{ background: 'linear-gradient(90deg, rgba(28,58,53,0.3), rgba(201,168,76,0.4), rgba(28,58,53,0.3))' }} />
                )}
              </div>

              <h3 className="font-serif font-semibold text-base md:text-lg mb-1.5" style={{ color: '#1C3A35' }}>{step.title}</h3>
              <p className="text-sm leading-relaxed max-w-[180px]" style={{ color: '#7A6E62' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* ===== OUR CLIENTS & PARTNERS SECTION ===== */}
      <section id="clients-partners" className="py-24 bg-gradient-to-b from-white via-[#F8F4EE] to-[#F5F0E8] overflow-hidden">
        <div className={`text-center mb-16 px-8 md:px-16 lg:px-24 fade-in-up ${isVisible ? 'visible' : ''}`}>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase mb-3" style={{ color: '#8B6F47' }}>
            Dipercaya Oleh
          </p>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 font-serif" style={{ color: '#1A332F', letterSpacing: '-0.02em' }}>
            Institusi Pendidikan & <span className="gallery-gradient-text">Mitra Bisnis</span>
          </h3>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#6F6358', lineHeight: 1.7 }}>
            Dipercaya oleh institusi pendidikan terkemuka dan mitra pengrajin profesional di seluruh Indonesia untuk mengembangkan inovasi batik digital.
          </p>
        </div>

        <div className="px-8 md:px-16 lg:px-24 space-y-16">
          {/* Institutional Partners */}
          <div>
            <h4 className="text-center font-serif text-lg font-semibold" style={{ color: '#1C3A35' }}>Institusi Pendidikan</h4>
            <div className="space-y-8">
              {/* Baris 1 */}
              <div
                className={`flex justify-center items-center gap-8 md:gap-12 lg:gap-16 fade-in-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: '0.1s' }}
              >
                <img
                  src="/images/instansi/kemenbud-removebg-preview.png"
                  alt="Kemendikbud"
                  className="h-20 md:h-24 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-110"
                />
                <img
                  src="/images/instansi/Belmawa Bersinergi.png"
                  alt="Belmawa Bersinergi"
                  className="h-24 md:h-48 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-110"
                />
                <img
                  src="/images/instansi/Diksaintek Berdampak.png"
                  alt="Diksaintek Berdampak"
                  className="h-16 md:h-20 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-110"
                />
              </div>

              {/* Baris 2 */}
              <div
                className={`flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 fade-in-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: '0.2s' }}
              >
                <img
                  src="/images/instansi/Kemendiktisaintek.png"
                  alt="Kemendikti Saintek"
                  className="h-16 md:h-20 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-110"
                />
                <img
                  src="/images/instansi/Logo-Resmi-Unsoed.png"
                  alt="Unsoed"
                  className="h-16 md:h-20 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-110"
                />
                <img
                  src="/images/instansi/Gemastik18-removebg-preview.png"
                  alt="Gemastik 18"
                  className="h-16 md:h-28 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-110"
                />
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="flex justify-center">
            <div style={{ height: '1px', width: '80px', background: 'linear-gradient(90deg, transparent, #8B6F47, transparent)' }} />
          </div>

          {/* Business Partners */}
          <div>
            <h4 className="text-center font-serif text-lg font-semibold mb-10" style={{ color: '#1C3A35' }}>Mitra Pengrajin</h4>
            <div
              className={`flex justify-center items-center gap-12 md:gap-20 lg:gap-32 fade-in-up ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: '0.3s' }}
            >
              <img
                src="/images/mitra/batikantodjamil.jpg"
                alt="Logo Mitra Batik Antodjamil"
                className="h-20 md:h-24 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-110"
              />
              <img
                src="/images/mitra/batikmartadireja.jpg"
                alt="Logo Mitra Batik Martadireja"
                className="h-20 md:h-24 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Custom Animations (HANYA CSS YANG DIPERLUKAN) */}
      <style jsx>{`
  /* Animasi scroll-right dan scroll-left dihapus karena tidak lagi digunakan */

  .gallery-gradient-text {
    background: linear-gradient(135deg, #1A332F 0%, #2C5E54 45%, #8B6F47 100%);
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
        <div className="absolute top-1/2 -right-10 w-96 h-96 rounded-full blur-3xl opacity-40 -z-0 transform -translate-y-1/2" style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.15), transparent)' }}></div>
        <div className="absolute top-1/4 -left-10 w-80 h-80 rounded-full blur-3xl opacity-30 -z-0" style={{ background: 'radial-gradient(ellipse, rgba(139,111,71,0.1), transparent)' }}></div>
        {/* ===== FLEX UTAMA ===== */}
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10 fade-in-up ${isVisible ? "visible" : ""
            }`}
        >
          {/* === KOLOM KIRI === */}
          <div className="lg:w-6/12 w-full flex flex-col justify-between">
            {/* Judul & Deskripsi */}
            <div>
              <p className="text-sm font-semibold tracking-wider uppercase mb-3" style={{ color: '#8B6F47' }}>
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
              <div className="w-full h-[240px] relative overflow-hidden">
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
                          className="flex-shrink-0 w-[19rem] md:w-[21rem] bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-[#D9CCBF]/50"
                        >
                          <p className="text-gray-700 italic leading-relaxed mb-4 line-clamp-4">
                            "{item.quote}"
                          </p>
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#F5F0E8] flex items-center justify-center mr-3 flex-shrink-0">
                              {item.isKonveksi ? (
                                <svg
                                  className="w-5 h-5 text-[#8B6F47]"
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
                                  className="w-6 h-6 text-[#8B6F47]"
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
                              <p className="text-sm text-[#8B6F47] font-medium">
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
              <div className="absolute -inset-4 bg-gradient-to-br from-[#F5F0E8]/50 to-[#FBF8F1]/50 rounded-3xl blur-2xl -z-10 opacity-75"></div>
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

     <section
  className="relative w-full flex items-center overflow-hidden"
  style={{
    minHeight: '340px',
    backgroundImage: `
      linear-gradient(to right, rgba(10,35,32,0.65) 0%, rgba(10,35,32,0.3) 35%, rgba(10,35,32,0) 60%),
      url('/images/cta-section.webp')
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'right center',
    backgroundRepeat: 'no-repeat'
  }}
>
  {/* CONTENT */}
  <div className={`relative z-10 w-full px-6 md:px-12 lg:px-20 py-12 fade-in-up ${isVisible ? 'visible' : ''}`}>
    
    <div className="md:w-[42%]">
      
      {/* HEADING */}
      <h2 className="font-serif text-2xl md:text-[2.4rem] font-semibold text-white leading-tight mb-3">
        Ready to Bring Your<br />
        Batik Ideas to Life?
      </h2>

      {/* DESC */}
      <p className="text-sm md:text-[0.95rem] mb-6 max-w-sm text-white/80 leading-relaxed">
        Join Larasena and start your creative journey today.
      </p>

      {/* BUTTON */}
      <a
        href={user ? dashboardRoute : '/register'}
        className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:translate-x-1"
        style={{
          background: '#D4A63F',
          color: '#fff',
          padding: '12px 26px',
          borderRadius: '999px'
        }}
      >
        Start Designing Now
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </a>

    </div>
  </div>
</section>


      {/* ===== FOOTER ===== */}
      <footer className="relative overflow-hidden text-gray-800 px-8 md:px-16 lg:px-24 py-16"
        style={{ background: 'white' }}>

        
        {/* footer-section.png — ilustrasi daun di pojok kanan bawah */}
        <div className="absolute bottom-0 right-0 w-56 md:w-72 pointer-events-none select-none" style={{ zIndex: 1, opacity: 0.65 }}>
          <img src="/images/footer-section.png" alt="" className="w-full h-auto object-contain"
            style={{ transform: 'translateX(10%) translateY(15%)' }} />
        </div>

        {/* Grid konten footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative" style={{ zIndex: 2 }}>
          {/* Brand */}
          <div>
            <a href="/" className="flex-shrink-0 flex items-center mb-5 hover:opacity-80 transition-opacity">
              <img src="/images/larasena-icon.svg" alt="Larasena Logo" className="h-11 w-auto" />
              <span className="ml-3 font-serif text-sm font-semibold text-[#1C3A35] tracking-tight lowercase">larasena</span>
            </a>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#7A6E62' }}>
              Platform digital terdepan untuk mendesain dan memproduksi batik dengan teknologi modern, melestarikan warisan budaya Indonesia.
            </p>
          </div>

          {/* Link Sections */}
          {[
            { title: "Fitur", links: ["Generate Batik AI", "Canvas Digital", "3D Model Batik", "Mitra Konveksi"] },
            { title: "Perusahaan", links: ["Tentang Kami", "Galeri", "Fitur", "Mitra"] },
            { title: "Dukungan", links: ["Bantuan", "Dokumentasi", "Privasi", "Syarat Layanan"] }
          ].map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-sm tracking-wider uppercase mb-4" style={{ color: '#1C3A35', letterSpacing: '0.08em' }}>{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm transition-colors duration-200 hover:text-[#1A332F]" style={{ color: '#7A6E62' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="relative pt-6" style={{ zIndex: 2, borderTop: '1px solid rgba(201,168,76,0.25)' }}>
          <p className="text-sm" style={{ color: '#9A8E82' }}>
            © {new Date().getFullYear()} <span className="font-semibold" style={{ color: '#1C3A35' }}>Larasena</span> — Teknologi Batik dengan Tradisi
          </p>
        </div>
      </footer>
    </div>
  );
}