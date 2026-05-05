import Sidebar from './Sidebar';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bell, MessageSquare, Search, ChevronDown, Menu as MenuIcon } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

export default function KonveksiLayout({ children, title }) {
  const { auth, subscription } = usePage().props;
  const user = auth.user;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isBlockedByPayment = Boolean(subscription?.payment_required);

  return (
    <>
      <Head title={title} />
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header
            className="flex items-center justify-between px-6 py-6 border-b bg-white"
            style={{ height: '97px' }}
          >
            {/* Tombol Menu untuk Mobile */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <MenuIcon className="w-6 h-6 text-gray-600"/>
            </button>
            
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search product..."
                className="pl-10 pr-4 py-2 border rounded-lg w-80 text-sm"
              />
            </div>

            {/* Ikon dan Profil */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell className="w-5 h-5 text-gray-500" />
              </button>
              
              <div className="border-l h-8 mx-2"></div>

              {/* Dropdown Profil */}
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center gap-3">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=BA682A&color=fff`} 
                    alt="Avatar" 
                    className="rounded-full w-10 h-10" 
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
                </MenuButton>
                <Transition 
                  as={Fragment} 
                  enter="transition ease-out duration-100" 
                  enterFrom="transform opacity-0 scale-95" 
                  enterTo="transform opacity-100 scale-100" 
                  leave="transition ease-in duration-75" 
                  leaveFrom="transform opacity-100 scale-100" 
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                    <div className="px-1 py-1">
                      <MenuItem>
                        {({ active }) => (
                          <Link 
                            href="/konveksi-profile" 
                            className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}
                          >
                            Profil
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link 
                            href="/logout" 
                            method="post" 
                            as="button" 
                            className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}
                          >
                            Logout
                          </Link>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {isBlockedByPayment && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 md:p-8 text-center">

            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <p className="text-xs font-semibold tracking-wider text-amber-600 uppercase">
              {subscription?.is_trial === false && subscription?.plan_status === 'payment_required'
                ? 'Free Trial Berakhir'
                : 'Akses Ditangguhkan'}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {subscription?.plan_status === 'payment_required' && !subscription?.is_trial
                ? 'Free Trial 15 Hari Kamu Sudah Habis'
                : 'Langganan Kamu Sudah Berakhir'}
            </h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Daftarkan langganan bulanan untuk melanjutkan akses penuh ke semua fitur Larasena —
              terima pesanan dari pelanggan, kelola produksi, dan tampil di direktori konveksi.
              Hanya <span className="font-semibold text-gray-800">Rp30.000/bulan</span>.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={route('billing.pay-now')}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#BA682A] text-white font-semibold hover:bg-[#9a5522] transition"
              >
                Berlangganan Sekarang
              </Link>

              <button
                type="button"
                onClick={() => router.visit(document.referrer || route('landing'))}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}