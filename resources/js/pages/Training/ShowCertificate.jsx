import { Head } from '@inertiajs/react';
import { Award, Download, Calendar, CheckCircle2 } from 'lucide-react';

export default function ShowCertificate({ certificate, auth }) {
    const handleDownload = () => {
        window.open(`/sertifikat/${certificate.id}/download`, '_blank');
    };

    const handleShareLinkedIn = () => {
        const certUrl = window.location.href;
        const courseName = certificate.course.title;
        const orgName = 'Larasena';
        const issueYear = new Date(certificate.issued_at).getFullYear();
        const issueMonth = new Date(certificate.issued_at).getMonth() + 1;
        
        // LinkedIn Add to Profile URL
        const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(courseName)}&organizationName=${encodeURIComponent(orgName)}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${encodeURIComponent(certUrl)}&certId=${encodeURIComponent(certificate.certificate_number)}`;
        
        window.open(linkedInUrl, '_blank');
    };

    const getLevelConfig = (level) => {
        const configs = {
            dasar: { color: 'from-green-500 to-emerald-600', text: 'Dasar' },
            menengah: { color: 'from-amber-500 to-orange-600', text: 'Menengah' },
            lanjutan: { color: 'from-red-500 to-rose-600', text: 'Lanjutan' }
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
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                        {/* Header */}
                        <div className={`bg-gradient-to-r ${levelConfig.color} p-8 text-white relative`}>
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                                    <Award className="w-10 h-10" />
                                </div>
                                <h1 className="text-3xl font-bold mb-2">{certificate.course.title}</h1>
                                <p className="text-lg text-white/90">Level {levelConfig.text}</p>
                            </div>
                        </div>

                        {/* Certificate Body */}
                        <div className="p-8">
                            {/* Certificate Text */}
                            <div className="text-center mb-8">
                                <p className="text-gray-600 mb-6">
                                    dengan menunjukkan dedikasi dan kemampuan dalam menguasai teknik seni batik tradisional Indonesia
                                </p>
                            </div>

                            {/* Certificate Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <Calendar className="w-6 h-6 text-[#BA682A] mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 mb-1">Tanggal Penyelesaian</p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {new Date(certificate.issued_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <CheckCircle2 className="w-6 h-6 text-[#BA682A] mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 mb-1">Total Materi</p>
                                    <p className="font-semibold text-gray-900 text-sm">{certificate.course.lessons_count || 4} Lesson</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <Award className="w-6 h-6 text-[#BA682A] mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 mb-1">Nomor Sertifikat</p>
                                    <p className="font-mono text-xs font-semibold text-gray-900 break-all">
                                        {certificate.certificate_number}
                                    </p>
                                </div>
                            </div>

                            {/* Signature Section */}
                            <div className="border-t pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-900">Platform Larasena</p>
                                        <p className="text-xs text-gray-500">Sistem Pelatihan Digital</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-900">Instruktur Batik</p>
                                        <p className="text-xs text-gray-500">Ahli Batik Tradisional</p>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Info */}
                            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                                <p className="text-xs text-blue-800">
                                    <strong>Verifikasi Sertifikat:</strong> Sertifikat ini dapat diverifikasi dengan mengunjungi{' '}
                                    <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                                        larasena.id/sertifikat/{certificate.id}
                                    </span>
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                                >
                                    <Download className="w-5 h-5" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={handleShareLinkedIn}
                                    className="flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:bg-[#004182]"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    Tambahkan ke LinkedIn
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
