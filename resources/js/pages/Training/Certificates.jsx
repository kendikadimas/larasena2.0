import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/User/Layout';
import SEO from '@/components/SEO';
import { Award, Download, Calendar, BookOpen, Trophy, Share2, CheckCircle2, ExternalLink } from 'lucide-react';

export default function Certificates({ certificates }) {
    const handleDownload = (certificateId) => {
        window.open(`/sertifikat/${certificateId}/download`, '_blank');
    };

    const handleShare = (certificate) => {
        const shareUrl = `${window.location.origin}/sertifikat/${certificate.id}`;
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
            dasar: { color: 'from-green-500 to-emerald-600', text: 'Dasar', icon: '🌱' },
            menengah: { color: 'from-amber-500 to-orange-600', text: 'Menengah', icon: '🔥' },
            lanjutan: { color: 'from-red-500 to-rose-600', text: 'Lanjutan', icon: '⚡' }
        };
        return configs[level] || configs.dasar;
    };

    return (
        <UserLayout>
            <Head title="Sertifikat Saya" />
            <SEO
                title="Sertifikat Saya"
                description="Koleksi sertifikat pelatihan batik yang telah diselesaikan"
                url="/sertifikat"
            />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Sertifikat Saya
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Pencapaian Anda dalam menguasai seni batik tradisional Indonesia
                        </p>
                    </div>

                    {/* Stats */}
                    {certificates.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-2">{certificates.length}</p>
                                <p className="text-gray-600">Total Sertifikat</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-2">
                                    {certificates.filter(c => c.course.level === 'dasar').length}
                                </p>
                                <p className="text-gray-600">Level Dasar</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                                <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-2">
                                    {certificates.filter(c => ['menengah', 'lanjutan'].includes(c.course.level)).length}
                                </p>
                                <p className="text-gray-600">Level Advanced</p>
                            </div>
                        </div>
                    )}

                    {/* Certificates Grid */}
                    {certificates.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {certificates.map((certificate) => {
                                const levelConfig = getLevelConfig(certificate.course.level);
                                
                                return (
                                    <div
                                        key={certificate.id}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                                    >
                                        {/* Certificate Header with Gradient */}
                                        <div className={`bg-gradient-to-r ${levelConfig.color} p-8 text-white relative overflow-hidden`}>
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                            <Award className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold opacity-90">Sertifikat Kompetensi</p>
                                                            <p className="text-xs opacity-75">Pelatihan Batik Tradisional</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-4xl">{levelConfig.icon}</span>
                                                </div>
                                                
                                                <h3 className="text-2xl font-bold mb-2">{certificate.course.title}</h3>
                                                <p className="text-white/80 text-sm">Level {levelConfig.text}</p>
                                            </div>
                                        </div>

                                        {/* Certificate Body */}
                                        <div className="p-8">
                                            {/* Certificate Number */}
                                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                                <p className="text-xs text-gray-500 mb-1">Nomor Sertifikat</p>
                                                <p className="font-mono text-sm font-bold text-gray-900">{certificate.certificate_number}</p>
                                            </div>

                                            {/* Course Info */}
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="flex items-start gap-3">
                                                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Tanggal Selesai</p>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {new Date(certificate.issued_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <BookOpen className="w-5 h-5 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Total Materi</p>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {certificate.course.lessons_count || 0} Lesson
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleDownload(certificate.id)}
                                                    className="flex-1 bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Download className="w-5 h-5" />
                                                    Download PDF
                                                </button>
                                                <button
                                                    onClick={() => handleShare(certificate)}
                                                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                                                    title="Share Certificate"
                                                >
                                                    <Share2 className="w-5 h-5" />
                                                </button>
                                                <a
                                                    href={`/sertifikat/${certificate.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                                                    title="View Certificate"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Award className="w-16 h-16 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Belum Ada Sertifikat</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Selesaikan pelatihan batik untuk mendapatkan sertifikat kompetensi
                            </p>
                            <a
                                href="/pelatihan"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg transition-all"
                            >
                                <BookOpen className="w-5 h-5" />
                                Mulai Belajar
                            </a>
                        </div>
                    )}

                    {/* CTA Section */}
                    {certificates.length > 0 && certificates.length < 3 && (
                        <div className="mt-12 bg-gradient-to-r from-[#BA682A] to-[#D2691E] rounded-2xl shadow-lg p-8 text-center text-white">
                            <h3 className="text-2xl font-bold mb-4">Terus Tingkatkan Keahlian Anda!</h3>
                            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                                Masih ada {3 - certificates.length} level lagi untuk dikuasai. Lanjutkan perjalanan Anda dalam menguasai seni batik.
                            </p>
                            <a
                                href="/pelatihan"
                                className="inline-flex items-center gap-2 bg-white text-[#BA682A] font-semibold px-8 py-4 rounded-xl hover:shadow-lg transition-all"
                            >
                                <BookOpen className="w-5 h-5" />
                                Lihat Pelatihan
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
