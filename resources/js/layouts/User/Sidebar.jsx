import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
  const { url } = usePage();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: 'Batik Saya',
      href: '/dashboard',
      icon: url === '/dashboard'
        ? '/images/sideicon/home-active.svg'
        : '/images/sideicon/home.png',
    },
    {
      name: 'Motif',
      href: '/motif',
      icon: url === '/motif'
        ? '/images/sideicon/motif-active.svg'
        : '/images/sideicon/motif.svg',
    },
    {
      name: 'Konveksi',
      href: '/konveksi',
      icon: url.startsWith('/konveksi')
        ? '/images/sideicon/konveksi-active.svg'
        : '/images/sideicon/konveksi.png',
    },
    {
      name: 'Produksi',
      href: '/produksi',
      icon: url.startsWith('/produksi')
        ? '/images/sideicon/produksi-active.svg'
        : '/images/sideicon/produksi.png',
    },
    {
      name: 'Bantuan',
      href: '/bantuan',
      icon: url === '/bantuan'
        ? '/images/sideicon/bantuan-active.svg'
        : '/images/sideicon/bantuan.png',
    },
  ];

  return (
    <>
      {/* Mobile Header - Fixed at top with highest z-index */}
      <div className="md:hidden flex justify-between items-center bg-white border-b px-4 py-3 shadow-md fixed top-0 left-0 right-0 z-[60]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <img
            src="/images/LARASENA.png"
            alt="Larasena Logo"
            className="h-12 object-contain"
          />
        </div>
      </div>

      {/* Sidebar - Slides from left, below mobile header */}
      <aside
        className={`fixed md:static top-0 left-0 z-[50] bg-white border-r h-full flex flex-col shadow-lg transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}
      >
        {/* Logo Section - Hidden on mobile (logo is in header), shown on desktop */}
        <div className="hidden md:flex px-6 pt-3 items-center h-24 w-64 border-b border-gray-100">
          <img
            src="/images/LARASENA.png"
            alt="Larasena Logo"
            className="object-contain h-46 hover:transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Mobile: Add padding-top to account for mobile header */}
        <div className="md:hidden h-16" />

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = url.startsWith(item.href) && item.href !== '#';
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#BA682A] text-white shadow-md'
                    : 'text-gray-500 hover:bg-[#BA682A1A] hover:text-[#BA682A]'
                }`}
                onClick={() => setIsOpen(false)} 
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-5 h-5 object-contain"
                />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay - Behind sidebar but above content */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
