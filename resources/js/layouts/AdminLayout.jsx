import { Link, usePage, router } from '@inertiajs/react';
import { LayoutDashboard, Users, Package, DollarSign, LogOut, Menu, X, Store, GraduationCap, ImagePlus, CreditCard } from 'lucide-react';
import { useState } from 'react';

const SHOW_TRAINING_FEATURE = false;

export default function AdminLayout({ children }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
        { name: 'Pengguna', href: '/admin-users', icon: Users },
        { name: 'Billing', href: '/admin-billing', icon: CreditCard },
        { name: 'Konveksi', href: '/admin-konveksi', icon: Store },
        { name: 'Motif', href: '/admin-motifs', icon: Package },
        { name: 'Verifikasi Batik', href: '/admin-published-motifs', icon: ImagePlus },
        { name: 'Transaksi', href: '/admin-transactions', icon: DollarSign },
        { name: 'Pelatihan', href: '/admin-training', icon: GraduationCap },
    ];

    const visibleNavigation = SHOW_TRAINING_FEATURE
        ? navigation
        : navigation.filter((item) => item.href !== '/admin-training');

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            router.post('/logout');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
          
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

           
            <aside className={`
                fixed md:static inset-y-0 left-0 z-30
                w-64 bg-white border-r border-gray-100 flex flex-col shadow-lg
                transform transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                
                <div className="px-6 pt-3 flex items-center h-24 border-b border-gray-100 transition-all duration-300">
                    <div className="flex items-center hover:transform hover:scale-105 transition-transform duration-300">
                        <img
                            src="/images/larasena-icon.svg"
                            alt="Larasena Logo"
                            className="object-contain h-10 w-auto"
                        />
                        <span className="ml-3 font-serif text-lg font-semibold text-[#1A332F] tracking-tight lowercase">larasena</span>
                    </div>
                </div>
                
              
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {visibleNavigation.map((item) => {
                        const isActive = url === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                                    isActive 
                                        ? 'bg-[#F5F0E8] border border-[#D9CCBF] text-gray-900 shadow-sm font-bold scale-105' 
                                        : 'text-gray-600 hover:bg-orange-50 hover:text-gray-900 font-medium border border-transparent'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=F8F5F2&color=BA682A`}
                            alt={auth.user.name}
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{auth.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium rounded-xl transition-colors border border-transparent hover:border-red-100"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

         
            <div className="flex-1 flex flex-col overflow-hidden">
               
                <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm relative z-20">
                    <button onClick={() => setSidebarOpen(true)} className="p-1">
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                    <div className="flex items-center">
                        <img 
                            src="/images/larasena-icon.svg" 
                            alt="Larasena" 
                            className="h-8 w-auto object-contain"
                        />
                        <span className="ml-2 font-serif text-lg font-semibold text-[#1A332F] tracking-tight lowercase">larasena</span>
                    </div>
                    <button onClick={handleLogout} className="p-1">
                        <LogOut className="w-5 h-5 text-red-600" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}