import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

export default function LarasenaNavbar({ user }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Batikpedia', href: '/galeri-motif' },
    { label: 'Layanan', href: '/layanan' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
        : 'bg-white/50 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img
              src="/images/larasena-icon.svg"
              alt="Larasena Logo"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-serif font-semibold text-gray-900 text-lg tracking-tight lowercase hidden sm:inline">larasena</span>
          </Link>

          {/* Center: Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4E8070] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right: Auth/Dashboard Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-white bg-[#4E8070] rounded-lg hover:bg-[#3F6D5F] transition-colors duration-200"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#4E8070] rounded-lg hover:bg-[#3F6D5F] transition-colors duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
