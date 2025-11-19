import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X, ChevronLeft, ChevronRight, ChevronDown, Home, Palette, ShoppingBag, Package, GraduationCap, Award, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const { url } = usePage();
  const [isOpen, setIsOpen] = useState(false); // For mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // For desktop
  const [expandedGroups, setExpandedGroups] = useState(['batik', 'pelatihan', 'produksi']); // All expanded by default

  const toggleGroup = (groupName) => {
    if (isCollapsed) return; // Don't toggle when sidebar collapsed
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const menuGroups = [
    {
      name: 'batik',
      label: null, // No header for main features
      items: [
        {
          name: 'Batik Saya',
          href: '/dashboard',
          icon: Home,
          activeColor: 'bg-gradient-to-r from-[#BA682A] to-[#D2691E]',
          hoverColor: 'hover:bg-orange-50'
        },
        {
          name: 'Motif',
          href: '/motif',
          icon: Palette,
          activeColor: 'bg-gradient-to-r from-[#BA682A] to-[#D2691E]',
          hoverColor: 'hover:bg-orange-50'
        }
      ]
    },
    {
      name: 'pelatihan',
      label: 'Pelatihan',
      color: 'text-[#dc213e]',
      hoverColor: 'hover:text-[#dc213e]',
      items: [
        {
          name: 'Pelatihan',
          href: '/pelatihan',
          icon: GraduationCap,
          activeColor: 'bg-[#dc213e]',
          hoverColor: 'hover:bg-red-50',
        },
        {
          name: 'Sertifikat',
          href: '/sertifikat',
          icon: Award,
          activeColor: 'bg-[#dc213e]',
          hoverColor: 'hover:bg-red-50'
        }
      ]
    },
    {
      name: 'produksi',
      label: 'Produksi & Layanan',
      color: 'text-[#3B82F6]',
      hoverColor: 'hover:text-[#3B82F6]',
      items: [
        {
          name: 'Galeri',
          href: '/konveksi',
          icon: ShoppingBag,
          activeColor: 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB]',
          hoverColor: 'hover:bg-blue-50'
        },
        {
          name: 'Produksi',
          href: '/produksi',
          icon: Package,
          activeColor: 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB]',
          hoverColor: 'hover:bg-blue-50'
        },
        {
          name: 'Bantuan',
          href: '/bantuan',
          icon: HelpCircle,
          activeColor: 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB]',
          hoverColor: 'hover:bg-blue-50'
        }
      ]
    }
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
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {menuGroups.map((group) => {
            // Groups without labels are always expanded (main features)
            const isExpanded = !group.label || expandedGroups.includes(group.name) || isCollapsed;
            const hasActiveItem = group.items.some(item => url.startsWith(item.href));
            
            return (
              <div key={group.name} className="space-y-1">
                {/* Group Header - Only show if label exists */}
                {!isCollapsed && group.label && (
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      isExpanded && hasActiveItem
                        ? group.color || 'text-gray-700'
                        : `text-gray-500 ${group.hoverColor || 'hover:text-gray-700'}`
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}

                {/* Divider - Only show before groups with labels in collapsed mode */}
                {isCollapsed && group.label && (
                  <div className="border-t border-gray-200 my-2" />
                )}

                {/* Group Items */}
                {isExpanded && (
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = url.startsWith(item.href) && item.href !== '#';
                      const Icon = item.icon;
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center gap-3 rounded-xl font-medium transition-all duration-200 group relative
                            ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                            ${
                            isActive
                              ? `${item.activeColor} text-white shadow-lg scale-105`
                              : `text-gray-600 ${item.hoverColor} hover:text-gray-900`
                          }`}
                          onClick={() => setIsOpen(false)}
                          title={isCollapsed ? item.name : ''}
                        >
                          <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : ''}`} />
                          
                          <span className={`text-sm font-medium transition-all duration-300 ${
                            isCollapsed ? 'md:hidden' : 'md:inline'
                          }`}>
                            {item.name}
                          </span>
                          
                          {/* Badge for new features */}
                          {item.badge && !isCollapsed && (
                            <span className={`ml-auto ${item.badgeColor} text-white text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse`}>
                              {item.badge}
                            </span>
                          )}
                          
                          {/* Tooltip for collapsed state */}
                          {isCollapsed && (
                            <div className="hidden md:group-hover:block absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-[70] pointer-events-none">
                              {item.name}
                              {item.badge && (
                                <span className={`ml-2 ${item.badgeColor} px-2 py-0.5 rounded-full text-xs`}>
                                  {item.badge}
                                </span>
                              )}
                              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
