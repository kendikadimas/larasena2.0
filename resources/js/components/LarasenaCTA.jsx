import { Link } from '@inertiajs/react';

export default function LarasenaCTA({ user, dashboardRoute, isVisible = true }) {
    return (
        <section
            className="relative w-full flex items-center overflow-hidden"
            style={{
                minHeight: '340px',
                backgroundImage: `
      linear-gradient(to right, rgba(10,35,32,0.65) 0%, rgba(10,35,32,0.3) 35%, rgba(10,35,32,0) 60%),
      url('/images/cta-section.webp')
    `,
                backgroundSize: 'cover',
                backgroundPosition: 'right center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className={`relative z-10 w-full px-6 md:px-12 lg:px-20 py-12 fade-in-up ${isVisible ? 'visible' : ''}`}>
                <div className="md:w-[42%]">
                    <h2 className="font-serif text-2xl md:text-[2.4rem] font-semibold text-white leading-tight mb-3">
                        Ready to Bring Your<br />
                        Batik Ideas to Life?
                    </h2>

                    <p className="text-sm md:text-[0.95rem] mb-6 max-w-sm text-white/80 leading-relaxed">
                        Join Larasena and start your creative journey today.
                    </p>

                    <Link
                        href={user ? dashboardRoute : '/register'}
                        className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:translate-x-1"
                        style={{
                            background: '#D4A63F',
                            color: '#fff',
                            padding: '12px 26px',
                            borderRadius: '999px'
                        }}
                    >
                        Start Designing Now
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}