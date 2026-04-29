import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, ShoppingCart, Users, DollarSign, UserCog } from 'lucide-react';

export default function Sidebar() {
  const { url, props } = usePage();
  const subscription = props.subscription;

  const menuItems = [
    { name: 'Dashboard', href: '/konveksi-dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Pesanan', href: '/konveksi-pesanan', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Pelanggan', href: '/konveksi-pelanggan', icon: <Users className="w-5 h-5" /> },
    { name: 'Penghasilan', href: '/konveksi-penghasilan', icon: <DollarSign className="w-5 h-5" /> },
    { name: 'Profil', href: '/konveksi-profile', icon: <UserCog className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex-col shadow-lg hidden md:flex transition-all duration-300">
      {/* Logo */}
      <div className="px-6 pt-3 flex items-center h-24 w-64 border-b border-gray-100 transition-all duration-300">
        <div className="flex items-center hover:transform hover:scale-105 transition-transform duration-300">
          <img
            src="/images/larasena-icon.svg"
            alt="Larasena Logo"
            className="object-contain h-10 w-auto"
          />
          <span className="ml-3 font-serif text-lg font-semibold text-[#1A332F] tracking-tight lowercase">larasena</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = url === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-blue-50 border border-blue-200 text-blue-900 shadow-sm font-bold scale-105'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-gray-900 font-medium border border-transparent'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {subscription && (
        <div className="mx-3 mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
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
            <Link href={route('billing.required')} className="mt-2 inline-flex text-[11px] font-semibold text-[#BA682A] hover:underline">
              Bayar Sekarang
            </Link>
          )}
        </div>
      )}
    </aside>
  );
}