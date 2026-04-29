import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X, ChevronLeft, ChevronRight, ChevronDown, Home, ImagePlus, Landmark, Store, Package, GraduationCap, Award, HelpCircle, MoreHorizontal, LogOut, User } from 'lucide-react';

// Wrapper untuk Lucide React icons yang menerima props isActive/isMobile tanpa meneruskannya ke DOM
const IconWrapper = ({ icon: IconComponent, isActive, isMobile, className, ...props }) => {
  // Remove isActive and isMobile from props that would be passed to DOM
  const { isActive: _, isMobile: __, ...domProps } = props;
  return <IconComponent className={className} {...domProps} />;
};

// Custom SVG Icon components - Define before use
const NyantingIcon = ({ isActive = false, isMobile = false, className, ...props }) => {
  // Remove isActive, isMobile from props that would be passed to DOM
  const { isActive: _, isMobile: __, ...domProps } = props;
  return (
    <img 
      src="/images/sideicon/nyanting-icon.svg" 
      alt="Nyanting" 
      className={className || "w-5 h-5"}
      style={{ 
        filter: isActive && isMobile 
          ? 'brightness(0) saturate(100%) invert(42%) sepia(54%) saturate(862%) hue-rotate(358deg) brightness(93%) contrast(90%)' 
          : 'none' 
      }}
      {...domProps}
    />
  );
};

const SanggarIcon = ({ isActive = false, isMobile = false, className, ...props }) => {
  // Remove isActive, isMobile from props that would be passed to DOM
  const { isActive: _, isMobile: __, ...domProps } = props;
  return (
    <img 
      src="/images/sideicon/sanggar-icon.svg" 
      alt="Sanggar" 
      className={className || "w-5 h-5"}
      style={{ 
        filter: isActive && isMobile 
          ? 'brightness(0) saturate(100%) invert(42%) sepia(54%) saturate(862%) hue-rotate(358deg) brightness(93%) contrast(90%)' 
          : 'none' 
      }}
      {...domProps}
    />
  );
};

const BatikpediaIcon = ({ isActive = false, isMobile = false, className, ...props }) => {
  // Remove isActive, isMobile from props that would be passed to DOM
  const { isActive: _, isMobile: __, ...domProps } = props;
  return (
    <img 
      src="/images/sideicon/batikpedia-icon.svg" 
      alt="Batikpedia" 
      className={className || "w-5 h-5"}
      style={{ 
        filter: isActive && isMobile 
          ? 'brightness(0) saturate(100%) invert(42%) sepia(54%) saturate(862%) hue-rotate(358deg) brightness(93%) contrast(90%)' 
          : 'none' 
      }}
      {...domProps}
    />
  );
};

const SHOW_TRAINING_FEATURE = false;

export default function Sidebar() {
  const { url, props } = usePage();
  const subscription = props.subscription;
  const [isOpen, setIsOpen] = useState(false); // For mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // For desktop
  const [expandedGroups, setExpandedGroups] = useState(
    SHOW_TRAINING_FEATURE ? ['batik', 'pelatihan', 'produksi'] : ['batik', 'produksi']
  ); // All expanded by default
  const [showMoreMenu, setShowMoreMenu] = useState(false); // For "Lainnya" bottom sheet

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
          name: 'Nyanting',
          href: '/dashboard',
          icon: NyantingIcon,
          activeColor: 'bg-[#F5F0E8] border border-[#D9CCBF] text-gray-900',
          hoverColor: 'hover:bg-orange-50'
        },
        {
          name: 'Sanggar',
          href: '/upload',
          icon: SanggarIcon,
          activeColor: 'bg-[#F5F0E8] border border-[#D9CCBF] text-gray-900',
          hoverColor: 'hover:bg-orange-50'
        },
        {
          name: 'Batikpedia',
          href: '/galeri-motif',
          icon: BatikpediaIcon,
          activeColor: 'bg-[#F5F0E8] border border-[#D9CCBF] text-gray-900',
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
          activeColor: 'bg-red-50 border border-red-200 text-red-900',
          hoverColor: 'hover:bg-red-50',
        },
        {
          name: 'Sertifikat',
          href: '/sertifikat',
          icon: Award,
          activeColor: 'bg-red-50 border border-red-200 text-red-900',
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
          name: 'Pengrajin',
          href: '/konveksi',
          icon: Store,
          activeColor: 'bg-blue-50 border border-blue-200 text-blue-900',
          hoverColor: 'hover:bg-blue-50'
        },
        {
          name: 'Produksi',
          href: '/produksi',
          icon: Package,
          activeColor: 'bg-blue-50 border border-blue-200 text-blue-900',
          hoverColor: 'hover:bg-blue-50'
        },
        {
          name: 'Bantuan',
          href: '/bantuan',
          icon: HelpCircle,
          activeColor: 'bg-blue-50 border border-blue-200 text-blue-900',
          hoverColor: 'hover:bg-blue-50'
        }
      ]
    }
  ];

  // Main bottom nav items for mobile
  const mainBottomNavItems = [
    { name: 'Nyanting', href: '/dashboard', icon: NyantingIcon },
    { name: 'Sanggar', href: '/upload', icon: SanggarIcon },
    { name: 'Batikpedia', href: '/galeri-motif', icon: BatikpediaIcon },
    { name: 'Produksi', href: '/produksi', icon: Package }
  ];

  // Other menu items for "Lainnya"
  const otherMenuItems = [
    { name: 'Pelatihan', href: '/pelatihan', icon: GraduationCap, group: 'Pelatihan' },
    { name: 'Sertifikat', href: '/sertifikat', icon: Award, group: 'Pelatihan' },
    { name: 'Pengrajin', href: '/konveksi', icon: Store, group: 'Layanan' },
    { name: 'Bantuan', href: '/bantuan', icon: HelpCircle, group: 'Layanan' },
    { name: 'Pengaturan', href: '/profile', icon: User, group: 'Akun' },
    { name: 'Logout', href: '/logout', icon: LogOut, group: 'Akun', isLogout: true }
  ];

  const visibleMenuGroups = SHOW_TRAINING_FEATURE
    ? menuGroups
    : menuGroups.filter((group) => group.name !== 'pelatihan');

  const visibleOtherMenuItems = SHOW_TRAINING_FEATURE
    ? otherMenuItems
    : otherMenuItems.filter((item) => item.group !== 'Pelatihan');

  const otherMenuGroupNames = SHOW_TRAINING_FEATURE
    ? ['Pelatihan', 'Layanan', 'Akun']
    : ['Layanan', 'Akun'];

  return (
    <>
      {/* Mobile Header - Fixed at top with highest z-index */}
      <div className="md:hidden flex justify-between items-center bg-white border-b px-4 py-3 shadow-md fixed top-0 left-0 right-0 z-[60]">
        <div className="flex items-center">
          <img
            src="/images/larasena-icon.svg"
            alt="Larasena Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="ml-2 font-serif text-lg font-semibold text-[#1A332F] tracking-tight lowercase">larasena</span>
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
              src="/images/larasena-icon.svg"
              alt="Larasena Logo"
              className="object-contain h-10 w-10"
            />
          ) : (
            <div className="flex items-center hover:transform hover:scale-105 transition-transform duration-300">
              <img
                src="/images/larasena-icon.svg"
                alt="Larasena Logo"
                className="object-contain h-10 w-auto"
              />
              <span className="ml-3 font-serif text-lg font-semibold text-[#1A332F] tracking-tight lowercase">larasena</span>
            </div>
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
          {visibleMenuGroups.map((group) => {
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
                          className={`flex items-center gap-3 rounded-xl transition-all duration-200 group relative
                            ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                            ${
                            isActive
                              ? `${item.activeColor} shadow-sm scale-105 font-bold`
                              : `border border-transparent text-gray-600 ${item.hoverColor} hover:text-gray-900 font-medium`
                          }`}
                          onClick={() => setIsOpen(false)}
                          title={isCollapsed ? item.name : ''}
                        >
                          <IconWrapper icon={Icon} isActive={isActive} className={`w-5 h-5 flex-shrink-0`} />
                          
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

        {!isCollapsed && subscription && (
          <div className="hidden md:block mx-3 mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <p className="font-semibold">Status Langganan</p>
            <p className="mt-1">
              {subscription.payment_required
                ? 'Perlu pembayaran'
                : subscription.is_trial
                ? 'Trial aktif'
                : 'Aktif'}
            </p>
            <p className="mt-1">
              Berlaku sampai:{' '}
              {subscription.is_trial
                ? (subscription.trial_ends_at ? new Date(subscription.trial_ends_at).toLocaleDateString('id-ID') : '-')
                : (subscription.subscription_ends_at ? new Date(subscription.subscription_ends_at).toLocaleDateString('id-ID') : '-')}
            </p>
            {subscription.payment_required && (
              <Link
                href={route('billing.required')}
                className="mt-2 inline-flex text-[11px] font-semibold text-[#BA682A] hover:underline"
              >
                Bayar Sekarang
              </Link>
            )}
          </div>
        )}
      </aside>

      {/* Overlay - Behind sidebar but above content */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {mainBottomNavItems.map((item) => {
            const isActive = url.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                  isActive 
                    ? 'text-[#D2691E]' 
                    : 'text-gray-600'
                }`}
              >
                <IconWrapper icon={Icon} isActive={isActive} isMobile={true} className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-medium text-center leading-tight">
                  {item.name}
                </span>
              </Link>
            );
          })}
          
          {/* Lainnya Button */}
          <button
            onClick={() => setShowMoreMenu(true)}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
              showMoreMenu ? 'text-[#D2691E]' : 'text-gray-600'
            }`}
          >
            <MoreHorizontal className={`w-6 h-6 mb-1 ${showMoreMenu ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-medium text-center leading-tight">
              Lainnya
            </span>
          </button>
        </div>
      </nav>

      {/* "Lainnya" Bottom Sheet Modal */}
      {showMoreMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] md:hidden"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[80] md:hidden transform transition-transform duration-300 ease-out">
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Header */}
            <div className="px-6 py-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Lainnya</h3>
            </div>
            
            {/* Menu Items */}
            <div className="px-4 py-3 max-h-[60vh] overflow-y-auto">
              {/* Group by category */}
              {otherMenuGroupNames.map((groupName) => (
                <div key={groupName} className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 px-2 mb-2">
                    {groupName}
                  </h4>
                  <div className="space-y-1">
                    {visibleOtherMenuItems
                      .filter(item => item.group === groupName)
                      .map((item) => {
                        const isActive = url.startsWith(item.href) && !item.isLogout;
                        const Icon = item.icon;
                        
                        // Handle logout differently
                        if (item.isLogout) {
                          return (
                            <button
                              key={item.name}
                              onClick={() => {
                                setShowMoreMenu(false);
                                router.post('/logout');
                              }}
                              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50"
                            >
                              <Icon className="w-5 h-5 flex-shrink-0" />
                              <span className="text-sm font-medium">{item.name}</span>
                            </button>
                          );
                        }
                        
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setShowMoreMenu(false)}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                              isActive
                                ? 'bg-[#F5F0E8] border border-[#D9CCBF] text-gray-900 shadow-sm font-bold'
                                : 'text-gray-700 hover:bg-gray-50 border border-transparent font-medium'
                            }`}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{item.name}</span>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Close Button */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
