import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const { url } = usePage();
  const [isOpen, setIsOpen] = useState(false); // For mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // For desktop

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
        className={`fixed md:static top-0 left-0 z-[50] bg-white border-r h-full flex flex-col shadow-lg transition-all duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 
        ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64`}
      >
        {/* Logo Section - Hidden on mobile (logo is in header), shown on desktop */}
        <div className={`hidden md:flex px-6 pt-3 items-center h-24 border-b border-gray-100 transition-all duration-300 ${
          isCollapsed ? 'justify-center px-2' : 'w-64'
        }`}>
          {isCollapsed ? (
            <img
              src="/images/LARASENA.png"
              alt="Larasena Logo"
              className="object-contain h-12 w-12"
            />
          ) : (
            <img
              src="/images/LARASENA.png"
              alt="Larasena Logo"
              className="object-contain h-46 hover:transform hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        
        {/* Desktop Toggle Button - Fixed position */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-[50%] -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors z-[9999]"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
        
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
                className={`flex items-center gap-3 rounded-lg font-medium transition-all duration-200 group relative
                  ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                  ${
                  isActive
                    ? 'bg-[#BA682A] text-white shadow-md'
                    : 'text-gray-500 hover:bg-[#BA682A1A] hover:text-[#BA682A]'
                }`}
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? item.name : ''}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-5 h-5 object-contain flex-shrink-0"
                />
                <span className={`text-sm transition-all duration-300 ${
                  isCollapsed ? 'md:hidden' : 'md:inline'
                }`}>
                  {item.name}
                </span>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="hidden md:group-hover:block absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-[70] pointer-events-none">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
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
