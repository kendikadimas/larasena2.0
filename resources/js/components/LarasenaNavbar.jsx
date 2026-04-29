import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AuthButtons from '@/components/AuthButtons';

export default function LarasenaNavbar({ user }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="relative w-full py-4 bg-transparent">
        <div className="px-8 md:px-16 lg:px-24 flex justify-between items-center">
          <Link href="/" className="flex-shrink-0 flex items-center transform hover:scale-105 transition-transform duration-300">
            <img
              src="/images/larasena-icon.svg"
              alt="Larasena Logo"
              className="h-12 w-auto"
            />
            <span className="ml-3 font-serif text-lg font-semibold text-[#1A332F] tracking-tight lowercase">larasena</span>
          </Link>

          <AuthButtons user={user} />
        </div>
      </div>

      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-8 px-8 py-3 rounded-3xl bg-white/90 backdrop-blur-lg border border-[#D9CCBF] shadow-lg">
          <Link href="/" className="font-medium transition-all duration-300 relative group text-base text-gray-700 hover:text-[#1A332F]">
            Beranda
            <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#8B6F47]"></span>
          </Link>
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
    </>
  );
}
