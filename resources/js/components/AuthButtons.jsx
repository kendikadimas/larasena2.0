import { Link } from '@inertiajs/react';

export default function AuthButtons({ user }) {
    return (
        <div className="flex items-center gap-3">
            {user ? (
                <Link
                    href={route('dashboard')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1A332F] to-[#2C5E54] text-white font-semibold hover:from-[#0F2420] hover:to-[#1A4A3F] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    Dashboard
                </Link>
            ) : (
                <>
                    <Link
                        href={route('login')}
                        className="px-4 py-2 md:px-6 md:py-2.5 rounded-xl border border-[#D9CCBF] bg-white/70 text-[#1A332F] font-semibold hover:bg-[#F5F0E8] hover:border-[#C9B8A2] transition-all duration-300 shadow-sm backdrop-blur-sm"
                    >
                        Masuk
                    </Link>
                    <Link
                        href={route('register')}
                        className="px-4 py-2 md:px-6 md:py-2.5 rounded-xl bg-gradient-to-r from-[#1A332F] to-[#2C5E54] text-white font-semibold hover:from-[#0F2420] hover:to-[#1A4A3F] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Daftar
                    </Link>
                </>
            )}
        </div>
    );
}
