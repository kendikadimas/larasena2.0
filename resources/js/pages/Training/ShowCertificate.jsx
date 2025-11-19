import { Head } from '@inertiajs/react';
import { Award, Download, Calendar, User, CheckCircle2, Share2, ExternalLink } from 'lucide-react';

export default function ShowCertificate({ certificate, auth }) {
    const handleDownload = () => {
        window.open(`/sertifikat/${certificate.id}/download`, '_blank');
    };

    const handleShare = () => {
        const shareUrl = window.location.href;
        const shareText = `Saya telah menyelesaikan kursus "${certificate.course.title}" di Larasena! 🎉`;

        if (navigator.share) {
            navigator.share({
                title: `Sertifikat ${certificate.course.title}`,
                text: shareText,
                url: shareUrl
            });
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('Link sertifikat berhasil disalin!');
        }
    };

    const getLevelConfig = (level) => {
        const configs = {
            dasar: { color: 'from-green-500 to-emerald-600', text: 'Dasar', emoji: '🌱' },
            menengah: { color: 'from-amber-500 to-orange-600', text: 'Menengah', emoji: '🔥' },
            lanjutan: { color: 'from-red-500 to-rose-600', text: 'Lanjutan', emoji: '⚡' }
        };
        return configs[level] || configs.dasar;
    };

    const levelConfig = getLevelConfig(certificate.course.level);

    return (
        <>
            <Head title={`Sertifikat - ${certificate.course.title}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    {auth?.user && (
                        <a
                            href="/sertifikat"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#BA682A] transition-colors mb-6"
                        >
                            ← Kembali ke Sertifikat
                        </a>
                    )}

                    {/* Certificate Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header with Batik Pattern Background */}
                        <div className={`bg-gradient-to-r ${levelConfig.color} p-12 text-white relative overflow-hidden`}>
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32"></div>
                            
                            {/* Corner Decorations */}
                            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-white/30 rounded-tl-3xl"></div>
                            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-white/30 rounded-tr-3xl"></div>
                            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-white/30 rounded-bl-3xl"></div>
                            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-white/30 rounded-br-3xl"></div>

                            <div className="relative z-10 text-center">
                                <div className="mb-8">
                                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                                        <Award className="w-12 h-12" />
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Sertifikat Kompetensi</h1>
                                    <p className="text-xl text-white/90">Pelatihan Batik Tradisional Indonesia</p>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Body */}
                        <div className="p-12">
                            {/* Certificate Text */}
                            <div className="text-center mb-12">
                                <p className="text-gray-600 mb-4">Dengan bangga diberikan kepada</p>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                    {certificate.user.name}
                                </h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Yang telah berhasil menyelesaikan pelatihan
                                </p>
                                <div className={`inline-block bg-gradient-to-r ${levelConfig.color} text-white px-8 py-4 rounded-2xl mb-4`}>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-1">{certificate.course.title}</h3>
                                    <p className="text-lg">Level {levelConfig.text} {levelConfig.emoji}</p>
                                </div>
                                <p className="text-gray-600 mt-8">
                                    dengan menunjukkan dedikasi dan kemampuan dalam menguasai teknik seni batik tradisional Indonesia
                                </p>
                            </div>

                            {/* Certificate Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                    <Calendar className="w-8 h-8 text-[#BA682A] mx-auto mb-3" />
                                    <p className="text-sm text-gray-500 mb-2">Tanggal Penyelesaian</p>
                                    <p className="font-bold text-gray-900">
                                        {new Date(certificate.issued_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                    <CheckCircle2 className="w-8 h-8 text-[#BA682A] mx-auto mb-3" />
                                    <p className="text-sm text-gray-500 mb-2">Total Materi</p>
                                    <p className="font-bold text-gray-900">{certificate.course.lessons_count || 0} Lesson</p>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                    <User className="w-8 h-8 text-[#BA682A] mx-auto mb-3" />
                                    <p className="text-sm text-gray-500 mb-2">Nomor Sertifikat</p>
                                    <p className="font-mono text-sm font-bold text-gray-900 break-all">
                                        {certificate.certificate_number}
                                    </p>
                                </div>
                            </div>

                            {/* Signature Section */}
                            <div className="border-t pt-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="text-center">
                                        <div className="mb-4">
                                            <div className="h-px bg-gray-300 w-48 mx-auto mb-2"></div>
                                            <p className="font-bold text-gray-900">Platform Larasena</p>
                                            <p className="text-sm text-gray-500">Sistem Pelatihan Digital</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="mb-4">
                                            <div className="h-px bg-gray-300 w-48 mx-auto mb-2"></div>
                                            <p className="font-bold text-gray-900">Instruktur Batik</p>
                                            <p className="text-sm text-gray-500">Ahli Batik Tradisional</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Info */}
                            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
                                <p className="text-sm text-blue-800">
                                    <strong>Verifikasi Sertifikat:</strong> Sertifikat ini dapat diverifikasi dengan mengunjungi{' '}
                                    <span className="font-mono bg-white px-2 py-1 rounded">
                                        larasena.id/sertifikat/{certificate.id}
                                    </span>
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg transition-all"
                                >
                                    <Download className="w-5 h-5" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg transition-all"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Bagikan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center mt-8 text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} Larasena - Platform Pelatihan Batik Digital</p>
                    </div>
                </div>
            </div>
        </>
    );
}
