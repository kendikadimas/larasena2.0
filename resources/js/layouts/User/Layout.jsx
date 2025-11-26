import Sidebar from './Sidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, Settings, User, LogOut, ChevronDown, ChevronsRight } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Breadcrumbs = () => {
    const { url } = usePage();
    const pathname = url.split('?')[0];    
    const segments = pathname.slice(1).split('/').filter(Boolean);

    const formatSegment = (segment) => {
        if (!isNaN(segment)) return "Detail";
        return segment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase()); 
    };

    return (
        <nav className="flex items-center text-sm font-medium text-gray-500">
            <Link href="/dashboard" className="hover:text-[#BA682A]">Home</Link>
            {segments.map((segment, index) => {
                const href = '/' + segments.slice(0, index + 1).join('/');
                const isLast = index === segments.length - 1;

                return (
                    <Fragment key={index}>
                        <ChevronsRight className="w-4 h-4 mx-1" />
                        <Link 
                            href={href} 
                            className={isLast ? "text-[#BA682A] font-semibold" : "hover:text-gray-700"}
                        >
                            {formatSegment(segment)}
                        </Link>
                    </Fragment>
                );
            })}
        </nav>
    );
};

export default function UserLayout({ children, title }) {

  const { auth, url } = usePage().props;
  const user = auth.user;

  return (
    <>
      <Head title={title} />
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden min-h-screen">
         
          <header
            className="hidden md:flex items-center justify-between px-6 py-6 bg-white shadow-sm"
            style={{ height: '97px' }}
          >
            <div>
              <h1 className="text-2xl font-bold text-[#BA682A] mb-1">{title}</h1>

             
              {url !== '/dashboard' && (
                <div className="hidden md:flex">
                  <Breadcrumbs />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
             
              <Menu as="div" className="relative z-10">
                <MenuButton className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                  {user.profile_photo_url ? (
                    <img 
                      src={user.profile_photo_url} 
                      alt={user.name} 
                      className="rounded-full w-8 h-8 object-cover border-2 border-[#BA682A]" 
                    />
                  ) : (
                    <div className="rounded-full w-8 h-8 bg-gradient-to-br from-[#BA682A] to-[#8B4513] flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
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
                    <MenuItems className="z-100 absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1">
                            <MenuItem>
                                {({ active }) => (
                                    <Link
                                        href={route('profile.edit')}
                                        className={`${
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Profil
                                    </Link>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <Link
                                        href={route('logout')}
                                        method="post" 
                                        as="button"   
                                        className={`${
                                            active ? 'bg-red-500 text-white' : 'text-gray-700'
                                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
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
          
          <div className="md:hidden h-16" />

         
          <div className="md:hidden bg-white border-b px-4 py-4 shadow-sm">
            <h1 className="text-xl font-bold text-[#BA682A]">{title}</h1>
            {url !== '/dashboard' && (
              <div className="mt-2">
                <Breadcrumbs />
              </div>
            )}
          </div>
      
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
          </div>

        </main>
      </div>
    </>
  );
}