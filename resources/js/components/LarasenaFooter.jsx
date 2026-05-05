import { Link } from '@inertiajs/react';

export default function LarasenaFooter() {
    return (
        <footer
            className="relative overflow-hidden text-gray-800 px-8 md:px-16 lg:px-24 py-16"
            style={{ background: 'white' }}
        >
            <div
                className="absolute bottom-0 right-0 w-56 md:w-72 pointer-events-none select-none"
                style={{ zIndex: 1, opacity: 0.65 }}
            >
                <img
                    src="/images/footer-section.png"
                    alt=""
                    className="w-full h-auto object-contain"
                    style={{ transform: 'translateX(10%) translateY(15%)' }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative" style={{ zIndex: 2 }}>
                <div>
                    <Link href="/" className="flex-shrink-0 flex items-center mb-5 hover:opacity-80 transition-opacity">
                        <img src="/images/larasena-icon.svg" alt="Larasena Logo" className="h-11 w-auto" />
                        <span className="ml-3 font-serif text-sm font-semibold text-[#1C3A35] tracking-tight lowercase">larasena</span>
                    </Link>
                    <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#7A6E62' }}>
                        Larasena adalah platform digital untuk desain batik, upload karya batik, dan komunitas kreator batik Indonesia.
                    </p>
                </div>

                {[
                    { title: 'Fitur', links: ['Generate Batik AI', 'Canvas Digital', '3D Model Batik', 'Mitra Konveksi'] },
                    { title: 'Perusahaan', links: ['Tentang Kami', 'Galeri', 'Fitur', 'Mitra'] },
                    { title: 'Dukungan', links: ['Bantuan', 'Dokumentasi', 'Privasi', 'Syarat Layanan'] }
                ].map((section, index) => (
                    <div key={index}>
                        <h4
                            className="font-semibold text-sm tracking-wider uppercase mb-4"
                            style={{ color: '#1C3A35', letterSpacing: '0.08em' }}
                        >
                            {section.title}
                        </h4>
                        <ul className="space-y-2.5">
                            {section.links.map((link, linkIndex) => (
                                <li key={linkIndex}>
                                    <a href="#" className="text-sm transition-colors duration-200 hover:text-[#1A332F]" style={{ color: '#7A6E62' }}>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="relative pt-6" style={{ zIndex: 2, borderTop: '1px solid rgba(201,168,76,0.25)' }}>
                <p className="text-sm" style={{ color: '#9A8E82' }}>
                    © {new Date().getFullYear()} <span className="font-semibold" style={{ color: '#1C3A35' }}>Larasena</span> — Teknologi Batik dengan Tradisi
                </p>
            </div>
        </footer>
    );
}